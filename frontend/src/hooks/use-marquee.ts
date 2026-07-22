"use client";

import { useEffect, useRef, useState, type RefObject, type PointerEvent } from "react";

export interface UseMarqueeOptions {
  /** Pixels per second the track scrolls at when idle. */
  speed?: number;
  /** Pause automatic scrolling while the pointer hovers the track (desktop). */
  pauseOnHover?: boolean;
  direction?: "left" | "right";
}

export interface UseMarqueeReturn {
  viewportRef: RefObject<HTMLDivElement | null>;
  trackRef: RefObject<HTMLDivElement | null>;
  handlers: {
    onPointerDown: (event: PointerEvent<HTMLDivElement>) => void;
    onPointerMove: (event: PointerEvent<HTMLDivElement>) => void;
    onPointerUp: (event: PointerEvent<HTMLDivElement>) => void;
    onPointerLeave: (event: PointerEvent<HTMLDivElement>) => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  };
  isDragging: boolean;
}

/**
 * Drives a seamless, infinite, right-to-left auto-scrolling marquee.
 *
 * How it stays seamless: the caller renders the item list **twice**
 * back to back (`[...items, ...items]`) inside `trackRef`. This hook
 * measures the rendered width of one copy (`trackRef.scrollWidth / 2`)
 * and wraps the scroll offset with modulo arithmetic, so the loop
 * point is invisible — there is no snap-back, because the pixels at
 * the wrap point are identical to the pixels the track started with.
 *
 * Movement is driven by `requestAnimationFrame` computing distance
 * from elapsed time (not a fixed per-frame increment), so playback
 * speed is correct and jitter-free regardless of the display's
 * refresh rate — this is what avoids the "jerky" motion a
 * `setInterval` or CSS-only approach tends to produce at 120Hz vs
 * 60Hz, or when the tab throttles a background timer.
 *
 * Pointer Events (not separate mouse/touch handlers) drive manual
 * drag-to-scroll, so the same code path handles desktop click-drag
 * and mobile swipe. Dragging pauses the RAF loop and directly offsets
 * the scroll position; releasing resumes autoplay from wherever the
 * user left it, never resetting to the start.
 *
 * `prefers-reduced-motion` disables autoplay entirely — the track
 * stays put and is still fully drag/swipe-scrollable, so motion-
 * sensitive users lose only the automatic movement, not the content.
 */
export function useMarquee({
  speed = 40,
  pauseOnHover = true,
  direction = "left",
}: UseMarqueeOptions = {}): UseMarqueeReturn {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const offsetRef = useRef(0);
  const halfWidthRef = useRef(0);
  const isHoveringRef = useRef(false);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const lastFrameTimeRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const prefersReducedMotionRef = useRef(false);

  const [isDragging, setIsDragging] = useState(false);

  const applyTransform = () => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
    }
  };

  const wrapOffset = () => {
    const half = halfWidthRef.current;
    if (half <= 0) return;
    // Modulo that stays positive for negative offsets too, so dragging
    // rightward past zero wraps back into the duplicated second half
    // instead of revealing empty space.
    offsetRef.current = ((offsetRef.current % half) + half) % half;
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotionRef.current = mediaQuery.matches;
    const handleChange = () => {
      prefersReducedMotionRef.current = mediaQuery.matches;
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        halfWidthRef.current = trackRef.current.scrollWidth / 2;
      }
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    if (trackRef.current) resizeObserver.observe(trackRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const directionSign = direction === "left" ? 1 : -1;

    const tick = (time: number) => {
      rafIdRef.current = requestAnimationFrame(tick);

      if (lastFrameTimeRef.current === null) {
        lastFrameTimeRef.current = time;
        return;
      }

      const deltaSeconds = (time - lastFrameTimeRef.current) / 1000;
      lastFrameTimeRef.current = time;

      const shouldHold =
        isDraggingRef.current || prefersReducedMotionRef.current || (pauseOnHover && isHoveringRef.current);

      if (!shouldHold) {
        offsetRef.current += speed * deltaSeconds * directionSign;
        wrapOffset();
        applyTransform();
      }
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
      lastFrameTimeRef.current = null;
    };
  }, [speed, direction, pauseOnHover]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartXRef.current = event.clientX;
    dragStartOffsetRef.current = offsetRef.current;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const delta = dragStartXRef.current - event.clientX;
    offsetRef.current = dragStartOffsetRef.current + delta;
    wrapOffset();
    applyTransform();
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return {
    viewportRef,
    trackRef,
    isDragging,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerLeave: endDrag,
      onMouseEnter: () => {
        isHoveringRef.current = true;
      },
      onMouseLeave: () => {
        isHoveringRef.current = false;
      },
    },
  };
}
