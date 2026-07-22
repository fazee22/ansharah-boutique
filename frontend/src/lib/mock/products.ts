import { primaryNav } from "@/constants/navigation";
import { collectLeavesWithTrail } from "@/lib/nav-tree";
import type { Product, ProductImage } from "@/types/product";

const PRODUCTS_PER_LEAF = 9;
const IMAGE_TONES: ProductImage["tone"][] = ["canvas", "evergreen", "ink"];

const NAME_DESCRIPTORS = [
  "Tailored Edit",
  "Signature Set",
  "Classic Weave",
  "Embellished Piece",
  "Studio Cut",
  "Considered Edit",
  "Heritage Weave",
  "Modern Silhouette",
  "Atelier Piece",
];

/**
 * Deterministic pseudo-random in [0, 1), seeded by a plain integer —
 * intentionally NOT `Math.random()`. Server-rendered collection pages
 * and the client hydration pass must produce byte-identical mock
 * data, or React throws a hydration mismatch; a seeded generator
 * gives us varied-looking data that's still a pure function of its
 * input.
 */
function seededRandom(seed: number): number {
  let t = (seed + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function buildImages(seed: number, label: string): ProductImage[] {
  const imageCount = 4 + Math.floor(seededRandom(seed) * 3); // 4–6 images, satisfies "minimum 4"
  return Array.from({ length: imageCount }, (_, index) => ({
    id: `${seed}-img-${index}`,
    tone: IMAGE_TONES[Math.floor(seededRandom(seed * 31 + index) * IMAGE_TONES.length)] ?? "canvas",
    alt: `${label} — view ${index + 1}`,
  }));
}

/** e.g. "VR-KHD-0142" — brand prefix + a 3-letter code from the fabric label + a padded running number. */
function buildSku(leafLabel: string, seed: number): string {
  const code = leafLabel.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase() || "GEN";
  const running = (1000 + (seed % 9000)).toString();
  return `VR-${code}-${running}`;
}

function buildDescriptions(leafLabel: string, categoryLabels: string[]): { short: string; full: string } {
  const trailLabel = categoryLabels.join(" ").toLowerCase();
  return {
    short: `A considered ${leafLabel.toLowerCase()} piece from the ${trailLabel} edit, cut for everyday ease.`,
    full: `Worked in ${leafLabel.toLowerCase()}, this piece is built from the ${trailLabel} edit — sourced, tested, and finished by hand before it reaches a pattern. The silhouette is cut for movement, not display, so it holds its shape from morning through evening. Every run is small and considered, meaning the piece you receive was never rushed to meet a season's deadline.`,
  };
}

const CARE_BY_FABRIC: Record<string, string[]> = {
  default: [
    "Dry clean recommended for the first wash",
    "Hand wash separately in cold water thereafter",
    "Do not bleach",
    "Iron on reverse at medium heat",
    "Store folded, away from direct sunlight",
  ],
  Khaddar: [
    "Dry clean only for the first two washes",
    "Hand wash cold with a mild detergent thereafter",
    "Do not wring — lay flat to dry",
    "Iron on reverse while slightly damp",
  ],
  Marina: [
    "Dry clean recommended to preserve the weave",
    "Do not machine wash",
    "Steam rather than iron where possible",
    "Store on a padded hanger",
  ],
};

function careInstructionsFor(leafLabel: string): string[] {
  return CARE_BY_FABRIC[leafLabel] ?? CARE_BY_FABRIC.default ?? [];
}

function buildProducts(): Product[] {
  const collectionsNode = primaryNav.find((item) => item.id === "collections");
  if (!collectionsNode) return [];

  const leaves = collectLeavesWithTrail(collectionsNode);
  const products: Product[] = [];

  leaves.forEach(({ leaf, trail }, leafIndex) => {
    // Drop the synthetic "Collections" root from the visible trail —
    // breadcrumbs and category labels start at "Summer Collection" etc.
    const visibleTrail = trail.slice(1);
    const categoryPath = visibleTrail.map((node) => node.id);
    const categoryLabels = visibleTrail.map((node) => node.label);

    for (let i = 0; i < PRODUCTS_PER_LEAF; i += 1) {
      const seed = leafIndex * 1000 + i;
      const rand = seededRandom(seed);
      const priceBase = 4500 + Math.floor(seededRandom(seed * 7) * 12) * 500; // PKR 4,500–10,500
      const isSale = rand < 0.22;
      const isNew = seededRandom(seed * 3) < 0.2;
      const isFeatured = seededRandom(seed * 5) < 0.15;
      const descriptor = NAME_DESCRIPTORS[(leafIndex + i) % NAME_DESCRIPTORS.length];
      const descriptions = buildDescriptions(leaf.label, categoryLabels);
      const deliveryFast = 2 + (seed % 2);

      products.push({
        id: `product-${leaf.id}-${i + 1}`,
        slug: `${leaf.id}-${i + 1}`,
        name: `${leaf.label} ${descriptor}`,
        sku: buildSku(leaf.label, seed),
        categoryPath,
        categoryLabels,
        collectionLabel: leaf.label,
        price: priceBase,
        salePrice: isSale ? Math.round((priceBase * 0.75) / 100) * 100 : undefined,
        currency: "PKR",
        images: buildImages(seed, `${leaf.label} ${descriptor}`),
        isNew,
        isFeatured,
        inStock: seededRandom(seed * 11) > 0.08,
        salesRank: Math.floor(seededRandom(seed * 13) * 1000),
        createdAt: new Date(2026, 0, 1 + ((seed * 3) % 300)).toISOString(),
        shortDescription: descriptions.short,
        description: descriptions.full,
        careInstructions: careInstructionsFor(leaf.label),
        deliveryEstimateDays: [deliveryFast, deliveryFast + 3],
      });
    }
  });

  return products;
}

/**
 * The full mock catalog, built once at module load. Stands in for a
 * real product API (Phase 4 is frontend-only for the collections
 * system — see `PROJECT_MEMORY.md`). Every query function in
 * `lib/products.ts` reads from this array; swapping in a real API
 * later means changing `lib/products.ts`'s implementations, not any
 * component that calls them.
 */
export const mockProducts: Product[] = buildProducts();
