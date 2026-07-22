"use client";

import { MessageCircle } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { buildWhatsAppGeneralLink } from "@/lib/whatsapp";

/**
 * Mounted once, globally, in `(site)/layout.tsx`. Reads the admin's
 * real WhatsApp Settings (Phase 7's `floatingButtonEnabled`/`number`/
 * `defaultMessage` had no frontend consumer until now) via
 * `useSiteSettings`, falling back to `config/site.ts`'s static number
 * and defaulting to visible if settings haven't loaded yet — a
 * slow/failed settings fetch should never be the reason a genuinely
 * useful contact button doesn't appear.
 */
function WhatsAppFloatingButton() {
  const { data: settings } = useSiteSettings();
  const whatsapp = settings?.whatsapp;

  if (whatsapp && (!whatsapp.enabled || !whatsapp.floatingButtonEnabled)) {
    return null;
  }

  const href = whatsapp?.number
    ? `https://wa.me/${whatsapp.number}?text=${encodeURIComponent(whatsapp.defaultMessage || "Hi! I have a question.")}`
    : buildWhatsAppGeneralLink();

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-evergreen text-porcelain shadow-elevated transition-transform hover:scale-105 print:hidden"
    >
      <MessageCircle className="h-6 w-6" aria-hidden="true" />
    </a>
  );
}

export { WhatsAppFloatingButton };
