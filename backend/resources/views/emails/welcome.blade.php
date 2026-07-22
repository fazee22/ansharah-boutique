@extends('emails.layout')

@section('content')
    <p style="margin:0 0 4px; font-family:'Courier New', monospace; font-size:11px; letter-spacing:0.05em; color:#8a7250; text-transform:uppercase;">
        Welcome
    </p>
    <h1 style="margin:0 0 16px; font-family:Georgia, serif; font-size:24px; font-weight:400; color:#14140f;">
        Welcome, {{ $user->name }}
    </h1>
    <p style="margin:0 0 24px; font-size:14px; line-height:1.6; color:#4a4438;">
        Your account is ready. From your dashboard you can track orders, save addresses, and pick your
        wishlist up wherever you left it.
    </p>

    @include('emails.partials.button', ['url' => rtrim(config('app.frontend_url'), '/').'/account', 'label' => 'Go to Your Account'])

    <p style="margin:24px 0 0; font-size:13px; line-height:1.6; color:#8a7d6b;">
        Questions any time — just reply to this email.
    </p>
@endsection
