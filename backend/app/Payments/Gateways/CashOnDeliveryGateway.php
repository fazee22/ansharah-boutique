<?php

namespace App\Payments\Gateways;

use App\Models\Order;
use App\Payments\Contracts\PaymentGatewayInterface;
use App\Payments\DTOs\PaymentInitiationResult;
use App\Payments\DTOs\PaymentVerificationResult;
use Illuminate\Http\Request;

/**
 * The only gateway with no external API — "payment" simply means the
 * order is confirmed for cash collection on delivery. `initiate()`
 * returns an immediately-`succeeded` result (there's no redirect, no
 * pending state to wait on), and `handleWebhook()` is unreachable in
 * practice since no external provider ever calls back for COD.
 */
class CashOnDeliveryGateway implements PaymentGatewayInterface
{
    public function key(): string
    {
        return 'cod';
    }

    public function label(): string
    {
        return 'Cash on Delivery';
    }

    public function isConfigured(): bool
    {
        return true;
    }

    public function initiate(Order $order): PaymentInitiationResult
    {
        return PaymentInitiationResult::succeeded(
            transactionId: 'COD-'.$order->order_number,
            raw: ['method' => 'cash_on_delivery'],
        );
    }

    public function verify(string $transactionReference): PaymentVerificationResult
    {
        return new PaymentVerificationResult(status: 'succeeded', transactionId: $transactionReference);
    }

    public function handleWebhook(Request $request): PaymentVerificationResult
    {
        // Cash on Delivery has no external provider to push a webhook —
        // nothing legitimate ever reaches this method.
        return new PaymentVerificationResult(status: 'failed', raw: ['error' => 'COD does not support webhooks.']);
    }
}
