# P20-A1 — Route/Interaction Matrix (Smart-Link marketing hub)

- **Task**: P20-A1 (Pod A — Smart-Link specialist, Phase 20 Wave 1)
- **Repo HEAD audited**: `main @ f8e8210` (full clone, tree clean) + this
  session's local commit (see worklog).
- **Method**: static source read of every route under `src/app/` + live
  production browser verification on https://smart-link.ly (agent-browser
  session `p20a1`, 1440×900 + 390×844, full-scroll reveal sweep, DOM-metric
  measurements, pixel-level ink analysis) + this session's local e2e re-runs.
- **Scope truth (unchanged since P19)**: the marketing hub has **zero
  authenticated routes** — auth lives in the three product subdomains
  (menu / bot / order .smart-link.ly). All routes below are public.

## Legend
- **V** = verified live in a real browser this session (production site or
  local production/dev build).
- **CI** = covered by the repo's Playwright battery (CI green at f8e8210,
  1/1 checks — P19-FINAL-RECON).
- **PASS** = observed behavior matches the documented contract.

## Page routes

| # | Route | Access | Purpose | Status at f8e8210 (this session's evidence) | Required work | Verification |
|---|-------|--------|---------|---------------------------------------------|---------------|--------------|
| 1 | `/` | public | Landing — KODE art direction (r160/P12-2a): 3-line Kufi lockup hero + drag-rotatable ChainSculpture + orange-flood chapters + mono status chrome + grain veil | **2 CONFIRMED DEFECTS**: (a) lockup line-height 0.92 collides Kufi ink — measured 1px min distance between `ع` descender («عملٍ») and `ر` bowl («رابطًا») at 1440 dark, ink-box overlap 100px (canvas metrics + pixel adjacency + 3× VLM crop all agree); (b) the designed 3-line lockup ragged-wraps to 5–6 lines with a mid-word orphaned `أ` at 390 (Range rects: 2/2/3 line-boxes; fs 56px clamp-min > the 335px measure), and to 1/2/3 lines at 768–1000. Rest of page CLEAN: zero console errors, scrollWidth 1440=1440 & 390=390, generic text-overlap detector finds ONLY the hero title pair, theme toggle flips dark↔light (bg #050507↔#F4F2ED, em ink #FF4C00↔#B23E00) and back, persistence intact | **FIXED this session**: lh 0.92→0.97 + budget divisor 2.76→2.91; lockup nowrap + `min-inline-size:0` + `min(var(--ln-h1), 12.6vw)` viewport-fit below 1025px | PASS after fix (V @1440+390, dev :3101, both stages; e2e sim-devices/lcp-guard/western-digits subset) |
| 2 | `/pricing` | public | Free-tier ecosystem cards + live per-product LYD ladders + FAQ | PASS: catalog-truth bullets live (SmartBot card mirrors bot /api/plans: «ردود تلقائية (100/شهر) · صفحة فيسبوك واحدة · 5 قواعد رد · إحصاءات أساسية» — verified in production DOM this session); 3 cards equal 363×543 @1440; zero overflow at 1440 & 390 (scrollW=vw); no pricing-truth defect found | none | PASS (V + CI) |
| 3 | `/about` | public | Story, values, founder | PASS (P19 matrix carries detailed evidence; no changes this session) | none | PASS (CI) |
| 4 | `/contact` | public | Contact form + channels | PASS: form fields verified at 1440 (name 298 / email 298 / phone 612 / message 612 / submit 612 px wide — 2-col grid then full rows); zero overflow at 390 | none | PASS (V + CI) |
| 5 | `/privacy` | public | Privacy policy | PASS (P19 evidence) | none | PASS (CI) |
| 6 | `/terms` | public | Terms of use | PASS (P19 evidence) | none | PASS (CI) |
| 7 | `/offline` | public (noindex) | SW-served offline tool page | PASS (P19 evidence; offline.spec covers the SW path) | none | PASS (CI) |
| 8 | `*` → `not-found.tsx` | public | 404 | PASS (P19 evidence; metadata contract pinned by seo spec) | none | PASS (CI) |

## API routes

| # | Route | Access | Purpose | Status | Required work | Verification |
|---|-------|--------|---------|--------|---------------|--------------|
| 9 | `POST /api/contact` | public (rate-limited) | Contact form → Resend dual email | PASS (api-contact-boundaries + api-contact-methods specs; fail-loud 503 without RESEND_API_KEY, honeypot fake-200, per-field 400s) | none | PASS (CI) |

## Metadata routes / boundaries

| # | Route | Purpose | Status | Verification |
|---|-------|---------|--------|--------------|
| 10 | `/robots.txt` | crawl policy | PASS | CI (seo spec) |
| 11 | `/sitemap.xml` | 6 URLs | PASS | CI (seo spec) |
| 12 | `/manifest.webmanifest` | PWA manifest | PASS | CI (sim-devices icon checks) |
| 13 | `error.tsx` | segment 500 boundary | PASS (code-read: focus-to-h1, reset, fleet button canon; contrast-graded icon ink) | code-read + parity |
| 14 | `global-error.tsx` | root boundary | PASS (code-read: values-only inline styles, 44/13/600/r10 canon) | code-read + parity |

## e2e spec coverage (28 spec files, 319 tests, 567 parity assertions)

- **Landing craft/behavior**: `sim-devices` (burger/h1/CLS/fold), `sim-mobile-320`, `sim-adversarial`, `sim-journeys`, `sim-modes`, `sim-touch-targets`, `landing-theme` (toggle + canvas repaint + persistence), `western-digits`, `cta`, `navigation`, `faq`, `a11y` + `a11y-states`, `pages`, `r9-coverage`.
- **Contact/API**: `contact`, `contact-success`, `api-contact-boundaries`, `api-contact-methods`.
- **SEO/meta/security**: `seo`, `structured-data`, `security-headers`, `offline`, `lcp-guard` (h1/intro/plan-catalog pins), `r14-contract`.

## Session defect ledger (P20-A1)

| # | Defect | Evidence | Disposition |
|---|--------|----------|-------------|
| 1 | Hero lockup ink collision (lh 0.92 < Noto Kufi ink at display scale) | min pixel distance 1px (orange `ر`↔white `ع`) measured on text-only screenshot; canvas fontBoundingBox math: line ink boxes overlap 100px at 1440; VLM 3× crop: "direct collision" | **FIXED** — ratio 0.97 + budget divisor re-anchored (documented, value-only) |
| 2 | Hero lockup ragged wrap < 1025px (5–6 lines, mid-word orphan) | Range.getClientRects at 390: 2/2/3 boxes; fs 56 > measure 335px; VLM 2× crop: orphaned `أ` | **FIXED** — nowrap + min-inline-size:0 + 12.6vw viewport-fit scale |
| 3 | VLM-suggested "empty orange block", "dashboard rounded corners", footer collisions | DISPROVEN by DOM truth: SentenceBand = 3 poster sentences (72px, 99px gaps — consistent); full-page text-overlap detector: only the hero pair; cockpit/platforms/final/FAQ clean | **NOT defects** (hallucination class — documented, no change) |
