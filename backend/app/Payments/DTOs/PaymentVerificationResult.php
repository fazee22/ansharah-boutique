<?php

namespace App\Payments\DTOs;

/** What every gateway's `verify()`/`handleWebhook()` returns after confirming a payment's real status with the gateway (or, for COD, confirming there was never an external step to check). */
final class PaymentVerificationResult
{
    public function __construct(
        public readonly string $status,
        public readonly ?string $transactionId = null,
        public readonly array $raw = [],
    ) {}
}
