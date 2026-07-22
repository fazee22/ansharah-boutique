<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Admin-facing product representation — deliberately more complete
 * than a future public `ProductResource` would be (SEO fields,
 * timestamps, raw status) since this is what powers the edit form,
 * not the storefront.
 *
 * @mixin \App\Models\Product
 */
class ProductResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'categoryId' => $this->category_id,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'name' => $this->name,
            'slug' => $this->slug,
            'sku' => $this->sku,
            'price' => (float) $this->price,
            'salePrice' => $this->sale_price !== null ? (float) $this->sale_price : null,
            'description' => $this->description,
            'shortDescription' => $this->short_description,
            'stockQuantity' => $this->stock_quantity,
            'status' => $this->status,
            'isFeatured' => $this->is_featured,
            'isNewArrival' => $this->is_new_arrival,
            'newArrivalPosition' => $this->new_arrival_position,
            'isSale' => $this->is_sale,
            'salePosition' => $this->sale_position,
            'tags' => $this->tags ?? [],
            'seoTitle' => $this->seo_title,
            'seoDescription' => $this->seo_description,
            'images' => ProductImageResource::collection($this->whenLoaded('images')),
            'createdAt' => $this->created_at?->toIso8601String(),
            'updatedAt' => $this->updated_at?->toIso8601String(),
        ];
    }
}
