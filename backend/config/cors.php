<?php

return [
    'paths' => ['api/*', 'up'],

    'allowed_methods' => ['*'],

    // In production, replace the wildcard with the exact storefront
    // and admin dashboard origins from FRONTEND_URL / ADMIN_URL.
    'allowed_origins' => array_filter(explode(',', env('CORS_ALLOWED_ORIGINS', 'http://localhost:3000'))),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];
