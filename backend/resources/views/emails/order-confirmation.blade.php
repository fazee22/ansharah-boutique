@extends('emails.layout')

@section('content')
    <p style="margin:0 0 4px; font-family:'Courier New', monospace; font-size:11px; letter-spacing:0.05em; color:#8a7250; text-transform:uppercase;">
        Order Confirmed
    </p>
    <h1 style="margin:0 0 16px; font-family:Georgia, serif; font-size:24px; font-weight:400; color:#14140f;">
        Thank you, {{ $order->customer_name }}
    </h1>
    <p style="margin:0 0 24px; font-size:14px; line-height:1.6; color:#4a4438;">
        We&rsquo;ve received your order <strong>{{ $order->order_number }}</strong> and it&rsquo;s being prepared.
        You&rsquo;ll get another email the moment it ships.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px; border-top:1px solid #e4ddcc;">
        @foreach ($order->items as $item)
            <tr>
                <td style="padding:12px 0; border-bottom:1px solid #e4ddcc; font-size:13px; color:#14140f;">
                    {{ $item->product_name }}
                    <br>
                    <span style="font-family:'Courier New', monospace; font-size:11px; color:#8a7d6b;">Qty {{ $item->quantity }}</span>
                </td>
                <td style="padding:12px 0; border-bottom:1px solid #e4ddcc; font-family:'Courier New', monospace; font-size:13px; color:#14140f; text-align:right;">
                    {{ $order->currency }} {{ number_format((float) $item->line_total, 2) }}
                </td>
            </tr>
        @endforeach
        <tr>
            <td style="padding:12px 0 0; font-size:13px; color:#4a4438;">Subtotal</td>
            <td style="padding:12px 0 0; font-family:'Courier New', monospace; font-size:13px; color:#4a4438; text-align:right;">{{ $order->currency }} {{ number_format((float) $order->subtotal, 2) }}</td>
        </tr>
        <tr>
            <td style="padding:4px 0; font-size:13px; color:#4a4438;">Shipping</td>
            <td style="padding:4px 0; font-family:'Courier New', monospace; font-size:13px; color:#4a4438; text-align:right;">{{ $order->currency }} {{ number_format((float) $order->shipping_fee, 2) }}</td>
        </tr>
        <tr>
            <td style="padding:8px 0 0; font-size:15px; color:#14140f; border-top:1px solid #e4ddcc;"><strong>Total</strong></td>
            <td style="padding:8px 0 0; font-family:'Courier New', monospace; font-size:15px; color:#14140f; text-align:right; border-top:1px solid #e4ddcc;"><strong>{{ $order->currency }} {{ number_format((float) $order->total, 2) }}</strong></td>
        </tr>
    </table>

    <p style="margin:0 0 4px; font-family:'Courier New', monospace; font-size:11px; letter-spacing:0.05em; color:#8a7250; text-transform:uppercase;">Shipping To</p>
    <p style="margin:0 0 24px; font-size:13px; line-height:1.6; color:#4a4438;">
        {{ $order->shipping_address['fullName'] ?? $order->customer_name }}<br>
        {{ $order->shipping_address['line1'] ?? '' }}<br>
        {{ $order->shipping_address['city'] ?? '' }}, {{ $order->shipping_address['country'] ?? '' }}
    </p>

    @include('emails.partials.button', ['url' => rtrim(config('app.frontend_url'), '/').'/account/orders/'.$order->id, 'label' => 'Track Your Order'])
@endsection
