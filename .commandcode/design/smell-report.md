# DAMIRA TEXTILE — Smell Report

**Date:** 2026-08-12 · **Mode:** smell · **Score: 6/10 — PRESENT**

## TL;DR

The surface is mostly authored: OKLCH warm-linen palette, serif/sans editorial system, texture-led imagery, no tech gradient, no feature tile grid, no icon toppers. But the control layer carries a generic reflex: seven pill-shaped controls (`border-radius: 999px` on buttons, chips, lang switch, search) plus a `translateY(-1px)` hover lift on CTAs. That is the "AI made this" tell on an otherwise quiet-luxury brand. The fix belongs to interaction/refine, not a full redesign.

## Heuristics

| # | Odor | Detected | Finding |
|---|---|---|---|
| 1 | Tech gradient | 0 (clean) | No gradient anywhere; palette is flat OKLCH linen/charcoal/gold |
| 2 | Generic tech hue | 0 (clean) | Charcoal + champagne gold, not blue-violet |
| 3 | Feature tile grid | 0 (clean) | Atelier facts are a definition list, not equal cards |
| 4 | Accent rail | 0 (clean) | No colored side stripes |
| 5 | Unearned blur | 0 (clean) | Backdrop blur only on sticky header, justified by scroll overlap |
| 6 | Stat monument | 0 (clean) | Specs are contextual sentences, not oversized numbers |
| 7 | Icon topper | 0 (clean) | No decorative icons above headings |
| 8 | Bounce everywhere | 0 (clean) | Cubic-bezier(0.22,1,0.36,1), no bounce/elastic |
| 9 | Default type | 0 (clean) | Cormorant Garamond + Inter, tuned scale, editorial intent |
| 10 | Center stack | 0 (clean) | Asymmetric hero, editorial grid, no safe-middle default |

## Odor Findings (observed)

### P1 — Pill-control family (7× `border-radius: 999px`)

- **Reflex:** rounded pill = the default interactive treatment in generated UI.
- **Evidence:** `.btn`, `.btn-primary`, `.btn-ghost`, `.btn-outline`, `.chip`, `.lang-btn`, `.search-input` all use `border-radius: 999px` in `css/styles.css`.
- **Why it weakens this brief:** Damira is editorial quiet luxury (Tekla/Ferm Living lane). Pill controls read as app-chrome, not atelier. The brief's own anti-reference list names "pill buttons" as a reflex to refuse.
- **Fix:** interaction/refine — square or slightly-radiused controls (2–4px) with hairline borders; keep pills only where a segmented control is semantically right (lang switch).

### P2 — Hover lift on CTAs (`translateY(-1px)`)

- **Reflex:** micro-lift on hover as a universal affordance cue.
- **Evidence:** `.btn-primary:hover` and `.header-cta:hover` both translate up 1px.
- **Why it weakens this brief:** quiet luxury moves less, not more. A 1px lift is noise on a surface whose voice is restraint.
- **Fix:** interaction — hover becomes a color/border shift only (gold fill or underline), no motion.

### P3 — Mobile menu as in-flow list (watch)

- **Reflex:** hamburger + vertical list is the standard responsive fallback.
- **Evidence:** `.mobile-nav` is a bordered block in document flow below the sticky header; it pushes content instead of overlaying it.
- **Why it weakens this brief:** on touch-first tablets (a stated audience), a menu that shoves content is friction; the language toggle stays visible which is right, but the menu itself should overlay.
- **Fix:** responsive — menu becomes an overlay panel anchored to the header with safe-area padding.

## What's Working

- Palette cannot be guessed from the domain (warm linen, not navy/white "textile" cliché).
- Type has project-specific reason (Cormorant Garamond = editorial atelier voice, Inter = quiet UI).
- Composition is asymmetric and texture-led, not a centered hero with three cards.
- No motion exists that doesn't reveal state (reveal-on-scroll, modal entrance).
- Copy is voice-consistent and has no exclamation points or em-dash abuse.

## Prescriptions

- **Primary:** `/design interaction` — replace pill family and hover lift with hairline editorial controls.
- **Secondary:** `/design responsive` — overlay mobile menu.
- If the pill fix leaves the lang switch feeling orphaned, treat it as a segmented control with 2px radius, not a third pill.

## Next Modes

`interaction` · `refine` · `responsive`
