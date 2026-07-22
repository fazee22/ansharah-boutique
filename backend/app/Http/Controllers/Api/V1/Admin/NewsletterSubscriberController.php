<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\NewsletterSubscriberResource;
use App\Models\NewsletterSubscriber;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class NewsletterSubscriberController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $subscribers = NewsletterSubscriber::query()
            ->when($request->filled('search'), fn ($query) => $query->where('email', 'like', '%'.$request->string('search').'%'))
            ->latest('subscribed_at')
            ->paginate($request->integer('per_page', 30));

        return ApiResponse::success(NewsletterSubscriberResource::collection($subscribers));
    }

    public function destroy(NewsletterSubscriber $subscriber): JsonResponse
    {
        $subscriber->delete();

        return ApiResponse::success(null, 'Subscriber removed.');
    }

    /**
     * Streams a CSV rather than building the whole file in memory —
     * the subscriber list is unbounded, and a streamed response keeps
     * memory flat regardless of how many thousand rows exist.
     */
    public function export(): StreamedResponse
    {
        $filename = 'newsletter-subscribers-'.now()->format('Y-m-d').'.csv';

        return response()->streamDownload(function () {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Email', 'Source', 'Subscribed At']);

            NewsletterSubscriber::query()->orderBy('subscribed_at')->chunk(500, function ($chunk) use ($handle) {
                foreach ($chunk as $subscriber) {
                    fputcsv($handle, [
                        $subscriber->email,
                        $subscriber->source ?? '',
                        $subscriber->subscribed_at?->toDateTimeString(),
                    ]);
                }
            });

            fclose($handle);
        }, $filename, ['Content-Type' => 'text/csv']);
    }
}
