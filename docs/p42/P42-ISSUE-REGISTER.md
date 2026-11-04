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

---

# P42 — ISSUE REGISTER (Wave 2 additions, 2026-11-02)

## B3 — demo contamination — PARTIAL EXECUTION → OWNER DECISION (the single blocker left)

**Executed** (owner-authorized, runbook Path-B-equivalent via guarded temp
tool; full backup captured first; evidence in session records):
- 36 pure-test orders deleted (incl. cross-tenant #647 — order on restaurant
  293 referencing demo items)
- 3 test reviews on item 712 deleted («عميل»/«test»/anonymous)
- Demo imagery curated to imageMap (6 rows: كنافة، بطاطس مقلية ×2، بسبوسة ×2، سموثي)
- Runbook updated with the executed state + pinned 13-order table (`819ed4b`)

**OWNER DECISION — the 13 mixed demo orders** (IDs 131, 618, 620, 621, 622,
634, 635, 639, 642, 645, 653, 657, 659; all status=new, real visitor food +
one test line each, Jul–Aug 2026):
- **(أ) RECOMMENDED:** authorize deletion → `delete-final` (tool mode, pins
  exactly these 13 IDs, then the 4 items, one transaction) or the updated
  runbook SQL. Canary turns green ≤24h later.
- (ب) keep items: canary stays red, public demo keeps showing gray test cards.
- (ج) line-surgery on 13 orders: NOT recommended (edits real order records).
**The nightly canary stays RED until (أ) executes.**

## B3-related UX — FIXED (`4c6dd1c`)
- Owner delete-item P2003 dead-end: API now maps to 409 with two
  blocker-specific remedies; owner-menu catches surface server copy
  (also un-swallows the category 409 + expired-plan 403). [P42-3b F-1/2/3]

## New from Wave-2 audits

| ID | Sev | Product | Finding | Disposition |
|---|---|---|---|---|
| W2-BOT-1 | P2 | SmartBot | connect-page «أضفه من إعدادات المنصة» links to /admin/settings — platform-admin-only, dead-end for merchants | OPEN (one-line fix) |
| W2-BOT-2 | P2 | SmartBot | GET /api/analytics/export (CSV/JSON) has NO frontend consumer | OPEN (button in reports) |
| W2-BOT-3 | P2 | SmartBot | No monthly-reply usage counter (Free 100 enforced silently — engine-side reject) | OPEN (needs small REST surface) |
| W2-BOT-4 | P2 | SmartBot | Suspended-org 403 distinguished only in analytics; other pages show misleading retry | OPEN (general SuspendedBanner) |
| W2-BOT-5 | P2 | SmartBot | Plan-lock gaps: scheduled/broadcast/sequences gate via toast only (PremiumLock model exists) | **FIXED `3ce58c3`** (broadcast message joins GATE_MESSAGES family; PremiumLockCard on scheduled/broadcast; sequences has NO backend gate — documented, nothing to lock) |
| W2-BOT-6..9 | P3 | SmartBot | AI in-thread assist absent (/api/ai/generate-reply unconsumed), stale sequences comment, Loader2 vs Skeleton, unsubscribe button | **FIXED `e2fae51`** (-6 first generate-reply consumer: in-thread suggest→DRAFT, human sends; -7 stale comment + N+1 parallel detail fetch retired (step_count rides the row since v24-C4); -8 Loader2→shape skeletons ×2 (button-pending spinners stay); -9 unsubscribe/resubscribe endpoints + two-step confirm, engine status filter was already the truth) |
| W2-ORD-1 | P2 | Smart-Order | Zero-payment-methods silent checkout dead-end | **FIXED `ccb0bd8`** (empty-state + WhatsApp lifeline) |
| W2-ORD-2..5 | P3 | Smart-Order | Mid-checkout staleness (no refresh), cross-store cart guard, staff dead-invite on Free, cap counters absent | **2/3/4 FIXED `6fa9c27`** (live-price cart evaluation at checkout + unavailable gate; cross-store replace-confirm dialog; staff seats counter + upgrade door from the SAME source of truth as the POST gate). -5 partial by design: dashboard PlanUsageBadge (products/orders) + staff counter shipped; categories/zones per-page counters remain as noted polish |
| W2-LNK-1 | P2 | Smart-Link | Offline fallback HTML-only (unstyled when truly offline) | **FIXED `b3fa8b8`→main `76858f7`** (SW offline disk; live-verified: smart-link.ly/sw.js serves v2) |
| W2-LNK-2..6 | P3 | Smart-Link | theme_color single dark, header/drawer CTA naming, landing-footer WhatsApp, schema «مدار الساعة» claim pin, safe-area insets | **CLOSED**: -2 documented deliberate (manifest = default-dark brand splash; ThemeColorSync r148 corrects live chrome incl. WebAPK; dual media metas cover no-JS) · -3 verified already-consistent (header/drawer exact twins since P40-5a — no change needed) · -4 **FIXED** (WhatsApp door in landing footer «المؤسسة» column, e2e-pinned) · -5 **FIXED** (schema description = SmartBot’s own published identity, no clock claim) · -6 **FIXED** (back-to-top + install-prompt safe-area insets, parity-pinned) |
| W2-MEN-1 | P2 | Smart-Menu | Table-QR «تحميل الكل» = N sequential PNGs (no ZIP) | **FIXED `50a76c2`** (pure-lib STORE ZIP builder; EOCD bug caught by independent python verifier, contract pinned in tests) |

