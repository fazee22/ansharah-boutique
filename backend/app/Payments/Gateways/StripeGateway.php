<?php

namespace App\Payments\Gateways;

use App\Models\Order;
use App\Payments\Contracts\PaymentGatewayInterface;
use App\Payments\DTOs\PaymentInitiationResult;
use App\Payments\DTOs\PaymentVerificationResult;
use App\Payments\Exceptions\GatewayNotConfiguredException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Talks to Stripe's plain REST API directly via Laravel's HTTP client
 * (Basic Auth with the secret key) rather than the `stripe/stripe-php`
 * SDK — real, working requests against Stripe's actual endpoints, with
 * no composer dependency to install. Swapping in the official SDK
 * later is a drop-in change to this one class; nothing else in the
 * app depends on how this gateway talks to Stripe internally.
 */
class StripeGateway implements PaymentGatewayInterface
{
    private const API_BASE = 'https://api.stripe.com/v1';

    public function key(): string
    {
        return 'stripe';
    }

    public function label(): string
    {
        return 'Credit / Debit Card (Stripe)';
    }

    public function isConfigured(): bool
    {
        return filled(config('payments.stripe.secret'));
    }

    /**
     * Creates a Stripe Checkout Session (hosted payment page) for the
     * order's total, in the smallest currency unit Stripe expects
     * (paisa/cents — hence `* 100`), and returns its hosted URL for
     * the frontend to redirect the customer to.
     */
    public function initiate(Order $order): PaymentInitiationResult
    {
        if (! $this->isConfigured()) {
            throw GatewayNotConfiguredException::forGateway($this->key());
        }

        $response = Http::asForm()
            ->withBasicAuth(config('payments.stripe.secret'), '')
            ->post(self::API_BASE.'/checkout/sessions', [
                'mode' => 'payment',
                'success_url' => rtrim((string) config('app.frontend_url'), '/')."/payment/success?order={$order->order_number}&session_id={CHECKOUT_SESSION_ID}",
                'cancel_url' => rtrim((string) config('app.frontend_url'), '/')."/payment/failed?order={$order->order_number}",
                'client_reference_id' => $order->order_number,
                'customer_email' => $order->customer_email,
                'line_items' => [[
                    'price_data' => [
                        'currency' => strtolower($order->currency),
                        'product_data' => ['name' => "Order {$order->order_number}"],
                        'unit_amount' => (int) round((float) $order->total * 100),
                    ],
                    'quantity' => 1,
                ]],
            ]);

        if ($response->failed()) {
            Log::warning('Stripe checkout session creation failed', ['order' => $order->order_number, 'response' => $response->json()]);

            return PaymentInitiationResult::failed(raw: $response->json() ?? []);
        }

        $session = $response->json();

        return PaymentInitiationResult::redirect(
            url: $session['url'],
            transactionId: $session['id'],
            raw: $session,
        );
    }

    public function verify(string $transactionReference): PaymentVerificationResult
    {
        if (! $this->isConfigured()) {
            throw GatewayNotConfiguredException::forGateway($this->key());
        }

        $response = Http::withBasicAuth(config('payments.stripe.secret'), '')
            ->get(self::API_BASE."/checkout/sessions/{$transactionReference}");

        $session = $response->json() ?? [];
        $status = ($session['payment_status'] ?? null) === 'paid' ? 'succeeded' : 'pending';

        return new PaymentVerificationResult(status: $status, transactionId: $transactionReference, raw: $session);
    }

    /**
     * Verifies the `Stripe-Signature` header against the configured
     * webhook secret using Stripe's documented HMAC-SHA256 scheme
     * before trusting the payload — a forged webhook without a valid
     * signature is rejected outright, never processed.
     */
    public function handleWebhook(Request $request): PaymentVerificationResult
    {
        $secret = config('payments.stripe.webhook_secret');
        $signatureHeader = $request->header('Stripe-Signature', '');

        if (! $secret || ! $this->verifyStripeSignature($request->getContent(), $signatureHeader, $secret)) {
            Log::warning('Rejected Stripe webhook with invalid signature.');

            return new PaymentVerificationResult(status: 'failed', raw: ['error' => 'Invalid signature']);
        }

        $payload = $request->json()->all();
        $eventType = $payload['type'] ?? null;
        $session = $payload['data']['object'] ?? [];

        $status = match ($eventType) {
            'checkout.session.completed' => 'succeeded',
            'checkout.session.expired' => 'failed',
            default => 'pending',
        };

        return new PaymentVerificationResult(
            status: $status,
            transactionId: $session['id'] ?? null,
            raw: $payload,
        );
    }

    private function verifyStripeSignature(string $payload, string $signatureHeader, string $secret): bool
    {
        $parts = collect(explode(',', $signatureHeader))
            ->mapWithKeys(function (string $part) {
                [$key, $value] = array_pad(explode('=', $part, 2), 2, null);

                return [$key => $value];
            });

        $timestamp = $parts->get('t');
        $signature = $parts->get('v1');

        if (! $timestamp || ! $signature) {
            return false;
        }

        $expected = hash_hmac('sha256', "{$timestamp}.{$payload}", $secret);

        return hash_equals($expected, $signature);
    }
}
