const STORAGE_KEY = "luxury-last-order-email";

/**
 * Remembers the email used for the most recent order lookup/payment
 * initiation in sessionStorage (cleared when the tab closes) — lets
 * `/order-confirmation`, `/payment/success`, `/payment/pending`, and
 * `/payment/failed` resolve the order automatically when a customer
 * lands on them right after checkout, without putting an email
 * address in the URL/browser history. Falls back to an inline prompt
 * (`OrderLookupGate`) when nothing is remembered — a direct visit, a
 * different device, or a cleared session.
 */
export function rememberOrderLookupEmail(email: string): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, email);
  } catch {
    // Storage can be unavailable (private browsing, etc.) — the inline
    // prompt fallback covers this case, so failing silently is fine.
  }
}

export function recallOrderLookupEmail(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}
