import { Fraunces, Manrope, IBM_Plex_Mono } from "next/font/google";

/**
 * Type system fonts, loaded once via `next/font` (self-hosted, zero
 * layout shift) and exposed as CSS variables consumed by
 * `tailwind.config.ts` -> `fontFamily.display / body / mono`.
 *
 *  - Fraunces  — display serif with optical sizing; carries the
 *                editorial, fashion-house personality of headings.
 *  - Manrope   — geometric grotesque body face; quiet and legible
 *                at small sizes for product copy and UI text.
 *  - IBM Plex Mono — utility face for SKUs, prices, and tabular data.
 */
export const fontDisplay = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["opsz", "SOFT", "WONK"],
  style: ["normal", "italic"],
  weight: "variable",
  display: "swap",
});

export const fontBody = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const fontMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const fontVariables = `${fontDisplay.variable} ${fontBody.variable} ${fontMono.variable}`;