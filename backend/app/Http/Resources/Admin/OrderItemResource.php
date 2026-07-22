<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'productId' => $this->product_id,
            'productName' => $this->product_name,
            'productSku' => $this->product_sku,
            'productImageUrl' => $this->product_image_url,
            'unitPrice' => (float) $this->unit_price,
            'quantity' => $this->quantity,
            'lineTotal' => (float) $this->line_total,
        ];
    }
}
