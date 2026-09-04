# COQ D'OR — Maison de Linge · Smell Report

**Date:** 2026-09-04 · **Mode:** smell · **Score: 10/10 — CLEAN** (updated after fixes)

## TL;DR

The August tell is gone: the pill-control family, the 1px hover lift, and the in-flow mobile menu were all replaced with hairline 2px controls, color-only hovers, and a fixed overlay menu. The surface is authored, not assembled: warm-linen OKLCH palette, Cormorant + Inter editorial pairing, asymmetric hero, gradient only where it does real work (caption scrims, image shimmer). All three faint odors from the original pass are gone: the model name is no longer echoed three times inside the group panel, the sticky quote bar's inline `style=` became a class, and the generic hint line under the slider was removed. Nothing left to clean.

## Heuristics

| # | Odor | Score | Finding |
|---|---|---|---|
| 1 | Tech gradient | CLEAN | Gradients exist only as caption scrims (to-top black) and the image shimmer; no hue energy anywhere |
| 2 | Generic tech hue | CLEAN | Charcoal + champagne gold on linen; not blue-violet |
| 3 | Feature tile grid | CLEAN | Collection cards are real products with models; atelier facts are a definition list |
| 4 | Accent rail | CLEAN | No colored side stripes |
| 5 | Unearned blur | CLEAN | Backdrop blur only on sticky header, sticky quote bar, modal backdrop, slider arrows — all depth-justified |
| 6 | Stat monument | CLEAN | Specs are contextual sentences; counts are small caps |
| 7 | Icon topper | CLEAN | No decorative icons above headings |
| 8 | Bounce everywhere | CLEAN | Cubic-bezier(0.22,1,0.36,1); active states scale 0.97 only |
| 9 | Default type | CLEAN | Cormorant Garamond + Inter, tuned scale, letter-spaced labels |
| 10 | Center stack | CLEAN | Asymmetric hero, editorial grid; centered catalog hero is an intentional cover |

## Resolved Issues

### R1 — Triple model-name echo inside the group panel (RESOLVED)

- **Was:** `js/app.js` rendered `.slide-name` ("Klasik Şal Yaka Havlu Bornoz") and `.slide-meta` ("BORNOZ KOLEKSİYONU · Klasik Şal Yaka Havlu Bornoz") below the photo, then wrote the same model name again into `#gmSummary`. The vision pass confirmed the panel read name / name / name in three stacked rows.
- **Fix applied:** `.slide-meta` now carries the collection eyebrow only; `#gmSummary` is a state/instruction line ("Şu an görüntülenen model. 'Desen İstemiyorum' ile…") that never repeats the name.
- **Verify:** screenshot shows the model name exactly once, under the photo.

### R2 — Leftover inline `style=` on the sticky quote bar (RESOLVED)

- **Was:** `index.html` — `<div style="display:flex;gap:var(--space-4);align-items:center;flex-wrap:wrap">` around the quote-bar actions, outside the class/token system.
- **Fix applied:** replaced with a `.quote-sticky-actions { display:flex; gap: var(--space-4); align-items:center; flex-wrap: wrap; }` class in `css/styles.css`; the inline attribute is gone.
- **Verify:** grep finds zero inline `style=` in the rendered quote-bar markup.

### R3 — Generic "tip" line under the group slider (RESOLVED)

- **Was:** `.gm-hint` rendered "Fotoğrafları ok tuşlarıyla veya kaydırarak değiştirebilirsiniz." centered and italic below the actions — a template-style helper sentence.
- **Fix applied:** removed the hint line, its `#gmHint` element reference, the `.gm-hint` CSS rule, and the TR/EN/FR `panel.hint` keys.
- **Verify:** grep finds no `gm-hint` / `panel.hint` remnants; the panel ends cleanly at the actions.

## Considered but Rejected

| Location | Candidate | Rejected because |
|---|---|---|
| `.gm-backdrop` blur(14px) | Reduce or remove the blur | Blur depth on the panel backdrop is intentional and verified in checkup; removing would flatten the layer model |
| `.dot` width 26px bar | Make dots circular again | The 6px bar-dot is a deliberate editorial variation, not a pill reflex |
| `.modal-close` rotate(90deg) hover | Remove the rotation | A 90° rotation on a close icon is a crisp affordance, not bounce; it is hover-only and reduced-motion-safe |
| `.ecat-model` square thumbs | Reconsider as rectangles | Square 1:1 thumbs match the design asset standard; changing would misrepresent the images |
| In-flow `.section` centered hero at catalog | Flag as center stack | The catalog cover is a centered editorial cover, not a default composition; page body is asymmetric |
| `.hero-caption` italic style | Flag italic + separator conflict | User already settled the caption wording and upright rendering; it is authored copy, not drift |

## Verification

- Source scan of `css/styles.css` (radius, blur, gradients, transforms) and `js/app.js` + `js/catalog.js` (aria labels, inline styles, hint/summary renders).
- Runtime: headless Chrome 1440px screenshots of index hero, collections grid, group panel, catalog top, catalog designs, and 375px mobile menu — inspected via vision.
- Grep confirms removal: no `gm-hint`, no `panel.hint`, no inline `style=` on the quote bar, one model-name echo in the panel.
- **Not verified:** a full TR/EN/FR read of every string in situ; a screen-reader pass of the group panel; hover states on touch devices.

## Verdict

**Pass** — no open issues; R1–R3 resolved and verified. The design's strongest idea (embroidered textile close-ups as hero proof, product-first browse) belongs to this brief and could not be transplanted without becoming wrong. No `refine` needed.
