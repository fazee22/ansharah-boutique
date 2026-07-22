import type { Variants } from "framer-motion";

/**
 * Shared Framer Motion variants. Import these instead of inlining
 * `initial`/`animate`/`transition` objects in components, so every
 * fade/slide in the product feels like the same hand — tuned to the
 * `luxury-ease` timing function defined in `tailwind.config.ts`.
 */
const LUXURY_EASE = [0.16, 1, 0.3, 1] as const;

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: LUXURY_EASE } },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: LUXURY_EASE } },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: LUXURY_EASE } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: LUXURY_EASE } },
};

export const staggerContainer = (staggerChildren: number = 0.08): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren, delayChildren: 0.05 },
  },
});

/** Standard viewport config for `whileInView` scroll reveals. */
export const scrollViewport = { once: true, margin: "-80px 0px -80px 0px" } as const;
