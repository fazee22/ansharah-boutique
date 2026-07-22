"use client";

import { useRef, type RefObject } from "react";
import { useScroll, useTransform, type MotionValue } from "framer-motion";

export interface UseParallaxReturn {
  ref: RefObject<HTMLDivElement | null>;
  y: MotionValue<number>;
}

/**
 * Light scroll-linked parallax for a single element: as the element
 * travels through the viewport, it drifts `distance` px in the
 * opposite direction of scroll, then settles back — a subtle depth
 * cue rather than a dramatic effect (per the "Parallax (light)"
 * requirement). Built on Framer Motion's scroll-progress primitives
 * so it's driven by a `transform` (GPU-composited), never by
 * re-rendering React on scroll.
 */
export function useParallax(distance: number = 32): UseParallaxReturn {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  return { ref, y };
}
