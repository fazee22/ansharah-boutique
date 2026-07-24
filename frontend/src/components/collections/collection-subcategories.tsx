import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MediaPlaceholder } from "@/components/shared/media-placeholder";
import { optimizeImage } from "@/lib/optimize-image";
import type { NavNode } from "@/types/navigation";

function slugFromHref(href: string | undefined): string | null {
  if (!href) return null;
  const segments = href.split("/").filter((segment) => segment && segment !== "collections");
  return segments.length > 0 ? segments.join("-") : null;
}

function CollectionSubcategories({ items, imageMap = {} }: { items: NavNode[]; imageMap?: Record<string, string> }) {
  if (!items.length) return null;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => {
        const imageUrl = imageMap[slugFromHref(item.href) ?? ""];

        return (
          <Link
            key={item.id}
            href={item.href ?? "#"}
            className="group relative block overflow-hidden rounded-md"
          >
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded Cloudinary category image
              <img
                src={optimizeImage(imageUrl, 500)}
                alt={item.label}
                className="aspect-square w-full object-cover transition-transform duration-[900ms] ease-luxury-ease group-hover:scale-105"
              />
            ) : (
              <MediaPlaceholder
                ratio="square"
                label={item.label}
                className="transition-transform duration-[900ms] ease-luxury-ease group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
            <span className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
              <span className="font-display text-heading-sm text-porcelain">{item.label}</span>
              <ArrowUpRight
                className="h-4 w-4 text-porcelain transition-transform duration-400 ease-luxury-ease group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export { CollectionSubcategories };