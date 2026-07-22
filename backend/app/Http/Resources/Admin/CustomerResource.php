<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\User
 */
class CustomerResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'accountStatus' => $this->account_status,
            'ordersCount' => $this->whenCounted('orders'),
            'addresses' => AddressResource::collection($this->whenLoaded('addresses')),
            'notes' => CustomerNoteResource::collection($this->whenLoaded('customerNotes')),
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
