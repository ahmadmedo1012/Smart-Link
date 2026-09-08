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

## r11 additions (deepest round — simulation army + live claims verification)

- **E2E suite is now 255 tests** (+115 user-simulation from r11): `e2e/sim-{journeys,adversarial,devices,modes}.spec.ts`. Simulation specs follow the gstack qa-patterns discipline: **user-perceivable selectors only (getByRole/getByLabel) — never read `src/**` for selectors**; a control that can't be located by role/label is itself a FINDING.
- **Global console gate (F-G8)**: `e2e/fixtures.ts` enforces zero console/pageerror in EVERY test's teardown. Intentional network noise (404/503/429/net::ERR_* from tests that deliberately trigger it) must be declared with `allowResourceNoise(consoleErrors, /pattern/)` — never by filtering at the assertion. The `allow` property on the errors array is NON-ENUMERABLE on purpose (an enumerable one breaks `expect(errors).toEqual([])` with "serializes to the same string").
- **The contact success contract is strict two-sided (r11)**: the client requires `res.ok && json.success === true && typeof json.message === "string"` — mocks must mirror the REAL API shape (`{success, message}`), not just `{success}`.
- **The services dropdown follows the disclosure pattern (r11)**: focus does NOT auto-open (the old onFocus/onBlur pair unmounted the menu mid-focus-move and dropped focus to body — a dead Tab stop); Enter/Space/click toggle; `onBlur` closes only when `relatedTarget` is outside the container; Escape closes and refocuses the trigger. Same for the mobile menu Escape → focus returns to the burger.
- **CSS file is `src/app/styles.css` (renamed from globals.css in r11)** — the rename is load-bearing: a Vercel Turbopack build-cache bug served a STALE compiled CSS (new HTML + old CSS, 137 bytes missing) despite correct source. A new file path has no cache entry in any layer. **If a CSS change ever goes "missing" live: byte-compare live vs local CSS size first, then rename/move the file — redeploying does NOT fix it.**
- **`@media (scripting: none)` opens all `.acc` panels without JS** (FAQ readable for no-JS users). Do NOT wrap `.acc` behavior in JS-only assumptions.
- **Live simulation runs** use `e2e/playwright.live.config.ts` (no webServer, baseURL = production): `npx playwright test sim-journeys sim-devices sim-modes --config e2e/playwright.live.config.ts --workers=2`. Real-POST adversarial tests are excluded on live on purpose (one shared rate-limit bucket per IP).
- **Screenshot tests write to `SIM_SHOTS_DIR` (default `test-results/sim-shots`)** — never to absolute paths (CI ENOENT).
- **`typedRoutes: true`** — internal `Link href`s are build-time verified; type link arrays with `import("next").Route` (plain inference widens to `string` and fails the build).
- **Max-length contract on the form (r11)**: inputs carry `maxLength={NAME_MAX/EMAIL_MAX/MESSAGE_MAX}` from `lib/contact-rules` — pasted overflow is clipped at the field (standard HTML UX); the server still enforces the caps for direct API callers. Tests assert the CLIPPING, not a late rejection.

## r12 additions (supply-chain round)

- **Deps**: react/react-dom 19.2.8, lucide-react 1.43, eslint-config-next 16.3.4, tailwind 4.3.3, @types/node 26, GitHub Actions v7. **ESLint 10 and TypeScript 7 are BLOCKED UPSTREAM** (eslint-config-next's bundled eslint-plugin-react uses a removed API in 10; bundled typescript-eslint hard-rejects TS 7 — while `tsc --noEmit` itself passes on TS 7 in ~1s). Do NOT retry these bumps until eslint-config-next updates its chain; the peer ranges alone (`eslint >=9`, `typescript >=3.3`) are NOT proof of compatibility.
- **Regression forensics before re-measuring (r12 lesson)**: when a dependency bump is suspected of a perf regression, first byte-compare the framework production builds (e.g. `react-dom/cjs/react-dom-client.production.js` — 19.2.4 vs 19.2.8 were the same 536,016 bytes with a 20-line diff) and grep the dominant live JS chunk for library markers (lucide count was 0). Both checks are minute-cheap and killed a false "regression" hypothesis in r12 without trusting a noisy Lighthouse re-run.
- **no-JS tests and the console gate**: Chromium itself logs `InvalidStateError: ViewTransition opt-in disabled` on no-JS navigations (site CSS requests view-transitions; the machinery is disabled with JS). The no-JS describe block declares this via `allowResourceNoise` — browser-internal noise is environment, not site code; everything else stays fatal.
- **Journey-test timeouts**: sim-journey visibility assertions use generous `{ timeout: 15_000 }` — user journeys are measured by experience, not milliseconds; the shared machine has documented load spikes to 7+.
- **CI runs Playwright's chromium-headless-shell**; after any `npm install` that moves @playwright/test, run `npx playwright install chromium` before E2E (missing-browser failures look like test failures, not setup failures).
