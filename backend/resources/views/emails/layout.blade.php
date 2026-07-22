<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $subject ?? config('app.name') }}</title>
</head>
{{--
    Every real-world email client strips or ignores a <style> block to
    some degree (Gmail, Outlook desktop especially), so every rule here
    is inline on the element itself — the only approach that reliably
    renders the same everywhere. This layout is the one shared shell
    every Mailable's view extends via @section('content'); the palette
    intentionally mirrors the storefront's design tokens
    (frontend/src/styles/globals.css) so an email doesn't look like a
    different brand than the site it links back to.
--}}
<body style="margin:0; padding:0; background-color:#f4f0e6; font-family:Georgia, 'Times New Roman', serif; color:#14140f;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f0e6; padding:32px 16px;">
    <tr>
        <td align="center">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background-color:#fbf9f4; border:1px solid #e4ddcc;">

                <tr>
                    <td style="padding:32px 40px; text-align:center; border-bottom:1px solid #e4ddcc;">
                        <span style="font-family:Georgia, serif; font-size:22px; letter-spacing:0.08em; color:#14140f; text-transform:uppercase;">
                            {{ config('app.name', 'Verrière') }}
                        </span>
                    </td>
                </tr>

                <tr>
                    <td style="padding:40px;">
                        @yield('content')
                    </td>
                </tr>

                <tr>
                    <td style="padding:24px 40px; border-top:1px solid #e4ddcc; text-align:center;">
                        <p style="margin:0 0 8px; font-family:'Courier New', monospace; font-size:11px; letter-spacing:0.05em; color:#7a7266; text-transform:uppercase;">
                            {{ config('app.name', 'Verrière') }} &mdash; Considered luxury, made to last
                        </p>
                        <p style="margin:0; font-family:'Courier New', monospace; font-size:11px; color:#a39a89;">
                            &copy; {{ date('Y') }} {{ config('app.name', 'Verrière') }}. All rights reserved.
                            @if ($showUnsubscribe ?? false)
                                &nbsp;&middot;&nbsp;
                                <a href="{{ $unsubscribeUrl ?? '#' }}" style="color:#a39a89;">Unsubscribe</a>
                            @endif
                        </p>
                    </td>
                </tr>

            </table>
        </td>
    </tr>
</table>
</body>
</html>
