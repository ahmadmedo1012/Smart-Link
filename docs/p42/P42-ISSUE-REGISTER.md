# P42 — ISSUE REGISTER (Wave 0 + Wave 1)

All findings verified with file:line evidence by read-only investigation
agents P42-1a/1b/1c/1d (2026-11-02). Dispositions: FIXED (Wave 1, commit
referenced) · OWNER (owner-side action) · P2/P3 (scheduled later wave or
product decision) · ACCEPTED (documented exception).

## B1 — Smart-Menu free-plan "zeros" (mission B1) — FIXED
- **Root cause:** `CountUp` (src/components/ui/CountUp.tsx) animated the
  three plan-limit rows 0→value over 1100ms; mid-animation frames render
  «حتى 0» ×3. Static HTML was always correct — screenshots caught the window.
  CountUp's own contract says marketing/hero only.
- **Fix:** retired from limit rows (`85957634`); r92 render pins now assert
  the sold ladder renders instantly and «حتى 0» appears nowhere.
- **Verified clean surfaces:** live /pricing, /subscribe, dashboard, mobile
  (data paths all correct pre-fix).

## B1-M1 — Menu order cap advertised «شهريًا», enforced LIFETIME — FIXED (copy)
- `api/orders/route.ts:441` counts all orders ever (no window, no reset).
- Copy now says «100 طلب» (Smart-Link web+mobile, Menu's own comparison
  label) — `ec42800` (Smart-Link), `85957634` (Menu).
- **P2 product decision (OPEN):** if the business wants genuinely monthly
  caps, that's an enforcement change (owner to decide; see P2-1 below).

## B1-M2 — Mobile free card «0 د.ل / لمدة 30 يوم» — FIXED
- `c95b5bc3`: price 0 → «مجاني», Free period → «مجانية للأبد» (web parity).

## B1-M3 — qa-seed obsolete ladder — FIXED
- `307786a5`: ladder aligned to default-plans.json; heal path rewrites rows.

## B1-M4 — quota nuances — P2 (OPEN)
- Cancelled orders count toward the lifetime cap; multi-menu upgrades update
  caps only on the `meta.upgradeRestaurantId` restaurant. Financial/quota
  semantics — NOT changed in Wave 1 (P38-adjacent). Product decision needed.

## B2 — Smart-Order free-plan claims — FIXED (enforcement + display)
- Free plan verified genuinely usable end-to-end (15 products, order #101
  blocked 409 with customer-safe copy — no change needed).
- **«3 أقسام» advertised-but-unenforced** → NOW ENFORCED (Free=3; paid=500
  practical-unlimited replacing the global 50) — `bbe895c`.
- **«منطقة توصيل واحدة» advertised-but-unenforced** → NOW ENFORCED (Free=1;
  paid=200) — `bbe895c`.
- **Planless merchants saw «اختر باقة»** → stats route resolves Free row —
  `ac47c36`.
- e2e boundary pins added (4th category/2nd zone → 409 with the card's own
  number in the message).

## B2-G2 — wallet-cap claim stronger than enforcement — FIXED (copy)
- UI check is guidance-only (quick code hides above 99 د.ل; manual row
  stays open) — server never rejects. Copy now describes the guidance —
  `ff6feb6`. A server-side rejection would contradict the open manual path
  (traced, decided copy-first).

## B2-G3 — demo store carried REAL wallet numbers — FIXED
- `d95fa4b`: demo methods seeded with 0940000000/0910000000; upsert heals
  existing production rows on the next deploy. Real payment constants
  untouched.

## B2-G1 — «أكثر من 2 متجر» inflation — FIXED
- `ff6feb6`: plain counted phrases below 10 (proper Arabic dual/plural);
  «+»/«أكثر من» return only at honest scale.

## B3 — demo contamination — RUNBOOK COMPLETE, OWNER EXECUTION PENDING
- Contaminated rows pinned by ID: al-waha-cafe (102) items **712**
  («كابتشينو اختبار 2», 3 reviews) + **767** («TestLimitItem»); al-waha-cafe-
  demo (312) items **778** + **779** (2 reviews).
- Root cause: owner-dashboard QA into production DB; round66 hid them;
  r135 sold-out re-exposed them; P40's runbook was never executed.
