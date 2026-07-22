<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Order
 */
class OrderResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'orderNumber' => $this->order_number,
            'userId' => $this->user_id,
            'customerName' => $this->customer_name,
            'customerEmail' => $this->customer_email,
            'customerPhone' => $this->customer_phone,
            'status' => $this->status,
            'subtotal' => (float) $this->subtotal,
            'shippingFee' => (float) $this->shipping_fee,
            'discount' => (float) $this->discount,
            'total' => (float) $this->total,
            'currency' => $this->currency,
            'paymentMethod' => $this->payment_method,
            'paymentStatus' => $this->payment_status,
            'shippingAddress' => $this->shipping_address,
            'billingAddress' => $this->billing_address,
            'itemCount' => $this->items_count ?? ($this->relationLoaded('items') ? $this->items->sum('quantity') : null),
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
            'statusHistory' => OrderStatusHistoryResource::collection($this->whenLoaded('statusHistory')),
            'notes' => OrderNoteResource::collection($this->whenLoaded('notes')),
            'createdAt' => $this->created_at?->toIso8601String(),
            'updatedAt' => $this->updated_at?->toIso8601String(),
        ];
    }
}
