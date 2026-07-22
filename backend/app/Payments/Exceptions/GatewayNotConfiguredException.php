<?php

namespace App\Payments\Exceptions;

use RuntimeException;

/** Thrown when `initiate()` is called on a gateway missing real credentials — a clear, honest failure instead of silently pretending to charge a card. */
class GatewayNotConfiguredException extends RuntimeException
{
    public static function forGateway(string $gateway): self
    {
        return new self("The \"{$gateway}\" payment gateway is not configured. Set its credentials in .env — see config/payments.php.");
    }
}
