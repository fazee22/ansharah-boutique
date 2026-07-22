"use client";

import { useEffect } from "react";
import { AlertOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Next.js `error.tsx` for the entire `admin/` segment — catches an unhandled error anywhere in the dashboard and offers a retry without losing the admin shell context entirely. */
export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-canvas px-4 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-destructive/30 text-destructive">
        <AlertOctagon className="h-7 w-7" aria-hidden="true" />
      </span>
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-heading-lg text-foreground">Something went wrong</h1>
        <p className="text-body-sm text-muted-foreground">This part of the dashboard hit an unexpected error.</p>
      </div>
      <Button variant="primary" size="md" onClick={reset}>
        Try Again
      </Button>
    </div>
  );
}
