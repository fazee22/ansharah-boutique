<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderNoteResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'body' => $this->body,
            'authorName' => $this->whenLoaded('author', fn () => $this->author?->name ?? 'Admin'),
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
