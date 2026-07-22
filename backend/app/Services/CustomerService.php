<?php

namespace App\Services;

use App\Models\User;
use App\Support\ActivityLogger;

class CustomerService
{
    public function setAccountStatus(User $customer, string $status): User
    {
        $customer->update(['account_status' => $status]);
        ActivityLogger::log('customer.status_changed', "Customer #{$customer->id}", ['status' => $status]);

        return $customer->fresh();
    }

    public function addNote(User $customer, ?int $authorId, string $body): User
    {
        $customer->customerNotes()->create(['author_id' => $authorId, 'body' => $body]);

        return $customer->fresh(['customerNotes']);
    }

    /**
     * Lightweight lifetime stats for the customer detail page — kept
     * here rather than piling more relations onto the `User` model
     * itself, since these are aggregate reads, not something a
     * customer "has."
     */
    public function stats(User $customer): array
    {
        $orders = $customer->orders();

        return [
            'totalOrders' => (clone $orders)->count(),
            'totalSpent' => (float) (clone $orders)->where('payment_status', 'paid')->sum('total'),
            'lastOrderAt' => (clone $orders)->latest()->value('created_at'),
        ];
    }
}
