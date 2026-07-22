<?php

namespace App\Support;

use Cloudinary\Cloudinary;
use Illuminate\Http\UploadedFile;

class CloudinaryUploader
{
    private static function client(): Cloudinary
    {
        $disk = config('filesystems.disks.cloudinary', []);

        $cloudName = $disk['cloud_name'] ?? env('CLOUDINARY_CLOUD_NAME');
        $apiKey = $disk['api_key'] ?? env('CLOUDINARY_API_KEY');
        $apiSecret = $disk['api_secret'] ?? env('CLOUDINARY_API_SECRET');

        if (! $cloudName || ! $apiKey || ! $apiSecret) {
            throw new \RuntimeException(
                'Cloudinary is not configured — CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, '
                .'and CLOUDINARY_API_SECRET must all be set in .env. Run `php artisan config:clear` '
                .'after changing .env, then fully restart `php artisan serve`.',
            );
        }

        $url = sprintf('cloudinary://%s:%s@%s', $apiKey, $apiSecret, $cloudName);

        return new Cloudinary($url);
    }

    public static function upload(UploadedFile $file, string $folder): array
    {
        $result = self::client()->uploadApi()->upload($file->getRealPath(), [
            'folder' => $folder,
        ]);

        return [
            'url' => $result['secure_url'],
            'public_id' => $result['public_id'],
        ];
    }

    public static function delete(string $publicId): void
    {
        self::client()->uploadApi()->destroy($publicId);
    }
}