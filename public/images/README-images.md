# Image Asset Disposition — SmartLink

r133 (A7 §4-6): sections 1–3 (hero-visual / feature-*.png placeholder
specs and the og-smartlink.svg "DONE" note) described assets that never
existed or were deleted in r9 — trimmed. What actually ships in
`public/` today: the two logo wordmark PNGs, favicon/apple-touch/icon
icons (incl. the r133 maskable-192), `og-smartlink.jpg`, the 10 woff2
fonts, `sw.js` and this note. This directory (`public/images/`) is empty
of binaries on purpose.

## r132 deletion history (kept — the accurate part of the old doc)

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
