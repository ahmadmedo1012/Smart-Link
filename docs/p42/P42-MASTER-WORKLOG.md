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

## 2026-11-02 — Wave 2.5 (owner archive decision + Waves-3..9 opening batch)

**Environment note (external blocker, honest record — TWICE this wave):** the
sandbox was recycled twice during this wave — all of `/home/z/p35-work` (and
its successor) with repos + credential store was destroyed each time. Work was
rebuilt from scratch and now lives in the SURVIVING persistent project tree;
every commit carries a format-patch backup in
`download/p42-w3-patches/` (durable). Repos re-cloned anonymously (public);
**push credentials are gone** — every commit below is verified locally; pushing
to `main` (and thus Vercel deploy + live production verification + CI runs)
waits for the Owner to re-deliver the GitHub PAT via IM.

**W2.5-1 · P0 resolution — the owner's archive decision CLOSED by instruction,
implemented.** Owner decision (IM, 2026-11-02): `delete-final` and any
deletion of the 13 mixed orders are FORBIDDEN (preserved data); the 4 test
items get a REAL archive system (not sold-out). Implemented on Smart-Menu
local `cb04b1c`: `MenuItem.archivedAt` (nullable timestamp; NULL = old
behavior byte-for-byte) + migration `zz_p42w3_item_archival` (guarded
triple-definition UPDATE of 712/767/778/779 — prod 4 rows, dev/CI no-op;
zero DELETE) + full public-surface filtering (menu page incl. featured raw
SQL, mobile API, print view, order submission, plan item-cap, owner stats
counter, sitemap content gate) + owner tooling (per-item archive button +
non-destructive confirm + the collapsible «الأصناف المؤرشفة» restore panel;
`?archived=true|false|all` staff-gated; archived items 404 for anonymous by
id) + the 409 delete remedy now points to archive. Tests: 18 new contract
tests (`tests/unit/item-archival.test.ts` — public disappearance + history
integrity + migration no-DELETE + route behavior mocked) and 2 existing
query-shape assertions STRENGTHENED with `archivedAt: null`. Local gates:
tsc-strict ✓ · eslint 0 ✓ · lint:idioms 4/4 (518 files) ✓ · vitest
**2896 passed** ✓ · `next build` (page-data collection) ✓. Migration-parity
gate + e2e ride CI (no local postgres in this sandbox). **After merge+deploy:
the nightly demo canary goes green automatically.**

**W2.5-2 · Cleanup-path security audit (owner instruction 3).**
- `p42/demo-cleanup-tool` branch: still on the remote (559fdee). Its route
  is SHA-256-key-guarded (hash-only in-repo) and never merges to main —
  verified `main` carries NO `p42-cleanup` route; **live probe:
  `https://menu.smart-link.ly/api/p42-cleanup` → 404** (production clean).
  Vercel preview probes at canonical URLs → DEPLOYMENT_NOT_FOUND; project
  SSO protection was restored to `all_except_custom_domains` after the W2
  windows. **Branch deletion prepared but blocked on push access** — the
  moment credentials return: `git push origin --delete
  p42/demo-cleanup-tool` (Smart-Menu), then remove any residual preview
  deployment from the Vercel dashboard. Until then no unauthenticated
  executable path to production data exists.
- Main-branch destructive-endpoint sweep (Smart-Menu): every mutating route
  is session-gated, permission-gated, or CRON_SECRET-gated. No open
  destructive path found.

**W2.5-3 · SmartBot W2-BOT-1/2/3 + W2-BOT-4 (local commits, see ledger).**
- BOT-1: connect-page admin dead-end — conditional platform-admin link;
  honest merchant copy.
- BOT-2: CSV export UI — `/api/analytics/export` finally consumable from
  the reports card.
