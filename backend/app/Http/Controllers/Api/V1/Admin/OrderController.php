<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AddNoteRequest;
use App\Http\Requests\Admin\UpdateOrderStatusRequest;
use App\Http\Resources\Admin\OrderResource;
use App\Models\Order;
use App\Services\OrderService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function __construct(private readonly OrderService $orders) {}

    /**
     * `?search=`, `?status=`, `?payment_status=`, `?sort=newest|oldest|total_desc|total_asc`,
     * paginated. Mirrors `Admin\ProductController::index()`'s shape
     * from Phase 6 — same search/filter/sort/paginate contract, one
     * endpoint, applied to a different model.
     */
    public function index(Request $request): JsonResponse
    {
        $sortMap = [
            'newest' => ['created_at', 'desc'],
            'oldest' => ['created_at', 'asc'],
            'total_desc' => ['total', 'desc'],
            'total_asc' => ['total', 'asc'],
        ];
        [$column, $direction] = $sortMap[$request->string('sort')->toString()] ?? $sortMap['newest'];

        $orders = Order::query()
            ->withCount('items')
            ->search($request->string('search')->toString() ?: null)
            ->when($request->filled('status'), fn ($query) => $query->where('status', $request->string('status')))
            ->when($request->filled('payment_status'), fn ($query) => $query->where('payment_status', $request->string('payment_status')))
            ->orderBy($column, $direction)
            ->paginate($request->integer('per_page', 20));

        return ApiResponse::success(OrderResource::collection($orders));
    }

    public function show(Order $order): JsonResponse
    {
        return ApiResponse::success(
            new OrderResource($order->load(['items', 'statusHistory.changedBy', 'notes.author'])),
        );
    }

    public function updateStatus(UpdateOrderStatusRequest $request, Order $order): JsonResponse
    {
        $updated = $this->orders->updateStatus(
            $order,
            $request->validated('status'),
            $request->user()?->id,
            $request->validated('note'),
        );

        return ApiResponse::success(new OrderResource($updated), 'Order status updated.');
    }

    public function addNote(AddNoteRequest $request, Order $order): JsonResponse
    {
        $updated = $this->orders->addNote($order, $request->user()?->id, $request->validated('body'));

        return ApiResponse::success(new OrderResource($updated->load('notes.author')), 'Note added.');
    }
}
