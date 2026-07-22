<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Payment;
use App\Payments\Contracts\PaymentGatewayInterface;
use App\Payments\DTOs\PaymentInitiationResult;
use App\Payments\PaymentGatewayFactory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * The one place that both calls a payment gateway AND writes to the
 * database — gateways themselves (`app/Payments/Gateways/*`) never
 * touch a model, keeping them pure "talk to this external API"
 * classes that are trivial to unit test with a fake HTTP response.
 */
class PaymentService
{
    /** @return array<int, array{key: string, label: string, configured: bool}> */
    public function availableMethods(): array
    {
        return array_map(
            fn (PaymentGatewayInterface $gateway) => [
                'key' => $gateway->key(),
                'label' => $gateway->label(),
                'configured' => $gateway->isConfigured(),
            ],
            PaymentGatewayFactory::all(),
        );
    }

    public function initiate(Order $order, string $gatewayKey): PaymentInitiationResult
    {
        $gateway = PaymentGatewayFactory::make($gatewayKey);

        return DB::transaction(function () use ($order, $gateway, $gatewayKey) {
            $result = $gateway->initiate($order);

            $payment = Payment::create([
                'order_id' => $order->id,
                'gateway' => $gatewayKey,
                'status' => $result->status,
                'amount' => $order->total,
                'currency' => $order->currency,
                'transaction_id' => $result->transactionId,
                'gateway_response' => $result->raw,
            ]);

            if ($result->status === 'succeeded') {
                $this->markOrderPaid($order, $payment);
            }

            return $result;
        });
    }

    /**
     * Applies a gateway's verified/webhook status to the matching
     * `Payment` row (found by `transaction_id`) and, on success,
     * the parent order — the single choke point every gateway's
     * result flows through before it can change an order's paid state.
     */
    public function applyVerification(string $transactionId, string $status, array $raw = []): ?Payment
    {
        $payment = Payment::where('transaction_id', $transactionId)->first();

        if (! $payment) {
            Log::warning('Payment verification for unknown transaction.', ['transaction_id' => $transactionId]);

            return null;
        }

        return DB::transaction(function () use ($payment, $status, $raw) {
            $payment->update([
                'status' => $status,
                'gateway_response' => array_merge($payment->gateway_response ?? [], $raw),
                'failure_reason' => $status === 'failed' ? ($raw['error'] ?? 'Payment failed.') : null,
            ]);

            if ($status === 'succeeded') {
                $this->markOrderPaid($payment->order, $payment);
            }

            return $payment->fresh();
        });
    }

    private function markOrderPaid(Order $order, Payment $payment): void
    {
        if ($order->payment_status === 'paid') {
            return;
        }

        $order->update(['payment_status' => 'paid']);

        // A successful payment is itself a meaningful status-history
        // event, distinct from an admin manually changing order
        // status — logged the same way so the Order Timeline shows it.
        $order->statusHistory()->create([
            'status' => $order->status,
            'changed_by' => null,
            'note' => "Payment received via {$payment->gateway} (ref: {$payment->transaction_id}).",
        ]);
    }
}
