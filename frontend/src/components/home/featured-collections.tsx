"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Section } from "@/components/shared/section";
import { SectionTitle } from "@/components/shared/section-title";
import { MediaPlaceholder } from "@/components/shared/media-placeholder";
import { useFeaturedCategories } from "@/hooks/use-featured-categories";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { motion } from "framer-motion";
import { ROUTES } from "@/constants/routes";
import { optimizeImage } from "@/lib/optimize-image";

const featuredCollections = [
  {
    id: "summer",
    slug: "summer-collection",
    title: "Summer Collection",
    description: "Lawn and cotton, cut light for the season's heat.",
    href: ROUTES.collection("summer-collection"),
    tone: "canvas" as const,
  },
  {
    id: "winter",
    slug: "winter-collection",
    title: "Winter Collection",
    description: "Karandi, khaddar, and marina — built for warmth without weight.",
    href: ROUTES.collection("winter-collection"),
    tone: "evergreen" as const,
  },
];

function FeaturedCollections() {
  const { data: categories } = useFeaturedCategories();

  return (
    <Section tone="canvas" spacing="lg">
      <SectionTitle
        eyebrow="Shop by Season"
        title="Featured Collections"
        description="Two edits, each built around how the season is actually worn."
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px 0px" }}
        variants={staggerContainer(0.15)}
        className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8"
      >
        {featuredCollections.map((collection) => {
          const imageUrl = categories?.find((category) => category.slug === collection.slug)?.imageUrl;

          return (
            <motion.div key={collection.id} variants={fadeUp}>
              <Link
                href={collection.href}
                className="group relative block overflow-hidden rounded-lg shadow-subtle transition-shadow duration-600 ease-luxury-ease hover:shadow-floating"
              >
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded Cloudinary category image
                  <img
                    src={optimizeImage(imageUrl, 800)}
                    alt={collection.title}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-[1400ms] ease-luxury-ease group-hover:scale-[1.06]"
                  />
                ) : (
                  <MediaPlaceholder
                    ratio="landscape"
                    tone={collection.tone}
                    label={collection.title}
                    className="transition-transform duration-[1400ms] ease-luxury-ease group-hover:scale-[1.06]"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-8">
                  <h3 className="font-display text-display-sm font-light text-porcelain">
                    {collection.title}
                  </h3>
                  <p className="max-w-xs text-body-sm text-porcelain/80">{collection.description}</p>
                  <span className="mt-3 inline-flex w-fit items-center gap-2 border-b border-porcelain/0 pb-1 font-mono text-overline uppercase tracking-widest text-porcelain transition-colors duration-400 ease-luxury-ease group-hover:border-brass group-hover:text-brass-light">
                    Explore
                    <ArrowUpRight
                      className="h-3.5 w-3.5 transition-transform duration-400 ease-luxury-ease group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </Section>
  );
}

export { FeaturedCollections };