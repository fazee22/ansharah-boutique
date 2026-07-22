/**
 * Recursive navigation tree. One shape powers the desktop mega menu,
 * the mobile accordion menu, and (later) any breadcrumb/sitemap UI —
 * so the menu structure is defined once, in `constants/navigation.ts`,
 * and never duplicated between desktop/mobile implementations.
 *
 * Depth in this project goes at most 4 levels deep, e.g.:
 *   Collections -> Summer Collection -> 2 Piece -> Embroidered Lawn
 * (top nav)        (mega menu column)   (column group)   (leaf link)
 */
export interface NavNode {
  /** Unique within its parent's children — used for React keys and a11y ids. */
  id: string;
  label: string;
  /** Omitted for nodes that are pure group headers with no destination of their own. */
  href?: string;
  /** Marks a top-level item as opening the mega menu instead of navigating directly. */
  megaMenu?: boolean;
  /** Small accent label, e.g. "New" or "Sale" — rendered as a badge next to the link. */
  badge?: string;
  children?: NavNode[];
}

export type NavTree = NavNode[];
