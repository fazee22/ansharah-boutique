# Auto-Moving Marquee

Status: implemented, used once on the homepage
(`components/home/collection-marquee.tsx`) via the reusable
`components/shared/marquee.tsx` + `hooks/use-marquee.ts`.

## Requirements recap

Right-to-left infinite loop, no jerks, no flickering, pause on hover
(desktop), swipe support on mobile, unlimited images, reusable.

## Why not a CSS `@keyframes` marquee

A pure-CSS `translateX(0) -> translateX(-50%)` loop is simple but
can't satisfy "swipe support on mobile" — CSS animations don't expose
a scroll offset JavaScript can read or write mid-drag, so there's no
way to let a user grab the strip and drag it without either fighting
the animation or abandoning the CSS approach entirely at the drag
boundary. It also can't be paused and resumed from its *current*
position without a `getComputedStyle` transform-matrix hack.

## The approach: `requestAnimationFrame` + measured modulo wrap

`useMarquee` (`hooks/use-marquee.ts`) keeps the scroll offset in a
plain `useRef<number>` (not React state — no re-render on every
frame) and:

1. On mount, measures the rendered width of **one copy** of the
   content: the caller renders `items` twice back-to-back, so
   `trackRef.scrollWidth / 2` is exactly the distance one full loop
   should travel. A `ResizeObserver` re-measures if content changes.
2. Every frame, advances the offset by `speed * deltaTime` (real
   elapsed seconds since the last frame, not a fixed increment) —
   this is what keeps motion smooth and correctly paced regardless of
   the display's refresh rate, and is why there's no jerk when a
   frame is dropped.
3. Wraps the offset with `((offset % half) + half) % half` — a
   modulo that stays positive for negative offsets — so the loop
   point is invisible: the pixels the track shows right after
   wrapping are pixel-identical to the pixels it showed at the start,
   because they're literally the second copy of the same content.
4. Writes the result straight to `track.style.transform` via a ref,
   bypassing React's render cycle entirely for the 60fps hot path.

## Pause on hover, drag on any device

`onMouseEnter`/`onMouseLeave` set a ref flag the RAF loop checks
before advancing — desktop hover pauses instantly, no state update,
no re-render.

Dragging uses the **Pointer Events API** (`onPointerDown/Move/Up`),
which unifies mouse and touch input behind one code path — there's no
separate "mobile swipe" implementation to keep in sync with desktop
drag. `setPointerCapture` ensures the drag keeps tracking even if the
pointer leaves the element's bounds mid-gesture. Dragging pauses the
RAF advance and offsets the transform directly from pointer delta;
releasing resumes autoplay from exactly where the user left it — it
never snaps back to the start.

## Reduced motion

`useMarquee` watches
`window.matchMedia("(prefers-reduced-motion: reduce)")` and holds the
offset still (no autoplay advance) when it matches, while leaving
drag-to-scroll fully functional — motion-sensitive users lose only
the automatic movement, not access to the content.

## Reusability

`components/shared/marquee.tsx` wraps the hook in a generic
`<Marquee items={T[]} renderItem={...} keyExtractor={...} />` — it
has no knowledge of "collections." The homepage instance passes
category nodes; a logos strip, testimonials, or a press-mentions band
elsewhere in the product would pass their own item type and
`renderItem`, reusing the exact same scroll/drag/pause/reduced-motion
engine.
