<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'orderId' => $this->order_id,
            'gateway' => $this->gateway,
            'status' => $this->status,
            'amount' => (float) $this->amount,
            'currency' => $this->currency,
            'transactionId' => $this->transaction_id,
            'failureReason' => $this->failure_reason,
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
