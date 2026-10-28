# P30 — Route Inventory (canonical verification pass)

- **Task**: P30 §4 (four-product route-inventory deliverable)
- **Repo HEAD audited**: `main @ d9fd4e9` (post P30-C)
- **Method**: source scan of every route under `src/app/` + production HTTP probes on https://smart-link.ly (this session) + internal-link sweep (21 links across 6 key pages, 0 broken) + the repo's e2e battery (330/330 green at HEAD) + sitemap/robots reconciliation.
- **Delta since docs/p19-route-matrix.md**: + العوالم micro-row on `/` (P30-C — the §3.3 choice moment); no routes added/removed.

## Classification legend

Valid public (VP) · Intended alias/redirect (AR) · Intentional demo/fixture (DF) · Unreachable/broken (BK) · Duplicate content (DP) · Obsolete (OB)

## Page routes

| Route | Class | Auth | Prod status | P30 verification |
|---|---|---|---|---|
| `/` | VP | none | 200 | landing; hero CTAs: «ابدأ مجاناً» → menu.smart-link.ly (external, aria-honest), «اكتشف العوالم» → #products; **P30-C العوالم micro-row** (3 registry doors, 44px hit zones, Label-in-Name) verified in served HTML |
| `/about` | VP | none | 200 | story/values/founder — unchanged since P19 |
| `/contact` | VP | none | 200 | form + 4 channels — unchanged since P19 |
| `/pricing` | VP | none | 200 | 3 plan cards + 3 ecosystem ladders; per-product «ابدأ الآن» CTAs — the platform's product-choice surface (complements the P30-C hero row) |
| `/privacy` | VP | none | 200 | TOC + policy — unchanged |
| `/terms` | VP | none | 200 | TOC + policy — unchanged |
| `/offline` | VP (SW-served) | none | 200 | offline tool page; noindex; SW path covered by e2e/offline.spec.ts in CI |
| `/products` | **non-route** | — | **404** | INTENTIONAL (verified again this session): product discovery = the homepage `#products` worlds section + `/pricing`; no duplicate catalog route exists (P29 decision upheld; P30-C strengthens hero discovery) |
| `*` catch-all | BK→404 (correct) | none | 404 | `/nonexistent-xyz` → 404 page, noindex, custom OG — verified |

## API routes

| Route | Method | Prod status | P30 verification |
|---|---|---|---|
| `/api/contact` | POST | 405 on GET (correct) | POST-only contact intake — the P19 contract holds; e2e covers validation paths |

## Sitemap/robots reconciliation

- `sitemap.xml` (200): exactly the 6 indexable pages (`/`, `/about`, `/pricing`, `/contact`, `/privacy`, `/terms`) — `/offline` (noindex) and `/products` (non-route) correctly absent. **Zero unexpected entries.**
- `robots.txt` (200): unchanged contract.

## P30 findings & gates

- **Zero defects found** in this pass (0 broken internal links of 21 checked; all auth-free routes public as designed — this repo has no authenticated routes by design; authentication lives in the product subdomains).
- Regression gates: parity 576/576 (incl. +3 P30-C hero pins) · truth-gate · e2e 330/330 (incl. WCAG 2.5.8 touch-target inventory — it caught the first P30-C draft at 21px, fail-pre-fix) · CI green at `d9fd4e9`.
