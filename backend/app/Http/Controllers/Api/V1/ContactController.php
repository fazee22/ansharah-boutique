<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\SubmitContactMessageRequest;
use App\Models\ContactMessage;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

/** Public endpoint backing the storefront Contact page's form (Phase 8). */
class ContactController extends Controller
{
    public function store(SubmitContactMessageRequest $request): JsonResponse
    {
        ContactMessage::create($request->validated());

        return ApiResponse::success(null, "Thanks for reaching out — we'll be in touch shortly.", Response::HTTP_CREATED);
    }
}
