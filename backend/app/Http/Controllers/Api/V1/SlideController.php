<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\SlideResource;
use App\Models\Slide;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Public, read-only counterpart to `Admin\SlideController` (Phase
 * 7) — only active slides, ordered by position, no auth required.
 * Closes the "Hero Banner / Auto Moving Slider are admin-editable but
 * the storefront doesn't read them" gap.
 */
class SlideController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $type = $request->string('type', 'hero')->toString();

        return ApiResponse::success(
            SlideResource::collection(Slide::type($type)->active()->ordered()->get()),
        );
    }
}
