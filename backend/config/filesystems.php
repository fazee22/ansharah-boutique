<?php

return [
    'default' => env('FILESYSTEM_DISK', 'cloudinary'),

    'disks' => [
        'local' => [
            'driver' => 'local',
            'root' => storage_path('app/private'),
            'serve' => true,
            'throw' => false,
        ],

        'public' => [
            'driver' => 'local',
            'root' => storage_path('app/public'),
            'url' => env('APP_URL').'/storage',
            'visibility' => 'public',
            'throw' => false,
        ],

        // Primary media disk. All product, category, and user-uploaded
        // imagery is stored on Cloudinary — never on local disk in
        // production, so the app scales horizontally without shared
        // file storage.
        
           'cloudinary' => [
            'driver' => 'cloudinary',
            'cloud' => [
                'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
            ],
            'api' => [
                'key' => env('CLOUDINARY_API_KEY'),
                'secret' => env('CLOUDINARY_API_SECRET'),
            ],
            'url' => [
                'secure' => true,
            ],
            'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
            'api_key' => env('CLOUDINARY_API_KEY'),
            'api_secret' => env('CLOUDINARY_API_SECRET'),
            'secure' => true,
        ],
    ],

    'links' => [
        storage_path('app/public') => public_path('storage'),
    ],
];
