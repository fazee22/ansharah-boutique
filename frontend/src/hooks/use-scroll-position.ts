"use client";

import { useEffect, useState } from "react";

/**
 * Tracks whether the page has scrolled past `threshold` pixels.
 * Powers the sticky header's compact/elevated state. Uses a passive
 * scroll listener and a boolean (not the raw offset) so consumers
 * only re-render on the state transition, not every scroll tick.
 */
export function useScrollPosition(threshold: number = 24): boolean {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > threshold);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return isScrolled;
}
