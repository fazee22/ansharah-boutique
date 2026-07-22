import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

/**
 * Luxury Fashion Design System — Tailwind Theme
 * ------------------------------------------------
 * Color tokens are consumed as HSL CSS variables (defined in
 * `src/styles/globals.css`) so that Shadcn UI primitives, dark-mode
 * variants, and alpha-blended utilities (e.g. `bg-ink/40`) all work
 * out of the box.
 *
 * Do not hard-code hex values in components — always reference a
 * semantic token (`bg-canvas`, `text-ink`, `border-hairline`, ...)
 * so the palette can be retuned from one place.
 */
const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "2rem",
        lg: "3rem",
        xl: "4rem",
        "2xl": "5rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
      },
    },
    screens: {
      xs: "420px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      "3xl": "1800px",
    },
    extend: {
      colors: {
        // Semantic surface / text tokens (Shadcn-compatible)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },

        // Brand vocabulary — the luxury fashion palette proper.
        // Kept alongside the semantic tokens above so design work can
        // speak in brand language ("brass", "ink") while components
        // stay themeable through the semantic layer.
        ink: "hsl(var(--ink))",
        canvas: "hsl(var(--canvas))",
        porcelain: "hsl(var(--porcelain))",
        brass: {
          DEFAULT: "hsl(var(--brass))",
          light: "hsl(var(--brass-light))",
          dark: "hsl(var(--brass-dark))",
        },
        evergreen: {
          DEFAULT: "hsl(var(--evergreen))",
          light: "hsl(var(--evergreen-light))",
          dark: "hsl(var(--evergreen-dark))",
        },
        stone: "hsl(var(--stone))",
        hairline: "hsl(var(--hairline))",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        // Editorial type scale (ratio ≈ 1.25), tracked slightly tighter
        // at large sizes for a premium, condensed-luxury headline feel.
        "display-2xl": ["4.5rem", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-xl": ["3.75rem", { lineHeight: "1.08", letterSpacing: "-0.02em" }],
        "display-lg": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.015em" }],
        "display-md": ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        "display-sm": ["1.75rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "heading-lg": ["1.5rem", { lineHeight: "1.3" }],
        "heading-md": ["1.25rem", { lineHeight: "1.35" }],
        "heading-sm": ["1.125rem", { lineHeight: "1.4" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6" }],
        "body-md": ["1rem", { lineHeight: "1.6" }],
        "body-sm": ["0.875rem", { lineHeight: "1.55" }],
        overline: [
          "0.75rem",
          { lineHeight: "1.4", letterSpacing: "0.14em" },
        ],
        caption: ["0.75rem", { lineHeight: "1.5" }],
      },
      spacing: {
        // Extends Tailwind's default 4px scale with the generous,
        // section-level increments a luxury layout needs.
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
        30: "7.5rem",
        34: "8.5rem",
        38: "9.5rem",
        "section-sm": "5rem",
        "section-md": "7.5rem",
        "section-lg": "10rem",
        "section-xl": "13rem",
        gutter: "1.25rem",
      },
      borderRadius: {
        none: "0",
        sm: "0.125rem",
        DEFAULT: "0.25rem",
        md: "0.375rem",
        lg: "0.625rem",
        xl: "1rem",
        "2xl": "1.5rem",
        pill: "999px",
      },
      boxShadow: {
        // Warm-tinted, low-opacity shadows (ink-based, not pure black)
        // for a soft, premium elevation rather than a harsh drop shadow.
        subtle: "0 1px 2px 0 hsl(var(--ink) / 0.04)",
        soft: "0 4px 16px -4px hsl(var(--ink) / 0.08)",
        elevated: "0 12px 32px -8px hsl(var(--ink) / 0.12)",
        floating: "0 24px 60px -12px hsl(var(--ink) / 0.18)",
        "brass-glow": "0 0 0 1px hsl(var(--brass) / 0.35)",
      },
      letterSpacing: {
        tightest: "-0.03em",
        tighter: "-0.02em",
        tight: "-0.01em",
        wide: "0.05em",
        wider: "0.1em",
        widest: "0.16em",
      },
      transitionTimingFunction: {
        "luxury-ease": "cubic-bezier(0.16, 1, 0.3, 1)",
        "luxury-in": "cubic-bezier(0.65, 0, 0.35, 1)",
      },
      transitionDuration: {
        400: "400ms",
        600: "600ms",
        800: "800ms",
      },
      maxWidth: {
        content: "1440px",
        prose: "68ch",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s var(--tw-ease, cubic-bezier(0.16,1,0.3,1))",
        "fade-up": "fade-up 0.7s var(--tw-ease, cubic-bezier(0.16,1,0.3,1))",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
