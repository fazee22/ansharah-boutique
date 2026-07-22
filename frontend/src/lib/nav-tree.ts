import type { NavNode, NavTree } from "@/types/navigation";

/**
 * Generic operations over the `NavNode` tree defined in
 * `constants/navigation.ts`. Collection pages, the homepage marquee,
 * breadcrumbs, and filters all need to walk the same tree in
 * different ways — these helpers live in one place so that logic
 * isn't reimplemented (and potentially drifts) per feature.
 */

/** All leaf nodes (no children) under `node`, depth-first. */
export function collectLeaves(node: NavNode): NavNode[] {
  if (!node.children?.length) return [node];
  return node.children.flatMap(collectLeaves);
}

/** All leaf nodes across an entire tree/forest. */
export function collectAllLeaves(tree: NavTree): NavNode[] {
  return tree.flatMap(collectLeaves);
}

export interface LeafWithTrail {
  leaf: NavNode;
  /** Every node from the root down to (and including) the leaf. */
  trail: NavNode[];
}

/** Like `collectLeaves`, but pairs each leaf with its full ancestor trail — needed anywhere a leaf's breadcrumb/category path matters (product generation, breadcrumbs). */
export function collectLeavesWithTrail(node: NavNode, trail: NavNode[] = []): LeafWithTrail[] {
  const nextTrail = [...trail, node];
  if (!node.children?.length) return [{ leaf: node, trail: nextTrail }];
  return node.children.flatMap((child) => collectLeavesWithTrail(child, nextTrail));
}

/**
 * Nodes exactly `depth` levels below `node` (1 = `node`'s direct
 * children, 2 = grandchildren, ...). Unlike `collectLeaves`, this
 * does NOT require the returned nodes to be leaves — e.g. calling
 * `collectAtDepth(collectionsNode, 2)` returns "2 Piece"/"3 Piece"
 * for Summer/Winter (still non-leaf group nodes two levels down) but
 * the true leaf fabrics for Shawls (which has only one level of
 * nesting, so there's nothing deeper to return) — useful for a
 * "browse categories" strip that should show one consistent tier of
 * specificity rather than the full leaf set.
 */
export function collectAtDepth(node: NavNode, depth: number): NavNode[] {
  if (depth <= 0 || !node.children?.length) return [node];
  return node.children.flatMap((child) => collectAtDepth(child, depth - 1));
}

/**
 * Resolves a URL path (the segments after `/collections/`) to the
 * matching node and its full ancestor chain, by walking `tree`
 * (typically the `children` of the "Collections" nav node) one
 * segment at a time. Segments are matched against each node's slug —
 * the last path segment of its `href`.
 *
 * Returns `null` if any segment fails to match, so callers can
 * `notFound()` on an invalid collection URL.
 */
export function resolveNodePath(
  tree: NavTree,
  segments: string[],
): { node: NavNode; ancestors: NavNode[] } | null {
  let currentLevel = tree;
  let matched: NavNode | null = null;
  const ancestors: NavNode[] = [];

  for (const segment of segments) {
    const found = currentLevel.find((node) => slugOf(node) === segment);
    if (!found) return null;

    if (matched) ancestors.push(matched);
    matched = found;
    currentLevel = found.children ?? [];
  }

  return matched ? { node: matched, ancestors } : null;
}

/** The final segment of a node's href — its own slug, independent of ancestry. */
export function slugOf(node: NavNode): string {
  const parts = (node.href ?? "").split("/").filter(Boolean);
  return parts[parts.length - 1] ?? node.id;
}

/**
 * Like `resolveNodePath`, but matches each segment against a node's
 * `id` rather than its URL slug. `Product.categoryPath` (see
 * `lib/mock/products.ts`) stores the id chain, not slugs — this is
 * what lets the product detail page turn that id chain back into
 * real `NavNode`s (and therefore real `.href` values) for its
 * breadcrumb trail.
 */
export function findNodesByIdPath(tree: NavTree, ids: string[]): NavNode[] {
  let currentLevel = tree;
  const found: NavNode[] = [];

  for (const id of ids) {
    const match = currentLevel.find((node) => node.id === id);
    if (!match) break;
    found.push(match);
    currentLevel = match.children ?? [];
  }

  return found;
}

/** Depth of a resolved node under the tree root — 0 for a top-level collection (e.g. "Summer Collection"). */
export function depthOf(ancestors: NavNode[]): number {
  return ancestors.length;
}

/**
 * Every node in `tree`, at every depth, expressed as its full path
 * segment array (e.g. `["winter-collection", "2-piece", "khaddar"]`).
 * Used by `generateStaticParams` to pre-render every collection and
 * category page — not just leaves, since "Summer Collection" and
 * "2 Piece" are themselves real pages too.
 */
export function collectAllPaths(tree: NavTree, prefix: string[] = []): string[][] {
  return tree.flatMap((node) => {
    const path = [...prefix, slugOf(node)];
    const childPaths = node.children?.length ? collectAllPaths(node.children, path) : [];
    return [path, ...childPaths];
  });
}
