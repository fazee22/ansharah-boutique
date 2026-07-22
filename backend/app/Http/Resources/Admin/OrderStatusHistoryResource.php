<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderStatusHistoryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'note' => $this->note,
            'changedByName' => $this->whenLoaded('changedBy', fn () => $this->changedBy?->name),
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
