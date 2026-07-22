@extends('emails.layout')

@section('content')
    <p style="margin:0 0 4px; font-family:'Courier New', monospace; font-size:11px; letter-spacing:0.05em; color:#8a7250; text-transform:uppercase;">
        Order Update
    </p>
    <h1 style="margin:0 0 16px; font-family:Georgia, serif; font-size:24px; font-weight:400; color:#14140f;">
        Your order is {{ $statusLabel }}
    </h1>
    <p style="margin:0 0 24px; font-size:14px; line-height:1.6; color:#4a4438;">
        Hi {{ $order->customer_name }}, order <strong>{{ $order->order_number }}</strong> has an update:
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px; background-color:#f4f0e6; border-left:3px solid #8a7250;">
        <tr>
            <td style="padding:16px 20px;">
                <p style="margin:0; font-family:'Courier New', monospace; font-size:12px; letter-spacing:0.05em; color:#14140f; text-transform:uppercase;">
                    {{ $statusLabel }}
                </p>
                @if ($note)
                    <p style="margin:8px 0 0; font-size:13px; color:#4a4438;">{{ $note }}</p>
                @endif
            </td>
        </tr>
    </table>

    @include('emails.partials.button', ['url' => rtrim(config('app.frontend_url'), '/').'/account/orders/'.$order->id, 'label' => 'View Order Status'])
@endsection
