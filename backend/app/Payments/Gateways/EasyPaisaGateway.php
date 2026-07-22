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
 * Same redirect-form pattern as `JazzCashGateway` (see that class's
 * doc comment for why `initiate()` returns a URL to our own bridge
 * route rather than EasyPaisa's directly) — EasyPaisa's Open API
 * signs its request fields with a merchant hash key using SHA-256
 * over the concatenated field values.
 */
class EasyPaisaGateway implements PaymentGatewayInterface
{
    private const SANDBOX_URL = 'https://easypaystg.easypaisa.com.pk/easypay/Index.jsf';

    private const LIVE_URL = 'https://easypay.easypaisa.com.pk/easypay/Index.jsf';

    public function key(): string
    {
        return 'easypaisa';
    }

    public function label(): string
    {
        return 'EasyPaisa';
    }

    public function isConfigured(): bool
    {
        return filled(config('payments.easypaisa.store_id')) && filled(config('payments.easypaisa.hash_key'));
    }

    public function initiate(Order $order): PaymentInitiationResult
    {
        if (! $this->isConfigured()) {
            throw GatewayNotConfiguredException::forGateway($this->key());
        }

        $reference = 'EP-'.$order->order_number.'-'.Str::random(6);
        $fields = $this->buildSignedFields($order, $reference);

        Cache::put("easypaisa.payment.{$reference}", $fields, now()->addMinutes(10));

        return PaymentInitiationResult::redirect(
            url: URL::temporarySignedRoute('api.v1.payments.easypaisa.redirect', now()->addMinutes(10), ['reference' => $reference]),
            transactionId: $reference,
        );
    }

    /**
     * @return array<string, string>
     */
    public function buildSignedFields(Order $order, string $reference): array
    {
        $fields = [
            'storeId' => config('payments.easypaisa.store_id'),
            'orderRefNum' => $reference,
            'amount' => number_format((float) $order->total, 2, '.', ''),
            'postBackURL' => config('payments.easypaisa.return_url') ?: rtrim((string) config('app.frontend_url'), '/').'/payment/success',
            'orderDate' => now()->format('Y-m-d H:i:s'),
            'expiryDate' => now()->addHours(1)->format('Y-m-d H:i:s'),
            'merchantHashedReq' => '',
        ];

        $fields['merchantHashedReq'] = $this->computeHash($fields);

        return $fields;
    }

    /** EasyPaisa's documented scheme: SHA-256 of every field value (excluding the hash itself), concatenated in a fixed order, with the merchant hash key appended. */
    private function computeHash(array $fields): string
    {
        $key = config('payments.easypaisa.hash_key');
        $concatenated = collect($fields)->except('merchantHashedReq')->implode('');

        return hash('sha256', $concatenated.$key);
    }

    public function verify(string $transactionReference): PaymentVerificationResult
    {
        return new PaymentVerificationResult(status: 'pending', transactionId: $transactionReference);
    }

    public function handleWebhook(Request $request): PaymentVerificationResult
    {
        $payload = $request->all();
        // EasyPaisa's documented success indicator on its postback.
        $status = ($payload['status'] ?? null) === '0000' ? 'succeeded' : 'failed';

        if ($status === 'failed') {
            Log::info('EasyPaisa payment not successful.', ['response' => $payload]);
        }

        return new PaymentVerificationResult(
            status: $status,
            transactionId: $payload['orderRefNum'] ?? null,
            raw: $payload,
        );
    }

    public function transactionUrl(): string
    {
        return (bool) config('payments.easypaisa.sandbox') ? self::SANDBOX_URL : self::LIVE_URL;
    }
}
