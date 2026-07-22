import type { Metadata } from "next";
import { Hammer, Mail } from "lucide-react";
import { Container } from "@/components/shared/container";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Under Maintenance",
  robots: { index: false, follow: false },
};

/**
 * A standalone, reachable page — not wired into actual site-wide
 * maintenance-mode middleware (that's a deploy-time/infra concern,
 * not a UI one, and out of scope here). This is the page a real
 * maintenance-mode redirect would point at once that infra exists.
 */
export default function MaintenancePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-4 text-center">
      <Container width="narrow" className="flex flex-col items-center gap-6">
        <span className="flex h-20 w-20 items-center justify-center rounded-full border border-porcelain/20 text-brass-light">
          <Hammer className="h-8 w-8" aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-2">
          <span className="font-mono text-overline uppercase tracking-widest text-porcelain/50">
            Back Shortly
          </span>
          <h1 className="font-display text-display-sm font-light text-porcelain sm:text-display-md">
            We&apos;re making a few considered improvements
          </h1>
          <p className="mx-auto max-w-md text-body-md text-porcelain/70">
            {siteConfig.name} is briefly offline for scheduled maintenance. We&apos;ll be back shortly —
            thank you for your patience.
          </p>
        </div>
        <a
          href={`mailto:${siteConfig.contact.email}`}
          className="flex items-center gap-2 font-mono text-caption uppercase tracking-widest text-porcelain/70 transition-colors hover:text-porcelain"
        >
          <Mail className="h-3.5 w-3.5" aria-hidden="true" />
          {siteConfig.contact.email}
        </a>
      </Container>
    </div>
  );
}
