import { Section } from "@/components/shared/section";
import { NewsletterForm } from "@/components/shared/newsletter-form";
import { Reveal } from "@/components/shared/reveal";

/**
 * Large, standalone newsletter moment — distinct from the compact
 * form repeated in the global footer (same `NewsletterForm`
 * component, different `variant`/`idPrefix` so both can render on
 * the same page without id collisions).
 */
function NewsletterSection() {
  return (
    <Section tone="evergreen" spacing="lg">
      <Reveal className="flex flex-col items-center gap-4 text-center">
        <span className="font-mono text-overline uppercase tracking-widest text-brass-light">
          Stay Considered
        </span>
        <h2 className="font-display text-display-md font-light text-porcelain">
          Join the list
        </h2>
        <p className="max-w-md text-body-md text-porcelain/75">
          Early access to new arrivals, considered edits, and nothing you didn&apos;t
          ask for.
        </p>
        <div className="mt-4 w-full">
          <NewsletterForm variant="section" tone="dark" idPrefix="homepage-newsletter" source="homepage" />
        </div>
      </Reveal>
    </Section>
  );
}

export { NewsletterSection };
