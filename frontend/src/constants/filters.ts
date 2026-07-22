import { primaryNav } from "@/constants/navigation";
import { collectAtDepth, collectLeavesWithTrail } from "@/lib/nav-tree";

const collectionsNode = primaryNav.find((item) => item.id === "collections");

export interface FilterOption {
  id: string;
  label: string;
}

/** Summer Collection / Winter Collection — the top tier under "Collections". Shawls is intentionally excluded here (it has no piece-type/season split, so it isn't a meaningful "Collection" filter choice); Shawls products remain reachable via the Fabric filter and their own category pages. */
export const COLLECTION_FILTER_OPTIONS: FilterOption[] = (collectionsNode?.children ?? [])
  .filter((node) => node.id !== "shawls")
  .map((node) => ({ id: node.id, label: node.label }));

/**
 * "2 Piece" / "3 Piece" — deduplicated by label, since both Summer
 * and Winter each have their own distinctly-`id`'d node with this
 * same label (see `lib/products.ts`'s `labelMatches` for why the
 * filter itself also matches by label, not id).
 */
export const PIECE_TYPE_FILTER_OPTIONS: string[] = collectionsNode
  ? [...new Set(collectAtDepth(collectionsNode, 2).filter((node) => node.children?.length).map((node) => node.label))]
  : [];

/** Every leaf fabric/shawl-type label in the tree, deduplicated — e.g. "Khaddar" appears under both Winter 2 Piece and 3 Piece but is listed once here. */
export const FABRIC_FILTER_OPTIONS: string[] = collectionsNode
  ? [...new Set(collectLeavesWithTrail(collectionsNode).map(({ leaf }) => leaf.label))]
  : [];
