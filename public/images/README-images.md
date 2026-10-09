# Image Asset Specification — SmartLink

No API key configured for image generation. Placeholder spec below.

## 1. Hero background — `hero-visual.png` (1200×675px / 16:9)
Dark tech editorial, deep navy canvas, warm orange (#ff8b1a) accent glow, floating glassmorphism panels, node connection graph suggesting digital ecosystem. No text. Cinematic grade.

## 2. Feature section visuals — `feature-*.png` (800×600px)
3–4 images: abstract tech compositions matching the palette. One per feature card. Clean, product-adjacent (interface mockups, data visualization hints, network nodes).

## 3. OG Card — `og-smartlink.svg` ✅ DONE
Enhanced with: node visualization, glass service pills, dual accent glow, orbital rings.

## 4. Services screenshots — DELETED (r132)

`smart-menu.jpg` (203 KB) + `smart-bot.jpg` (53 KB) shipped since the
early rounds with **zero `src/` consumers** — no page, component, or
test ever rendered them (r131 A3 D10 grep; r132 A6 §1 re-verified).

r132 disposition:
- `smart-bot.jpg` — deleted as-is (the r131 "blocked by the live e2e
  reference" ruling was over-broad for this file: no spec ever fetched
  it; only docs mentioned it).
- `smart-menu.jpg` — the sole code reference was the immutable-cache
  probe at `e2e/security-headers.spec.ts` (fetching it + asserting
  200/immutable). The probe is repointed at `/logo-light.png` (the
  r131 copper light wordmark, which now rides the immutable list in
  `next.config.ts` — it was the one rendered image without a cache
  rule), then the file is deleted.
- The `/images/:path*` cache rule in `next.config.ts` is retired with
  them (nothing lives under `/images/` anymore).

`og-smartlink.jpg` (repo root) is untouched — it is the live OG/Twitter
+ JSON-LD card (JPEG stays JPEG for crawler compatibility).

---

**To generate:** configure Fal.ai or OpenAI key in Settings > Media Providers, then request regeneration via this skill.
