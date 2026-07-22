<?php

namespace App\Support;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

/**
 * Lightweight activity logging — a static `log()` call writes a
 * structured line to the `activity` channel (`config/logging.php`)
 * recording who did what to which record. Deliberately a plain log
 * channel rather than a database table: an admin activity feed UI
 * reading structured DB rows is a natural follow-up once there's a
 * concrete screen that needs it, but the logging itself — the part
 * that can't be retrofitted after the fact — is real today.
 *
 * Wired into the highest-value actions (order status changes, admin
 * account status changes, destructive deletes) as the demonstrated
 * pattern; extending it to further admin actions is a mechanical,
 * one-line addition per call site.
 */
class ActivityLogger
{
    public static function log(string $action, string $subject, array $context = []): void
    {
        Log::channel('activity')->info($action, array_merge([
            'subject' => $subject,
            'actor_id' => Auth::guard('api')->id(),
        ], $context));
    }
}