## Smart-Menu commercial semantics — OWNER DECISIONS (analysis ready, no policy changed)

1. **Order-cap window (P2-1):** Free = LIFETIME 100 (current, enforced
   `orders/route.ts:441`). Option B (monthly) analysis delivered: revenue
   pressure vs seasonal fairness (Libyan market), abuse self-healing vs
   one-time lockout, zero migration vs calendar decision + marketing copy.
   **Owner to pick A (keep) or B (switch) — enforcement is a one-line change
   + copy either way.**
2. **Cancelled orders in cap (P2-2):** today ALL statuses count (verified).
   Proposal: exclude `cancelled` (terminal, zero value, revenue definition
   already excludes it) — gives owners a self-service remedy against junk
   floods on the public endpoint. Orthogonal to decision 1.
3. **Multi-menu upgrade propagation (technical, not policy):** three
   verified inconsistencies (user-wide pending block contradicts the r93 DB
   relaxation; sibling menus keep old caps while NEW menus inherit upgraded
   caps free; M-3 approval lacks restaurant-row lock + tier re-check) —
   fix plan + test locations documented; awaiting a fix wave.
4. **Sticky paid caps after expiry:** restaurant.maxOrders never reverts on
   subscription expiry (cron flips only user status) — with lifetime caps
   one Pro payment = 99999 orders forever. Product decision needed
   (enforcement change vs documented acceptance).

## Dependabot — state after Wave 2

- Smart-Menu: **1 low** (deepmerge — NO patched release exists; documented).
- SmartBot: zod-high FIXED (`c4716a8`); deepmerge ×2 = the same unpatched
  exception (decisions-ledger entry with upgrade trigger).
- Smart-Order: zod-high FIXED (`d25f840`); deepmerge same exception family.
- All remaining alerts across the family: the single deepmerge advisory
  (GHSA-gcqx-w48m-w2h4) with no patched version in existence.

---

# P42 — ISSUE REGISTER (Wave 2.5 additions, 2026-11-02)

## B3 — CLOSED BY OWNER INSTRUCTION → ARCHIVE IMPLEMENTED (local, ready to push)

The owner decided via IM (2026-11-02): **no delete-final, no deletion of
the 13 mixed orders (preserved data), and a REAL archive for the 4 test
items — not sold-out.** Implemented as Smart-Menu local commit `cb04b1c`
(schema + guarded migration + all public-surface filters + owner tooling +
runbook decision record; 18 contract tests; 2896-test battery green;
build green). On merge+deploy:
- the 4 items leave every public surface (page, mobile payload, print,
  featured showcase, order path, plan cap, sitemap gate);
- the 13 mixed orders keep their FKs and render intact (history untouched);
- the nightly demo canary turns green automatically;
- owners gain the general archive/unarchive tool (menu page).
**Push/deploy/live-verify blocked on GitHub PAT re-delivery** (sandbox
recycling destroyed the credential store — see worklog W2.5).

## B3-security — cleanup tooling posture (owner instruction 3) — AUDITED

- `main` carries NO cleanup route (verified in-repo + live
  `/api/p42-cleanup` → 404 on production).
- `p42/demo-cleanup-tool` (remote, 559fdee): SHA-256-key-guarded route,
  never merged; Vercel preview DEPLOYMENT_NOT_FOUND at canonical URLs;
  project SSO protection restored after W2. **Branch deletion command
  prepared; blocked on push access.** Owner-side follow-up after push:
  remove any residual preview deployment in the Vercel dashboard.
- Main-branch mutating-route sweep: all session/permission/CRON_SECRET
  gated. No open destructive path.

## Commercial decisions — DOCUMENTED, behavior preserved (instruction 4)

`docs/p42/P42-OWNER-DECISIONS.md` (new): P2-1 cap window A/B, P2-2
cancelled-order options, sticky-caps options, publishers status, standing
owner dependencies. Nothing executed without owner choice.

## Wave-2 register updates

