"use client";

import Link from "next/link";
import { Marquee } from "@/components/shared/marquee";
import { MediaPlaceholder } from "@/components/shared/media-placeholder";
import { Section } from "@/components/shared/section";
import { SectionTitle } from "@/components/shared/section-title";
import { useCategoryImageMap } from "@/hooks/use-category-image-map";
import { primaryNav } from "@/constants/navigation";
import { collectAtDepth } from "@/lib/nav-tree";

const collectionsNode = primaryNav.find((item) => item.id === "collections");
const marqueeItems = collectionsNode ? collectAtDepth(collectionsNode, 2) : [];

function slugFromHref(href: string | undefined): string | null {
  if (!href) return null;
  const segments = href.split("/").filter((segment) => segment && segment !== "collections");
  return segments.length > 0 ? segments.join("-") : null;
}

function CollectionMarquee() {
  const imageMap = useCategoryImageMap();

  return (
    <Section tone="porcelain" spacing="md" fullBleed>
      <div className="mx-auto max-w-content px-gutter sm:px-8 lg:px-12">
        <SectionTitle eyebrow="Shop the Edit" title="Browse by Category" align="center" />
      </div>

      <div className="mt-10">
        <Marquee
          items={marqueeItems}
          keyExtractor={(item) => item.id}
          speed={36}
          gap="gap-5"
          renderItem={(item) => {
            const imageUrl = imageMap[slugFromHref(item.href) ?? ""];

            return (
              <Link
                href={item.href ?? "#"}
                className="group relative block w-[240px] shrink-0 overflow-hidden rounded-md sm:w-[280px]"
                draggable={false}
              >
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded Cloudinary category image
                  <img
                    src={imageUrl}
                    alt={item.label}
                    className="aspect-[3/4] w-full object-cover transition-transform duration-[900ms] ease-luxury-ease group-hover:scale-105"
                  />
                ) : (
                  <MediaPlaceholder
                    ratio="portrait"
                    label={item.label}
                    className="transition-transform duration-[900ms] ease-luxury-ease group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 font-display text-heading-sm text-porcelain">
                  {item.label}
                </span>
              </Link>
            );
          }}
        />
      </div>
    </Section>
  );
}

export { CollectionMarquee };