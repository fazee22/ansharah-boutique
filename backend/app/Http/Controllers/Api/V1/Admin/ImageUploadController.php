<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Support\ApiResponse;
use App\Support\CloudinaryUploader;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\File;

class ImageUploadController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'image' => ['required', File::image()->max(8 * 1024)],
            'folder' => ['nullable', 'string', 'max:60'],
        ]);

        $folder = $request->string('folder')->toString() ?: 'misc';
        $uploaded = CloudinaryUploader::upload($request->file('image'), $folder);

        return ApiResponse::success($uploaded, 'Image uploaded.');
    }
}