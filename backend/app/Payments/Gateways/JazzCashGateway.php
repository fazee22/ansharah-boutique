<?php

namespace App\Payments\Gateways;

use App\Models\Order;
use App\Payments\Contracts\PaymentGatewayInterface;
use App\Payments\DTOs\PaymentInitiationResult;
use App\Payments\DTOs\PaymentVerificationResult;
use App\Payments\Exceptions\GatewayNotConfiguredException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;

/**
 * JazzCash's Page Redirect API doesn't accept a simple GET redirect —
 * it requires an HTML form POST of `pp_*` fields (each request signed
 * with a `pp_SecureHash`: HMAC-SHA256 of the integrity salt plus every
 * non-empty `pp_*` value, sorted alphabetically by key, joined with
 * `&`) to their transaction endpoint. So `initiate()` here doesn't
 * return JazzCash's URL directly — it returns a URL to OUR OWN
 * `api.v1.payments.jazzcash.redirect` route, which renders an auto-submitting
 * form (`resources/views/payments/gateway-redirect.blade.php`) built
 * from a short-lived cached payload. This is the standard, correct
 * integration pattern for this API, not a workaround.
 */
class JazzCashGateway implements PaymentGatewayInterface
{
    private const SANDBOX_URL = 'https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/';

    private const LIVE_URL = 'https://payments.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/';

    public function key(): string
    {
        return 'jazzcash';
    }

    public function label(): string
    {
        return 'JazzCash';
    }

    public function isConfigured(): bool
    {
        return filled(config('payments.jazzcash.merchant_id'))
            && filled(config('payments.jazzcash.password'))
            && filled(config('payments.jazzcash.integrity_salt'));
    }

    public function initiate(Order $order): PaymentInitiationResult
    {
        if (! $this->isConfigured()) {
            throw GatewayNotConfiguredException::forGateway($this->key());
        }

        $reference = 'JC-'.$order->order_number.'-'.Str::random(6);
        $fields = $this->buildSignedFields($order, $reference);

        // Cached briefly (10 minutes — comfortably longer than a
        // customer takes to load the redirect page) rather than
        // querystring'd, since the signed field set includes
        // merchant credentials that shouldn't appear in a URL/log.
        Cache::put("jazzcash.payment.{$reference}", $fields, now()->addMinutes(10));

        return PaymentInitiationResult::redirect(
            url: URL::temporarySignedRoute('api.v1.payments.jazzcash.redirect', now()->addMinutes(10), ['reference' => $reference]),
            transactionId: $reference,
        );
    }

    /**
     * @return array<string, string>
     */
    public function buildSignedFields(Order $order, string $reference): array
    {
        $fields = [
            'pp_Version' => '1.1',
            'pp_TxnType' => 'MPAY',
            'pp_Language' => 'EN',
            'pp_MerchantID' => config('payments.jazzcash.merchant_id'),
            'pp_Password' => config('payments.jazzcash.password'),
            'pp_TxnRefNo' => $reference,
            'pp_Amount' => (string) ((int) round((float) $order->total * 100)), // smallest currency unit
            'pp_TxnCurrency' => $order->currency,
            'pp_TxnDateTime' => now()->format('YmdHis'),
            'pp_BillReference' => $order->order_number,
            'pp_Description' => "Order {$order->order_number}",
            'pp_TxnExpiryDateTime' => now()->addHours(1)->format('YmdHis'),
            'pp_ReturnURL' => config('payments.jazzcash.return_url') ?: rtrim((string) config('app.frontend_url'), '/').'/payment/success',
            'pp_SecureHash' => '',
        ];

        $fields['pp_SecureHash'] = $this->computeSecureHash($fields);

        return $fields;
    }

    /** JazzCash's documented signing scheme: integrity salt + every non-empty pp_* value, sorted by key, joined with "&", HMAC-SHA256'd with the salt as key. */
    private function computeSecureHash(array $fields): string
    {
        $salt = config('payments.jazzcash.integrity_salt');
        ksort($fields);

        $values = collect($fields)->filter(fn ($value) => $value !== '' && $value !== null)->values()->implode('&');

        return hash_hmac('sha256', "{$salt}&{$values}", (string) $salt);
    }

    public function verify(string $transactionReference): PaymentVerificationResult
    {
        // JazzCash's inquiry API mirrors the redirect API's signed-field
        // shape; wired the same way as initiate() once real sandbox
        // credentials are available to test against.
        return new PaymentVerificationResult(status: 'pending', transactionId: $transactionReference);
    }

    public function handleWebhook(Request $request): PaymentVerificationResult
    {
        $payload = $request->all();
        $responseCode = $payload['pp_ResponseCode'] ?? null;

        // "000" is JazzCash's documented success response code.
        $status = $responseCode === '000' ? 'succeeded' : 'failed';

        if ($status === 'failed') {
            Log::info('JazzCash payment not successful.', ['response' => $payload]);
        }

        return new PaymentVerificationResult(
            status: $status,
            transactionId: $payload['pp_TxnRefNo'] ?? null,
            raw: $payload,
        );
    }

    public function transactionUrl(): string
    {
        return (bool) config('payments.jazzcash.sandbox') ? self::SANDBOX_URL : self::LIVE_URL;
    }
}
