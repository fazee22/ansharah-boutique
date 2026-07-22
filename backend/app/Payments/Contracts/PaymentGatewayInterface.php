<?php

namespace App\Payments\Contracts;

use App\Models\Order;
use App\Payments\DTOs\PaymentInitiationResult;
use App\Payments\DTOs\PaymentVerificationResult;
use Illuminate\Http\Request;

/**
 * Every payment gateway — Stripe, JazzCash, EasyPaisa, Cash on
 * Delivery — implements exactly this contract. `PaymentController`
 * and `PaymentService` only ever talk to this interface, never to a
 * concrete gateway class directly, so adding a fifth gateway later
 * (e.g. Alfalah, UnionPay) means writing one new class and registering
 * it in `PaymentGatewayFactory` — nothing else in the codebase changes.
 */
interface PaymentGatewayInterface
{
    /** A stable, unique key — "stripe", "jazzcash", "easypaisa", "cod". Matches `payments.gateway` and `config/payments.php`'s keys. */
    public function key(): string;

    /** Human-readable label for UI display (payment method selector, invoices). */
    public function label(): string;

    /** True only if this gateway has real, usable credentials configured (see `config/payments.php`) — lets the frontend/API hide gateways that would just fail. Always true for `cod`. */
    public function isConfigured(): bool;

    /**
     * Starts a payment for the given order. For redirect-based
     * gateways this creates a hosted checkout session/order with the
     * provider and returns a URL to send the customer to; for Cash on
     * Delivery there's no external step, so this returns an
     * already-`succeeded` result.
     */
    public function initiate(Order $order): PaymentInitiationResult;

    /**
     * Confirms a payment's real status directly with the gateway
     * (a polling/redirect-return check, as opposed to a webhook push
     * — see `handleWebhook()`), given the gateway's own reference for
     * the transaction.
     */
    public function verify(string $transactionReference): PaymentVerificationResult;

    /**
     * Handles an inbound webhook/IPN callback from the gateway.
     * Implementations MUST verify the request's signature (or
     * equivalent authenticity check) before trusting its payload —
     * see each gateway's implementation for the specific mechanism.
     */
    public function handleWebhook(Request $request): PaymentVerificationResult;
}
