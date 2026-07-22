import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";
import { MediaPlaceholder } from "@/components/shared/media-placeholder";
import { ROUTES } from "@/constants/routes";

/**
 * Full-bleed dark promotional band. Kept visually distinct (ink tone,
 * brass CTA) from the rest of the light-canvas homepage so it reads
 * as an event/moment rather than another content section.
 */
function SaleSection() {
  return (
    <Section tone="ink" spacing="lg" fullBleed className="relative overflow-hidden">
      <div className="absolute inset-0 opacity-25">
        <MediaPlaceholder ratio="wide" tone="ink" className="h-full w-full" />
      </div>

      <div className="relative mx-auto flex max-w-content flex-col items-center gap-6 px-gutter text-center sm:px-8 lg:px-12">
        <Reveal>
          <span className="font-mono text-overline uppercase tracking-widest text-brass-light">
            Limited Time
          </span>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-display text-display-md font-light text-porcelain sm:text-display-lg">
            Up to 30% off select edits
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="max-w-lg text-body-md text-porcelain/75">
            A considered edit of past-season pieces, reduced while they last. Once
            they&apos;re gone, they&apos;re gone.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <Button asChild variant="brass" size="lg" className="mt-2">
            <Link href={ROUTES.sale}>
              Shop The Sale
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </Reveal>
      </div>
    </Section>
  );
}

export { SaleSection };
