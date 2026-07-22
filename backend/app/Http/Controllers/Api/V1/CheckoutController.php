<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\CheckoutRequest;
use App\Http\Resources\Admin\OrderResource;
use App\Services\OrderService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 * The real checkout endpoint (Phase 10) — `POST /api/v1/orders`. See
 * `OrderService::createFromCheckout()`'s doc comment for why line
 * items are snapshots rather than references to real product rows.
 * Works for guests and authenticated customers alike (an
 * authenticated request's order is linked to their account and shows
 * up in their real Order History immediately).
 */
class CheckoutController extends Controller
{
    public function __construct(private readonly OrderService $orders) {}

    public function store(CheckoutRequest $request): JsonResponse
    {
        $items = collect($request->validated('items'))->map(fn (array $item) => [
            'name' => $item['name'],
            'sku' => $item['sku'],
            'imageUrl' => $item['image_url'] ?? null,
            'unitPrice' => (float) $item['unit_price'],
            'quantity' => (int) $item['quantity'],
        ])->all();

        $order = $this->orders->createFromCheckout(
            attributes: [
                'customerName' => $request->validated('customer_name'),
                'customerEmail' => $request->validated('customer_email'),
                'customerPhone' => $request->validated('customer_phone'),
                'paymentMethod' => $request->validated('payment_method'),
                'shippingFee' => $request->validated('shipping_fee'),
                'currency' => $request->validated('currency') ?? 'PKR',
                'shippingAddress' => $request->validated('shipping_address'),
            ],
            items: $items,
            userId: $request->user('api')?->id,
        );

        return ApiResponse::success(new OrderResource($order), 'Order placed.', Response::HTTP_CREATED);
    }
}
