@extends('emails.layout')

@section('content')
    @if ($eyebrow)
        <p style="margin:0 0 4px; font-family:'Courier New', monospace; font-size:11px; letter-spacing:0.05em; color:#8a7250; text-transform:uppercase;">
            {{ $eyebrow }}
        </p>
    @endif
    <h1 style="margin:0 0 16px; font-family:Georgia, serif; font-size:24px; font-weight:400; color:#14140f;">
        {{ $headline }}
    </h1>

    <div style="font-size:14px; line-height:1.7; color:#4a4438;">
        {!! $bodyHtml !!}
    </div>

    @if ($ctaUrl && $ctaLabel)
        @include('emails.partials.button', ['url' => $ctaUrl, 'label' => $ctaLabel])
    @endif
@endsection
