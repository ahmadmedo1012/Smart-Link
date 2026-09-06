# SmartLink

Next.js 16 App Router, RTL Arabic, Tailwind CSS v4.

## Key points
- RTL (`dir="rtl"`), Cairo (body) + **Readex Pro first for headings** (`--font-heading`), both via `next/font/google` with CSS variables
- Brand primary `oklch(0.55 0.19 45)` — **byte-identical to Smart-Menu & SmartBot** (light mode: `oklch(0.40 0.19 45)` dual-lightness for AA)
- `--accent` = `oklch(0.55 0.19 45 / 0.15)` dark, `/ 0.12` light (Smart-Menu parity)
- Dark/light theme via next-themes
- **Architecture (round 5): pages are Server Components** — entrance motion is CSS (`reveal-up` keyframes + scroll-driven `animation-timeline: view()`), **framer-motion is NOT a dependency at all** (removed from package.json in r5; `lib/motion.ts` deleted). Only client islands: contact form, FAQ accordion (CSS grid-rows), GenArtBackground (seeded SVG), main-nav, hero counters, scroll-progress. `sonner`/Toaster also removed in r5 (was mounted with zero `toast()` callers)
- Pages: `/`, `/about`, `/contact`, `/pricing`, `/privacy`, `/terms` (+ `error.tsx`, `global-error.tsx`, `not-found.tsx`) — each carries unique metadata + canonical
- API: `POST /api/contact` — sends real email via Resend (notification + auto-reply); returns 503 (fail-loud, never fake success) when `RESEND_API_KEY` missing. Sanitizes unknown input types at the boundary (missing `subject` must not 500)
- Motion language lives in CSS tokens (`--move-base`, `--ease-spring`, keyframes in `globals.css`) — matches Smart-Menu/SmartBot curves
- Icons from lucide-react
- No database — email only (Resend, free tier)

## Brand assets
- `public/og-smartlink.jpg` (1200×630 JPEG, ~24 KB) — OG/Twitter preview image (rendered from the `.svg` source; social crawlers don't support SVG)
- `public/manifest.webmanifest` + `icon-192.png`, `icon-512.png`, `icon-512-maskable.png` (PWA)
- `public/logo.png` (600×409, ~61 KB) — also referenced in JSON-LD `Organization.logo` as ImageObject
- `public/favicon-32.png` (32×32 real), `apple-touch-icon.png` (180×180)

## Performance guardrails (do not regress)
- No raw Tailwind palette colors (`amber/orange/purple/...`-NNN) — brand tokens only
- No `framer-motion` imports of any kind (type-only included — the dependency is gone; keep it that way)
- No new toast library — the contact page owns its inline error/success UI
- `next.config.ts` carries a static CSP — if you add a third-party script/host (analytics, fonts, images), allow-list it in the CSP `script-src`/`connect-src`/`img-src` or it will be blocked
- Above-the-fold content must render pre-JS (CSS reveal, never `initial={{opacity:0}}` wrappers)
- `next/image` for all raster content images
- Legal pages (privacy/terms) must stay pure Server Components
