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
