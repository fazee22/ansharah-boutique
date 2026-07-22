{{-- Reusable CTA button partial — table-based so it renders correctly in Outlook, which ignores padding/border-radius on <a> tags directly. --}}
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
    <tr>
        <td style="background-color:#14140f; border-radius:2px;">
            <a href="{{ $url }}" style="display:inline-block; padding:14px 32px; font-family:'Courier New', monospace; font-size:12px; letter-spacing:0.08em; text-transform:uppercase; color:#fbf9f4; text-decoration:none;">
                {{ $label }}
            </a>
        </td>
    </tr>
</table>
