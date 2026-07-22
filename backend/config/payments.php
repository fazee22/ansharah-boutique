<?php

/**
 * Central config for every payment gateway — every key here is read
 * straight from .env (see .env.example's "Payments" section) and
 * nowhere else in the codebase reads a payment credential directly.
 * A gateway with a missing required key reports `isConfigured() ===
 * false` (see each Gateway class) rather than the app trying to use
 * it and failing at charge time.
 */
return [

    'default' => env('DEFAULT_PAYMENT_GATEWAY', 'cod'),

    'stripe' => [
        'key' => env('STRIPE_KEY'),
        'secret' => env('STRIPE_SECRET'),
        'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
    ],

    'jazzcash' => [
        'merchant_id' => env('JAZZCASH_MERCHANT_ID'),
        'password' => env('JAZZCASH_PASSWORD'),
        'integrity_salt' => env('JAZZCASH_INTEGRITY_SALT'),
        'return_url' => env('JAZZCASH_RETURN_URL'),
        // JazzCash provides separate sandbox and live endpoints; toggle via JAZZCASH_SANDBOX.
        'sandbox' => env('JAZZCASH_SANDBOX', true),
    ],

    'easypaisa' => [
        'store_id' => env('EASYPAISA_STORE_ID'),
        'hash_key' => env('EASYPAISA_HASH_KEY'),
        'return_url' => env('EASYPAISA_RETURN_URL'),
        'sandbox' => env('EASYPAISA_SANDBOX', true),
    ],

];
