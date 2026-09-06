# SmartLink

Next.js 16 App Router, RTL Arabic, Tailwind CSS v4.

## Key points
- RTL (`dir="rtl"`), Cairo (body) + **Readex Pro first for headings** (`--font-heading`), both via `next/font/google` with CSS variables
- Brand primary `oklch(0.55 0.19 45)` — **byte-identical to Smart-Menu & SmartBot** (light mode: `oklch(0.40 0.19 45)` dual-lightness for AA)
- `--accent` = `oklch(0.55 0.19 45 / 0.15)` dark, `/ 0.12` light (Smart-Menu parity)
- Dark/light theme via next-themes
- **Architecture (round 8): hero, footer, services, showcase, features, how-it-works, CTA are all Server Components** — entrance motion is CSS (`reveal-up` keyframes + scroll-driven `animation-timeline: view()`), **framer-motion is NOT a dependency at all** (removed from package.json in r5; `lib/motion.ts` deleted). Client islands (complete list): contact form, FAQ accordion (CSS grid-rows, shared by home + pricing), GenArtBackground (seeded SVG, 3 variants: bands/blobs/rings), main-nav, **hero stats (hero-stat.tsx — SSRs the FINAL values, counts up on scroll-in; LCP must never wait on hydration)**, **back-to-top (back-to-top.tsx)**, theme-provider, error pages. `sonner`/Toaster also removed in r5 (was mounted with zero `toast()` callers). PageTransition and the JS scroll-progress were removed in r8 (View Transitions + CSS `scroll(root)` timeline took over).
- Pages: `/`, `/about`, `/contact`, `/pricing`, `/privacy`, `/terms` (+ `error.tsx`, `global-error.tsx`, `not-found.tsx`) — **metadata via `pageMetadata()` from `src/lib/seo.ts` (MANDATORY for new pages)**: Next.js merges `openGraph` shallowly, so a hand-written partial `openGraph` silently drops og:image/site_name/locale (r6 found all 5 subpages sharing link cards with NO preview image). The helper stamps the full OG/Twitter shape + canonical
- API: `POST /api/contact` — sends real email via Resend (notification + auto-reply); returns 503 (fail-loud, never fake success) when `RESEND_API_KEY` missing. Sanitizes unknown input types at the boundary (missing `subject` must not 500)
- Motion language lives in CSS tokens (`--move-base`, `--ease-spring`, keyframes in `globals.css`) — matches Smart-Menu/SmartBot curves
- Icons from lucide-react
- No database — email only (Resend, free tier)
- **One accordion implementation** (`.acc` grid-rows in `faq-accordion.tsx`) and **one seeded-SVG generator** (`gen-art-background.tsx`) — never hand-roll a copy in a page (r6 removed two duplicates: a fixed-maxHeight variant that clipped long answers, and a 50-line inline GenArt copy)

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

## Testing guardrails (r7 — do not regress)
- E2E suite lives in `e2e/` (Playwright + axe-core, 66 tests after r8): run `npm run build && npm run test:e2e` — all 66 must pass; CI (`.github/workflows/ci.yml`) enforces this on every push to main
- **Every new page/route must get a PAGES entry in `e2e/fixtures.ts`** (smoke + SEO + axe scan in both themes come free from the loop) — plus a JSON-LD check if it emits structured data
- Every behavioral fix becomes a regression test (existing ones: back-to-top visibility logic, counters +K/decimals, FAQ un-clipped answers, JSON-LD email, og:image on subpages, rate-limit 429, honeypot, fail-loud 503, **SSR'd final stat values in raw HTML — the r8 LCP fix**)
- axe must report **zero WCAG 2 AA violations in BOTH dark and light themes** — theme toggling is part of the scan loop
- The contact UI test fulfills `**/api/contact` with a mocked 503 (network-level) to stay independent of the in-memory rate limiter; the real backend contract is covered by the direct API tests in the same file — keep that layering
- UI labels that change with state (e.g. burger `فتح القائمة` → `إغلاق القائمة`) must be located with a regex matching BOTH states
- `playwright.config.ts` webServer runs `next start` — never point tests at `next dev`

## Performance guardrails — r8 additions (do not regress)
- **Font loading: Readex Pro (heading/LCP font) stays preloaded; Cairo (body font) is `preload: false`** — the body font must never compete with the LCP preload window. If you swap font roles, re-check the preload split
- **Stat/counters SSR their FINAL values** — `useState(value)`, not `useState("0")`. Anything whose text is an LCP candidate must be complete in the server HTML (raw-HTML test enforces this)
- CSS scroll-driven animations: named view-timelines must declare an explicit `animation-range` — the default `cover` range puts a resting element at ~50% progress (the r8 hero-parallax contrast bug: opacity 0.75 at rest). `exit 0% cover 100%` matches "advance only while scrolling out"
- Decorative blurs stay ≤ ~90px radius and ≤ 6 elements per page — giant blurs (120–180px) were a measured raster cost on mobile
- `@keyframes` are load-bearing: before deleting a CSS block, grep both the class AND every keyframe it references (26 dead keyframes were removed in r8; five of them — float/drift/line-draw/shimmer/shine — had been silently superseded by compound names like `float-icon`)
