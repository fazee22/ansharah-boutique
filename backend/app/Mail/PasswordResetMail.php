<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Template and Mailable are ready; not yet wired to an actual
 * forgot-password request/token flow (no `POST /auth/forgot-password`
 * endpoint exists yet — the storefront login page has no "forgot
 * password" link either). Both are a natural, small follow-up once
 * that flow is scoped, reusing this class as-is.
 */
class PasswordResetMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly User $user,
        public readonly string $resetUrl,
        public readonly int $expiresInMinutes = 60,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Reset Your Password');
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.password-reset',
            with: ['user' => $this->user, 'resetUrl' => $this->resetUrl, 'expiresInMinutes' => $this->expiresInMinutes],
        );
    }
}
