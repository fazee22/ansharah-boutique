<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SlideResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'title' => $this->title,
            'subtitle' => $this->subtitle,
            'imageUrl' => $this->image_url,
            'linkUrl' => $this->link_url,
            'ctaLabel' => $this->cta_label,
            'position' => $this->position,
            'isActive' => $this->is_active,
        ];
    }
}
