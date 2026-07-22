<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\SubscribeNewsletterRequest;
use App\Models\NewsletterSubscriber;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

/**
 * Public endpoint — the real backing store for the newsletter forms
 * built in Phase 2/3 (footer + homepage sections), which only
 * validated client-side until now. `firstOrCreate` makes re-
 * subscribing with the same email a harmless no-op rather than a
 * duplicate-key error the frontend would have to handle specially.
 */
class NewsletterController extends Controller
{
    public function subscribe(SubscribeNewsletterRequest $request): JsonResponse
    {
        $subscriber = NewsletterSubscriber::firstOrCreate(
            ['email' => $request->validated('email')],
            ['source' => $request->validated('source'), 'subscribed_at' => now()],
        );

        return ApiResponse::success(['email' => $subscriber->email], "You're on the list.");
    }
}
