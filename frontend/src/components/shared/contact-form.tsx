"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { contactService } from "@/services/api/contact.service";
import { emailSchema } from "@/lib/validation";

const inputClass =
  "h-12 rounded-md border border-hairline bg-canvas px-4 text-body-sm text-ink placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass";

/** Real, persisted contact form (`POST /api/v1/contact`, Phase 8) — not a form that goes nowhere. */
function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set(key: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!values.name.trim()) nextErrors.name = "Please enter your name.";
    if (!emailSchema.safeParse(values.email).success) nextErrors.email = "Enter a valid email address.";
    if (!values.message.trim()) nextErrors.message = "Please enter a message.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("submitting");
    try {
      await contactService.submit(values);
      setStatus("success");
      setValues({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col gap-2 rounded-lg border border-brass/30 bg-brass/5 p-8 text-center">
        <p className="font-display text-heading-sm text-foreground">Message sent</p>
        <p className="text-body-sm text-muted-foreground">
          Thanks for reaching out — our team will be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-name" className="font-mono text-caption uppercase tracking-wide text-muted-foreground">
            Name
          </label>
          <input id="contact-name" value={values.name} onChange={(e) => set("name", e.target.value)} className={inputClass} />
          {errors.name ? <span className="text-caption text-destructive">{errors.name}</span> : null}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-email" className="font-mono text-caption uppercase tracking-wide text-muted-foreground">
            Email
          </label>
          <input id="contact-email" type="email" value={values.email} onChange={(e) => set("email", e.target.value)} className={inputClass} />
          {errors.email ? <span className="text-caption text-destructive">{errors.email}</span> : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-phone" className="font-mono text-caption uppercase tracking-wide text-muted-foreground">
            Phone <span className="normal-case text-muted-foreground/70">(optional)</span>
          </label>
          <input id="contact-phone" value={values.phone} onChange={(e) => set("phone", e.target.value)} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-subject" className="font-mono text-caption uppercase tracking-wide text-muted-foreground">
            Subject <span className="normal-case text-muted-foreground/70">(optional)</span>
          </label>
          <input id="contact-subject" value={values.subject} onChange={(e) => set("subject", e.target.value)} className={inputClass} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-message" className="font-mono text-caption uppercase tracking-wide text-muted-foreground">
          Message
        </label>
        <textarea
          id="contact-message"
          rows={5}
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
          className="rounded-md border border-hairline bg-canvas p-4 text-body-sm text-ink placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
        />
        {errors.message ? <span className="text-caption text-destructive">{errors.message}</span> : null}
      </div>

      {status === "error" ? (
        <p role="alert" className="text-caption text-destructive">
          Something went wrong sending your message — please try again.
        </p>
      ) : null}

      <Button
  type="submit"
  variant="primary"
  size="lg"
  isLoading={status === "submitting"}
  className="w-fit !bg-[#14140f] !text-white hover:!bg-[#14140f]/90"
>
  Send Message
</Button>
    </form>
  );
}

export { ContactForm };
