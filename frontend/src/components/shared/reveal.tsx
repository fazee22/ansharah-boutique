"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import { fadeUp, scrollViewport } from "@/lib/animations";
import { cn } from "@/lib/utils";

export interface RevealProps {
  children: React.ReactNode;
  variants?: Variants;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li";
}

/**
 * Scroll-reveal foundation: wraps children in a `whileInView`
 * animation using the shared `fadeUp` variant by default. This is
 * the one place `viewport` / "once" behavior is configured, so every
 * scroll-triggered reveal in the app behaves identically (fires once,
 * ~80px before entering viewport) without each usage re-deriving it.
 *
 * Respects `prefers-reduced-motion` automatically — Framer Motion
 * reads the OS setting and Tailwind's global reduced-motion rule
 * (see `globals.css`) additionally collapses the CSS transition.
 */
function Reveal({ children, variants = fadeUp, className, delay = 0, as = "div" }: RevealProps) {
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={scrollViewport}
      variants={variants}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}

export { Reveal };
