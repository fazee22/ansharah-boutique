import { collectLeavesWithTrail } from "@/lib/nav-tree";
import type { NavNode } from "@/types/navigation";
import type { FilterVisibility } from "@/components/collections/filters-panel";

const PIECE_TYPE_LABELS = new Set(["2 Piece", "3 Piece"]);

/**
 * Decides which `FiltersPanel` groups are worth showing for a given
 * resolved collection node. A filter group is hidden when the URL
 * has already fully pinned that dimension down (e.g. the "Fabric"
 * checkboxes are pointless on the "Khaddar" leaf page — that page
 * *is* the fabric filter already applied) or when the dimension
 * doesn't exist for this branch at all (Shawls has no "Piece Type"
 * split, so that group never appears under it).
 *
 * The top-level `/collections` index (which isn't scoped to any
 * single node) shows every group — pass `null` for that case.
 */
export function computeFilterVisibility(node: NavNode | null): FilterVisibility {
  if (!node) {
    return { collection: true, pieceType: true, fabric: true };
  }

  const isLeaf = !node.children?.length;
  const leavesUnderNode = collectLeavesWithTrail(node);
  const descendantHasPieceTypeDimension = leavesUnderNode.some(({ trail }) =>
    trail.some((ancestor) => PIECE_TYPE_LABELS.has(ancestor.label)),
  );
  const nodeItselfIsPieceType = PIECE_TYPE_LABELS.has(node.label);

  return {
    // The `/collections/[...slug]` route is always scoped to one
    // collection by the URL itself — the Collection checkbox group
    // would be redundant (and, for the "other" collection, useless)
    // on every page reached through it.
    collection: false,
    pieceType: descendantHasPieceTypeDimension && !nodeItselfIsPieceType,
    fabric: !isLeaf,
  };
}
