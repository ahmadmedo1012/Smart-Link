# P42 — MASTER WORKLOG

Chronological record of P42 work. Evidence is durable: this file lives in the
Smart-Link repo under `docs/p42/`. Severity ladder: P0 critical → P3 polish.

## 2026-11-02 — Wave 0 (Recovery & Baseline) — COMPLETE

**W0-1 · Environment reconstructed.** Sandbox had been recycled (all of
`/home/z/p35-work/` destroyed — the same loss that blocked P39 Job 490778's
first run). Owner delivered the rotated credential set via IM (GitHub PAT
`ahmadmedo1012`, Vercel token, EXPO×3 — EXPO_1 verified as account `rh2011`).
Stored chmod-600 at `/home/z/p35-work/secrets/cred-store-rotated-2026-11-01.txt`,
values never printed, never committed. Four repos re-cloned; HEADs matched the
mission's known references exactly (Smart-Link `fdc5f247` · SmartBot `832044d3`
· Smart-Menu `c98b183b` · Smart-Order `b26efe0`).

**W0-2 · P41 recovered.** P41's published record read from
`Smart-Link/docs/p41/`: P41 completed the P39 Android verification
(Job 490778 run 2 — all 6 builds FINISHED at main HEADs, keytool + APK v2
parser certs, package IDs, live assetlinks matches), captured the baseline,
and launched discovery agents. The build-ID discrepancy vs the P39 dispatch
summary is documented in P41-RECOVERY-AND-BASELINE §3: the continuation
summary was lossy; EAS records are authoritative.

**W0-3 · Android release chain re-verified fresh (read-only).** Expo GraphQL
(authenticated, read-only): all six 2026-11-01 00:25–00:27 UTC builds
FINISHED at exactly the current main HEADs — SmartBot `4e696cde`/`0090eff8`
@ `832044d3`, Smart-Menu `e718483b`/`9e642e41` @ `c98b183b`, Smart-Order
`85b14884`/`99ea5050` @ `b26efe0`; artifact URLs live. Cross-check: the
assetlinks.json files fetched live this session still match P41's verified
cert fingerprints (Menu `[0] 7B:5D:FC…C1:2D`, Order `[0] 8E:C7:C9…58:E5`).
**Verdict stands: Android PRODUCTION-READY ×3; no rebuilds needed; Play
upload remains Owner-side.** Quota posture: 6/15 Android used this cycle.
Also read: `pushSecurityEnabled: false` on the Expo account (the SmartBot
Push Protection standing item — Owner-side recommendation to enable).

