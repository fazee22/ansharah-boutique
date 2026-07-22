# Design System — Foundation

Status: **tokens defined, no components/pages built yet** (Phase 1 scope).
Source of truth: `frontend/tailwind.config.ts` + `frontend/src/styles/globals.css`.

## Direction

Luxury, minimal, editorial. Quiet materials (ink, canvas, stone) with a
single warm metallic accent (brass) and a deep botanical secondary
(evergreen) used sparingly for emphasis, not decoration. The palette
avoids both common "AI-generated" defaults — the cream-and-terracotta
combination and the near-black-with-acid-accent combination — in favor
of a warmer, quieter neutral paired with brass and evergreen, which
reads as fashion-editorial rather than generic tech-startup.

## Color

| Token         | Hex (reference) | Use                                   |
|----------------|------------------|-----------------------------------------|
| `ink`           | `#14140F`         | Primary text, primary buttons (light mode) |
| `canvas`        | `#F4F0E6`         | Page background                        |
| `porcelain`     | `#FAF8F3`         | Card/panel surfaces, elevated content  |
| `brass`         | `#B08D46`         | CTAs, focus rings, price emphasis, links |
| `evergreen`     | `#1F3A30`         | Secondary accent — badges, admin nav   |
| `stone` / `hairline` | `#DCD5C7`   | Borders, dividers                      |

Every token is exposed as an HSL CSS variable (`--ink`, `--canvas`, …)
so components can use Tailwind opacity modifiers, e.g. `bg-ink/5` for a
whisper-soft tint. **Never hard-code a hex value in a component** —
always reference the semantic (`bg-background`, `text-foreground`) or
brand (`bg-brass`, `border-hairline`) token.

A `.dark` variant is defined for the future Admin Dashboard shell only;
the customer storefront stays on the light editorial palette.

## Typography

| Role       | Typeface        | CSS variable     | Notes                                  |
|------------|-------------------|--------------------|------------------------------------------|
| Display    | Fraunces (serif)   | `--font-display`    | Headlines, editorial moments; used with restraint, not on body copy |
| Body       | Manrope (sans)     | `--font-body`       | UI text, product copy, navigation      |
| Utility    | IBM Plex Mono      | `--font-mono`       | Prices, SKUs, order numbers, timestamps |

Loaded via `next/font/google` in `frontend/src/config/fonts.ts` —
self-hosted at build time, no runtime font-loading layout shift.

### Type Scale (`fontSize` in `tailwind.config.ts`)

`display-2xl` → `display-sm` (headlines), `heading-lg` → `heading-sm`
(section titles), `body-lg` → `body-sm` (copy), `overline` and
`caption` (labels/metadata). Ratio ≈ 1.25, tightened letter-spacing at
large sizes for a condensed-luxury headline feel.

## Spacing

Extends Tailwind's 4px base scale with named, section-level increments
(`section-sm` 80px → `section-xl` 208px) so vertical rhythm between
major page sections is chosen from a fixed set of values rather than
ad-hoc pixel numbers.

## Radius & Elevation

Corners stay restrained (`sm` 2px → `xl` 16px, `pill` for tags/buttons)
rather than heavily rounded, consistent with a minimal luxury
aesthetic. Shadows (`subtle` → `floating`) are warm-tinted (derived
from `--ink` at low opacity) instead of pure black, for a softer,
premium elevation.

## Motion

Framer Motion is installed but **no animations are implemented in
Phase 1** — only the timing primitives are defined
(`transitionTimingFunction.luxury-ease`, `luxury-in`) for later phases
to use consistently. `prefers-reduced-motion` is respected globally in
`globals.css`.

## Accessibility Floor

- Visible focus ring on every interactive element (`:focus-visible` →
  2px brass ring, see `globals.css`).
- Reduced-motion media query disables/shortens all animation and
  smooth scrolling.
- Color pairs (ink/canvas, porcelain/ink) meet WCAG AA contrast at
  body-text sizes.
