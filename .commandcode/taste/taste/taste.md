# Taste
- Communicates in Turkish (TR) and expects replies to match that language. Confidence: 0.9
- Dictates exact file contents to be written and expects verbatim reproduction ("birebir") rather than paraphrase or embellishment. Confidence: 0.7
- Keeps project design/brand specifications in a `.commandcode/brief.md` file as the canonical design brief before building. Confidence: 0.6
- Prefers a single canonical design brief: when two sources of truth exist (root `.commandcode/brief.md` and `.commandcode/design/brief.md`), consolidate into the one the tooling reads and remove the duplicate to prevent drift. Confidence: 0.7
- Specifies colors in OKLCH notation with hex fallbacks (e.g. `oklch(0.97 0.01 80)` / `#FAF8F5`) for design tokens. Confidence: 0.7
- Prefers a minimalist, editorial, "quiet luxury" aesthetic (high-contrast serif typography, generous spacing, warm off-white/charcoal/champagne-gold palette), citing Tekla Fabrics and Ferm Living as reference points. Confidence: 0.6
- Prefers multi-language support (TR/EN/FR) with a subtle header language toggle for B2B-facing sites. Confidence: 0.7
- Drives design work through Command Code's `/design` slash-command workflow (`/design setup`, `/design voice`), supplying a concise high-level spec (aesthetic, sections, languages) and expecting the agent to research the repo, verify assets, and implement rather than ask questions. Confidence: 0.6
- Uses minimal continuation directives (e.g. "kaldığın yerden devam et", "ok devam et" — "continue where you left off") and expects the agent to track its own task state across turns (todo list, pending validations) and resume autonomously without re-asking or re-confirming scope. Confidence: 0.7
- Wants finished projects initialized as git repos and published to GitHub as **private** repos, with a README treated as mandatory ("readme ekle mutlaka"). Confidence: 0.8
- Treats the user's manual file/folder reorganization on disk (e.g., moving images into `items/<collection>/` folders) as the authoritative source of truth for asset mappings; expects the site's data layer and HTML references to be updated to match immediately, without re-verifying or second-guessing the user's organization. Confidence: 0.8
- Product/collection photos must render at their native aspect ratio without cropping — when images look "kesik" (cut off) in fixed boxes, the fix is per-image `aspect-ratio` + natural-height rendering, not `object-fit: cover` into a fixed square. Confidence: 0.8
sume autonomously without re-asking or re-confirming scope. Confidence: 0.6
