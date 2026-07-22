<?php

namespace App\Http\Controllers\Api\V1\Account;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\OrderResource;
use App\Models\Order;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Order History + Order Tracking. Every query is scoped to
 * `$request->user()->id` — a customer can only ever see their own
 * orders, enforced at the query level (not just hidden in the UI).
 * Reuses `Http\Resources\Admin\OrderResource` for the same reason as
 * `AddressController` — an order's own shape doesn't change based on
 * who's allowed to see it, only which orders are returned.
 */
class OrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $orders = Order::query()
            ->withCount('items')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate($request->integer('per_page', 10));

        return ApiResponse::success(OrderResource::collection($orders));
    }

    public function show(Request $request, Order $order): JsonResponse
    {
        abort_unless($order->user_id === $request->user()->id, 404);

        return ApiResponse::success(new OrderResource($order->load(['items', 'statusHistory'])));
    }
}
