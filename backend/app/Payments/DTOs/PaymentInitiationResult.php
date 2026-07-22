<?php

namespace App\Payments\DTOs;

/**
 * What every gateway's `initiate()` returns, regardless of how
 * different their real APIs are — a redirect-based gateway (Stripe
 * Checkout, JazzCash, EasyPaisa) sets `redirectUrl`; a synchronous
 * one (Cash on Delivery, which has no external step) sets `status`
 * straight to "succeeded" and leaves `redirectUrl` null. Callers
 * (`PaymentController`) branch on `redirectUrl` being present, never
 * on which gateway was used — that's the whole point of the
 * interface.
 */
final class PaymentInitiationResult
{
    public function __construct(
        public readonly string $status,
        public readonly ?string $redirectUrl = null,
        public readonly ?string $transactionId = null,
        public readonly array $raw = [],
    ) {}

    public static function redirect(string $url, ?string $transactionId = null, array $raw = []): self
    {
        return new self(status: 'pending', redirectUrl: $url, transactionId: $transactionId, raw: $raw);
    }

    public static function succeeded(?string $transactionId = null, array $raw = []): self
    {
        return new self(status: 'succeeded', transactionId: $transactionId, raw: $raw);
    }

    public static function failed(array $raw = []): self
    {
        return new self(status: 'failed', raw: $raw);
    }
}
