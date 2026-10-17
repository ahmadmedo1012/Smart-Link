# P19-A — Route/Interaction Matrix (Smart-Link marketing hub)

- **Task**: P19-A (Pod A — Smart-Link specialist, Phase 19)
- **Repo HEAD audited**: `main @ ac10c7e` (+ this session's SmartBot-card truth fix, local commit)
- **Method**: static source read of every route file under `src/app/` + live browser verification (dev server on `:3120`, production build on `:3121`) via `agent-browser` (named session `p19a`), + live production DOM checks on https://smart-link.ly, + the repo's e2e suite (lcp-guard + faq specs re-run locally; CLS gate re-run 4×).
- **Sitemap scope**: this repo is the marketing hub of the ecosystem. **Zero authenticated routes** — authentication lives inside the three product subdomains (menu / bot / order .smart-link.ly), each with its own login + dashboards. All routes below are public.

## Legend

- **V** = verified live in a real browser this session (dev build `:3120` and/or production build `:3121`).
- **CI** = covered by the repo's Playwright battery which is green at HEAD (CI run 91 @ `ac10c7e`, `SUCCESS`).
- **PASS** = observed behavior matches the documented contract.

## Page routes

| # | Route | Purpose | Key interactive controls | Observed behavior (evidence) | Verdict | Required repair |
|---|-------|---------|--------------------------|------------------------------|---------|-----------------|
| 1 | `/` | Landing — KODE art direction (r160/P12-2a) | skip link → `#main`; sticky `LandingHeader` (scroll-spy chapter nav, `[ 00n ]` section counter, theme toggle with SSR 44×44 slot, burger on mobile); hero: drag-rotatable `ChainSculpture` (three.js, DPR-capped, IO/visibility-paused), `MagneticGoldLink` CTA (external → menu.smart-link.ly), «اكتشف العوالم» anchor, scroll cue; marquee (decorative, aria-hidden); worlds cards ×3 (live product links); journey/sentence/cockpit/platforms sections; finale CTA; FAQ `<details>` accordion (6 Q&As, zero JS); landing footer; grain veil | h1 3-line lockup paints server-side (LCP doctrine); canvas mounts with WebGL2 (1440×997) and animates; FAQ toggle verified: `details[open]` flips + answer visible; theme toggle flips `html.dark↔html.light` (bg `#050507↔#F4F2ED`); scrollWidth 390=390 / 1440=1440 (zero horizontal overflow); console: zero errors (dev-mode React/HMR artifacts only, no page errors) | **PASS (V+CI)** | none |
| 2 | `/pricing` | Pricing — free-tier ecosystem cards + LIVE per-product ladders + FAQ | 3 plan cards (external «ابدأ الآن» CTAs → product subdomains, `aria-label` external-link convention); 3 ecosystem mini-tables (formatLyd amounts, per-product «تفاصيل الخطط» external links); `FaqAccordion` client island (first open by default, one-open-at-a-time, `aria-expanded`/`aria-controls`); SiteChrome nav + burger + theme toggle | 3 plan cards + 3 ecosystem tables render; accordion: click Q2 → Q2 opens, Q0 closes (verified twice); burger opens 8-link menu + body scroll-lock (`position:fixed`); Esc closes menu; theme toggle works; **FAQ wording = live-truth** («متاحة الآن/اليوم… من 19 د.ل») — no قريباً/قادمة anywhere in the DOM; scrollWidth 1440=1440, 390=390; lcp-guard + faq e2e specs pass vs production build | **PASS (V+CI)** | ✅ fixed this session (see Defects) |
| 3 | `/about` | About — story, values, founder | 4 value cards (hover border-shift); founder card; CountUp stat «3 منتجات حيّة»; «تواصل معنا» CTA → `/contact`; reveal-on-scroll (RevealObserver) | h1 «عن SmartLink» server-rendered; 1 stat cell, 4 contact CTAs; no overflow at 390 | **PASS (V+CI)** | none |
| 4 | `/contact` | Contact — form + channels | `ContactForm` client island: name/email/phone(optional, Libyan-normalized)/subject select/message + hidden honeypot `company`; per-field Arabic validation (`aria-invalid` + `aria-describedby`), first-invalid focus, `role="status"` success region; 4 info cards (mailto, prefilled `wa.me` opener, location, hours) | empty submit → 3 field errors («الاسم مطلوب»…) + focus lands on `#name`; form fields = company/name/email/phone/subject/message/submit; 4 keyline cards; no overflow | **PASS (V+CI)** | none |
| 5 | `/privacy` | Privacy policy (noindex-follow? no — indexable, canonical) | TOC nav (11 section anchors); back-to-top; SiteChrome | title + 25 nav links render; breadcrumb JSON-LD present; no overflow | **PASS (V+CI)** | none |
| 6 | `/terms` | Terms of use | TOC nav (10 section anchors); back-to-top; SiteChrome | title + 24 nav links render; no overflow | **PASS (V+CI)** | none |
| 7 | `/offline` | SW-served offline tool page (noindex,nofollow) | WhatsApp CTA (prefilled opener); no nav needed offline | direct visit renders title + h1 + WhatsApp display; served from SW cache when offline (e2e/offline.spec.ts covers the real SW path in CI) | **PASS (V+CI)** | none |
| 8 | `*` (catch-all → `not-found.tsx`) | 404 | «العودة للرئيسية» + «تواصل معنا» CTAs; noindex, custom OG (no inherited home card/canonical) | `/this-route-does-not-exist` → 404 page with h2 + both CTAs; title «الصفحة غير موجودة \| SmartLink» | **PASS (V+CI)** | none |

## API routes

| # | Route | Purpose | Contract highlights | Observed behavior (curl + form) | Verdict |
|---|-------|---------|---------------------|----------------------------------|---------|
| 9 | `POST /api/contact` | Contact form → Resend dual email (owner notification + sender confirmation) | shared validation module (`lib/contact-rules`); honeypot → byte-identical fake 200; in-memory rate limit (IP 5/min + global 20/min, env-tunable cap+map); 64 KB char-capped body read before parse; XSS sanitize `<>`; fail-loud 503 when `RESEND_API_KEY` absent | GET → **405**; POST valid w/o key (dev) → **503** fail-loud with WhatsApp fallback; POST bad email → **400** `{"field":"email"}`; honeypot → fake **200** identical shape | **PASS (V+CI — api-contact-* specs)** |

## Metadata routes / boundaries

| # | Route | Purpose | Observed | Verdict |
|---|-------|---------|----------|---------|
| 10 | `/robots.txt` | crawl policy | `Allow / · Disallow /api/ · Sitemap` served | **PASS (V)** |
| 11 | `/sitemap.xml` | 6 URLs, content-dated lastmod | served; home/pricing stamped at request time, legal/about/contact from `content-dates.ts` | **PASS (V)** |
| 12 | `/manifest.webmanifest` | PWA manifest | 200 `application/manifest+json` | **PASS (V)** |
| 13 | `error.tsx` (segment boundary) | 500 fallback per segment | not deliberately triggered this session (would require injecting a render failure); contract (reset button, focus-to-h1, console.error digest) code-read + covered by design history; pinned families in parity | **PASS (code-read)** |
| 14 | `global-error.tsx` (root boundary) | catastrophic client failure | inline-styled values-only boundary (no CSS bundle), 44/13/600/r10 canon, plain `<a>` hard reload; code-read | **PASS (code-read)** |

## Verification evidence (this session)

- Dev server (`next dev :3120`) + production build (`next build` + `next start :3121`); agent-browser named session `p19a`.
- **Overflow sweep @390×844**: `/`, `/pricing`, `/contact`, `/about`, `/privacy`, `/terms`, `/offline`, 404 → `scrollWidth 390` on all 8 (zero horizontal overflow). Same at 1440×900.
- **Console**: zero page errors; console shows only dev-mode artifacts (React DevTools eval warning under production CSP — dev-only, React never uses eval in production; HMR; Vercel Analytics debug).
- **e2e re-runs (production build :3121)**: `lcp-guard.spec.ts` 8/8 PASS (includes the re-anchored SmartBot card pin); `faq.spec.ts` 3/3 PASS (incl. the P14-P0B truth regression: no future-tense paid-plan wording, «متاحة اليوم» positively present); `sim-devices.spec.ts -g "CLS"` 2/2 PASS × 3 consecutive runs. One earlier parallel-load run had 2 flakes + 2 crash-retries (documented sandbox memory-contention class — the repo's own config notes it and exposes `E2E_WORKERS`); every flake passed on immediate re-run, zero product failures.
- **CLS local (production build, buffered PerformanceObserver)**: `/` = 0.0026, `/pricing` = 0.00002 — both far under the 0.02 gate; **no threshold touched**.

## Defects found & fixed this session

| Defect | Evidence | Fix |
|--------|----------|-----|
| **SmartBot FREE-tier card listed marketing bullets not backed by the plan's catalog** (and omitted the real limits) — while the Menu/Order cards on the same page follow the page's own documented «features from the plan's own catalog» law | Hub card (`src/app/pricing/page.tsx:98-105` pre-fix) said: «ردود تلقائية ذكية / تصنيف النوايا الأساسي / لوحة تحكم متكاملة / تقارير أساسية / إدارة صفحة واحدة / دعم فني عبر البريد». Live catalog (bot.smart-link.ly/api/plans id=1, and bot's own /pricing free card) says: «ردود تلقائية (100/شهر) / صفحة فيسبوك واحدة / 5 قواعد رد / إحصاءات أساسية» — 3 bullets unsourced, the 100-replies/month and 5-rules limits missing | `src/app/pricing/page.tsx:98-113` — card now mirrors the live catalog verbatim (4 bullets) + sourcing comment; `e2e/lcp-guard.spec.ts:78` pin re-anchored (value only — the logic «a core feature of each plan must be server-rendered» is unchanged). Verified rendering in dev + production builds; lcp-guard 8/8 green |

## Data-truth check (marketing claims vs live pricing sources)

| Claim (Smart-Link surface) | Live source of truth | Agreement |
|---|---|---|
| Ecosystem ladders — SmartBot: مجاني 0 / أساسي 19 / مميز 29 / احترافي 129 / مؤسسي 299 («د.ل / شهريًا») | `bot.smart-link.ly/api/plans` (queried 2026-10-17): same names/prices, period_days 30 | ✅ exact |
| Ecosystem ladders — Smart Menu: مجاني 0 / أساسي 19 / بريميوم 29 / احترافي 129 / شركات 299 («د.ل / 30 يومًا») | `menu.smart-link.ly/api/plans` + live `/pricing` DOM: same | ✅ exact |
| Ecosystem ladders — Smart Order: مجاني 0 / أساسي 19 / بريميوم 29 / احترافي 129 («د.ل / شهريًا») | `order.smart-link.ly/api/plans`: same (periodDays 30) | ✅ exact |
| Homepage FAQ «الباقات المدفوعة … متاحة اليوم … تنطلق من 19 د.ل شهرياً» | lowest paid tier = 19 on all three products (live APIs) | ✅ |
| Homepage FAQ «البدء مجاناً … بدون بطاقة ائتمان» | free tier at 0 د.ل on all three | ✅ |
| /pricing FAQ «باقة بريميوم في Smart Order تتيح 3 أعضاء واحترافيًا فريقًا غير محدود» | SO Premium features «حسابات فريق (3 أعضاء)», Pro «فريق غير محدود» | ✅ |
| /pricing FAQ «خطة Smart Menu المجانية تتيح منيوًا واحدًا بعشرة أصناف و100 طلب شهريًا» | SM Free maxMenus 1 / maxItems 10 / maxOrders 100 | ✅ |
| Smart Order free card «15 منتجاً و3 أقسام / 100 طلب شهرياً / منطقة توصيل واحدة / طرق دفع محلية» | SO Free maxProducts 15 / maxOrders 100 + features | ✅ |
| Smart Menu free card «منيو واحد و10 أصناف / 100 طلب شهريًا / طلبات عبر واتساب / إحصائيات أساسية» | SM Free catalog + limits | ✅ |
| SmartBot free card (pre-fix) — **discrepancy** | see Defects above | ❌ → **fixed** |
| Cockpit «أقل باقة SmartBot مدفوعة 19 د.ل شهرياً» | bot أساسي 19 | ✅ |

**FAQ «قريباً / launch soon» finding — verdict: NOT obsolete in source (already fixed by prior waves; verified not stale):**
- Source: `src/components/landing/LandingFaq.tsx:31` — «الباقات المدفوعة … **متاحة اليوم** بالدينار الليبي وتنطلق من 19 د.ل شهرياً». /pricing FAQ (`pricing/page.tsx:189`) — «متاحة **الآن**».
- Live production DOM (https://smart-link.ly, checked 2026-10-17): identical fixed wording — **the live site does not contain the «قريباً» paid-plan wording**. Any search-index snippet still showing it is a stale crawler cache, not the served site (re-indexing is a Search Console action for the coordinator, not a code change).
- Regression guards already in repo (all green this session): `tests/truth-gate.mjs` (walks ALL of `src/` for 8 banned claim shapes, CI step «Paid-plans truth gate (P14-P0B)»), `e2e/faq.spec.ts:67-85` (renders: no future tense in the free answer + «متاحة اليوم» positively required), `tests/parity.mjs:2549` (source: old wording string must be absent).
- The only remaining «قريباً» strings in `src/` are: `contact-rules.ts:61` («سنتواصل معك قريباً» — contact auto-reply, not a plan claim) and historical code comments documenting the fixes — both deliberately outside the truth-gate ban scope.

## Residuals (documented, deliberately not touched — bounded-diff discipline)

- `src/app/styles.css:1423-1429` — `.ln-card--dashed` dead CSS (last consumer was the retired P13-2a coming-soon card). Removal deferred (unpinned, cosmetic).
- `src/app/about/page.tsx:186-187` — «خدمات قادمة تطمح…» vision phrasing: future-intent statement, not a present-tense commercial claim; the truth-gate's documented scope decision allows intent phrasing.
- `src/lib/schema.ts:218` — «مجانية للأبد» (Smart Order offer description): family convention (bot's own live /pricing free card says «مجاني للأبد، بدون حدود زمنية»); free tier is live at 0 د.ل. Kept.
- Marquee keeps «ردود تلقائية ذكية» as a **product-level** capability claim (homepage vocabulary — true across the product: Basic+ carries AI replies); distinct from the free-plan card that this session re-truthed.

## Gates (at commit)

| Gate | Result |
|------|--------|
| `npx tsc --noEmit` | 0 errors |
| `npm run lint` (eslint) | 0 errors / 0 warnings |
| `node tests/parity.mjs` | 567/567 assertions |
| `node tests/truth-gate.mjs` | 54 files, zero banned claims |
| `npm run build` | ✅ (8 static pages + API route) |
| `npx playwright test e2e/lcp-guard.spec.ts e2e/faq.spec.ts` (:3121 prod build) | 11/11 PASS (1 documented sandbox flake retried clean) |
| `npx playwright test e2e/sim-devices.spec.ts -g "CLS"` (:3121) | 2/2 PASS × 3 consecutive runs — **gate intact, no threshold change** |
| CI (GitHub Actions, run 91 @ `ac10c7e`) | **SUCCESS** — lint + parity + truth-gate + build + FULL e2e incl. CLS |
| vitest | not configured in this repo (no vitest dep/script) — N/A |

*Servers used this session: dev `:3120` (this session), production build `:3121` (this session, killed after gates). The leftover `:3111` production server (pre-`ac10c7e` build) was left untouched.*
