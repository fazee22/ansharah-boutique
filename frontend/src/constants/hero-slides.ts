export interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  tone: "canvas" | "evergreen" | "ink";
}

/**
 * Static hero slide data. Structured as plain data (not JSX) so it
 * maps 1:1 onto the shape an admin-managed "hero slides" API resource
 * will eventually return — swapping this constant for a fetch call
 * later won't require changing `Hero`'s rendering logic, only where
 * the array comes from.
 */
export const heroSlides: HeroSlide[] = [
  {
    id: "new-season",
    eyebrow: "New Season",
    title: "Considered luxury, cut for the modern wardrobe",
    description:
      "Hand-finished silhouettes in rare fabrics — a collection built for how you actually dress.",
    primaryCta: { label: "Shop Now", href: "/new-arrivals" },
    secondaryCta: { label: "Explore Collection", href: "/collections" },
    tone: "canvas",
  },
  {
    id: "winter-edit",
    eyebrow: "Winter Edit",
    title: "Weight, warmth, and quiet restraint",
    description: "Khaddar, karandi, and marina — worked into shapes built to last beyond a season.",
    primaryCta: { label: "Shop Now", href: "/collections/winter-collection" },
    secondaryCta: { label: "Explore Collection", href: "/collections" },
    tone: "evergreen",
  },
  {
    id: "shawls",
    eyebrow: "The Shawl Edit",
    title: "One layer, endlessly worn",
    description: "Embroidered and printed shawls designed to anchor every look in the edit.",
    primaryCta: { label: "Shop Now", href: "/collections/shawls" },
    secondaryCta: { label: "Explore Collection", href: "/collections" },
    tone: "ink",
  },
];
