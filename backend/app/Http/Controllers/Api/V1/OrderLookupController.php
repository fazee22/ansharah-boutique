<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\LookupOrderRequest;
use App\Http\Resources\Admin\OrderResource;
use App\Models\Order;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

/**
 * Backs the Order Confirmation / Payment Success / Payment Pending
 * pages for a guest who just placed an order and has no account to
 * log into — the same "order number + matching email" ownership
 * check `PaymentController::initiate()` uses, not a real session, but
 * meaningfully better than an unauthenticated lookup by id alone.
 */
class OrderLookupController extends Controller
{
    public function show(LookupOrderRequest $request): JsonResponse
    {
        $order = Order::where('order_number', $request->validated('order_number'))
            ->where('customer_email', $request->validated('email'))
            ->with(['items', 'statusHistory'])
            ->first();

        abort_unless($order, 404, 'No matching order found.');

        return ApiResponse::success(new OrderResource($order));
    }
}
