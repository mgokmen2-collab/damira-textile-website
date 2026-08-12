# DAMIRA TEXTILE — Review Report

**Date:** 2026-08-12 · **Mode:** review · **Score: 39/50 — MIDDLE**

## TL;DR

A brand surface with real identity. First impression is strong: the asymmetric hero with the Monaco embroidery, the editorial serif headline, and the warm linen ground commit to the lane within one second. Hierarchy is clean, color voice is earned, type voice is deliberate. The weak lens is **interaction feel** — the control family (pills, hover lifts, in-flow mobile menu) is the one place the surface stops feeling like the atelier and starts feeling like a template. Fixing the control language is the highest-impact move; no structural rethink needed.

## First Read

The page says "textile atelier on the Riviera" before the headline is read: linen ground, gold-ruled serif, embroidery photography. The strongest visual idea (fabric texture as hero proof) belongs to this brief and could not be transplanted to another product without becoming wrong.

## Lenses

| # | Lens | Score | Key finding |
|---|---|---|---|
| 1 | First impression | 8/10 | Confident lane, memorable proof object (embroidery close-up), category visible instantly |
| 2 | Hierarchy | 8/10 | Hook/bridge/detail reads clearly; hero leads the eye; grid rhythm is editorial |
| 3 | Color voice | 8/10 | Warm linen + charcoal + champagne gold is specific, restrained, and used in correct proportion (~10% gold) |
| 4 | Type voice | 8/10 | Cormorant Garamond display vs Inter UI is a real pairing with scale contrast; letter-spaced labels |
| 5 | Interaction feel | 7/10 | States exist (hover/focus/empty/loading/success) but control geometry and hover motion contradict the quiet voice |

## What's Working

- **Proof object:** the embroidered textile close-ups are the artifact; the hero is not a stock luxury photo.
- **Editorial grid:** collection stagger and product swatch grid carry Ferm Living lineage without copying it.
- **Color proportion:** gold is used as accent only; the page is not beige-soup.
- **Copy:** specific, short, no exclamation points; B2B notes (min order, delivery) build trust.
- **i18n:** three languages, complete key coverage, no layout-breaking strings observed.

## Priority Issues

### P1 — Control family breaks the register (interaction feel)

- **Evidence:** 7 pill-radius controls + `translateY(-1px)` hover lifts (see smell-report P1/P2).
- **Impact:** the one moment the page looks assembled rather than authored.
- **Fix:** `/design interaction` — hairline 2–4px radius controls, color/border hover shifts, no lift.

### P2 — Mobile menu displaces content (responsiveness)

- **Evidence:** at 768px, hamburger menu is an in-flow block; opening it pushes the hero down.
- **Impact:** touch-first tablet browsing (stated audience) gets friction at the nav moment.
- **Fix:** `/design responsive` — overlay panel with safe-area padding.

### P3 — Quote form error recovery (interaction feel)

- **Evidence:** generic error line, no per-field marking; failed submit clears nothing but gives no pointer.
- **Impact:** the conversion surface (B2B quote) is the least forgiving part of the flow.
- **Fix:** `/design interaction` — field-level errors, `aria-describedby`, preserve selection.

## Recommendation

Run **one** combined interaction+responsive pass: replace the pill family with hairline controls, overlay the mobile menu, and harden form errors. That single pass moves interaction feel from 7 to 9 and closes the smell-report's only real tells. No recolor, no typeset, no relayout needed; the direction is right.

## Next Modes

`interaction` · `responsive`
