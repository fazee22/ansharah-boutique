@extends('emails.layout')

@section('content')
    <p style="margin:0 0 4px; font-family:'Courier New', monospace; font-size:11px; letter-spacing:0.05em; color:#8a7250; text-transform:uppercase;">
        Password Reset
    </p>
    <h1 style="margin:0 0 16px; font-family:Georgia, serif; font-size:24px; font-weight:400; color:#14140f;">
        Reset your password
    </h1>
    <p style="margin:0 0 8px; font-size:14px; line-height:1.6; color:#4a4438;">
        Hi {{ $user->name }}, we received a request to reset your password. Click below to choose a new one —
        this link expires in {{ $expiresInMinutes }} minutes.
    </p>
    <p style="margin:0 0 24px; font-size:13px; line-height:1.6; color:#8a7d6b;">
        If you didn&rsquo;t request this, you can safely ignore this email — your password won&rsquo;t change.
    </p>

    @include('emails.partials.button', ['url' => $resetUrl, 'label' => 'Reset Password'])

    <p style="margin:24px 0 0; font-size:12px; line-height:1.6; color:#a39a89;">
        Or copy and paste this link into your browser:<br>
        <a href="{{ $resetUrl }}" style="color:#8a7250; word-break:break-all;">{{ $resetUrl }}</a>
    </p>
@endsection