- BOT-3: monthly-reply usage counter — `GET /api/subscriptions/usage`
  (engine's own `get_plan_limits` read) + `PlanUsageCard` + pytest contract.
- BOT-4: suspended-tenant honest state — `isTenantSuspended` classifier +
  ApiError-preserving useMe + full-page suspended state in AuthGuard (kills
  the login-redirect loop); 6 classifier tests.
- BOT-5 (plan-lock gaps) + P3s: still open (next batch).

**W2.5-4 · Smart-Link W2-LNK-1 — styled offline shell (local commit, see
ledger).** The SW cached only the /offline HTML — offline it rendered
UNSTYLED (the registered gap). Now: the SW derives an offline DISK from the
page's own asset references at install (CSS chunk + fonts + icons +
manifest — content-hash-proof by construction), serves those from cache
ONLY when the network fails, and bumps VERSION. Everything else (POSTs,
other pages' assets, analytics) passes through untouched — the Playwright
page.route contracts preserved. Verified: the real-SW e2e (register →
offline navigation → styled-shell computed-style proof → network-first
recovery) + the page-contract/axe specs all green locally.

**W2.5-5 · Pending commercial decisions consolidated (owner instruction 4)
— behavior unchanged.** New `docs/p42/P42-OWNER-DECISIONS.md` (this
directory): cap window A/B, cancelled-orders options, sticky caps,
publishers status, standing owner-side dependencies. No policy changed.

**Standing item — credential re-delivery required to push/deploy/verify:**
GitHub PAT (+ Vercel token for the preview cleanup + EAS tokens if a mobile
release wave follows). All work is committed locally with durable patch
backups.

## Wave 3 — 2026-11-02 (session: credentials restored → full ship-out)

**W3-0 · Credentials re-delivered and stored safely.** Owner sent GitHub
PAT + Vercel token + 3 EAS tokens over IM. Stored OUTSIDE all repos
(`~/.p42/credentials.env` chmod 600 + git credential store); both GitHub
(ahmadmedo1012) and Vercel (team_bBctUHIWiI5k3h4rYmp4rzBp) verified via
API before first use. **Standing directive from Owner: commit and push to
main continuously** — no unpushed batches from this point on.

**W3-1 · The Wave-2.5 backlog ships (all three repos).** Pushed: Smart-Menu
`cb04b1c`, SmartBot `9bdec1c`, Smart-Link `76858f7`. All three CI runs
GREEN (links in the ledger's Wave-3 section). Vercel deployed all four
projects (smart-menu, smartbot-frontend, smart-bot-api, smartlink).

**W3-2 · Smart-Menu production verification of the archival (Owner
directive 6 — direct behavior proof).** Live probes on
menu.smart-link.ly: both public menu APIs clean (16/25 items, zero test
vocabulary), menu HTML pages 0 occurrences, print pages 0 real occurrences
(only «عقد الاختبار» in a CSS contrast comment — a false positive we
chased down rather than waved through), sitemap 0 refs. The migration ran
at deploy time (items live before → gone immediately after READY). Order
integrity = UPDATE-only design + green contract CI; private dashboard
spot-check left to the Owner (/owner/orders — the 13 mixed orders must
list normally).

**W3-3 · Cleanup-path lockdown executed (Owner directive 3 — was blocked
on push access).** `p42/demo-cleanup-tool` branch deleted from the
Smart-Menu remote (main-only now); 8 residual Vercel preview deployments
deleted (6 cleanup-tool + 2 orphaned deps-mobile); live 404 probe on
/api/p42-cleanup re-verified. No unauthenticated executable path to
production data remains.

**W3-4 · W2-BOT-5 plan-lock rollout (SmartBot `3ce58c3`, CI green,
deployed).** The broadcast gate message joins the GATE_MESSAGES family
(ends «رقِّ خطتك» — the old wording was invisible to isPlanLocked; the
send-gate test now pins the family suffix instead of loose «الترقية»).
Shared PremiumLockCard; scheduled page locks the composer but keeps the
existing list (creation-gate doctrine); broadcast page locks create+send
and hides the dead «بث جديد» CTA; the send-downgrade path closes the
confirm dialog. 6 render contracts (incl. the v24-C2 wait-for-enabled
race we hit: the confirm button is disabled while the estimate chain
loads — clicking early is a silent no-op). sequences has NO backend gate
(documented in its page header since v17) — nothing to lock, recorded
instead of invented; calendar page is view-only.

**W3-5 · W2-MEN-1 QR ZIP (Smart-Menu `50a76c2`).** «تحميل الكل» for table
QRs now downloads ONE archive instead of N sequential PNGs. Pure-lib
STORE-method ZIP builder (no new dependency): PNGs are already deflate'd
so STORE loses nothing. **The honest bug story (kept in the commit and the
test header): the first draft wrote the central-directory size from `off`
AFTER it had advanced 12 bytes into the EOCD preamble — our structural
tests passed, python's zipfile refused the file. Independent verification
caught what the tests missed; the tests now pin the full EOCD contract
(declared size == actual distance to EOCD) and a generated archive unzips
clean with CRCs verified by python.** Per-table filenames unchanged inside
the archive; per-file single-QR downloads untouched.

**Next:** W2-ORD-2..5 + W2-LNK-2..6 + W2-BOT-6..9 (the P3 polish wave),
per the register's priorities.

**W3-6 · The P3 polish wave (four repos, continuous cadence).** With the
credentials live, every register P3 item shipped the same session:
- Smart-Link `551b787` (W2-LNK-4/5/6 + two documented dispositions): the
  landing footer owns the WhatsApp door (twin of the P40-5a header, honest
  hours in the accessible name, e2e-pinned); the JSON-LD SmartBot Service
  description became the product's own published identity (the fleet's last
  «على مدار الساعة»); back-to-top + install-prompt clear the iOS
  home-indicator zone. theme_color stays single-dark ON PURPOSE (manifest =
  default-dark brand splash; ThemeColorSync corrects live chrome incl.
  WebAPK; documented, not churned). Header/drawer CTA naming was already
  twin-consistent — verified, recorded, no change invented.
- Smart-Order `6fa9c27` (W2-ORD-2/3/4): checkout totals now re-derive from
  LIVE prices via a pure lib (the store endpoint already shipped products —
  they were being discarded); changed lines are marked, unavailable lines
  announce themselves and block submit (the server refusal was always
  correct — now the customer knows WHY before pressing). Cross-store cart
  replacement asks first. Staff page carries the seat counter + upgrade
  door from the SAME source of truth that refuses the POST (fill-then-fail
  dead end retired).
- SmartBot `e2fae51` (W2-BOT-6..9): /api/ai/generate-reply got its first
  consumer — an in-thread suggest button that plants a DRAFT (the human
  sends, always); the empty-reply WHY contract surfaces verbatim. The
  sequences N+1 parallel detail fetch retired (step_count has ridden the
  row since v24-C4 — the comment claiming otherwise was the map, not the
  territory). Two bare Loader2 loading states → shape-matched skeletons.
  Unsubscribe/resubscribe: the engine's status filter was already the
  truth; now there's a door to it (tenant-scoped, two-step confirm).

**The recurring lesson this wave (kept in commits and tests):** structural
tests passed a broken ZIP (python's zipfile refused it — EOCD +12 bytes);
a disabled send-confirm button swallowed an early click silently; an AI
button fired on a still-loading thread. Three instances of one rule: a
passing test only proves the contract it actually pins — so each fix
pinned the contract it learned (full EOCD shape, wait-for-enabled, thread-
loaded gating).

## Wave 3 continuation — 2026-11-02 evening (third recycle survived; batch W3-7)

**W3-7-0 · Third sandbox recycle; credentials re-delivered; standing
directive reaffirmed.** The box recycled again (third time in the program),
destroying `/home/z/my-project/p42-work` — but the durable layer held: the
format-patch store in the workspace repo survived, and (as designed in W3-0)
everything of value was already pushed, so nothing was lost. Owner
re-delivered GitHub PAT + EXPO×3 via IM with the standing directive
(verbatim): «احفظهم واعمل دوما commit and push to main باستمرار لكي لا
يتم فقدان التقدّم». Credentials stored durably (chmod-600, tracked in the
sandbox workspace repo which has no remote, outside all product repos —
secret-scan gates unaffected). Workspace rebuilt: fresh clones of all four
repos, all four verified CI-GREEN at HEAD before any new work. Discovery:
the previous session had already shipped W3-4..W3-6 (SmartBot plan-lock
`3ce58c3`, Smart-Menu QR-ZIP `50a76c2`, the P3 polish wave
`551b787`/`6fa9c27`/`e2fae51`) — the remote was ahead of the local session
report; the ledger is the source of truth and was already complete.

**W3-7 · Smart-Menu multi-menu upgrade propagation — FIXED `ea2a01bb`**
(the register's "technical, not policy" item; P38-adjacent — handled with
triple care). All three registered inconsistencies confirmed against the
code, then fixed toward r93 per-restaurant semantics:
1. Pending-payment block scoped per-restaurant — the app-layer probes were
   the stale pre-r93 remnant contradicting their own r93-N6 partial index;
   new shared `src/lib/pending-payment-scope.ts` mirrors the index bucket
   expression literally (absent key AND JSON-null = the new-subscription
   bucket; Prisma can't express "key absent" in path filters, hence
   findMany-then-JS-filter over the index-bounded few rows).
2. Every NEW restaurant starts at FREE caps + `planId: null` (was:
   inherited the user's possibly-upgraded paid caps with no planEnd —
   "free Pro forever" on every new menu). Admin explicit-plan path
   (r93-N4) and subscribe-approval provisioning untouched.
3. M-3 approval (deferred out of the zz_round93 migration by its own
   comment, never done until now): `SELECT…FOR UPDATE` on the restaurant
   row + tier re-check under the lock mirroring the request-time guard;
   `UPGRADE_TIER_NOT_HIGHER` → 409 actionable Arabic (payment rolls back
   to pending for approver action); the co-owner double-fee scenario now
   rejects. Honest boundary kept in the commit: a strictly-higher
   concurrent upgrade still succeeds at full price (documented pricing
   behavior).
User-level plan bump KEPT deliberately (maxMenus entitlement + expiry
guard/cron are load-bearing) → became owner-decision §6. Tests: 16 new
contracts; suite 2907→2927 green; author-check/lint/lint:idioms/typecheck/
build all green (the build gate honestly required the repo's own embedded
PostgreSQL — restored per its documented path, left running).

**W3-8 · W2-ORD-5 completed — Smart-Order `591cbd4`.** Categories +
delivery-zones manage pages get the family-stamp counter chips
(«الأقسام: X من Y» / «مناطق التوصيل: X من Y») + copper upgrade door at
cap, reading `caps` from the SAME GET endpoints the pages already used —
extended exactly the way `6fa9c27` extended staff. 3 unit contracts + 3
parity pins (508→511). CI green ×4 checks at final HEAD.

**W3-9 · P2-5 Expo SDK 58 evaluation — SUPERSEDED, closed with a record
correction** (`P42-EXPO-SDK58-EVALUATION.md`, new): the leap already
happened in P36 (2026-10-31); the zod/decode-uri-component advisories were
closed by overrides, not the jump; and the only remaining mobile advisory
(deepmerge, unpatched upstream) is closed by expo@58.0.22 dropping it from
the tree — a patch, not a breaking jump. Real remaining work = the staged
«58.0.22 patch wave» (Smart-Menu rides its Wave-8 rebuild; SmartBot/
Smart-Order lockfile-only preserving NO-REBUILD; smartlink-mobile — the
only true SDK-57 app — full jump as P3). Plan-first per D6: nothing
executed.

**W3-10 · Feature-level parity matrix — DONE** (P42-4d;
`P42-PARITY-MATRIX.md` expanded to the 8-state feature level across all
three apps, file:line evidence). Verdict: the core four states + expired-
session are solid on both surfaces everywhere; the systematic weakness is
plan-limit states on native. **Wave-4 gap register opened:** GAP-X1
(fleet-wide native plan-lock UI) + GAP-X2 (native offline banner) +
GAP-BOT-1 (native suspended-tenant state — the twin of the W2-BOT-4 web
fix), GAP-MENU-1 (native advanced analytics absent), GAP-SO-1 (native
reports lock + no pricing destination) as the P2 heads; P3s registered.
Wave 4 = the plan-lock family across the fleet, starting with GAP-X1.

**Session cadence note:** every unit of this batch was pushed to main the
moment it passed its gates (standing directive). CI links in the ledger.
