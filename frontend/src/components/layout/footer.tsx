"use client";

import Link from "next/link";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Separator } from "@/components/ui/separator";
import { NewsletterForm } from "@/components/shared/newsletter-form";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/constants/routes";
import { primaryNav } from "@/constants/navigation";

const collectionsColumn = primaryNav.find((item) => item.id === "collections");

const customerCareLinks = [
  { label: "Contact Us", href: ROUTES.contact },
  { label: "Shipping & Delivery", href: ROUTES.shippingPolicy },
  { label: "Returns & Exchanges", href: ROUTES.returnPolicy },
  { label: "Size Guide", href: "/size-guide" },
  { label: "FAQs", href: ROUTES.faqs },
];

const aboutLinks = [
  { label: "Our Story", href: ROUTES.about },
  { label: "Sustainability", href: "/sustainability" },
  { label: "Careers", href: "/careers" },
  { label: "Press", href: "/press" },
];

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com", icon: Instagram },
  { label: "Facebook", href: "https://facebook.com", icon: Facebook },
  { label: "YouTube", href: "https://youtube.com", icon: Youtube },
];

const paymentMethods = ["Visa", "Mastercard", "American Express", "COD"];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: ROUTES.privacyPolicy },
  { label: "Terms & Conditions", href: ROUTES.termsConditions },
  { label: "Refund Policy", href: ROUTES.refundPolicy },
];

/**
 * Global site footer. Link columns pull from the same navigation
 * source (`primaryNav`) where possible, so the "Collections" list
 * here can never drift out of sync with the mega menu.
 */
function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-hairline bg-ink text-porcelain print:hidden">
      <Container>
        <div className="grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <span className="font-display text-heading-lg text-porcelain">{siteConfig.name}</span>
            <p className="max-w-sm text-body-sm text-porcelain/70">{siteConfig.tagline}.</p>
            <NewsletterForm idPrefix="footer" source="footer" />
          </div>

          <FooterColumn
            title="Collections"
            links={
              collectionsColumn?.children?.map((child) => ({
                label: child.label,
                href: child.href ?? "#",
              })) ?? []
            }
          />
          <FooterColumn title="Customer Care" links={customerCareLinks} />
          <FooterColumn title="About" links={aboutLinks} />
        </div>

        <Separator className="bg-porcelain/10" />

        <div className="flex flex-col items-center gap-6 py-8 sm:flex-row sm:justify-between">
          <p className="font-mono text-caption text-porcelain/60">
            © {year} {siteConfig.name}. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-porcelain/20 text-porcelain/80 transition-colors hover:border-brass hover:text-brass"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </a>
            ))}
          </div>

          <ul className="flex flex-wrap items-center gap-3" aria-label="Accepted payment methods">
            {paymentMethods.map((method) => (
              <li
                key={method}
                className="rounded border border-porcelain/15 px-2.5 py-1 font-mono text-[0.6875rem] uppercase tracking-wide text-porcelain/60"
              >
                {method}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-porcelain/10 py-5 sm:justify-start">
          {LEGAL_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-[0.6875rem] uppercase tracking-wide text-porcelain/50 transition-colors hover:text-porcelain"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-mono text-overline uppercase text-porcelain/50">{title}</h3>
      <ul className="flex flex-col gap-3">
        {links.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="text-body-sm text-porcelain/80 transition-colors hover:text-brass"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export { Footer };
