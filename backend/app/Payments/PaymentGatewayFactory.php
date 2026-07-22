<?php

namespace App\Payments;

use App\Payments\Contracts\PaymentGatewayInterface;
use App\Payments\Gateways\CashOnDeliveryGateway;
use App\Payments\Gateways\EasyPaisaGateway;
use App\Payments\Gateways\JazzCashGateway;
use App\Payments\Gateways\StripeGateway;
use InvalidArgumentException;

/**
 * The single place that knows every gateway's key maps to which
 * class — `PaymentService`/`PaymentController` ask this factory for
 * "the stripe gateway" and get back something implementing
 * `PaymentGatewayInterface`, never instantiating a gateway class
 * directly. Adding a new gateway means one line here plus the new
 * class itself.
 */
class PaymentGatewayFactory
{
    /** @var array<string, class-string<PaymentGatewayInterface>> */
    private const MAP = [
        'stripe' => StripeGateway::class,
        'jazzcash' => JazzCashGateway::class,
        'easypaisa' => EasyPaisaGateway::class,
        'cod' => CashOnDeliveryGateway::class,
    ];

    public static function make(string $key): PaymentGatewayInterface
    {
        $class = self::MAP[$key] ?? null;

        if (! $class) {
            throw new InvalidArgumentException("Unknown payment gateway \"{$key}\".");
        }

        return app($class);
    }

    /** @return array<int, PaymentGatewayInterface> Every registered gateway, regardless of whether it's currently configured — callers filter by `isConfigured()` as needed (see `PaymentController::methods()`). */
    public static function all(): array
    {
        return array_map(fn (string $key) => self::make($key), array_keys(self::MAP));
    }
}