| ID | Disposition |
|---|---|
| W2-BOT-1 (connect dead-end) | **FIXED (local)** — conditional platform-admin link; honest merchant copy |
| W2-BOT-2 (CSV export no UI) | **SHIPPED** — main `9bdec1c`, CI green, deployed |
| W2-BOT-3 (silent reply cap) | **SHIPPED** — main `9bdec1c`, CI green, deployed |
| W2-BOT-4 (suspended UX) | **SHIPPED** — main `9bdec1c`, CI green, deployed |
| W2-BOT-5 (plan-lock gaps) | **FIXED `3ce58c3`** — pushed, CI green, deployed |
| W2-BOT-6..9 (P3 polish) | **FIXED `e2fae51`** — CI at the run recorded in the ledger |
| W2-ORD-2..5 (P3) | 2/3/4 **FIXED `6fa9c27`** (CI green + deployed) · 5 partial (badge + seats shipped; categories/zones counters = noted polish) |
| W2-LNK-1 (offline shell styling) | **SHIPPED** — main `76858f7`, CI green, deployed, live-verified (sw.js v2) |
| W2-LNK-2..6 (P3) | CLOSED — see register row for per-item dispositions |
| W2-MEN-1 (QR ZIP) | **FIXED `50a76c2`** — pushed (CI link in ledger) |

---

# P42 — ISSUE REGISTER (Wave 3 continuation, 2026-11-02 evening session)

> Session context: third sandbox recycle destroyed `/home/z/my-project/p42-work`
> (again); owner re-delivered GitHub PAT + EAS×3 via IM (Vercel token NOT
> re-delivered — noted below). Workspace rebuilt from the durable patch store +
> fresh clones; all four repos verified CI-green at HEAD before this batch.

