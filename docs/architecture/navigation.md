# Navigation Architecture

## Single source of truth

`frontend/src/constants/navigation.ts` exports one tree (`primaryNav`,
typed as `NavNode[]` in `types/navigation.ts`) that both
`DesktopNav`/`MegaMenu` and `MobileNav` render. The menu structure —
Home, Collections (Summer/Winter/Shawls, each with their own 2 Piece /
3 Piece / fabric sub-levels), New Arrivals, Sale, About, Contact — is
defined exactly once. Changing the navigation means editing this file;
no menu markup should ever be hand-duplicated between desktop and
mobile.

## One recursive renderer, two presentations

`NavNode` is recursive (`children?: NavNode[]`) with no fixed depth
limit. Both menu implementations walk the same tree with a **single
recursive component** rather than hand-written markup per level:

- **Desktop** (`MegaMenu` -> `MegaMenuNode`): a leaf renders as a
  plain link; a node with children renders its label as a column/
  group header and recurses into a nested `<ul>`. This is what turns
  into the mega menu's multi-column, multi-level layout — Summer
  Collection / Winter Collection / Shawls are the three columns
  (`Collections`'s direct children), and 2 Piece / 3 Piece render as
  bold sub-headers within their column, exactly matching the
  requested structure.
- **Mobile** (`MobileNav` -> `MobileNavNode`): the same tree renders
  as nested `Accordion` sections instead of hover columns — the
  touch-appropriate equivalent of the same information architecture,
  not a separate menu definition.

## Why a mega menu (grid) instead of nested hover flyouts

The brief lists both "Mega Menu" and "Multi-Level Dropdown" as
requirements. Rather than building two competing patterns (a flyout
chain of `Summer Collection ▶ 2 Piece ▶ Embroidered Lawn` submenus
opening rightward on hover, *and* a separate mega menu), this
implementation treats the mega menu as the multi-level dropdown: all
levels of a column render open, at once, in the panel. This is the
standard premium-fashion-ecommerce pattern (fewer hovers, no risk of
a flyout closing before the user reaches it, better for trackpad/
touch users) and the recursive renderer described above **is** the
reusable "multi-level dropdown" primitive — it is simply presented as
a grid instead of a hover chain.

## Interaction & accessibility

- Opens on hover (`onMouseEnter`) or focus (`onFocus`) of the trigger,
  closes on mouse-leaving the nav, outside click
  (`useClickOutside`), <kbd>Escape</kbd> (`useEscapeKey`), or focus
  leaving the nav entirely (`onBlur` + `contains` check) — so a
  keyboard-only user tabbing past the last mega menu link closes it
  automatically.
- The trigger is a real `<button>` with `aria-haspopup="true"`,
  `aria-expanded`, and `aria-controls` pointing at the panel's `id`.
- The panel has `role="region"` and an `aria-label`.

## Routes are wired, pages are not

Every leaf link resolves to a real `/collections/...` URL via
`ROUTES.collection()` (e.g.
`/collections/winter-collection/3-piece/khaddar`). No page exists at
those routes yet — that's Phase 3+. Linking to them now means no menu
markup needs to change when the collection pages are built; only
`app/collections/[...slug]/page.tsx` needs to be added.
