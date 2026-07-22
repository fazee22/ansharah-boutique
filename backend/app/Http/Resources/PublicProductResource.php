<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PublicProductResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $ancestry = $this->categoryAncestry();

        return [
            'id' => (string) $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'sku' => $this->sku,
            'categoryPath' => array_column($ancestry, 'slug'),
            'categoryLabels' => array_column($ancestry, 'name'),
            'collectionLabel' => $this->category?->name ?? '',
            'price' => (float) $this->price,
            'salePrice' => $this->sale_price !== null ? (float) $this->sale_price : null,
            'currency' => 'PKR',
            'images' => $this->whenLoaded('images', fn () => $this->images
                ->sortBy('position')
                ->values()
                ->map(fn ($image) => [
                    'id' => (string) $image->id,
                    'url' => $image->url,
                    'alt' => $this->name,
                ])),
            'isNew' => (bool) $this->is_new_arrival,
            'isFeatured' => (bool) $this->is_featured,
            'inStock' => $this->stock_quantity > 0,
            'salesRank' => 0,
            'createdAt' => $this->created_at?->toIso8601String(),
            'shortDescription' => $this->short_description ?? '',
            'description' => $this->description ?? '',
            'careInstructions' => [],
            'deliveryEstimateDays' => [2, 7],
        ];
    }

    /** @return array<int, array{slug: string, name: string}> */
    private function categoryAncestry(): array
    {
        $chain = [];
        $category = $this->category;

        while ($category) {
            $chain[] = ['slug' => $category->slug, 'name' => $category->name];
            $category = $category->parent;
        }

        return array_reverse($chain);
    }
}