| ID | Disposition |
|---|---|
| Multi-menu upgrade propagation (register §"commercial semantics" item 3 — the technical fix) | **FIXED Smart-Menu `ea2a01bb`** (pushed, CI see ledger): (1) pending-payment block scoped per-restaurant — new shared probe `src/lib/pending-payment-scope.ts` mirrors the r93-N6 partial-index bucket expression literally (absent key AND JSON-null both = the new-subscription bucket); the subscribe route blocks only on a pending NEW-subscription payment; the upgrade route's user-wide block removed (the per-restaurant probe was already the only pair the DB index rejects). (2) Every NEW restaurant now starts at FREE caps with `planId: null` (was: inherited the user's possibly-upgraded paid caps + no planEnd = free forever) — same as public self-registration since round87-A6; admin explicit-plan path (r93-N4) and subscribe-approval provisioning untouched. (3) M-3 (round93-inspection-c, deferred out of the migration back then): approval now runs `SELECT…FOR UPDATE` on the restaurant row + re-reads `{id, planId}` under the lock + mirrors the request-time tier guard (free skips; paid requires strictly higher sortOrder; vanished plan row → reject before FK explosion); `UPGRADE_TIER_NOT_HIGHER` → 409 actionable Arabic (payment rolls back to pending), `UPGRADE_RESTAURANT_MISSING` → 404. The co-owner double-fee scenario (same-or-lower tier) now rejects; a strictly-higher concurrent upgrade still succeeds (full price, fresh term — documented pricing behavior, the honest boundary of the fix). 16 new tests (`p42-4a-per-restaurant-subscriptions.test.ts`); suite 2907→2927 green; tsc/lint/lint:idioms/build all green. **User-level plan bump KEPT deliberately** (load-bearing: `maxMenus` entitlement + expiry guard/cron) → new owner-decision question (see P42-OWNER-DECISIONS §6). |
| W2-ORD-5 (categories/zones per-page counters — the "noted polish") | **FIXED Smart-Order `591cbd4`** (pushed, CI see ledger): GET /api/categories + /api/delivery-zones now attach `caps {current, max, planNameAr, canCreate}` from the SAME source the POST gate reads (currentPlan + categoryCapFor/zoneCapFor; current rides the rendered findMany — zero extra queries); both manage pages show the family-stamp counter chip («الأقسام: X من Y» / «مناطق التوصيل: X من Y») + the copper upgrade door at cap (exact staff-page W2-ORD-4 structure). 3 new unit contracts + 3 parity pins (508→511). W2-ORD-5 now **COMPLETE** (was "partial by design"). |
| P2-5 (Expo SDK 58 evaluation) | **SUPERSEDED by facts → closed with correction** (evaluation doc: `P42-EXPO-SDK58-EVALUATION.md`): the 57→58 leap already happened 2026-10-31 in P36 (SmartBot `c6322340` · Smart-Order `2340df9` · Smart-Menu `513682fc`; the six P39-verified AABs are SDK-58 binaries); the zod/decode-uri-component advisories were closed by overrides (W2-3), not by the jump; and the ONLY remaining mobile advisory (deepmerge — no patched release exists at all) is closed by **expo@58.0.22** which drops deepmerge from the tree via `@expo/config@58.0.10` (verified against the npm registry: 58.0.9 ships it, 58.0.10 doesn't). Real remaining work = the staged «58.0.22 patch wave» (Smart-Menu first riding its Wave-8 rebuild; SmartBot/Smart-Order lockfile-only; smartlink-mobile — the only true SDK-57 app — full jump as P3 follow-up). Nothing executed — plan-first per D6. |
| Feature-level parity matrix (Wave-3 mission item) | **DONE** (P42-4d): `P42-PARITY-MATRIX.md` expanded to the 8-state feature level (loading/empty/error/retry/offline/expired-session/permission/plan-limit) across all three apps with file:line evidence. Verdict: core four + 401 solid on both surfaces; the systematic weakness is plan-limit states on native. **Wave-4 gap register opened** (GAP-X1/X2 cross-cutting + GAP-BOT-1/3, GAP-MENU-1/2/3, GAP-SO-1/2/3) — 3×P2 all on native, headlined by the plan-lock family (GAP-X1). |
| B3 (demo contamination) | **CLOSED** — archival shipped + production-verified (W3-1/W3-2); the nightly demo canary auto-greened by design. Register rows above are historical record. |

## Standing credential note (2026-11-02 evening)

GitHub PAT + EAS×3 re-delivered and stored (durable, chmod-600, outside all
repos). **Vercel token NOT re-delivered this round** — not currently blocking
(no preview cleanup pending; branch already deleted; if a future wave needs
Vercel API access, ask the owner).

---

# P42 — ISSUE REGISTER (Wave 4 additions, 2026-11-02 night)

| ID | Disposition |
|---|---|
| GAP-X1 (fleet-wide native plan-lock UI) | **FIXED on all three apps** — SmartBot mobile `81c86768` (classifier twin of web plan-lock.ts + PremiumLock component + locks on scheduled/broadcast/calendar/analytics per the 3ce58c3 doctrine + 56 tests) · Smart-Menu mobile `5e74620f` (classifier on both web copy markers + PlanLimitLockSheet + **the real upgrade destination ported from the web** — the native "subscribe" was the new-signup wizard, never mounted for owners; new OwnerSubscribeScreen does upgrade mode via /api/subscriptions/upgrade; 23 tests) · Smart-Order mobile `b58953ba` (reports LockedState + staff 409 door + **the first native pricing screen** with 23 anti-drift pins reading the web sources + 18 classifier tests). CI: SmartBot green ×4 · Smart-Order green ×4 · Smart-Menu re-running at fix `f90bf213` (the 5e74620f root-job failure = vite:oxc nearest-tsconfig discovery vs the un-installed mobile deps in the root job — root-caused, simulated, fixed with a standalone nested tsconfig, lesson kept in the commit). |
| GAP-BOT-1 (native suspended-tenant state) | **FIXED SmartBot `81c86768`** — central suspension emission in the API layer (plan gates deliberately excluded), full-page SuspendedState in the app layout with web copy verbatim + ACTIVE support doors (public /api/support/info works under suspension) + 60s recheck with the cache-eviction trap documented. |
| GAP-SO-1 (native reports lock + no pricing destination) | **FIXED Smart-Order `b58953ba`** — see GAP-X1 row; the pricing screen sources numbers from the same GET /api/plans as the web and pins them field-by-field. |
| GAP-MENU-1 (native advanced analytics absent) | **OPEN — owner scope decision** (port analytics tab behind entitlement, or record intentionally web-only). |
| GAP-X2 (native offline banners) + P3s (GAP-BOT-3, GAP-MENU-2/3, GAP-SO-2/3) | OPEN — later waves (P3 register, parity matrix). |
| Release posture (honest change) | SmartBot + Smart-Order mobile trees were NO-REBUILD — the Wave-4 commits make shipped-AAB ≠ main, so **the Wave-8 mobile release batch must include all three apps** (Smart-Menu was already REBUILD-REQUIRED). Parity matrix notes updated. |
| Mobile CI lesson (recorded in `f90bf213`) | Root-job vitest importing mobile/ files: vite:oxc nearest-tsconfig discovery requires a loadable tsconfig WITHOUT mobile deps — solved by the standalone nested `mobile/src/lib/tsconfig.json`; also: Hermes hbc stores Arabic as UTF-16LE (bundle greps false-negative — both mobile agents hit it; verify with a byte scan). |

---

# P42 — ISSUE REGISTER (Wave 5 additions, 2026-11-02/03)

Baseline before the wave: all four repos re-verified at the W4 SHAs
(Smart-Link `dffbd37` · SmartBot `81c86768` · Smart-Menu `f90bf213` ·
Smart-Order `b58953b`), CI green on every HEAD.

| ID | Disposition |
|---|---|
| GAP-SO-2 (native skeleton system) | **FIXED Smart-Order `e1622fa`** (pushed, CI success incl. both e2e suites): pure-RN-Animated Skeleton primitive with the web family's exact recipe (1200ms linear sweep, reduce-motion full stop); 18 major surfaces converted to shape-matched skeletons with real screen dimensions + SR announcements; spinners kept (documented + pinned) only at the two shapeless boot/session gates. Mobile suite 85→135. |
| GAP-SO-3 / GAP-X2 (Smart-Order offline) | **FIXED `e1622fa`**: netinfo@12.0.1 + global ConnectivityBanner (guest+merchant) + onlineManager wiring (reconnect auto-refetch verified from query-core source) + honest offline/server-failure split + cart-safety pins (idempotency key reuse, cart never silently discarded) + web WifiOff strip in the merchant dashboard shell. |
| GAP-X2 (SmartBot offline) | **FIXED SmartBot `78fc1386`** (pushed, CI ×4 green): banner = web strip twin (verbatim copy, byte-exact lucide paths) above the authed Stack; **the dead `void onlineManager.isOnline()` no-op with its false comment replaced by the documented setEventListener wiring**; shared pure-TS predicate. Suite 145→181. |
| GAP-X2 (Smart-Menu authed trees) | **FIXED Smart-Menu `bd0657dd`** (pushed, CI ×4 green): banner inside AuthenticatedApp (owner + admin + unpaid trees); **refetchOnReconnect was dead config on native** (RQ v5 default binds window events that never fire on RN) — setEventListener rides NetInfo now; honesty guards pinned. Parity 365→375. |
| GAP-BOT-3 (team seats) | **FIXED SmartBot `1a4a85c4` — decision: PORT** (evidence-based): add-member + role-change + delete ported with the web contract intact (form-encoded, 3/8 thresholds, no double-submit, confirms). **Byte-level discovery:** the seat-limit 403 is a DIFFERENT message family (suffix «لإضافة المزيد», «رقّ» without kasra) — new `isSeatLimit` classifier + `SEAT_LIMIT_PREFIX`, both-ways family separation pinned; quota-honest treatment (verbatim server text + upgrade door in the open form — no PremiumLock card that would lie on a quota, no hidden buttons). |
| GAP-MENU-1 (native advanced analytics) | **FIXED Smart-Menu `eaadd4a6` — decision: IMPLEMENT** (scope evidence: server-gated route exists, react-native-svg already in deps, lock/upgrade family shipped in W4 — no architectural expansion, zero new deps). OwnerAnalyticsScreen = the AnalyticsTab twin (dual gate: entitlements probe + 403 primary truth; range labels verbatim; skeleton/empty/error/retry/locked states; per-card empty guarded by seriesHasData — no fake zeros); SVG chart family (Spline/Column/Doughnut/Area/Sparkline) on mobile tokens; second 403-family classifier (`plan-feature-gate.ts`, disjunction pinned); PlanFeatureLockCard twin with working door → OwnerSubscribe (restaurant context). Parity 375→395; root suite 2969→2989. |
| GAP-MENU-3 (central web 401) | **FIXED Smart-Menu `9d460734`**: central seam in csrf-client.ts covering ~62 previously-uncovered consumers — idempotent keepalive logout + Arabic dismissible toast + redirect riding the login page's server-validated `redirect` contract (family precedent Smart-Order r132/SmartBot v15-E5); loop/SSR/500 guard rails; page-level handlers coexist. +19 seam tests (behavioral + source contracts). |
| Wave-5 verifications (no regressions found) | Checkout correctness HOLDS (server re-pricing in Serializable tx + idempotency pre-check + raced-twin recovery — now source-pinned) · entitlements HOLDS (live /api/plans, no client enforcement) · plan/restaurant context HOLDS (CTA carries restaurant id; per-restaurant pending block; M-3 row-lock; new restaurants FREE caps) · demo integrity HOLDS (archive filters on all 7 public surfaces; canary functional; no PII) · publisher advertising sweep: ZERO violations (no UI consumes /api/publisher/*; landing FB-only) · SmartBot mutation spot-check: all major mutations already honest (loading/self-disable/confirms/server-text errors). |
| Release posture | netinfo added as a new native module to SmartBot + Smart-Order mobile (Smart-Menu mobile already carried netinfo@12.0.1 for its pre-existing ConnectivityBanner — verified). Both apps were already REBUILD-REQUIRED since W4; **the Wave-9 release batch absorbs all three apps** (Smart-Menu included). |

---

# P42 — ISSUE REGISTER (Wave 6 additions, 2026-11-02/03)

Three parallel backend reliability audits (§6): SmartBot `211a4215` ·
Smart-Menu `3834e766` · Smart-Order `58db2f6`+`e6500e9`+`829868d`+`8b1d36d`.
**Zero open P0/P1 across all three backends.**

| ID | Sev | Product | Finding | Disposition |
|---|---|---|---|---|
| W6-BOT-1 | P2 | SmartBot | Tenant-deletion sweep missed the 4 v19 Step-2 tables (fb_posts, ad_accounts, ad_campaigns, ad_items) — deleted tenant's posts + raw ad payloads survived "complete" deletion forever | **FIXED `211a4215`** (+2 tests; other tenants' rows asserted to survive) |
| W6-BOT-2 | P3 | SmartBot | reset-password non-numeric user_id → raw ValueError 500 + CRITICAL Telegram/Sentry alert on an admin typo | **FIXED `211a4215`** (guarded `_as_int` conversion → clean 422 Arabic; 3 tests) |
| W6-BOT-3..8 | P3 | SmartBot | Seat-limit count-then-insert race (deferred — avoid racing W5's fresh seat work; proposal: per-tenant LoopLocalLock) · AsyncOpenAI default 600s timeout · cleanup cron full-scans (index proposal) · TagEngine N+1 · own-tenant self-delete without re-auth (pinned product flag) · campaign-create role inconsistency (viewer vs editor) | DOCUMENTED (agent record P42-6a) |
| W6-MEN-1 | P2 | Smart-Menu | **Unarchive plan-cap bypass:** PUT /api/items/[id] accepted {archivedAt: null} with no cap check while POST counts live items only → archive k, create k, unarchive = N+k above the paid cap | **FIXED `3834e766`** (POST-family guard: Restaurant FOR UPDATE + maxItems under lock + destination-restaurant live count + PlanLimitError 403; 10 tests) |
| W6-MEN-2..6 | P3 | Smart-Menu | sub_admin+MANAGE_RESTAURANTS can't file upgrades (fail-closed inconsistency) · owner-level expiry semantics · sticky paid caps · cancelled-orders-in-cap · maxMenus user-level (all frozen owner decisions) + stuck-cron detection (external monitoring) + TRUST_PROXY_DEPTH default off-Vercel | DOCUMENTED (frozen policy / r119 S10 / round92-B2 deferral) |
| W6-ORD-1 | P2 | Smart-Order | Register fan-out was 4 independent writes — a raced slug burned the email with an unrecoverable orphan account (login works, requireBusiness refuses forever) | **FIXED `58db2f6`** (one interactive transaction: user + business + OWNER membership + default payment methods + audit row; tx-contract pin) |
| W6-ORD-2 | P2 | Smart-Order | Public track-lookup was a full-table scan (unique (businessId, orderNumber) can't serve orderNumber alone); merchant orders list + money-path daily count unindexed | **FIXED `e6500e9`** (two additive indexes on BOTH schema twins + index-pin tests; rides the db-push deploy chain) |
| W6-ORD-3 | P2 | Smart-Order | Products PATCH price lacked POST's r140 999_999_000 cap (an edit could reach the MAX_SAFE_INTEGER edge) | **FIXED `829868d`** (+pin) |
| W6-ORD-4 | P2 | Smart-Order | make-admin.js ran against whatever DATABASE_URL it found — repo-published QA credential could be planted into a production DB | **FIXED `8b1d36d`** (refuses NODE_ENV=production pre-connection; validated live against an ambient foreign DB — aborted pre-write) |
| W6-ORD-5..13 | P3 | Smart-Order | Checkout price-snapshot ms-window (architecture rewrite — out of policy) · subscriptions member-attach policy + null-business poll wart · push.ts duplicate role map · category hard-delete FK race · no Sentry · extraPerms whitelist narrower than permissionsFor · customers bounded load · unlimited track GET (unguessable 122-bit token) · products PATCH/DELETE unaudited | DOCUMENTED (agent record P42-6c) |

---

# P42 — ISSUE REGISTER (Waves 7+8 additions, 2026-11-03)

## Wave 7 — SEO/discoverability

| ID | Sev | Product | Finding | Disposition |
|---|---|---|---|---|
| W7-BOT-1 | P3 | SmartBot | og:locale ar_AR only on landing (child openGraph replaces root object — shallow-merge family); /login shipped no og:image (imageless WhatsApp cards); root twitter.title made every X card show the home title | **FIXED `1b5d9043`** (+pin wall `1aa1676e`) |
| W7-BOT-2 | P3 | SmartBot | FAQ JSON-LD encryption answer ≠ visible copy (W2-C3 never propagated to schema); Organization claimed ar+en with zero English backing | **FIXED `0607b4ce`** |
| W7-MEN-1 | P3 | Smart-Menu | Dead JSON-LD values: description "" (schema default leaked), hasMenuItem:[] husks (archived/sold-out sections), fully-empty menus still shipped a Menu entity | **FIXED `4e650a52`** (+10 pins) |
| W7-MEN-2 | P3 | Smart-Menu | Sitemap static routes carried fake new Date() lastmods | **FIXED `4e650a52`** |
| W7-ORD-1 | **P2** | Smart-Order | **/track/[token] was INDEXABLE** (no canonical guard, no X-Robots-Tag; a throwing generateMetadata on DB outage rendered 200 with NO robots meta) — order tokens + customer info at risk of indexing; checkout had nofollow+homepage-canonical contradiction; sitemap silently empty on env-unset | **FIXED `d8a13d5`** (triple-layer exclusion + site-url resolver + store OG restoration; +19 pins) |
| W7-LNK-* | — | Smart-Link | Full audit | **CLEAN — zero findings** (live-production evidence, all prior pins hold) |

## Wave 8 — security/a11y/perf

| ID | Sev | Product | Finding | Disposition |
|---|---|---|---|---|
| W8-BOT-1 | P2 | SmartBot | Non-string broadcast name → raw 500 (`{"name":{"a":1}}` live-probed) | **FIXED `bb4e4a02`** (isinstance + pin; the interrupted agent's length-cap family kept 100%) |
| W8-BOT-2 | P3 | SmartBot | safeRedirect open-redirect guard had ZERO tests | **FIXED `bb4e4a02`** (6-test matrix wall) |
| W8-BOT-3 | P3 | SmartBot | Stale zod OSV suppression (both lockfiles already at 4.6.7) | **FIXED `d7b68694`** (removed per its own removal clause) |
| W8-MEN-1 | **P2** | Smart-Menu | **Open-redirect bypass:** WHATWG parser strips tab/LF/CR before path grammar → `?redirect=/%09/evil.com` passed the r118 guard and parsed cross-origin in BOTH sinks (proven live) — the W5 401 seam rides this exact param | **FIXED `e7294e50`** (C0+DEL control-char rejection in both safeRedirectTarget twins; +9 pins) |
| W8-ORD-1 | P3 | Smart-Order | 6 native interactive controls at ~32-36px (chips, store back, cart qty, calendar nav, staff remove) — below the 44px floor | **FIXED `d9b4f1e`** (44px floor + 6-test contract) |
| W8-ORD-2 | P3 | Smart-Order | FAQ JSON-LD lacked the r140 <-escape; 3 blank-target links without rel="noopener noreferrer" | **FIXED `d9b4f1e`** |
| W8-LNK-1 | **P2** | Smart-Link | **Owner's private notification email shipped in 6 public client-bundle chunks** (ownerEmail on the SITE object literal-scribed by 3 client importers — «never displayed» true in DOM, false in view-source) | **FIXED `44d151b`** (constant → server route only + unit pin + bundle-secrets e2e gate stripping 7 credential shapes; axe tags → wcag22aa) |
| W8-fleet | P3 | fleet | A11y coverage gaps (no automated axe/keyboard CI sweep in Menu/Order; no 200%-zoom e2e in Bot/Menu) · perf candidates documented with numbers (Menu font preloads 194KB, Order unbounded 500-product payload, Bot common base 193KB in watch zone) | DOCUMENTED (agent records P42-8{a,b,c,d}) |

---

# P42 — ISSUE REGISTER (Waves 9+10 additions, 2026-11-03)

## Wave 9 — SDK-58 internal patch + the release batch

| ID | Sev | Product | Finding | Disposition |
|---|---|---|---|---|
| P2-5 → executed | P2 | fleet | The staged «58.0.22 patch wave» (SDK58 evaluation §6, approved plan-first per D6) | **EXECUTED & VERIFIED W9**: Smart-Menu `7ebf6a9f` · Smart-Order `52a4dca` · SmartBot `e9fa9fb5` — three atomic lockfile-only commits; **deepmerge GONE from all three lockfiles** (greps, not assumptions — the family's last reachable mobile advisory closes with it); expo-doctor 20/20; OSV clean; CI green ×3. Stage 3 (smartlink-mobile full jump) NOT taken — remains P3 (see F-04) |
| W9-BIN | — | fleet | Six release builds (STORE + INTERNAL per app) at the W9 heads | **FINISHED** — full inventory table in the worklog W9 section (build IDs, SHAs, timestamps). The smartbot pair is superseded by the F-01 binary requirement below |

## Wave 10 — the 10a findings register (independent review)

| ID | Sev | Product | Finding | Disposition |
|---|---|---|---|---|
| **F-01** | **P2** | SmartBot | Login open-redirect: the control-char bypass class Smart-Menu fixed in W8b (`e7294e50`) was unpatched in the `safeRedirect` twin — `?redirect=/%09/evil.com` survived the guard (WHATWG strips TAB/LF/CR before path grammar) | **FIXED `7f7c5692`** — verbatim port: `[\x00-\x1f\x7f]` rejected first; LoginRedirect wall 6→11 contracts (live semantics proofs + `/%09/` `/%0A/` `/%0D/` `/%7F/` vectors); suite 65 files/629 tests; CI run 41611252036 success; both Vercel projects READY at `7f7c5692`; guard verified live in the production bundle. **Binary follow-up OPEN (external): the STORE artifact `99911883` predates the fix — rebuild at `7f7c5692` required before Play upload, blocked on EAS quota (resets 2026-12-01). Precision: the fix delta has zero mobile/ impact — no vulnerable code path is embedded in the binary; no OTA exists in the family** |
| **F-02** | **P1** | Smart-Menu | Web production frozen at W3 `ea2a01bb` — **8 consecutive failed production deploys W4→W9** (TS2307: W5 parity tests import `../../mobile/**` that `.vercelignore` strips; CI's full checkout stayed green while Vercel errored — the verification seam nobody watched) | **FIXED `e7a52ecd`** — `.vercelignore` += `tests/` + `tests/e2e/` + `maestro/` (family pattern); dual typecheck gates 0 (full tree + stripped-upload simulation); CI run 41610376913 success; **production READY 2026-11-03 09:21:37 (first success after 8 failures)**; live-verified: `/api/health` commitSha `e7a52ecd…` + sitemap truth + W8b guard in the login bundle. Ledger cadence restored: production-READY evidence is again mandatory per wave |
| F-03 | P3 | Smart-Order | No pending-subscription-payment dedup (family-inconsistent with both siblings) | DOCUMENTED (10a) → next maintenance wave (partial unique index + P2002→409, mirrors siblings) |
| F-04 | P3 | Smart-Link | Smart-Link mobile (SDK 57) still carries `deepmerge@4.3.1` with no documented exception | DOCUMENTED (10a) → next maintenance wave (SDK-58 jump per evaluation Stage 3, or documented suppression + audit-gate extension) |
| F-05 | P3 | Smart-Order | Subscription review lacks tier-monotonicity (M-3 sibling check absent) | DOCUMENTED (10a) → policy call, owner register |
| F-06 | P3 | SmartBot | Campaign creation open to `viewer` (DOC-6 still open) | DOCUMENTED (10a) → quiet-round alignment to editor-gate |
| F-07 | P3 | Smart-Menu | Dev-tree `zod@3.25.76` (HIGH) via knip — invisible to the `--prod`-scoped audit gate | DOCUMENTED (10a) → knip bump or dev-tree override |
| F-08 | P3 | Smart-Order | Any member (incl. STAFF) may submit/attach subscription payment | DOCUMENTED (10a) → product decision |
| F-09 | P3 | Smart-Order | Schema sync fails open in production deploys (`vercel-db-sync.mjs` exit-0 anti-freeze; silent index-drift window) | DOCUMENTED (10a) → post-deploy index probe proposed |
| F-10 | P3 | SmartBot | DOC-1/DOC-2/DOC-5 re-verified open and accurately documented (seat race · OpenAI timeout · tenant self-delete) | DOCUMENTED (10a) → scheduled per W6 proposals, with TTLs |
| W10-EXT | — | fleet | **EAS free-plan Android quota exhausted (15/15)** — 17 Android builds created in the account 2026-11-01..03; blocks the smartbot rebuild at `7f7c5692` | **EXTERNAL — owner-side**: resets **2026-12-01** (free) or paid plan (requires explicit owner approval; NOT purchased — no paid action taken). The stale smartbot binary is NOT uploaded/distributed |

## Wave 10 — post-closure additions (2026-11-04, session 10d)

| ID | Sev | Product | Finding | Disposition |
|---|---|---|---|---|
| **W10-EXT-2** | — | fleet | **Vercel account soft-block — all production serving paused (402 DEPLOYMENT_DISABLED)**: `FAIR_USE_LIMITS_EXCEEDED` (overage `fluidCpuDuration`) blocked the account **2026-11-04 02:41:35 UTC** until auto-unpause **2026-12-04 02:41:35 UTC**. All four domains + vercel.app URLs answer 402; deployments paused account-wide (SmartBot's CI-green `2522399b` pushed 03:36 is undeployable — last deploy `070f4e00` at 02:10, 31 minutes before the block). NOT a P42 regression: every W10 live proof was performed 2026-11-03, hours earlier. Smart-Menu's scheduled `ping`/`demo-canary` canary failures are this block's symptoms, not code regressions | **EXTERNAL — owner-side** (register §8): Pro upgrade (paid — explicit approval required; NOT purchased) or wait for the 2026-12-04 auto-unpause or Vercel support. The dashboard banner is live-driven from the softBlock API field + domain probes and clears itself on unblock |
| token-note | — | fleet | **EAS token/schema status corrected (vs 10c):** EXPO_TOKEN_1 works (inventory re-queried on it, HTTP 200) — the 10c "revoked" reading was schema drift, not revocation: `App.platform`/`Build.buildNumber` were removed from the EAS GraphQL schema (use `Build.platform`/`appBuildVersion`/`releaseChannel`); TOKEN_2/_3 now 403 on account queries (`me: null` — restricted scope). No new EAS builds since the W9 batch; the six artifacts unchanged | Credentials file annotated (2026-11-04); future EAS queries must use the corrected field set |
