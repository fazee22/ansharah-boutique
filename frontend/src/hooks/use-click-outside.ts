"use client";

import { useEffect, type RefObject } from "react";

/**
 * Fires `handler` on any pointer event outside `ref`'s element(s).
 * Accepts one ref or an array (mega menu needs to treat the trigger
 * button and the panel as a single "inside" region).
 */
export function useClickOutside<T extends HTMLElement>(
  refs: RefObject<T | null> | RefObject<T | null>[],
  handler: () => void,
  enabled: boolean = true,
): void {
  useEffect(() => {
    if (!enabled) return;

    const refList = Array.isArray(refs) ? refs : [refs];

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      const isInside = refList.some((ref) => ref.current?.contains(target));
      if (!isInside) handler();
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [refs, handler, enabled]);
}
