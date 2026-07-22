<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReorderSlidesRequest;
use App\Http\Requests\Admin\UpdateSlideRequest;
use App\Http\Requests\Admin\UploadSlideRequest;
use App\Http\Resources\Admin\SlideResource;
use App\Models\Slide;
use App\Services\SlideService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SlideController extends Controller
{
    public function __construct(private readonly SlideService $slides) {}

    /** `?type=hero|marquee` (required) — one endpoint for both sliders, same as the shared service/table. */
    public function index(Request $request): JsonResponse
    {
        $type = $request->string('type', 'hero')->toString();

        return ApiResponse::success(
            SlideResource::collection(Slide::type($type)->ordered()->get()),
        );
    }

    public function store(UploadSlideRequest $request): JsonResponse
    {
        $slide = $this->slides->upload($request->validated('type'), $request->file('image'), $request->validated());

        return ApiResponse::success(new SlideResource($slide), 'Slide uploaded.', Response::HTTP_CREATED);
    }

    public function update(UpdateSlideRequest $request, Slide $slide): JsonResponse
    {
        $updated = $this->slides->update($slide, $request->validated());

        return ApiResponse::success(new SlideResource($updated), 'Slide updated.');
    }

    public function destroy(Slide $slide): JsonResponse
    {
        $this->slides->delete($slide);

        return ApiResponse::success(null, 'Slide deleted.');
    }

    public function toggleActive(Slide $slide): JsonResponse
    {
        $updated = $this->slides->toggleActive($slide);

        return ApiResponse::success(new SlideResource($updated), 'Slide visibility updated.');
    }

    public function reorder(ReorderSlidesRequest $request): JsonResponse
    {
        $this->slides->reorder($request->validated('type'), $request->validated('items'));

        return ApiResponse::success(null, 'Order updated.');
    }
}
