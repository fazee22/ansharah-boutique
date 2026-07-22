"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { cn } from "@/lib/utils";
import type { NavNode } from "@/types/navigation";

/**
 * Renders one level of the navigation tree recursively:
 *  - a leaf (no `children`) renders as a plain link
 *  - a node WITH `children` renders its own label as a (linked)
 *    group header, then recurses into its children one level deeper
 *
 * This single recursive renderer is what satisfies both the "Mega
 * Menu" and "Multi-Level Dropdown" requirements without two parallel
 * implementations — Collections -> Summer Collection -> 2 Piece ->
 * Embroidered Lawn is exactly four calls deep into the same function.
 */
function MegaMenuNode({ node, depth }: { node: NavNode; depth: number }) {
  const hasChildren = !!node.children?.length;

  if (!hasChildren) {
    return (
      <li>
        <Link
          href={node.href ?? "#"}
          className="inline-block py-1.5 text-body-sm text-muted-foreground transition-colors duration-400 ease-luxury-ease hover:text-brass-dark"
        >
          {node.label}
        </Link>
      </li>
    );
  }

  return (
    <li className={cn(depth > 0 && "pt-4 first:pt-0")}>
      <Link
        href={node.href ?? "#"}
        className={cn(
          "inline-flex items-center gap-1 font-body text-ink transition-colors duration-400 ease-luxury-ease hover:text-brass-dark",
          depth === 0 ? "text-heading-sm font-medium" : "text-body-sm font-semibold uppercase tracking-wide text-muted-foreground",
        )}
      >
        {node.label}
        {depth === 0 ? <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" /> : null}
      </Link>
      <ul className={cn("flex flex-col", depth === 0 ? "mt-3 gap-1" : "mt-1.5 gap-0.5 pl-0")}>
        {node.children!.map((child) => (
          <MegaMenuNode key={child.id} node={child} depth={depth + 1} />
        ))}
      </ul>
    </li>
  );
}

export interface MegaMenuProps {
  node: NavNode;
  id: string;
}

/**
 * Full-width panel shown below the header when a `megaMenu` top-nav
 * item is active. Columns are the node's direct children (Summer
 * Collection / Winter Collection / Shawls); each column recurses via
 * `MegaMenuNode`.
 */
function MegaMenu({ node, id }: MegaMenuProps) {
  const columns = node.children ?? [];

  return (
    <motion.div
      id={id}
      role="region"
      aria-label={`${node.label} menu`}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-x-0 top-full z-40 border-t border-hairline bg-porcelain shadow-elevated"
    >
      <Container>
        <div
          className="grid gap-10 py-10"
          style={{ gridTemplateColumns: `repeat(${Math.max(columns.length, 1)}, minmax(0, 1fr))` }}
        >
          {columns.map((column) => (
            <ul key={column.id} className="flex flex-col">
              <MegaMenuNode node={column} depth={0} />
            </ul>
          ))}
        </div>
      </Container>
    </motion.div>
  );
}

export { MegaMenu };
