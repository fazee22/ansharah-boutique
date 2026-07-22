"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/shared/section";
import { MediaPlaceholder } from "@/components/shared/media-placeholder";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { useParallax } from "@/hooks/use-parallax";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { ROUTES } from "@/constants/routes";

function BrandStory() {
  const { ref, y } = useParallax(28);
  const { data: settings } = useSiteSettings();
  const imageUrl = settings?.homepage?.brandStoryImageUrl;

  return (
    <Section tone="porcelain" spacing="lg">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal className="order-2 lg:order-1">
          <div className="flex flex-col gap-5">
            <span className="font-mono text-overline uppercase tracking-widest text-brass-dark">
              Our Story
            </span>
            <h2 className="font-display text-display-md font-light text-foreground">
              Made with intention, worn with ease
            </h2>
            <p className="max-w-lg text-body-md text-muted-foreground">
              Every piece begins with the fabric — sourced, tested, and worked by hand
              before it ever reaches a pattern. We build slowly, in small runs, because
              considered clothing shouldn&apos;t be rushed.
            </p>
            <p className="max-w-lg text-body-md text-muted-foreground">
              What comes out the other side isn&apos;t trend-led. It&apos;s the piece
              you reach for three seasons on, still exactly as considered as the day
              you bought it.
            </p>
            <Button asChild variant="outline" size="md" className="mt-2 w-fit">
              <Link href={ROUTES.about}>
                Read Our Story
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </Reveal>

        <div ref={ref} className="order-1 overflow-hidden rounded-lg lg:order-2">
          <motion.div style={{ y, scale: 1.1 }}>
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded Cloudinary image
              <img src={imageUrl} alt="Our atelier" className="aspect-square w-full object-cover" />
            ) : (
              <MediaPlaceholder ratio="square" tone="evergreen" label="Atelier" />
            )}
          </motion.div>
        </div>
      </div>
    </Section>
  );
}

export { BrandStory };