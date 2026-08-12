# DAMIRA TEXTILE — Design Constitution

Tek kaynak: bu dosya. Kök `.commandcode/brief.md` kaldırılmıştır; içeriği aşağıya birleştirildi.

## Register

**Brand.** The site is the experience: a digital showroom for a tourist textile wholesaler based in Nice, France. Emotional arrival, editorial rhythm, quiet luxury. The catalog viewer is the product surface inside the brand surface.

## Business Reality (user-verified)

- DAMIRA TEXTILE, Nice (Fransa) merkezli, **turistik tekstil ürünlerinin toptan (B2B) satışını** yapan firma.
- Ürünler: keten üzerine makine nakışı, Fransız bölgesel/turistik motifler (Monaco, Corse, Vendée, Île d'Oléron, Baie de Somme, Marseille, Fort Boyard).
- Alıcılar: hediyelik eşya mağazaları, oteller, perakende turistik satış noktaları.
- Kataloglar modüler olmalı: yeni koleksiyon/desen eklemek tek veri kaydı ile mümkün (js/data.js).

## Target Audience & Requirements (from product brief)

- B2B clients, interior architects, luxury hotel buyers, and retail customers.
- **Languages:** TR (Türkçe), EN (English), FR (Français) with a subtle language toggle in the header.
- **Core Functionality:**
  - Interactive digital catalog viewer (PDF preview + grid view).
  - High-resolution tactile fabric showcases.
  - Multi-language switcher (TR/EN/FR).
  - Quick quote request / contact interface.

## Voice

- **Physical words:** linen, warm, tactile, unhurried, editorial, quiet, precise, generous.
- Copy is short, sentence case, no exclamation points. Turkish as source language; EN/FR translations must not break line lengths or layout.
- Fabric names and collection names are proper nouns; honor them.

## Anti-References

- Coton Blanc's outdated catalog system (modal-heavy, dated grid) — we are the modern replacement.
- Generic tech/startup reflexes: blue-violet CTAs, purple-cyan gradients, pill buttons, glassmorphism, emoji icons, stock-photo luxury clichés.
- SaaS "card grid everywhere" patterns; cards only where content is genuinely discrete (fabric swatches, catalog covers).
- Centered-hero-with-three-feature-cards as the default composition.

## Inspiration & Competitor Benchmarks (from product brief)

- **Tekla Fabrics (teklafabrics.com):** Architectural typography, generous spacing, high-end photography focus.
- **Ferm Living (fermliving.com):** Editorial lookbooks, interactive catalog grids, warm minimal UI.
- **Coton Blanc (cotonblanc.com):** Direct competitor. We replace their outdated catalog system with a modern, responsive, touch-first catalog viewer.

## Design Principles

1. **Texture before decoration.** Fabric photography is the hero; UI gets out of the way. Generous negative space, no competing patterns.
2. **Editorial hierarchy.** Serif display type with real contrast between scales; 3-level text blocks (hook / bridge / detail). Measure 60-76ch for paragraphs.
3. **The catalog is a lookbook, not a file list.** Grids are editorial (Ferm Living-style), PDF preview is secondary to the visual browse.
4. **Quiet luxury means restraint.** The gold accent appears in under ~10% of the surface; the off-white linen background carries the page.
5. **Touch-first catalog interactions.** Swipe/pinch friendly on tablets; hover is enhancement, never a gate (no hover-only affordances).

## Accessibility Expectations

- Contrast: charcoal on linen body text passes AA; gold is used for accents/display only, never as sole carrier of meaning.
- Focus rings: visible, 3:1 contrast, consistent across grid items, links, and controls.
- Touch targets ≥ 44×44px; language toggle and quote CTA sized for touch.
- `prefers-reduced-motion` honored; catalog transitions degrade to simple fades.
- Keyboard-navigable catalog grid and language switcher; PDF preview has a non-PDF fallback (grid view).

## Visual Foundation

- **Brand Identity:** High-end textile manufacturing & premium home/hotel fabrics (marka konumlaması). Aesthetic: minimalist, editorial, quiet luxury.
- **Logo Style:** High-contrast serif typography with interlocked 'DG' monogram. (logo.jpg'den doğrulandı: siyah D + altın G serif monogram; "DAMIRA" siyah all-caps; "TEXTILE" altın serif, ince altın çizgilerle çevrili.)
- **Colors (OKLCH, from product brief):**
  - Primary Background: Warm Off-White / Natural Linen (`oklch(0.97 0.01 80)` / `#FAF8F5`)
  - Primary Text/Accents: Charcoal Black (`oklch(0.20 0.01 80)` / `#1A1918`)
  - Secondary Accent: Champagne Gold (`oklch(0.72 0.08 75)` / `#C5A059`)
  - Muted Borders: Soft Sand Tint (`oklch(0.92 0.01 80)`)
- **Photography (verified from items/):** close-up, flat-lay fabric details, even diffuse light, texture-forward, minimal staging. 25 unique embroidered designs in `items/` (JPG) — these are the catalog's raw material; treat texture crops as hero assets, not thumbnails.
- **Type direction:** high-contrast serif display (editorial, Tekla-like) paired with a quiet sans or plain system font for UI. Letter-spaced small caps for labels.

## Component Rules

- **Header:** minimal — logo mark left, navigation center/right, subtle TR/EN/FR toggle. No hamburger until ≤ tablet; the toggle stays visible on all breakpoints.
- **Catalog grid:** editorial grid of fabric swatches; each cell is a texture crop + collection name + fabric name; hover/click reveals detail and PDF/spec access.
- **Quote request:** short form (name, company, fabric(s) selected, quantity/yardage, message), gold accent on the primary action only; confirmation copy names the next step.
- **Language toggle:** subtle text-based TR / EN / FR, not flags or globe icons; persists selection.
- **PDF preview:** opens from grid view, never replaces it; loading/empty/error states for the viewer are designed, not assumed.
- **Modular catalog data:** all collections/products/translations live in `js/data.js` (COLLECTIONS, PRODUCTS, I18N). Adding a design = one object entry; the UI (filter, search, quote, modal) picks it up automatically.
