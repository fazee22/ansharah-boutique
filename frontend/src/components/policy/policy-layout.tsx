import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { ROUTES } from "@/constants/routes";
import type { ReactNode } from "react";

export interface PolicySection {
  heading: string;
  body: ReactNode;
}

export interface PolicyLayoutProps {
  title: string;
  updatedAt: string;
  intro?: string;
  sections: PolicySection[];
}

/**
 * Shared long-form layout for Privacy Policy, Terms & Conditions,
 * Return Policy, Shipping Policy, and Refund Policy — five pages,
 * one structure (breadcrumb, title, last-updated date, a list of
 * heading/body sections). Content is real, considered policy
 * language (not lorem ipsum) so each page is genuinely usable as a
 * starting point, not a placeholder — legal review before launch is
 * still the store owner's responsibility, which the page says
 * outright rather than implying otherwise.
 *
 * Uses its own minimal "Home > Title" trail rather than
 * `components/collections/breadcrumbs.tsx`, which always hardcodes a
 * second "Collections" crumb — accurate for category pages, wrong
 * for a generic content page like this one.
 */
function PolicyLayout({ title, updatedAt, intro, sections }: PolicyLayoutProps) {
  return (
    <Container width="narrow" className="flex flex-col gap-10 py-12 sm:py-16">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-caption text-muted-foreground">
        <Link href={ROUTES.home} className="transition-colors hover:text-brass-dark">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" aria-hidden="true" />
        <span aria-current="page" className="text-ink">
          {title}
        </span>
      </nav>

      <div className="flex flex-col gap-3 border-b border-hairline pb-8">
        <h1 className="font-display text-display-sm font-light text-foreground sm:text-display-md">{title}</h1>
        <p className="font-mono text-caption uppercase tracking-widest text-muted-foreground">
          Last updated {updatedAt}
        </p>
        {intro ? <p className="max-w-2xl text-body-md text-muted-foreground">{intro}</p> : null}
      </div>

      <div className="flex flex-col gap-8">
        {sections.map((section) => (
          <div key={section.heading} className="flex flex-col gap-3">
            <h2 className="font-display text-heading-md text-foreground">{section.heading}</h2>
            <div className="flex flex-col gap-3 text-body-sm leading-relaxed text-muted-foreground">
              {section.body}
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}

export { PolicyLayout };
