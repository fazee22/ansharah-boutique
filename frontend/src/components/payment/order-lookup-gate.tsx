"use client";

import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { emailSchema } from "@/lib/validation";

export interface OrderLookupGateProps {
  orderNumber: string | null;
  onSubmit: (email: string) => void;
}

/**
 * Shown instead of order details when we don't have a remembered
 * email for this session (see `hooks/use-order-lookup.ts`) — a direct
 * visit to a confirmation link, a different device, or a cleared
 * session all land here rather than at a dead end.
 */
function OrderLookupGate({ orderNumber, onSubmit }: OrderLookupGateProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setError("Enter the email address used for this order.");
      return;
    }
    setError(null);
    onSubmit(result.data);
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-4 rounded-lg border border-hairline bg-porcelain p-8 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-hairline text-brass-dark">
        <Mail className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-heading-sm text-foreground">Confirm your email</h2>
        <p className="text-body-sm text-muted-foreground">
          {orderNumber ? `Enter the email used for order ${orderNumber}.` : "Enter the email used for this order."}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="h-11 w-full rounded-md border border-hairline bg-canvas px-3 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
        />
        {error ? <span className="text-caption text-destructive">{error}</span> : null}
        <Button type="submit" variant="primary" size="md">
          View Order
        </Button>
      </form>
    </div>
  );
}

export { OrderLookupGate };
