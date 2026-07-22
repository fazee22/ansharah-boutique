"use client";

import { useCallback, useEffect, useState } from "react";
import type { PanInfo } from "framer-motion";

const SWIPE_THRESHOLD_PX = 50;

export interface UseImageGalleryOptions {
  count: number;
  /** Whether arrow-key navigation should be active — pass `false` when e.g. a lightbox using the same hook isn't open. */
  keyboardEnabled?: boolean;
}

/**
 * Shared index/navigation state for both the inline product gallery
 * and the fullscreen lightbox — one implementation of "next/previous/
 * goto/keyboard-arrows/swipe" reused by both, so their navigation
 * behavior can never drift apart.
 */
export function useImageGallery({ count, keyboardEnabled = true }: UseImageGalleryOptions) {
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return;
      setActiveIndex(((index % count) + count) % count);
    },
    [count],
  );

  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const previous = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    if (!keyboardEnabled) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") previous();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [keyboardEnabled, next, previous]);

  /** Pass directly to a `motion.div`'s `onDragEnd` for swipe-to-navigate. */
  function handleDragEnd(_event: unknown, info: PanInfo) {
    if (info.offset.x < -SWIPE_THRESHOLD_PX) next();
    else if (info.offset.x > SWIPE_THRESHOLD_PX) previous();
  }

  return { activeIndex, goTo, next, previous, handleDragEnd };
}