**W0-4 · Live findings re-verified (mission Phase B).** Fresh fetches of all
public pricing surfaces found the B1/B2 "zero limits" NOT reproducing on any
public page (Menu /pricing renders حتى 1/10/100; Order renders 15/100/3 —
matching Smart-Link's advertised numbers). B3 demo contamination CONFIRMED
live (`TestLimitItem` ×2, «كابتشينو اختبار 2» with rating — on
`/menu/al-waha-cafe`). Full truth trace delegated to Wave-1 investigation
agents (below) — zeros root-caused to the CountUp animation window, not data.

**W0-5 · Wave-1 investigations (4 read-only agents).** P42-1a (Smart-Menu
pricing truth), P42-1b (Smart-Order pricing truth), P42-1c (demo
contamination), P42-1d (SmartBot claims + Order trust + Dependabot).
Findings and dispositions in `P42-ISSUE-REGISTER.md`.

## 2026-11-02 — Wave 1 (Critical product truth) — COMPLETE

19 commits across all four repos, all pushed to main continuously, CI green
per repo at final HEAD (see `P42-CI-DELIVERY-LEDGER.md` for the
commit-by-commit record):

- **Smart-Menu** `c98b183b → 72e4e2c9` (7 commits): CountUp retired from
  plan-limit rows (the B1 zeros root cause), «الطلبات الشهرية»→«الطلبات»
  (lifetime cap honesty), mobile free card «مجاني/مجانية للأبد» (was
  «0 د.ل/لمدة 30 يوم»), qa-seed ladder aligned to the sold ladder, r92
  render parity pins (Free 1/10/100, no «حتى 0»), the live demo canary
  (nightly, env-gated), the runbook's missing Review-FK step with pinned
  row IDs, root deps (minimatch 11 · brace-expansion 1.1.20/5.0.11 ·
  vite 8.1.6 · vitest 4.1.12 — the five failing Dependabot security jobs),
  mobile overrides (minimatch 11.0.3 · glob 14.0.3, exact pins).
- **Smart-Order** `b26efe0 → 3221aff` (5 commits): per-plan resource caps
  ENFORCED (Free 3 categories/1 zone — as advertised; paid 500/200 — making
  «غير محدودة» practically true), dashboard badge truth (planless = Free,
  not «اختر باقة»), quantifier honesty under ten (no more «أكثر من 2»),
  wallet-cap copy describes the guidance it actually is, demo store's
  wallets de-realized (0940000000/0910000000, upsert-heals on deploy) +
  Free catalog modeled (1 zone), dependabot.yml (first ever — /mobile npm +
  github-actions; root bun-audited by design), mobile overrides.
- **SmartBot** `832044d3 → 7d8bb1bb` (3 commits): plan cards stop promising
  «دعم فوري»/«دعم فني ممتاز» (office-hours WhatsApp truth — startup.py
  upsert heals prod rows on deploy), «14 نية»→«13 نية مصنّفة» (the 14th was
  dead code — empirically verified 13 reachable), pricing footnote
  «مدى الحياة»→«مشمولة بالخطة».
- **Smart-Link** `fdc5f24 → 0a9bceb` (4 commits): Menu order-claim drops
  «شهريًا» (the sibling enforces a LIFETIME cap; Order's monthly window and
  Bot's monthly replies are genuinely enforced and stay), +9 section-scoped
  truth-gate claim pins, root minimatch override + zod 4.6.7, mobile
  overrides (minimatch+glob — glob@14 survived the full expo export gate),
  dependabot.yml /mobile entry.

## Constraints honored

- P38 financial guarantees untouched (repricing, idempotency, payment
  validation, delivery fees, roles, order states, seat limits) — Smart-Order
  money path changes were copy-only; the wallet-cap decision was traced and
  resolved as copy-truth, not enforcement.
- P40 honesty wave extended, never regressed.
- No credential rotation/revocation performed during P42 (mission §18);
  no secrets printed or committed.
- Arabic-first copy throughout; existing product identities preserved.

## Wave-1 production verification (Vercel + live pages, 2026-11-02)

All four products deployed at final HEADs (Vercel production READY):
smartlink `9ba91d9` · smart-menu `72e4e2c9` · smart-order `3221aff` ·
smartbot-frontend + smart-bot-api `7d8bb1bb`. Live checks on production:

- smart-link.ly/pricing — the Menu free-plan claim reads «100 طلب» (lifetime
  truth); Order/Bot monthly claims intact.
- menu.smart-link.ly/pricing — limit rows render as plain instant text
  («حتى 1 / حتى 10 / حتى 100»), «حتى 0» nowhere in the DOM (CountUp gone).
- order.smart-link.ly — «أكثر من» quantifier gone (plain counted figures).
- order.smart-link.ly/store/demo-store — REAL wallet numbers: 0 occurrences;
  demo numbers: present (the deploy-seed heal worked — money-safety closed).
- bot.smart-link.ly — «دعم فوري»/«دعم فني ممتاز»: 0; office-hours phrasing
  live; «13 نية مصنّفة» present, «14 نية» 0 (landing).

## Next waves (per mission §23)

Wave 2 (core workflows) → Wave 3 (native parity matrix) → Wave 4 (visual) →
Wave 5 (backend reliability) → Wave 6 (SEO) → Wave 7 (security/a11y/perf) →
Wave 8 (release readiness — batched mobile rebuild decision point) →
Wave 9 (independent acceptance ×2).

## 2026-11-02 — Wave 2 (P0 demo cleanup + native/deps/journey audits + first fixes) — IN PROGRESS

**W2-1 · P0 demo cleanup — PARTIAL EXECUTION (owner-authorized via continuation §2.1).**
The runbook's zero-orders premise was falsified by live precheck: 50 OrderItem
rows (49 orders) referenced the four pinned test items 712/767/778/779, and
779's two documented reviews were already gone (partial pre-session execution).
Executed through a guarded temporary tool branch (`p42/demo-cleanup-tool` —
SHA-256-keyed header, pinned-ID verification before any mutation,
single-transaction deletes with rollback-on-count-deviation; never merges to
main): **full backup first** (4 items + 3 reviews + 49 orders + 48 order
items, chmod-600, contains visitor names/phones so stays out of the public
repo), then **36 pure-test orders deleted** (incl. the cross-tenant #647: an
order on restaurant 293 carrying demo-tenant items — a data-integrity anomaly
in itself), then **the 3 test reviews on 712** («عميل»/«test»/anonymous),
then **the imageMap curation** (كنافة 691، بطاطس مقلية 695+789، بسبوسة
693+786، سموثي 687). A mid-operation SQL quoting bug (PG 42703) proved the
transaction guard: zero rows written, clean rollback, retried after fix.
**Remaining: the four ITEMS stay published — blocked by 13 pinned mixed demo
orders (real visitor food + one test line each, all status=new, Jul–Aug
2026). OWNER DECISION required (runbook options أ/ب/ج); `delete-final` mode
is ready and hard-pins exactly those 13 IDs.** The nightly canary stays red
until then. Runbook updated on Smart-Menu main (`819ed4b`).

**W2-2 · Read-only investigation wave (agents P42-2a/2b/2c/2d).**
- **2a cap semantics:** counting query verified (lifetime, ALL statuses incl.
  cancelled — `orders/route.ts:441`); upgrade flow traced (restaurant-only
  cap write + user-wide plan bump + free inheritance for new menus); four
  technical inconsistencies documented (user-wide pending-payment block vs
  r93 DB design; cap-propagation asymmetry; M-3 approval gaps; sticky paid
  caps after expiry). A-vs-B decision analysis (lifetime vs monthly) +
  cancelled-order rule proposal prepared for the owner.
- **2b Smart-Order first-frame:** the CountUp flash CONFIRMED on /pricing
  limit rows (post-hydration «حتى 0» frame + 1.1s ramp) → **FIXED** same
  session (`c5314a3` + unit source-scan pin + browser ISR-aware pins, CI
  green at `8494d2f`).
- **2c native release needs:** SmartBot **NO-REBUILD** (mobile/ diff since
  832044d3 is EMPTY); Smart-Menu **REBUILD-REQUIRED at next mobile release**
  (free-card truth in 2 shipped screens; no OTA channel exists — no
  expo-updates); Smart-Order **NO-REBUILD** (dev-tooling lockfile only;
  expo-updates tarball-inspected — glob never enters its runtime graph).
  Parity skeleton captured (→ P42-PARITY-MATRIX.md).
- **2d Dependabot deep-dive:** SmartBot 3 alerts (zod-high via @expo/cli
  nested copy; deepmerge ×2 unpatched), Smart-Menu 21 (node-forge ×12,
  shell-quote critical, zod direct+transitive, 5 more, smol-toml now
  patchable at 1.9.0+).

**W2-3 · Security wave (merged to main, CI green).**
- Smart-Menu `0cf7a20` (branch-gated: mobile ✓ + lint-build-test ✓ first):
  zod 4.6.7 direct+override, node-forge 1.4.2 (×12 advisories), shell-quote
  1.11.0 (critical), decode-uri-component 0.5.1, compression 1.8.2,
  source-map-js ^1.2.2, postcss-selector-parser 6.1.5, knip>smol-toml ^1.9.0
  (accepted-exception converted to fix). **Repo alerts 21 → 1** (deepmerge,
  unpatched upstream, documented).
- SmartBot `c4716a8` (branch-gated: mobile job = the @expo/cli-on-zod-4
  smoke, PASS): zod override ^4.6.6; deepmerge ×2 → documented exception in
  `docs/decisions-ledger.md` with the exact upgrade trigger.
- Smart-Order `d25f840`: same zod override (all 4 Dependabot checks green
  at final HEAD).

**W2-4 · Journey audits (agents P42-3a/3b/3c/3d) + first fixes.**
- Smart-Menu (3b): journeys complete; **P1 delete-item FK dead-end → FIXED**
  (`4c6dd1c`: P2003→409 with blocker-specific remedies — OrderItem → «أخفِه»,
  Review → «احذف تقييماته أولاً»; UI catches now surface server copy — also
  un-swallows the category 409 and the expired-plan 403). P2/P3 polish
  registered (QR ZIP bundle, error-surface consistency).
- Smart-Order (3c): no P0/P1; **P2 zero-payment-methods silent dead-end →
  FIXED** (`ccb0bd8`: honest empty-state + store WhatsApp lifeline).
  P3s registered (mid-checkout staleness, cross-store cart guard, staff
  dead-invite on Free, cap counters).
- SmartBot (3a retry): no P0/P1; 5×P2 registered — connect-page
  admin-settings dead-end for merchants, CSV export endpoint with no UI,
  no monthly-reply usage counter (Free 100 enforced silently), no general
  suspended banner, plan-lock pattern gaps (PremiumLock model exists in
  flows/analytics). P3s (AI in-thread assist, stale comment, Loader2).
- Smart-Link (3d): **all 5 directive §3.1 verifications PASS** (CTA
  destinations, product paths, signup pathways, no landing→registration
  confusion, card/table semantics); SEO/PWA/responsive/RTL unusually
  well-pinned. P2 offline-shell styling registered; P3s (theme_color,
  CTA naming consistency, landing-footer WhatsApp, schema 24/7-adjacent
  claim pin, safe-area).

**W2-5 · Branch hygiene.** Two temp branches merged+deleted (deps, zod);
`p42/demo-cleanup-tool` remains (guarded, skip-ci) until the owner decision
executes delete-final. Vercel SSO protection was disabled only inside the
two cleanup windows and restored to `all_except_custom_domains` after each.
