"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { emailSchema } from "@/lib/validation";
import { newsletterService } from "@/services/api/newsletter.service";
import { cn } from "@/lib/utils";

export interface NewsletterFormProps {
  variant?: "inline" | "section";
  /** Controls caption text color — "light" (default) for canvas/porcelain backgrounds, "dark" for ink/evergreen backgrounds. */
  tone?: "light" | "dark";
  /** Tags where the subscription came from (e.g. "footer", "homepage") — stored on the subscriber record for the admin Newsletter Management list. */
  source?: string;
  className?: string;
  idPrefix?: string;
}

/**
 * Newsletter signup form, shared by the footer (`variant="inline"`)
 * and the homepage newsletter section (`variant="section"`, larger
 * type and a centered layout). Submits to the real backend
 * (`POST /api/v1/newsletter/subscribe`, added Phase 7) — subscribers
 * land in the admin Newsletter Management list. Validation still runs
 * client-side first via `emailSchema` so an obviously invalid address
 * never even reaches the network.
 */
function NewsletterForm({
  variant = "inline",
  tone = "light",
  source,
  className,
  idPrefix = "newsletter",
}: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputId = `${idPrefix}-email`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = emailSchema.safeParse(email);

    if (!result.success) {
      setErrorMessage("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    try {
      await newsletterService.subscribe(result.data, source);
      setStatus("success");
      setEmail("");
    } catch (caught) {
      setErrorMessage((caught as { message?: string })?.message ?? "Couldn't subscribe — please try again.");
      setStatus("error");
    }
  }

  const isSection = variant === "section";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={cn("flex w-full flex-col gap-3", isSection ? "max-w-lg items-center text-center" : "max-w-md", className)}
    >
      <div
        className={cn(
          "flex w-full gap-2",
          isSection ? "flex-col sm:flex-row" : "flex-col sm:flex-row",
        )}
      >
        <label htmlFor={inputId} className="sr-only">
          Email address
        </label>
        <input
          id={inputId}
          type="email"
          required
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          placeholder="Your email address"
          className={cn(
            "h-12 flex-1 border border-hairline bg-canvas px-4 text-body-sm text-ink placeholder:text-muted-foreground",
            "rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass",
            isSection && "h-14 text-body-md",
          )}
        />
        <Button type="submit" variant="brass" size={isSection ? "lg" : "md"} isLoading={status === "submitting"}>
          Subscribe
        </Button>
      </div>
      <p
        className={cn(
          "text-caption",
          tone === "dark" ? "text-porcelain/70" : "text-muted-foreground",
          status === "error" && (tone === "dark" ? "text-red-300" : "text-destructive"),
        )}
        role="status"
        aria-live="polite"
      >
        {status === "success" && "You're on the list — welcome."}
        {status === "error" && errorMessage}
        {(status === "idle" || status === "submitting") &&
          "Considered edits, quietly delivered. No spam, unsubscribe anytime."}
      </p>
    </form>
  );
}

export { NewsletterForm };
