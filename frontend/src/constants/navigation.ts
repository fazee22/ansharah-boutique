import { ROUTES } from "@/constants/routes";
import { slugify } from "@/lib/format";
import type { NavNode, NavTree } from "@/types/navigation";

/**
 * Single source of truth for the primary navigation, consumed by
 * both `DesktopNav` (mega menu) and `MobileNav` (accordion). Update
 * the tree here — never hand-edit menu markup in either component.
 *
 * `parentPath` is the list of segments *under* `/collections/` (the
 * "collections" prefix itself is added once by `ROUTES.collection`),
 * so a leaf like Summer Collection -> 2 Piece -> Embroidered Lawn
 * resolves to `/collections/summer-collection/2-piece/embroidered-lawn`.
 */
function toId(parentPath: string[], label: string): string {
  return slugify([...parentPath, label].join("-"));
}

function toHref(parentPath: string[], label: string): string {
  return ROUTES.collection([...parentPath, label].map(slugify).join("/"));
}

function link(label: string, parentPath: string[]): NavNode {
  return { id: toId(parentPath, label), label, href: toHref(parentPath, label) };
}

function group(label: string, parentPath: string[], children: NavNode[]): NavNode {
  return {
    id: toId(parentPath, label),
    label,
    href: toHref(parentPath, label),
    children,
  };
}

const summerCollection = group("Summer Collection", [], [
  group("2 Piece", ["summer-collection"], [
    link("Embroidered Lawn", ["summer-collection", "2-piece"]),
    link("Printed Lawn", ["summer-collection", "2-piece"]),
  ]),
  group("3 Piece", ["summer-collection"], [
    link("Embroidered Lawn", ["summer-collection", "3-piece"]),
    link("Printed Lawn", ["summer-collection", "3-piece"]),
  ]),
]);

const winterCollection = group("Winter Collection", [], [
  group("2 Piece", ["winter-collection"], [
    link("Marina", ["winter-collection", "2-piece"]),
    link("Linen", ["winter-collection", "2-piece"]),
    link("Viscose", ["winter-collection", "2-piece"]),
    link("Winter Karandi", ["winter-collection", "2-piece"]),
    link("Khaddar", ["winter-collection", "2-piece"]),
  ]),
  group("3 Piece", ["winter-collection"], [
    link("Marina", ["winter-collection", "3-piece"]),
    link("Linen", ["winter-collection", "3-piece"]),
    link("Viscose", ["winter-collection", "3-piece"]),
    link("Winter Karandi", ["winter-collection", "3-piece"]),
    link("Khaddar", ["winter-collection", "3-piece"]),
  ]),
]);

const shawls = group("Shawls", [], [
  link("Embroidered Shawls", ["shawls"]),
  link("Printed Shawls", ["shawls"]),
]);

export const primaryNav: NavTree = [
  { id: "home", label: "Home", href: ROUTES.home },
  {
    id: "collections",
    label: "Collections",
    href: ROUTES.collections,
    megaMenu: true,
    children: [summerCollection, winterCollection, shawls],
  },
  { id: "new-arrivals", label: "New Arrivals", href: ROUTES.newArrivals, badge: "New" },
  { id: "sale", label: "Sale", href: ROUTES.sale, badge: "Sale" },
  { id: "about", label: "About", href: ROUTES.about },
  { id: "contact", label: "Contact", href: ROUTES.contact },
];
