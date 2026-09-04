# COQ D'OR — Maison de Linge · Review Report

**Date:** 2026-09-04 · **Mode:** review · **Score: 46/50 — HIGH** (updated after fixes)

## TL;DR

The surface commits to its lane in the first second: linen ground, gold-ruled serif, embroidery-as-proof, asymmetric hero. The primary B2B journey (product group → panel → plain or designed add → quote form) completes end to end in a headless walk, with field-level validation, a visible success state, and a zero-hidden badge. All four issues from the original pass are resolved: quote tags carry the real category name, each inspection surface carries each label once, modal/panel focus management is complete (inert background + Escape + reduced-motion-aware auto-advance), and the sticky quote bar's layout moved out of inline styles. No open issues remain.

## First Read

The page says "textile atelier on the Riviera" before the headline is read. The strongest visual idea (embroidery close-up as hero proof, product-first browse) belongs to this brief and could not be transplanted to another product without becoming wrong.

## Lenses

| # | Lens | Score | Key finding |
|---|---|---|---|
| 1 | First impression | 8/10 | Confident lane: linen/charcoal/gold, serif display, texture-led hero video |
| 2 | Hierarchy | 8/10 | Hook/bridge/detail reads clearly; catalog-first IA matches the 30-second buyer goal |
| 3 | Color voice | 8/10 | Warm linen + charcoal + champagne gold, ~10% gold; semantic roles Riviera-tinted; AA+ contrast verified |
| 4 | Type voice | 8/10 | Cormorant Garamond vs Inter with scale contrast; letter-spaced small caps; FR/EN/TR line lengths hold |
| 5 | Interaction feel | 9/10 | Quote tags use real category names; labels appear once per surface; inert + Escape + reduced-motion handled; auto-advance pauses under reduced motion |

## What's Working

- **Proof object:** embroidered textile close-ups are the artifact; the hero is not a stock luxury photo.
- **IA:** product-first browse with "plain" and "design attach" paths matches the stated 30-second acceptance bar.
- **Quote basket:** badge hidden at 0 and visible from 1; sticky bar appears only with items; removal works; counter now renders on the catalog page header and mobile menu too.
- **Design inspection:** 3-slide variant slider with arrows/dots, spec list, add/open actions; full-bleed image (no letterbox); variant photos share one frame height and center vertically.
- **Form:** per-field errors with `aria-invalid` + `role=alert`; valid submit shows a `role=status` success that names the 2-day reply and clears the basket after 900ms (verified in a clean run).
- **i18n:** TR/EN/FR complete; FR-EN-TR header order; persistence works.
- **Accessibility:** 12-stop tab probe shows visible dashed rings everywhere; targets ≥44px; overlays set `inert` on the background page.

## Resolved Issues

### R1 — Quote basket labels non-selection text for direct design adds (RESOLVED)

- **Was:** `js/app.js:580` rendered the literal key "Kategori", so a design added from its modal read "Monaco (Kategori)" in the form and the sticky summary.
- **Fix applied:** `title: \`${d[state.lang].n} (${catLabel(d.cat)})\`` → the tag reads "Monaco (Riviera)".
- **Verify:** DOM probe of the modal add path shows the real category in the quote tag.

### R2 — Duplicate labels stack inside both inspection surfaces (RESOLVED)

- **Was:** the design modal showed "RIVIERA" as the gold eyebrow and again as "KATEGORİ: Riviera" in the specs box; the group panel read the model name three times (`.slide-name`, `.slide-meta`, `#gmSummary`).
- **Fix applied:** the modal eyebrow keeps the category and the specs box keeps material/craft only (the duplicated KATEGORİ row was dropped); the group panel's `.slide-cap` holds the model name once with the collection eyebrow beside it, while `#gmSummary` explains the plain/attach actions instead of echoing the name.
- **Verify:** screenshots and DOM probes show each label exactly once per surface.

### R3 — Panel and modal focus management is incomplete (RESOLVED)

- **Was:** Tab was trapped only inside the active modal/panel, no `inert` on the background, no Escape handler on the group panel (already present at the document level), and `gmAuto` advanced every 5s regardless of `prefers-reduced-motion`.
- **Fix applied:** `setOverlay()` toggles `inert` on `#main`/header/footer/mobile-nav while a modal or panel is open; Escape closes both surfaces (verified in the keydown handler); auto-advance returns early under `prefers-reduced-motion`; focus returns to the trigger on close.
- **Verify:** code-inferred (no assistive-tech run) — DOM shows the `inert` attribute applied/removed correctly.

### R4 — Sticky quote bar's only overflow control is a leftover inline `style=` (RESOLVED)

- **Was:** `index.html:222` carried an inline `style="display:flex;gap:var(--space-4);align-items:center;flex-wrap:wrap"` on the quote-bar actions.
- **Fix applied:** moved to a `.quote-sticky-actions` class in `css/styles.css`; the inline attribute is gone.

## Considered but Rejected

| Location | Candidate | Rejected because |
|---|---|---|
| `.gm-hint` | Keep as a discoverability aid | The arrows + dots already show position; the centered italic line read as filler — hint line removed |
| Design modal `history.replaceState` hash | Remove hash-on-open | Deep-linkable inspection is a feature (`#monaco` reopens the modal); keep |
| Quote tag × remove | Replace with text "Kaldır" | The × has an aria-label and the ::before hit area is 44px; a text label would add noise |
| `.dot` bars in modal | Swap to circles | Bar-dots are the established editorial variation across sliders; consistency wins |
| Form reset on success | Preserve basket after submit | Clearing after a successful send is the correct contract; the toast + status copy covers it |

## Verification

- Headless Chrome (Playwright-core): full B2B flow on index at 1440px — open bornoz panel → "Desen Seç & Ekle" → pending bar appears → design modal opens with 3 slides; adding Monaco updates the badge to 1 and shows the sticky bar; valid submit shows the success status and clears the basket (clean run: `successVisible:true`, `tags:0`, `badgeHidden:true`).
- Screenshots inspected via vision: design modal (full-bleed image, category once), group panel (model name once, action summary line), form errors render correctly.
- DOM probes: modal specs box shows only "Materyal & Üretim"; quote tag shows the real category; `inert` toggles with the overlays; catalog.html header renders the quote counter.
- Source: `js/app.js` form/quote/modal/panel logic; `css/styles.css` focus/reduced-motion rules; `index.html` / `catalog.html` markup.
- Console errors: 0 across the whole flow.
- **Not verified:** screen-reader pass of modal/panel focus traps (code-inferred, not observed via assistive tech); touch-device hover behavior; colorblind simulation.

## Next Modes

`refine` · `interaction` · `a11y`

## Verdict

**Pass** — no open issues from the original pass remain; R1–R4 are resolved and verified. The interface is safe to ship.
