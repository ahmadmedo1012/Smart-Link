# Image Asset Specification — SmartLink

No API key configured for image generation. Placeholder spec below.

## 1. Hero background — `hero-visual.png` (1200×675px / 16:9)
Dark tech editorial, deep navy canvas, warm orange (#ff8b1a) accent glow, floating glassmorphism panels, node connection graph suggesting digital ecosystem. No text. Cinematic grade.

## 2. Feature section visuals — `feature-*.png` (800×600px)
3–4 images: abstract tech compositions matching the palette. One per feature card. Clean, product-adjacent (interface mockups, data visualization hints, network nodes).

## 3. OG Card — `og-smartlink.svg` ✅ DONE
Enhanced with: node visualization, glass service pills, dual accent glow, orbital rings.

## 4. Services screenshots — `smart-menu.jpg` / `smart-bot.jpg`
Existing. Replace with fresh retina captures after next deploy.

> **r131 (A3 D10 / F9b):** zero `src/` consumers — these two JPGs are NOT
> rendered anywhere in the app (verified by grep). They survive only as
> (a) a live e2e fixture — `e2e/security-headers.spec.ts:60` fetches
> `/images/smart-menu.jpg` and expects 200 — and (b) this doc entry.
> Deleting them requires first dropping the e2e list entry (and this
> section); until that edit is sanctioned, they stay (r131 F9b ruling:
> deletion blocked by the live reference, kept + documented instead).

---

**To generate:** configure Fal.ai or OpenAI key in Settings > Media Providers, then request regeneration via this skill.