- Wave 1: runbook fixed (Review-FK-first ordering — the missing step that
  would have failed the cleanup) `300a7851`; **live demo canary** added to
  the nightly workflow (fails on any test-artifact vocabulary in the public
  HTML) `884d6bf0`.
- **OWNER: execute `docs/runbooks/demo-content-cleanup.md` (both tenants) —
  the nightly canary stays red until then.**

## B3-images — demo image duplicates — P2 (OPEN, owner dashboard)
- كنافة/بطاطس مقلية/بسبوسة/سموثي carry wrong/duplicate photos; curation
  corpus already exists in `src/app/demo/route.ts:207-224`. Owner-side fix
  via dashboard; documented in the runbook.

## B5 — SmartBot claims — VERIFIED TRUE, 3 micro-fixes landed
- All major claims verified against implementation (100 monthly replies
  enforced; prices/limits/rules/team gates card-for-card; AI replies real
  with provider keys; broadcast/scheduling gated and implemented; support
  hours honest).
- FIXED: «دعم فوري»/«دعم فني ممتاز» → office-hours/priority phrasing
  (`fa7d9b4e`, prod rows heal on deploy via startup upsert); «14 نية»→
  «13 نية مصنّفة» (dead `problem` intent, 13 empirically reachable —
  `629b4b2c`); «تحديثات مجانية مدى الحياة» → «مشمولة بالخطة» (`7d8bb1bb`).
- P3 (OPEN): multi-platform publishers (X/LinkedIn/Instagram) implemented
  but unadvertised — free marketing upside if wanted.

## B6 — Smart-Order trust metrics — VERIFIED HONEST (after G1/G3 fixes)
- Store/order counts are live DB aggregates (now with honest quantifiers);
  «6 طرق دفع» derived from the constant; demo store properly labeled with
  all-zeros WhatsApp destination; payment/delivery examples match backend.

## B7 — Dependabot failures — FIXED across the family
- Root cause (all repos): minimatch GHSA-g3hv-75wg-m249 (fix ONLY in 11.x;
  parents pin ^3/^10) + glob GHSA-3g3m-2fjr-6pw4 (fix ONLY in 14.0.2+;
  Expo pins ^13) — `update_not_possible` by construction.
- Smart-Link root `9b8bae7` + mobile `a6590be` + /mobile dependabot entry
  `0a9bceb` (glob@14 survived the full expo export gate — no fallback
  needed). Smart-Order mobile overrides + first-ever dependabot.yml
  (`3221aff`). Smart-Menu root `31c5053c` (minimatch 11 ·
  brace-expansion 1.1.20/5.0.11 [GHSA-qhr7-859c-m2p7 wave] · vite 8.1.6 ·
  vitest 4.1.12 — 16 advisories → 2) + mobile `72e4e2c9` (exact pins).
- **ACCEPTED (documented in-repo):** Smart-Menu knip>zod v3 carve-out
  (knip's own CLI schema; dev-only) and smol-toml ≤1.8.0 inside knip's
  subtree (patched 1.8.1 does not exist on npm yet). SmartBot repo carries
  its own pre-existing Dependabot notice (1 high/2 low, unrelated to Wave-1
  commits) — next wave.
- **OWNER (light):** new Dependabot PR backlog to triage (Smart-Link
  #22–#31 + Smart-Order's fresh set) — routine minor/patch bumps.

## Standing owner-side dependencies (unchanged from P41)
1. Revoke any still-active OLD conversation-exposed tokens (GitHub/Expo/
   Vercel) — the rotated set is in place; old-set revocation status unknown.
2. Execute the demo-content cleanup runbook (B3 above).
3. FCM v1 + APNs keys for real push delivery.
4. Apple developer credentials (iOS device builds).
5. Play Console upload of the three verified AABs (or authorize eas submit).
6. Consider enabling Expo account `pushSecurityEnabled` (read: false).
7. Real Android device for Maestro E2E (none in sandbox).

## P2 register (next waves)
- P2-1: Menu order-cap semantics (lifetime vs monthly) — product decision.
- P2-2: cancelled-orders-in-cap + multi-menu upgrade propagation (Menu).
- P2-3: demo image curation (Menu, owner dashboard).
- P2-4: SmartBot Dependabot notice + unadvertised multi-platform publishers.
- P2-5: Expo SDK 58 evaluation (the pinned-tree advisories' only fix;
  mission D6: plan first, don't auto-upgrade).
