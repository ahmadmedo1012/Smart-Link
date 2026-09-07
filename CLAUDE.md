# SmartLink

Next.js 16 App Router, RTL Arabic, Tailwind CSS v4.

## Key points
- RTL (`dir="rtl"`), Cairo (body) + **Readex Pro first for headings** (`--font-heading`), both via `next/font/google` with CSS variables
- Brand primary `oklch(0.55 0.19 45)` — **byte-identical to Smart-Menu & SmartBot** (light mode: `oklch(0.40 0.19 45)` dual-lightness for AA)
- `--accent` = `oklch(0.55 0.19 45 / 0.15)` dark, `/ 0.12` light (Smart-Menu parity)
- Dark/light theme via next-themes
- **Architecture (round 9): hero, footer, services, showcase, features, how-it-works, CTA, the contact page itself and GenArtBackground are all Server Components** — entrance motion is CSS (`reveal-up` keyframes + scroll-driven `animation-timeline: view()`), **framer-motion is NOT a dependency at all** (removed from package.json in r5; `lib/motion.ts` deleted). Client islands (complete list): **contact-form.tsx (r9: only the form hydrates — the page around it is static)**, FAQ accordion (CSS grid-rows, shared by home + pricing), main-nav, **hero stats (hero-stat.tsx — SSRs the FINAL values, counts up on scroll-in; LCP must never wait on hydration)**, **back-to-top (back-to-top.tsx)**, theme-provider, error pages. `sonner`/Toaster removed in r5; PageTransition and the JS scroll-progress removed in r8 (View Transitions + CSS `scroll(root)` timeline took over). **GenArtBackground became a server component in r9** (deterministic seeded RNG — its SVG is baked into static HTML; do NOT re-add `"use client"`).
- Pages: `/`, `/about`, `/contact`, `/pricing`, `/privacy`, `/terms` (+ `error.tsx`, `global-error.tsx`, `not-found.tsx`) — **metadata via `pageMetadata()` from `src/lib/seo.ts` (MANDATORY for new pages)**: Next.js merges `openGraph` shallowly, so a hand-written partial `openGraph` silently drops og:image/site_name/locale (r6 found all 5 subpages sharing link cards with NO preview image). The helper stamps the full OG/Twitter shape + canonical
- **Business constants live in `src/lib/site.ts` ONLY (r9)**: WhatsApp number/URL/display, owner email, product URLs/labels, socials, support hours. The number used to appear in 11 files with 3 different display formats. Never hardcode these again — import SITE. The WhatsApp display string renders inside `dir="ltr"` so the "+" never rides the bidi reversal.
- **JSON-LD lives in `src/lib/schema.ts` (r9)**: organization (+LocalBusiness), website and the two Service entities carry stable `@id`s and cross-reference each other. **AggregateRating is deliberately absent** — Google policy forbids it without visible on-page reviews; adding it invites a manual action.
- API: `POST /api/contact` — sends real email via Resend (notification + auto-reply); returns 503 (fail-loud, never fake success) when `RESEND_API_KEY` missing. Sanitizes unknown input types at the boundary (missing `subject` must not 500). **r9: malformed JSON body → 400 (not 500); email capped at 254 (RFC 5321); the email FIELD error is mapped by exact string match — "خدمة البريد غير مهيأة" is a 503 about the service and must stay a general alert**
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
- No new toast library — the contact form owns its inline error/success UI
- **Shadow utilities are generated from `@theme --shadow-*` entries (r9)** — a `--shadow-foo` variable in `:root` generates NOTHING in Tailwind v4 (the r9 audit found `shadow-glow` on 4 call sites rendering no shadow at all for the site's entire life). Runtime values live in `--t-*` vars (distinct names — a theme entry cannot reference its own name) so they switch per light/dark. Never write `shadow-[0_0_60px_var(--shadow-glow)]` (invalid embedded shadow) — use the generated `shadow-glow-strong`.
- **LCP elements (h1 + intro of every page) carry NO reveal animation (r9 generalization of r8)** — the eyebrow badge keeps `reveal-d1` for the cascade. `e2e/lcp-guard.spec.ts` enforces the raw HTML.
- `next.config.ts` carries a static CSP — if you add a third-party script/host (analytics, fonts, images), allow-list it in the CSP `script-src`/`connect-src`/`img-src` or it will be blocked. The two Unsplash hosts were REMOVED in r9 (zero remote images — keep the surface minimal).
- Above-the-fold content must render pre-JS (CSS reveal, never `initial={{opacity:0}}` wrappers)
- `next/image` for all raster content images
- Legal pages (privacy/terms) must stay pure Server Components
- **`mr-*`/`ml-*` physical spacing works only because the site is RTL-only** — prefer logical `ms-*`/`me-*` for any new code

## Testing guardrails (r7/r9 — do not regress)
- E2E suite lives in `e2e/` (Playwright + axe-core, **108 tests after r9**): run `npm run build && npm run test:e2e` — all must pass; CI (`.github/workflows/ci.yml`) enforces this on every push to main. **On a re-used dev server, kill it first** — the in-memory API rate limiter bleeds between runs (a stale server turned the 503 test into 429).
- **Every new page/route must get a PAGES entry in `e2e/fixtures.ts`** (smoke + SEO + axe scan in both themes + mobile viewport come free from the loop) — plus a JSON-LD check if it emits structured data
- Every behavioral fix becomes a regression test. r9 highlights: **LCP raw-HTML guard (`lcp-guard.spec.ts`), the contact SUCCESS path (`contact-success.spec.ts` — was failure-only), per-field Arabic errors with aria-describedby, API edges (malformed JSON → 400, 254/100/5000 caps, subject type coercion), pricing server content, reduced-motion, mobile-viewport axe, footer contract, no-JS resilience**
- **Live API tests that consume the rate-limited POST must send an isolated `x-forwarded-for` IP** (see `contact-success.spec.ts`) — otherwise they eat the shared budget of `contact.spec.ts` and flip its 503 test to 429
- axe must report **zero WCAG 2 AA violations in BOTH dark and light themes AND at 375×812 mobile** — theme toggling and the mobile viewport are part of the scan loops
- The contact UI test fulfills `**/api/contact` with a mocked 503 (network-level) to stay independent of the in-memory rate limiter; the real backend contract is covered by the direct API tests — keep that layering
- UI labels that change with state (e.g. burger `فتح القائمة` → `إغلاق القائمة`) must be located with a regex matching BOTH states
- `playwright.config.ts` webServer runs `next start` — never point tests at `next dev`

## Performance guardrails — r8 additions (do not regress)
- **Font loading (r8 final A/B): BOTH Cairo and Readex Pro are `preload: true`** — with LCP elements painting instantly (no reveal), preloads are pure win: LCP lands at max(FCP, font arrival). The measured decision lives in `layout.tsx`; re-run the A/B before changing either.
- **Stat/counters SSR their FINAL values** — `useState(value)`, not `useState("0")`. Anything whose text is an LCP candidate must be complete in the server HTML (raw-HTML test enforces this)
- CSS scroll-driven animations: named view-timelines must declare an explicit `animation-range` — the default `cover` range puts a resting element at ~50% progress (the r8 hero-parallax contrast bug: opacity 0.75 at rest). `exit 0% cover 100%` matches "advance only while scrolling out". **`.reveal-scroll-stagger > *` carries a default range for children beyond nth-child(6)** (r9 — the same bug class, one list-growth away).
- Decorative blurs stay ≤ ~90px radius and ≤ 6 elements per page — giant blurs (120–180px) were a measured raster cost on mobile (the r9 audit caught the 404 page still at 150px; fixed)
- `@keyframes` are load-bearing: before deleting a CSS block, grep both the class AND every keyframe it references (26 dead keyframes were removed in r8; five of them — float/drift/line-draw/shimmer/shine — had been silently superseded by compound names like `float-icon`)
- **The universal reduced-motion kill-switch includes `::view-transition-*`** (r9) and JS `scrollTo` must consult `matchMedia("(prefers-reduced-motion)")` before using `behavior: "smooth"`
