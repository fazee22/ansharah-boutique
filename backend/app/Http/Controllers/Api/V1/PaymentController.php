<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\InitiatePaymentRequest;
use App\Models\Order;
use App\Payments\Exceptions\GatewayNotConfiguredException;
use App\Payments\Gateways\EasyPaisaGateway;
use App\Payments\Gateways\JazzCashGateway;
use App\Payments\PaymentGatewayFactory;
use App\Services\PaymentService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    public function __construct(private readonly PaymentService $payments) {}

    /** Public — lists every registered gateway and whether it's actually usable right now, so the frontend's payment method selector can grey out an unconfigured one instead of letting a customer pick it and hit a 500. */
    public function methods(): JsonResponse
    {
        return ApiResponse::success($this->payments->availableMethods());
    }

    public function initiate(InitiatePaymentRequest $request): JsonResponse
    {
        $order = Order::where('order_number', $request->validated('order_number'))->firstOrFail();

        // Ownership check: an authenticated request must own the order;
        // a guest request must supply the order's own customer email.
        // Neither is a substitute for real checkout-session-based
        // ownership (Phase 10+), but both are meaningfully better than
        // "anyone who knows an order number can pay it."
        $user = $request->user('api');
        $isOwner = $user
            ? $order->user_id === $user->id
            : strcasecmp($order->customer_email, $request->validated('email')) === 0;

        abort_unless($isOwner, 403, "That order doesn't match the email provided.");

        try {
            $result = $this->payments->initiate($order, $request->validated('gateway'));
        } catch (GatewayNotConfiguredException $exception) {
            return ApiResponse::error($exception->getMessage(), 422);
        }

        return ApiResponse::success([
            'status' => $result->status,
            'redirectUrl' => $result->redirectUrl,
            'transactionId' => $result->transactionId,
        ]);
    }

    public function webhook(Request $request, string $gateway): JsonResponse
    {
        try {
            $gatewayInstance = PaymentGatewayFactory::make($gateway);
        } catch (\InvalidArgumentException) {
            return ApiResponse::error('Unknown gateway.', 404);
        }

        $result = $gatewayInstance->handleWebhook($request);

        if ($result->transactionId) {
            $this->payments->applyVerification($result->transactionId, $result->status, $result->raw);
        } else {
            Log::warning("Webhook from {$gateway} carried no transaction id.", ['payload' => $request->all()]);
        }

        // Gateways expect a 200 acknowledging receipt regardless of the
        // payment's own outcome — a non-2xx here just causes pointless
        // provider-side retries of a webhook we already understood.
        return ApiResponse::success(null, 'Webhook received.');
    }

    /** Renders the auto-submitting form bridge for JazzCash's Page Redirect API — see `JazzCashGateway`'s doc comment. Only reachable via the temporary signed URL `initiate()` hands back. */
    public function jazzcashRedirect(Request $request, string $reference)
    {
        abort_unless($request->hasValidSignature(), 403);

        $fields = Cache::get("jazzcash.payment.{$reference}");
        abort_unless($fields, 404, 'This payment link has expired.');

        $gateway = app(JazzCashGateway::class);

        return view('payments.gateway-redirect', [
            'actionUrl' => $gateway->transactionUrl(),
            'fields' => $fields,
        ]);
    }

    /** Same bridge pattern as `jazzcashRedirect()` for EasyPaisa's Open API. */
    public function easypaisaRedirect(Request $request, string $reference)
    {
        abort_unless($request->hasValidSignature(), 403);

        $fields = Cache::get("easypaisa.payment.{$reference}");
        abort_unless($fields, 404, 'This payment link has expired.');

        $gateway = app(EasyPaisaGateway::class);

        return view('payments.gateway-redirect', [
            'actionUrl' => $gateway->transactionUrl(),
            'fields' => $fields,
        ]);
    }
}
