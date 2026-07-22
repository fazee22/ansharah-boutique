import type { Metadata } from "next";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionTitle } from "@/components/shared/section-title";
import { ContactForm } from "@/components/shared/contact-form";
import { siteConfig } from "@/config/site";
import { publicSettingsService } from "@/services/api/settings.service";
import { buildWhatsAppGeneralLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with the ${siteConfig.name} team.`,
};

export default async function ContactPage() {
  const whatsappLink = buildWhatsAppGeneralLink();
  const settings = await publicSettingsService.getAll();
  const contactEmail = settings.website?.contactEmail || siteConfig.contact.email;
  const contactPhone = settings.website?.contactPhone || siteConfig.contact.phone;
  const contactAddress = settings.website?.contactAddress || siteConfig.contact.address;

  return (
    <Container width="wide" className="flex flex-col gap-12 py-12 sm:py-16">
      <SectionTitle
        eyebrow="Get in Touch"
        title="Contact Us"
        description="Questions about an order, a piece, or anything else — we're glad to help."
      />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <ContactInfoRow icon={Mail} label="Email" value={contactEmail} href={`mailto:${contactEmail}`} />
            <ContactInfoRow icon={Phone} label="Phone" value={contactPhone} href={`tel:${contactPhone.replace(/\s+/g, "")}`} />
            <ContactInfoRow icon={MapPin} label="Address" value={contactAddress} />
          </div>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer noopener"
            className="flex w-fit items-center gap-2.5 rounded-md bg-evergreen px-5 py-3 text-body-sm text-porcelain transition-colors hover:bg-evergreen-dark"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Chat with us on WhatsApp
          </a>

          {/* Map placeholder — no live map API is wired up; a real embed (Google Maps/Mapbox) drops in here once an API key is provisioned. */}
          <div
            role="img"
            aria-label={`Map showing our location near ${contactAddress}`}
            className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-lg border border-hairline bg-stone/30 text-muted-foreground"
          >
            <MapPin className="h-8 w-8" aria-hidden="true" />
            <span className="text-caption">{contactAddress}</span>
          </div>
        </div>

        <div className="rounded-lg border border-hairline bg-porcelain p-6 sm:p-8">
          <ContactForm />
        </div>
      </div>
    </Container>
  );
}

function ContactInfoRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <span className="flex items-start gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-hairline text-brass-dark">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="flex flex-col">
        <span className="font-mono text-caption uppercase tracking-wide text-muted-foreground">{label}</span>
        <span className="text-body-sm text-ink">{value}</span>
      </span>
    </span>
  );

  return href ? (
    <a href={href} className="transition-opacity hover:opacity-70">
      {content}
    </a>
  ) : (
    content
  );
}