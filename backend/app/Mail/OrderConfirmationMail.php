<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Sent the moment an order is placed (or, today, whenever
 * `OrderService`/a future checkout flow chooses to dispatch it — no
 * automatic trigger is wired to order creation yet, since orders are
 * still seeded rather than placed through a live checkout).
 * Implements `ShouldQueue` — sending goes through the `database`
 * queue connection already configured (see `.env.example`), so
 * dispatching this never blocks the HTTP response that triggered it.
 */
class OrderConfirmationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public readonly Order $order)
    {
        // Eager-load what the view needs so rendering the email never
        // triggers a lazy-load exception under Model::preventLazyLoading().
        $this->order->loadMissing('items');
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: "Order Confirmed — {$this->order->order_number}");
    }

    public function content(): Content
    {
        return new Content(view: 'emails.order-confirmation', with: ['order' => $this->order]);
    }
}
