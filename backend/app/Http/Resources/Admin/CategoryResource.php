<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Category
 */
class CategoryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'parentId' => $this->parent_id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'imageUrl' => $this->image_url,
            'position' => $this->position,
            'isVisible' => $this->is_visible,
            'productCount' => $this->whenCounted('products'),
            // Present only when the caller eager-loaded `children` (the
            // tree endpoint does; the flat list endpoint doesn't), so a
            // flat paginated response never pays for the recursive load.
            'children' => CategoryResource::collection($this->whenLoaded('children')),
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
