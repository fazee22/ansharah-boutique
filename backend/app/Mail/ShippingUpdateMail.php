<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/** Sent from `OrderService::updateStatus()` alongside writing the status-history entry — the same event that updates the admin's Order Timeline also (optionally) notifies the customer. Dispatching this from the service is a follow-up wiring change, not part of this Mailable itself. */
class ShippingUpdateMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly Order $order,
        public readonly string $statusLabel,
        public readonly ?string $note = null,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: "Order {$this->order->order_number} — {$this->statusLabel}");
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.shipping-update',
            with: ['order' => $this->order, 'statusLabel' => $this->statusLabel, 'note' => $this->note],
        );
    }
}
