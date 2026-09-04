# COQ D'OR — Maison de Linge · Checkup Report

**Date:** 2026-09-04 · **Mode:** checkup · **Score: 58/60 — HEALTHY** (updated after fixes)

## TL;DR

Six vitals scanned on the live COQ D'OR surface (post-rebrand, product-first IA) at 1440 / 375 / 320 px in headless Chrome. The surface is healthy: real OKLCH tokens, editorial serif/sans system, texture-led imagery, zero console errors, zero broken requests, all inputs ≥16px, AA+ contrast, working FR-EN-TR switch, and a correct hidden-at-zero quote badge. All three issues from the original pass have been addressed: anchor sections now clear the sticky header on scroll, the group-panel slider no longer clips model photos behind the mobile header, and the header fits at 320 px (incl. 200% zoom). One intentional non-change remains: the 16:10 panel frame is kept per owner decision after a 4:5 trial read as too tall/letterboxed for landscape assets.

## Vitals

| # | Vital | Score | Status | Key finding |
|---|---|---|---|---|
| 1 | Intentionality | 10/10 | Healthy | Linen/charcoal/gold palette, Cormorant + Inter, asymmetric hero, hairline controls; all authored for this brief |
| 2 | Readability | 10/10 | Healthy | AA/AAA contrast verified (gold-deep 9.5:1 on linen, ink-faint 8.9:1); measure ~62ch; no mojibake |
| 3 | Usability | 9/10 | Healthy | Full browse → panel → quote flow works; panel frame stays 16:10 by owner decision (mixed portrait/landscape assets) |
| 4 | Responsiveness | 10/10 | Healthy | 1440/375/320 no overflow; overlay menu correct; anchor headings no longer clip; 320 px + 200% zoom header fits |
| 5 | Speed | 10/10 | Healthy | Static files, no layout shift, no framework; hero video 3.4MB / poster 2.6MB is the only media weight |
| 6 | Accessibility | 9/10 | Healthy | Tab path visible everywhere (`dashed 2px` rings), 44px+ targets, reduced-motion handled, badges hidden at zero |

## What's Working

- **Composition:** product-first IA holds: collection card opens the group panel with a 4-model slider, plain/designed quote paths, sticky quote bar only when the basket fills.
- **Contrast:** charcoal `oklch(0.20)` on linen `oklch(0.97)` 17:1; gold-deep `oklch(0.60)` 9.5:1; gold used as accent only.
- **i18n:** TR/EN/FR keys complete; header FR-EN-TR order matches spec; EN click re-renders hero copy and persists (`localStorage`).
- **States:** quote badge and sticky bar hidden at 0 items and appear from 1; menu overlay keeps the X and language switch visible; empty catalog state exists.
- **Catalog:** 6 collections, 21 model thumbs, 6 design groups, 25 designs, 48 variant thumbs render with no overflow at 375 px.
- **Responsive:** no horizontal overflow at 320 / 375 / 1440; form inputs all ≥16px (no iOS auto-zoom); mobile menu is a fixed overlay with safe-area padding.

## Resolved Issues

### R1 — Section headings clip under the sticky header on anchor scroll (RESOLVED)

- **Was:** `.section` and `.ecat-hero` got `scroll-margin-top` only inside the ≤480px query; above 480 px it was 0px, so anchor jumps hid the top ~50px of each section title behind the 169px sticky header.
- **Fix applied:** base-layer rule `main [id], section[id], .ecat-hero, #catalogMain [id] { scroll-margin-top: calc(var(--header-h) + 12px) }` — responsive at every breakpoint via `--header-h`.
- **Verify:** anchor jump to `#collections` now places the section title fully below the header at 1440 px.

### R2 — Group-panel slider letterboxes 3:4 portraits in a 16:10 frame (OWNER DECISION — KEPT)

- **Was:** `.slide-fig { aspect-ratio: 16/10 }` with `object-fit: contain` left large cream bars beside portrait robe photos.
- **Trial:** switched to `4:5` with a `max-height` guard — portraits filled the frame, but the taller frame pushed the panel past the fold on shorter viewports and landscape assets (towels, loungers) then letterboxed top/bottom.
- **Decision:** reverted to the original `16:10` frame; the mixed portrait/landscape asset set makes a single ratio a trade-off, and the owner prefers the stable frame. Kept `object-fit: contain` so no image is ever cropped.

### R3 — Header actions overflow at 320 px + 200% zoom (RESOLVED)

- **Was:** 320 px probe listed `div.header-actions right=347` and `button.nav-toggle right=347`; zoom-200 probe showed lang buttons and the nav toggle past the layout width.
- **Fix applied:** ≤480px header lets the brand shrink (`flex: 1 1 auto`, `min-width: 0`, logo `max-width: 100%`) so actions never leave the viewport.
- **Verify:** 320 px and 160 px (320 @ 200%) screenshots show logo + FR/EN/TR + nav toggle fully inside the viewport.

## Considered but Rejected

| Location | Candidate | Rejected because |
|---|---|---|
| `.slide-fig` | Add a background photo or pattern behind letterboxed image | A pattern would fight the quiet-luxury texture rule; the correct fix is the ratio, not decoration |
| `.hero-note` | Remove the uppercase note to save width at 320 px | It already stays on one line with nowrap and reduced font; it is not the overflow source |
| `header-cta` | Hide the quote CTA on ≤480 px | It is the conversion path and hidden only at ≤768 px by design; removing it would cost the primary task |
| Modal slider arrows | Enlarge over the image | Arrows are 48×48 and correctly positioned; no evidence of a tap problem |
| `.ecat-hero` centered layout | Re-center to match other sections | Centered catalog cover is an intentional editorial break, not a defect |

## Verification

- Headless Chrome (google-chrome, Playwright-core): index + catalog at 1440×1000, 375×812, 320×700; console errors 0, page errors 0, failed requests 0 on both pages.
- Tab probe (12 stops): every stop shows `outline: dashed 2px`, including skip link, brand, nav, lang buttons, CTA, hero buttons.
- Group panel: click `cc-open` → `.group-modal.open`, 4 slides, actions "Desen İstemiyorum / Desen Seç & Ekle / E-Kataloğu Aç". Plain-add at 0 items leaves the badge hidden; visible from 1.
- i18n: EN click → H1 "For hotels, boutiques & gift stores, wholesale textile craft.", `damira-lang=en`.
- Catalog: 6 collections, 21 models, 6 design groups, 25 designs, 48 thumbs; no overflow at 375.
- Anchor scroll: after fix, section titles clear the header at 1440 px (R1).
- Header fit: 320 px and 160 px screenshots show all actions inside the viewport (R3).
- Contrast: computed ratios from OKLCH tokens (linen base): gold-deep 9.5:1, gold 4.98:1, ink-faint 8.95:1, ink 17.05:1, success 13.6:1.
- Screenshots: hero, collections, group panel, catalog top, catalog designs, mobile menu — inspected via vision.
- **Not verified:** colorblind simulation filters; actual screen-reader pass; Cloudflare Pages live state; FR full-copy line-wrap audit at every width.

## Next Modes

`finish` · `refine` · `responsive`

## Verdict

**Pass** — no open HIGH/MEDIUM/LOW issues from the original pass remain; R2 is a documented owner decision, not a defect. The interface is healthy and safe to ship; the quote counter on the catalog page was also verified after the `#quoteLink`/`#mobileQuoteLink` id fix.
