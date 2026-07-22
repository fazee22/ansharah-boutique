<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * A generic, admin-composed campaign shell — not tied to a single
 * fixed message like the other four Mailables. `bodyHtml` is rendered
 * unescaped (`{!! !!}`) in the view since it's meant to hold real
 * formatted content (paragraphs, links), so this class must only ever
 * be constructed with admin-authored copy, never raw customer input —
 * the admin Newsletter Management screen (Phase 7) is the intended
 * source; wiring a "compose campaign" UI to actually call this is a
 * follow-up, not part of this Mailable.
 */
class NewsletterMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly string $headline,
        public readonly string $bodyHtml,
        public readonly ?string $eyebrow = null,
        public readonly ?string $ctaUrl = null,
        public readonly ?string $ctaLabel = null,
        public readonly ?string $unsubscribeUrl = null,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: $this->headline);
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.newsletter',
            with: [
                'eyebrow' => $this->eyebrow,
                'headline' => $this->headline,
                'bodyHtml' => $this->bodyHtml,
                'ctaUrl' => $this->ctaUrl,
                'ctaLabel' => $this->ctaLabel,
                'showUnsubscribe' => (bool) $this->unsubscribeUrl,
                'unsubscribeUrl' => $this->unsubscribeUrl,
            ],
        );
    }
}
