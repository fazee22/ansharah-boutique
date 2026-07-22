<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Redirecting to your payment provider…</title>
    <meta name="robots" content="noindex, nofollow">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: #f4f0e6;
            color: #14140f;
        }
        .card {
            text-align: center;
        }
        .spinner {
            width: 32px;
            height: 32px;
            border: 3px solid #e5ded0;
            border-top-color: #8a7250;
            border-radius: 50%;
            margin: 0 auto 16px;
            animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    {{-- Standard signed-form-POST redirect pattern for gateways (JazzCash,
         EasyPaisa) whose hosted checkout doesn't accept a simple GET
         redirect — see PaymentController::jazzcashRedirect()/easypaisaRedirect()
         and each Gateway class's doc comment for why this bridge exists. --}}
    <div class="card">
        <div class="spinner" role="status" aria-label="Redirecting"></div>
        <p>Redirecting you to your payment provider — please don&rsquo;t close this window.</p>
    </div>

    <form id="gateway-form" method="POST" action="{{ $actionUrl }}">
        @foreach ($fields as $key => $value)
            <input type="hidden" name="{{ $key }}" value="{{ $value }}">
        @endforeach
    </form>

    <script>
        document.getElementById('gateway-form').submit();
    </script>
</body>
</html>
