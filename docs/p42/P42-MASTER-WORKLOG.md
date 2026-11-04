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

## Wave 4 — 2026-11-02 night (the plan-lock family lands on native)

**W4-1 · GAP-X1 + GAP-BOT-1 — SmartBot mobile `81c86768`** (pushed, CI green
×4: quality-gates · osv · mobile · secret-scan). The plan-lock family and
the suspended-tenant honest state reach the native app:
- `mobile/src/lib/gates.ts:34-50` — the classifier, a literal twin of web
  plan-lock.ts (403 + the GATE_MESSAGES suffix «رقِّ خطتك»; the full family:
  5 _plan_gates messages + broadcast + sequences + rules-limit — copied
  verbatim from backend source into the tests).
- `mobile/src/components/premium-lock.tsx` — the PremiumLockCard twin
  (exact lucide-1.x Crown path from the published tarball so the icon set
  stays byte-identical to web) with «ترقية الخطة» CTA → the existing native
  /subscribe destination.
- Locks mount per the 3ce58c3 doctrine: scheduled composer (list stays),
  broadcast create+send (both gates; «بث جديد» hidden; empty-state hint =
  the web literal), calendar create-only (native-only asymmetry — the
  native calendar CREATES against has_scheduling while web is read-only;
  documented, not silently locked away), analytics defensive interception
  (the 5 gated advanced reads have no native surface — nothing invented).
- GAP-BOT-1: central suspension emission in the API layer (twin of the 401
  pattern; plan gates deliberately don't pass through) + full-page
  SuspendedState in the app layout (the native AuthGuard twin): web copy
  verbatim, ShieldAlert, ACTIVE support doors (WhatsApp/phone via the
  public /api/support/info that works under suspension), 60s /api/me recheck
  with the cache-eviction trap documented (a stale success must not
  un-suspend a future suspension).
- 56 new tests (29 classifier/behavioral + 27 source-contract render pins
  per the fleet's theme.parity precedent — the mobile runner is node-env
  only; honestly documented). Mobile suite 145/145; tsc/lint/expo-export
  (4.5MB hbc) green.

**W4-2 · GAP-X1 — Smart-Menu mobile `5e74620f` + CI fix `f90bf213`**
(pushed; CI at f90bf213 re-running at ledger-write — the 5e74620f run had
one root-job failure, root-caused and fixed same-session, story below).
- `mobile/src/lib/plan-limit.ts` — the classifier: 403 + BOTH web copy
  markers («لقد وصلت للحد الأقصى» + «قم بترقية خطتك») + kind/limit/planName
  parsing; deliberately NOT classifying the renewal 403 (wrong remedy) —
  negatives pinned.
- `PlanLimitLockSheet` — AppBottomSheet lock surface: server message
  verbatim, web promise line verbatim, «رقِّ خطتك» CTA, SR announcement.
- **The honest discovery:** the existing native subscribe flow is the
  NEW-SIGNUP wizard (tempRestaurants → POST /api/subscriptions) and is never
  mounted for an active owner (RootNavigator: role=owner ⇒ OwnerStack) —
  routing a cap-blocked owner there would be a dishonest dead end. So the
  agent ported the WEB CTA's real destination behavior: a new
  OwnerSubscribeScreen (upgrade mode: paid plans only →
  POST /api/subscriptions/upgrade with upgradeRestaurantId, target resolved
  via /api/auth/me exactly like the web; >99 LYD plans get the server's own
  cap copy + an honest web pointer; unresolvable target gets a support
  note — no dead buttons).
- Mounts: OwnerMenuScreen (item-cap catch, CTA carries the capped
  restaurant — BETTER than the web which always upgrades the primary) and
  OwnerRestaurantsScreen (menus cap, account-level like the web CTA).
- 23 new tests (classifier real-imports BOTH sides — the web's own
  PlanLimitError class builds the message, the mobile classifier must
  classify it; render pins raw-text per the r145 precedent). Suite
  2950/2952; parity 365/365; mobile tsc/lint/export green.
- **The CI lesson (kept in the fix commit f90bf213):** the root-job
  lint-build-test failed — vite:oxc discovers the NEAREST tsconfig for the
  imported mobile file; mobile/tsconfig.json extends expo/tsconfig.base
  which is only resolvable with mobile deps installed (present in the
  dedicated mobile CI job, absent in the root job). Local gates passed
  because mobile deps were installed — the environments differ. Fix: a
  standalone nested mobile/src/lib/tsconfig.json (no extends) winning
  nearest-first discovery everywhere; proven by simulating the broken
  extends locally (same failure → fix → 23/23 both states); all gates
  re-run green after.

**W4-3 · GAP-SO-1 — Smart-Order mobile `b58953ba`** (pushed, CI green ×4).
The severed upgrade path on native gets its first real destination:
- `mobile/src/app/merchant/manage/pricing.tsx` — the native pricing screen:
  the web cards' copy/numbers EXACTLY, sourced from the same public
  GET /api/plans the web /pricing loads (FALLBACK_PLANS diffed field-by-
  field against the web FAMILY_PLANS and PINNED by 23 anti-drift tests
  that read the web sources), badges/isPopular/yearly math/folded features
  all mirroring pricing-client.tsx; registered in the stack + a permanent
  hub row (perm:null).
- Reports: 403 PLAN_ENTITLEMENT → LockedState (web copy) + «عرض الباقات
  والترقية» door. Staff: 409 keeps the server message visible in-form +
  the upgrade door + the grey seats counter chip (the web staff:98 pattern;
  the numeral-only «2 / 3» form reverses in RTL RN Text — the Arabic-
  grammar «X من Y» family form used instead, hazard documented + pinned).
- Classifier on the real fail() envelope (status + body.error.code);
  refuses plain 403/409-DUPLICATE/422/network — pinned.
- 41 new tests (23 plans anti-drift + 18 classifier/wiring); mobile 85/85;
  root tsc/lint/unit 269/parity 511 green. NOTE: this session completed
  work from an interrupted agent (infra error) — the retry agent verified
  every pin against the real web sources before accepting it, added the
  seats counter, and kept 100% of the interrupted work.
- Fleet-level surprise recorded: Hermes hbc stores Arabic literals as
  UTF-16LE — plain bundle greps report false negatives for Arabic strings
  (bit both mobile agents); verify with a UTF-16LE byte scan.

**Posture change (honest, recorded in all three commits):** SmartBot and
Smart-Order mobile trees were NO-REBUILD (empty/dev-only diffs since the
P39-verified AABs) — these commits make shipped-AAB ≠ main, so the next
mobile release batch (the program's Wave-8 batching) must include them
alongside Smart-Menu's already-required rebuild. Parity matrix release
notes updated accordingly. GAP-MENU-1 (native advanced analytics) remains
an owner scope decision; GAP-X2 (native offline banners) and the P3s
remain in the register for later waves.

## 2026-11-02/03 — Wave 5 (Product completeness & web/native parity) — COMPLETE

Baseline re-verified before the wave: all four repos at the W4 SHAs, working
trees clean, CI green ×4/×2 on every HEAD (the reconciliation protocol).

**W5-1 · GAP-SO-2 + GAP-SO-3 — Smart-Order mobile `e1622fa`** (pushed; CI
success — mobile · lint+parity+build · E2E API · Browser e2e; Dependabot
runs green too). The fleet's only skeleton-doctrine violation ends:
- `mobile/src/components/skeleton.tsx` — the Skeleton primitive in **pure RN
  Animated** (zero new deps): the web family's exact recipe (muted ground +
  card-tone sweep, **1200ms literally-linear** loop, `radius.sm`, full stop
  under reduce-motion), Smart-Order's own theme tokens. **18 major surfaces**
  converted to shape-matched skeletons using each screen's real `makeStyles`
  dimensions (storefront, product, cart, tracking, dashboard, orders,
  order/customer detail, every manage screen incl. reports/settings/pricing).
  Every skeleton announces loading (`AccessibilityInfo.announceForAccessibility`
  + `progressbar`/`busy` semantics). Spinners remain — documented + test-pinned
  — only at the two shapeless gates (pre-font boot, pre-destination session).
- Offline: `@react-native-community/netinfo@12.0.1` (native module → rides the
  Wave-9 rebuild, noted in the commit). Global `ConnectivityBanner` in the
  root layout (guest + merchant); NetInfo → pure `isOnlineSnapshot` → tiny
  external store, **plus `onlineManager.setOnline` wiring** — react-query v5's
  reconnect auto-refetch/resume verified from query-core source, not assumed.
  Honest split: device-offline = rose banner; server-failure = per-surface
  ErrorState retry. Cart safety verified + pinned: in-memory zustand cart
  untouched by offline; `createOrder` fails loudly with one reused idempotency
  key. Web: family-consistent WifiOff strip in the merchant dashboard shell
  (`offline-banner.tsx`, `navigator.onLine`, aria-live).
- Verifications (zero changes — both HOLD, now pinned as source contracts):
  checkout W2-ORD-2 (server re-prices from live rows in a Serializable tx,
  availability/stock/min-order/plan gates, idempotency pre-check + raced-twin
  recovery; mobile sends choices only, cart clears solely on confirmed
  success) and entitlements (live `GET /api/plans`, server-body 403/409
  classification, no client-side enforcement anywhere).
- Gates: mobile tsc 0 · lint clean · **135/135** (was 85) · expo export ✓ +
  UTF-16LE byte-scan · root tsc 0 · lint clean · unit 269 · parity 511.

**W5-2 · GAP-X2 + GAP-BOT-3 — SmartBot mobile `78fc1386` + `1a4a85c4`**
(pushed; CI success ×4: quality-gates · osv · mobile · secret-scan).
- `78fc1386` — the offline banner: netinfo installed (zod `dev:true` lockfile
  quirk reverted — diff is netinfo-only); `connectivity-banner.tsx` = the web
  strip's twin (verbatim copy «انقطع الاتصال بالإنترنت — سيتم إعادة المحاولة
  تلقائياً», WifiOff with byte-exact lucide-1.24 paths, `alert`+`polite`),
  mounted above the Stack in `(app)/_layout`. **The honest fix inside:**
  the existing `void onlineManager.isOnline()` was a **no-op whose comment
  falsely claimed** react-query auto-detects NetInfo — replaced with the
  documented `onlineManager.setEventListener` wiring (queries pause offline,
  refetchOnReconnect refreshes on return — the banner's literal promise is
  now true). Shared `isNetReachable` predicate in pure-TS `lib/connectivity.ts`.
- `1a4a85c4` — **GAP-BOT-3 decided: PORT** (evidence: one mutation + form
  over the existing gates family; the GET's admin audience = the mutation
  audience). **Byte-level discovery:** the seat-limit message «حد أعضاء
  الفريق لخطتك هو {n} — رقّ خطتك لإضافة المزيد» is a genuinely DIFFERENT
  family — ends «لإضافة المزيد» (not «رقِّ خطتك») AND «رقّ» lacks the kasra —
  so `isPlanLocked` misses it by design. Extended honestly: `isSeatLimit` +
  `SEAT_LIMIT_PREFIX`, verbatim backend copy in tests, both-ways family
  separation pinned (rules-limit stays a plan-lock). Treatment honest for a
  QUOTA (not a feature lock): verbatim server text + «ترقية الخطة» door
  inside the open form — no PremiumLock card («متاحة في Premium» would lie
  on a quota), no hidden buttons. Full web contract ported: add-member
  (form-encoded, thresholds 3/8, no double-submit), role change (per-member
  pending), delete (confirm).
- Publisher sweep (read-only): **zero violations** — landing is Facebook-only,
  pricing/connect carry no platform claims, README's Instagram/WhatsApp
  mention is the messaging flow engine, and no UI consumes `/api/publisher/*`
  at all. Mutation spot-check: all major native mutations already carry
  loading + self-disabling + confirms + honest server-text errors —
  documented, nothing to fix.
- Gates: typecheck 0 · lint clean · **181/181** (was 145) · expo export ✓ +
  UTF-16LE byte-scan.

**W5-3 · GAP-MENU-2 + GAP-MENU-3 — Smart-Menu `bd0657dd` + `9d460734`**
(pushed; CI success ×4: triage · lint-build-test · prod-qa · mobile).
- `bd0657dd` — the banner reaches the authenticated trees: mounted inside
  `AuthenticatedApp` (owner + admin + unpaid-owner AuthStack), above the
  stack, below the public overlay (one visible banner at a time; public
  mounts untouched). **Key discovery wired:** `refetchOnReconnect: true` was
  **dead config on native** — React Query v5's default onlineManager binds
  `window` online/offline which never fire on RN. Now `setEventListener`
  rides NetInfo (`providers.tsx`) with the banner's exact predicate. Honesty
  guards pinned: no optimistic `setQueryData` writes, 500 never shows the
  strip, native central 401 branch untouched.
- `9d460734` — the central 401 seam reaches `csrf-client.ts` (web): covers
  all ~62 previously-uncovered consumers with an idempotent once-per-page
  journey — keepalive `POST /api/auth/logout` + Arabic manual-dismiss toast
  (dynamic import, bundle guard) + 1200ms beat then
  `location.replace('/login?expired=1&redirect=<current>')`, riding the login
  page's existing server-validated `redirect` contract (family precedent:
  Smart-Order r132 A2-F5 + SmartBot v15-E5). Guard rails: `/api/auth/*`
  stays caller-local, login loop guard, SSR-safe, 500 never blamed, Response
  passes through unchanged, page-level handlers coexist without races.
- Verifications (both HOLD, file:line evidence in the agent record):
  plan/restaurant context (mobile CTA carries the capped restaurant id →
  `upgradeRestaurantId`; per-restaurant pending block intact; M-3 approval
  row-lock intact; new restaurants always start FREE caps `planId: null`)
  and demo integrity (archive filters on all 7 public surfaces; nightly
  canary workflow functional; no customer PII or payment details on public
  demos; the 4 archived items + 13 mixed orders untouched).
- Gates: mobile tsc 0 · lint 0-0 · parity **375/375** (+10) · export 7.6MB ✓
  + byte-scan · root author/lint/idioms/tsc ✓ · test **2969/2** (+19) ·
  build ✓.

**W5-4 · GAP-MENU-1 — Smart-Menu mobile `eaadd4a6`** (pushed; CI mobile ✓
triage ✓ at worklog-write, lint-build-test/prod-qa completing — links in the
ledger). **The last P2 parity gap closes — advanced analytics reaches native.**
Scope decision (principal): **IMPLEMENT** — evidence: the server-gated route
already exists (`requirePlanFeature(auth, restaurantId, 'advancedStats')`),
`react-native-svg@15.16.0` was already in dependencies (QR), and the
lock/upgrade family shipped in W4. No architectural expansion, zero new deps.
- `OwnerAnalyticsScreen` — the AnalyticsTab twin: dual gate exactly like the
  web dashboard (entitlements probe avoids the wasted fetch below tier; the
  403 from `/api/stats/advanced` is the fail-closed primary truth → lock,
  never a fake loading error), range labels verbatim («اليوم/هذا الأسبوع/
  هذا الشهر»), and every honest state: shape skeleton, per-card empty (web
  copy verbatim, `seriesHasData`-guarded — KPIs stay skeletons instead of the
  web's failed-load zeros), error + retry, locked.
- Charts on react-native-svg: SplineAreaChart (Catmull-Rom), ColumnChart,
  DoughnutChart, AreaChart, HorizontalBar, MiniSparkline + the
  `chart-geometry` port — mobile culinary tokens (zero raw hex); the
  doughnut's hover-grow became press-grow (no pointer on touch).
- `plan-feature-gate.ts` — the second 403-family classifier («هذه الميزة
  متوفرة في خطة…»), a separate module so the count-cap classifier
  (5e74620f) stays byte-untouched; disjunction pinned in both directions.
- `PlanFeatureLockCard` — the PlanFeatureLock twin (تعطيل + تفسير + working
  door → `OwnerSubscribe` carrying the restaurant id, the W4 doctrine).
- Mount: dedicated `OwnerAnalytics` on OwnerStack (registered exactly like
  OwnerSubscribe) + an unconditioned dashboard section card — the native
  twin of the web's always-visible analytics tab; the lock lives inside.
- Gates: mobile tsc 0 · lint 0-0 · parity **395/395** (+20) · export 7.7MB ✓
  + byte-scan · root author/lint/idioms/tsc ✓ · test **2989/2** (+20).

**Wave-5 verdict:** every gap in the Wave-4 GAP register is now closed —
GAP-X1 ✓ (W4) · GAP-X2 ✓ fleet-wide · GAP-BOT-1 ✓ (W4) · GAP-BOT-3 ✓
(ported) · GAP-MENU-1 ✓ (implemented) · GAP-MENU-2 ✓ · GAP-MENU-3 ✓ ·
GAP-SO-1 ✓ (W4) · GAP-SO-2 ✓ · GAP-SO-3 ✓. **Fleet-level discovery worth
the register:** React Query v5's onlineManager defaults to `window` events
on React Native — `refetchOnReconnect` was silently dead in ALL THREE native
apps before this wave (each app's fix is pinned by its own tests). Release
posture: netinfo is a new native module in SmartBot + Smart-Order — both
already REBUILD-REQUIRED since W4; Smart-Menu likewise. The Wave-9 release
batch absorbs all of it.

## 2026-11-02/03 — Wave 6 (Backend, database & operational reliability) — COMPLETE

Three parallel deep audits (one per product backend) with the same posture:
audit deep, fix clearly-verified authorized defects, document the rest. All
three verdicts: **zero open P0/P1** — the prior isolation waves held under
adversarial re-verification.

**W6-1 · SmartBot backend `211a4215`** (pushed; audit method: AST route table
of all ~230 endpoints across 37 routers with per-endpoint auth/tenant
analysis + adversarial by-id tracing + FK/cascade/index coverage over 53
models). Zero P0/P1 — plan gates all server-side, payments server-authority
intact (atomic claims + partial unique index), secrets never unmasked.
Fixed: (P2) tenant-deletion sweep missed the 4 v19 Step-2 tables
(fb_posts/ad_accounts/ad_campaigns/ad_items — deleted tenant's posts + raw
ad payloads survived "complete" deletion forever) → 4 models added to the
sweep + 2 tests; (P3) reset-password non-numeric user_id → raw ValueError
500 + CRITICAL alert on an admin typo → guarded conversion, clean 422
Arabic (the `_as_int` bool-is-int trap handled) + 3 tests. Gates: pytest
1272 passed/3 skipped forward AND reverse-order (hermeticity), coverage
68.37% ≥ 66 floor, ruff clean, secret-scan clean. Author metadata corrected
post-agent (agent-p42-6a@ → ahmadmedo1012) before push — a process lesson
recorded for future briefs.

**W6-2 · Smart-Menu backend `3834e766`** (pushed). Zero P0/P1 — every
isolation surface re-verified with file:line (owner ladders, admin
permissions, public payload filters, PII ladders, rotation-proof rate caps);
ea2a01bb semantics intact (per-restaurant pending block, M-3 row-lock,
FREE caps for new restaurants); order money path fully guarded (server
re-pricing, restaurant row-lock cap, terminal-cancelled, idempotent
money-only replay). **Fixed a real P2 cap-bypass hole:** unarchive accepted
`{archivedAt: null}` with NO cap check while POST counts live items only —
an owner at maxItems=N could archive k, create k replacements, unarchive →
N+k live items above the paid cap. Fixed with the POST-family guard
(Restaurant FOR UPDATE in one tx → maxItems under the lock → live count
scoped to the DESTINATION restaurant for move+restore → PlanLimitError
403). 10 new tests; suite 2999/2; build green (migrate deploy + 87/87
pages on the embedded PG). The 4 archived items + 13 mixed orders
untouched (behavior-only fix).

**W6-3 · Smart-Order backend `58db2f6` + `e6500e9` + `829868d` +
`8b1d36d`** (pushed). Zero P0/P1 — all 47 API routes audited; checkout
money-safety, plan caps, CAS discipline all hold under adversarial
re-verification (raced idempotency, in-tx conditional stock decrements,
in-tx Serializable plan gate). Fixed 4×P2: (1) register fan-out made
ATOMIC — was 4 independent writes where a raced slug burned the email with
an unrecoverable orphan account (login works, requireBusiness refuses
forever); now one interactive transaction (user + business + OWNER
membership + default payment methods + audit row) + tx-contract pin.
(2) Two hot Order indexes on BOTH schema twins (SQLite + PostgreSQL
variants): (businessId, createdAt) for the merchant list + money-path
daily count; (orderNumber, customerPhone, createdAt) for the public
track-lookup that was a full-table scan. (3) Products PATCH price now
carries POST's r140 999_999_000 cap (edit could reach the MAX_SAFE_INTEGER
edge). (4) make-admin.js refuses NODE_ENV=production before any DB
connection (repo-published QA credential; validated live against an
ambient foreign DATABASE_URL — aborted pre-write). Gates: tsc 0 · lint
clean · unit 274/274 (+5) · parity 511/511 · schema-twins + prisma
validate both providers · **E2E API battery 168 passed in-session** (CI's
exact chain) · browser e2e 13 passed (1 flaky-on-retry).

**Fleet posture after W6:** every backend re-audited end-to-end with
adversarial tracing; the multi-tenant + money-path enforcement held
everywhere; 7 verified defects fixed (1 data-retention, 1 admin-UX 500, 1
cap-bypass, 1 atomicity/orphan-account, 2 hot indexes, 1 input-cap, 1
prod-guard); ~25 P3s documented with proposals in the agent records
(/home/z/my-project/agent-ctx/P42-6{a,b,c}-*.md — mirrored into this
program's durable records at the next docs commit).

## 2026-11-03 — Waves 7+8 (SEO/discoverability + security/accessibility/performance) — COMPLETE

**W7 — SEO & discoverability (§7).** Four parallel audits (one per product),
all evidence-based; two agents were interrupted mid-work and their partial
work was verified-and-completed by retry agents (the W4-5c precedent —
both partial works survived verification 100%).

- **SmartBot `1b5d9043` + `0607b4ce` + `1aa1676e`** (pushed, CI ×4 green):
  og:locale ar_AR re-declared on all 8 child-OG routes (the r133 ruling was
  live on the landing only — child openGraph REPLACES the root object, the
  v9-E2 shallow-merge family); /login og:image completed (imageless WhatsApp
  cards — the market's dominant share channel); root twitter.title removed
  so X cards read each route's own og:title; JSON-LD truth sync (FAQ
  encryption answer == visible copy verbatim — the W2-C3 fix never
  propagated to schema; Organization knowsLanguage trimmed to Arabic-only
  per r144 doctrine); 6-twin pin wall (vitest + parity.mjs). Verified
  clean: titles/canonicals/robots/sitemap, marketing truth (zero
  X/LinkedIn/Instagram publishing ads), prices match DB seed.
- **Smart-Menu `4e650a52`** (pushed, CI ×4 green): dead JSON-LD values
  leave the machine — empty description `""` (schema default leaked to
  every description-less restaurant), empty `hasMenuItem: []` sections
  (all items archived/sold-out left structural husks), fully-empty menus
  drop the whole Menu entity above the honest «قائمتنا قيد التحضير»;
  sitemap lastmod truth (fake new Date() on static routes removed);
  +10 pins; suite 3009/2; build green. Private trees triple-excluded
  (robots + noindex + 307); demo posture deliberate + pinned.
- **Smart-Order `d8a13d5`** (pushed, CI ×4 green incl. both e2e): the
  discovery contract — /track/[token] gets canonical:null + meta noindex +
  **X-Robots-Tag: noindex header** (triple-layered out of indexes; the
  122-bit order credential never rides any head signal; the DB-outage
  branch also covered — a throwing generateMetadata used to render 200
  with NO robots meta); checkout noindex+self-canonical (was nofollow +
  homepage canonical — the family's last contradiction); lib/site-url.ts
  one-origin resolver (env-unset used to silently empty the sitemap);
  store OG og:url+og:site_name restored (the money page lost them on every
  share — shallow-merge again); robots /api/media/ opening verified
  scoped; +19 pins; unit 284 · parity 520 · build 40/40.
- **Smart-Link (audit-only, zero commits):** every checklist item HOLDS
  with live-production evidence (all 6 routes' metadata byte-identical to
  HEAD; zero redirect chains; product claims all truthful — W2-LNK-5,
  B1-M1 pins hold; sw.js v2 + manifest verified live; full gate set green
  incl. e2e 334 with only Chromium OOM flakes under parallel load).

**W8 — Security (ASVS+MASVS) + Accessibility (WCAG 2.2 AA) + Performance
(honest numbers) (§8).** Four product agents (two interrupted → verified +
completed; Smart-Link's orphan commit gate-verified by the session manager
after the agent died post-commit).

- **SmartBot `bb4e4a02` + `d7b68694`** (pushed): the interrupted agent's
  length-cap family (rules/broadcasts/templates — every cap matches the
  actual model columns, 422-Arabic D1-H1 family) kept 100% + the gap it
  missed fixed (non-string broadcast name → raw 500 on `{"name":{"a":1}}`
  — isinstance guard + pin); safeRedirect had ZERO tests → 6-test matrix
  wall (//evil.com, backslash, javascript: all rejected); stale zod OSV
  suppression removed per its own removal clause (both lockfiles at
  4.6.7); SSRF/CSRF/secrets/MASVS verified clean (SecureStore, permissions
  [], no inbound deep links); a11y gates all green (0 unnamed icon-only
  buttons/244 files, contrast AA, 101 native labels); perf: common base
  193.1KB gz ≤195KB budget, prod warm 0.10s edge HIT, hbc flat 4.5MB.
  pytest 1281/3 · ruff · tsc · vitest 624 · build ×2 · secret-scan · OSV.
- **Smart-Menu `e7294e50`** (pushed, CI ×4 green): **a real open-redirect
  bypass fixed** — the r118-A4-P3 guard rejected `//` and `/\` but the
  WHATWG parser strips ASCII tab/LF/CR before path grammar, so
  `?redirect=/%09/evil.com` passed all three checks then parsed
  CROSS-ORIGIN in both sinks (proven live: new URL origin === evil.com);
  fixed by rejecting all C0+DEL control chars in both safeRedirectTarget
  twins — the W5 401 seam and the proxy both ride this exact param, so the
  guard is the single choke point; +9 pins; suite 3018/2; build green.
  Everything else verified clean: upload magic-byte validation + tenant
  paths, zero SSRF surface, zero raw mutating fetches outside csrfFetch
  (PCRE2 sweep), rotation-proof order rate caps, SecureStore WHEN_UNLOCKED,
  allowlist-parsed deep links, VIBRATE-only permissions; perf measured
  (menu HTML 22.3KB gz from ISR, 26 chunks ~370KB gz, fonts 194.4KB
  documented as candidate optimization).
- **Smart-Order `d9b4f1e`** (pushed, CI ×4 green incl. both e2e): native
  touch-target floor — 6 interactive controls sat at ~32-36px (chips,
  store back, cart qty, calendar nav, staff remove) → all raised to the
  44px floor + 6-test source contract; FAQ JSON-LD got the r140 <-escape
  (last inline ld+json without it); 3 blank-target links lacked
  rel="noopener noreferrer" (the new parity sweep caught the third that
  manual grep missed). Security verified clean (zod caps mirrored
  client/server, cuid capability URLs enumeration-infeasible, no SSRF, no
  open redirects, SecureStore-only tokens, permissions [], QR client-side
  over origin+slug only, 0 web dep advisories). Contrast numerically
  verified 6.5-15.9:1 both themes. Perf: prod store page 41.6KB HTML /
  TTFB 0.57-1.68s ISR / initial JS ~305KB gz (three.js globe NOT in
  initial payload) / hbc 3.47MB flat.
- **Smart-Link `44d151b`** (pushed, CI ×2 green incl. full e2e): **the
  owner's private notification email was shipping in public client
  bundles** — ownerEmail lived on the SITE object while three client
  components imported SITE, literal-scribing the object into 6 public
  chunks («never displayed» was true in the DOM and false in view-source);
  the constant moved to its only consumer (server route, never bundled) +
  a unit pin (SITE carries no private keys — rejects any future
  owner/private/secret/token/apikey key) + a new e2e gate
  (bundle-secrets.spec.ts) reading the real build output and stripping 7
  credential shapes (re_/sk-/ghp_/AKIA/AIza/xox/PEM — the thresholds born
  from a real false-positive: Tailwind's mask-image sk-); axe tags
  upgraded from 2.1 to **wcag22aa** (axe-core 4.14's target-size 2.5.8
  sees beyond the custom touch-target inventory). Verified by the session
  manager after the agent's post-commit crash: lint · unit 45/45 · parity
  598 · truth 59 files · build · new e2e 2/2 · touched offline +
  r9-coverage specs 23/23.

## 2026-11-03 — Wave 9 (SDK-58 internal patch wave + the six release builds) — COMPLETE

**The «58.0.22 patch» (evaluation §6 executed as written; agent records
P42-9a/9b/9c).** Three atomic lockfile-only commits, one per product app,
each gated before push:

- **Smart-Menu `7ebf6a9f`** (Stage 1): `expo ^58.0.0 → ~58.0.22` +
  `expo install --fix` (exactly 2 bundled-module shifts: expo-build-properties
  ~58.0.12, expo-dev-client ~58.0.18) + pnpm-lock regen (895 packages).
  **deepmerge left the tree** (3 lockfile refs → 0), `@expo/config@58.0.10`
  (the deepmerge-dropper), `@expo/cli@58.1.18` (zod pin gone from its deps),
  overrides block byte-identical. expo-doctor **20/20**; OSV mobile tree:
  1 advisory (deepmerge) → «No issues found». CI run 41558667724 success.
- **Smart-Order `52a4dca`** (Stage 2a): same patch via npm — lockfile diff
  1 removed (deepmerge) · 0 added · 18 changed entries, all inside the expo
  patch family. CI run 41558671936 success ×4 (+ 4 Dependabot runs green).
- **SmartBot `e9fa9fb5`** (Stage 2b): same patch + `dec-deepmerge-unpatched`
  retired in `docs/decisions-ledger.md` per its own removal clause (the one
  repo with an in-repo exception ledger). CI run 41559913294 success ×4.

Stage 3 (smartlink-mobile 57→58 full jump) NOT taken — remains documented
P3 (evaluation §6: optional-advised, separate decision; see F-04).

**The release batch — six EAS Android builds, all FINISHED
(2026-11-03 01:29–01:31 UTC, v1.0.0 / build 4 each):**

| App | Profile | Distribution | Build ID | Git SHA | Completed | Expires |
|---|---|---|---|---|---|---|
| smartbot | production | STORE | `99911883-0abc-4e3c-aa55-60b4f1d28d88` | `e9fa9fb551` | 01:53:28 | 2026-12-03 |
| smartbot | preview | INTERNAL | `5b244fad-3954-495a-b589-24150d37cfcd` | `e9fa9fb551` | 01:53:34 | 2026-11-17 |
| smart-menu | production | STORE | `cdee59ee-4805-4fa7-88d8-18b2db112b6f` | `7ebf6a9ff0` | 01:51:38 | 2026-12-03 |
| smart-menu | preview | INTERNAL | `36a49c5a-08e2-45bc-91ef-87778d893668` | `7ebf6a9ff0` | 01:52:24 | 2026-11-17 |
| smart-order | production | STORE | `57e36480-fe79-452e-9772-499ef559151d` | `52a4dca71c` | 01:55:00 | 2026-12-03 |
| smart-order | preview | INTERNAL | `b9dafa52-7418-4dbf-b684-283254a3bd62` | `52a4dca71c` | 02:16:35 | 2026-11-17 |

No OTA channels exist in the family (no `updates` / `runtimeVersion` /
channel in any app.json/eas.json — verified by grep) → **every future code
fix requires a full binary rebuild.** This fact becomes the W10 external
blocker below. (Store artifacts were NOT uploaded/distributed in W9 —
release gating remained with the owner.)

## 2026-11-03 — Wave 10 (10a independent review + remediation 10b) — COMPLETE on web; smartbot binary BLOCKED-EXTERNAL

**10a verdict — «NOT READY AS A FLEET — two blockers»** (agent record
P42-10a; counts P0=0 · P1=1 · P2=1 · P3=8):

- **F-02 (P1)** — Smart-Menu web production was quietly dead for five
  waves: **all 8 production deploys W4→W9 state=ERROR**
  (`5e74620f`, `f90bf213b`, `9d460734`, `eaadd4a6`, `3834e766`, `4e650a52`,
  `e7294e50`, `7ebf6a9f`; last READY was W3 `ea2a01bb`). Root cause
  (Vercel build logs, read-only API): `.vercelignore` strips `mobile/`
  (by design — EAS builds it), but W5's parity tests
  (`tests/unit/mobile-plan-limit.test.ts`,
  `tests/unit/p42-5d-mobile-analytics-feature-gate.test.ts`) import
  `../../mobile/src/lib/**` → `next build` type-check **TS2307** on the
  stripped Vercel upload. CI checks out the full tree → green; Vercel →
  red. The seam was born in W5 and went unwatched for five waves.
  **Fix `e7a52ecd`:** `.vercelignore` += `tests/`, `tests/e2e/`,
  `maestro/` (the SmartBot family pattern; zero src/ changes; CI keeps
  full-tree coverage). Dual gates: full-tree typecheck 0 + Vercel-upload
  simulation (tests/+maestro/+mobile/ moved aside) `tsc --noEmit` 0.
  CI run 41610376913 success → **production deploy READY 2026-11-03
  09:21:37 — first success after 8 failures**. Live triple verification:
  `/api/health` → `commitSha e7a52ecd…` db connected · `/sitemap.xml`
  static-route lastmod gone (W7 live) · login bundle carries the W8b guard.
- **F-01 (P2)** — SmartBot login `safeRedirect`
  (`fb_dashboard/frontend/src/app/login/page.tsx`) lacked the W8b
  control-char rejection: WHATWG strips TAB/LF/CR before path grammar →
  `?redirect=/%09/evil.com` survived the guard and parsed cross-origin.
  **Fix `7f7c5692`** — verbatim port of Smart-Menu `e7294e50`: reject the
  whole `[\x00-\x1f\x7f]` class before any other check. Regression wall
  6→11 contracts in `LoginRedirect.test.tsx` (live semantics proofs:
  `new URL("/\t/evil.com", base).origin === "https://evil.com"` for
  TAB/LF/CR; vectors `/%09/`, `/%0A/`, `/%0D/`, `/%7F/evil.com` →
  `/dashboard`). Gates: 11/11 · tsc 0 · eslint 0 · full frontend suite
  **65 files / 629 tests**. CI run 41611252036 success ×4 → both Vercel
  projects (smart-bot-api + smartbot-frontend) deployed READY at
  `7f7c5692` (09:28). Live: production bundle (chunk `0noaqbwwrgp9f.js`)
  contains the fixed guard verbatim.
- **F-03…F-10 (P3 register)** — documented, none blocks release; owned by
  the next maintenance wave (full table in the issue register W10 section).

**The remaining blocker is EXTERNAL — EAS free-tier quota.** The smartbot
STORE artifact (`99911883`, git `e9fa9fb551`) **predates the F-01 fix
commit**; the 10a directive requires the store binary to be rebuilt at
`7f7c5692` before any Play Store upload. The rebuild was attempted in 10b
and **refused by EAS: free-plan Android quota exhausted (15/15, resets
2026-12-01)** — the account shows **17 Android builds created
2026-11-01..03** (9 on Nov 1 across the P41 batch incl. madarek-mobile and
subnation · 2 madarek Nov 2 · the 6 W9 builds Nov 3). Precision, so nothing
is overstated in either direction: the F-01 delta (`e9fa9fb5..7f7c5692`)
touches only `fb_dashboard/frontend/` — `git diff` shows **zero mobile/
impact**, and `mobile/src` has no redirect-handling login (grep) — so the
stale binary does not embed the vulnerable web code path; the staleness is
commit-provenance (not built at a fix-carrying SHA). Per the standing
directive the stale binary is **NOT uploaded/distributed**; the rebuild
waits for the quota reset (free) or a paid plan (requires explicit owner
approval — not purchased). Documented as owner-side external release
dependency in the owner-decisions register.

**10b final reconciliation (same day, session manager):** re-verified all
four remote heads from origin (`be0582ce` / `7f7c5692` / `e7a52ecd` /
`52a4dca` — no newer commits; ancestry confirmed W9→W10), CI check-runs
green on every head, all five Vercel production deployments READY at
exactly those SHAs (smartlink · smart-bot-api · smartbot-frontend ·
smart-menu · smart-order), live endpoints 200 + health commitSha match +
bundle guard match; EAS inventory re-queried read-only (the table above);
this document set reconciled to reality — W9/W10 sections were missing
from every canonical doc until now (the dashboard said green before the
ledger did; that inversion is itself the W10 lesson).

---

## 10d — Post-closure re-verification + the Vercel account block (2026-11-04)

Continuation session of the final-reconciliation directive (same lineage as
10c; the sandbox had recycled the clones — fresh clones verified against
origin). Nothing reopened without regression evidence; no paid actions; no
destructive cleanup.

**Baseline re-verified (all four repos):** the P42-closure heads remain
strict ancestors of current `main` (compare API: behind=0 everywhere); P43
waves have since advanced three repos on top — SmartBot `7f7c5692 →
2522399b` (+3), Smart-Menu `e7a52ecd → 29a8936e` (+5), Smart-Order
`52a4dca → af1a5bf7` (+8); Smart-Link still at `f1aa2ff` (the 10c docs
commit). CI on current heads: Smart-Link 2/2 · SmartBot 4/4 · Smart-Order
4/4 success; Smart-Menu main gates green (lint-build-test / prod-qa /
triage) but its **scheduled canaries (`ping`, `demo-canary`) fail —
symptom of the block below, not a regression**. Working trees clean on
fresh clones at all four current heads.

**NEW EXTERNAL EVENT (discovered this session, 09:42 UTC): Vercel account
soft-block — all four production sites DOWN (402).** The team object
(`team_bBctUHIWiI5k3h4rYmp4rzBp`) carries `softBlock`:
`FAIR_USE_LIMITS_EXCEEDED` · overage `fluidCpuDuration` · blockedAt
**2026-11-04 02:41:35 UTC** · auto-unpause **2026-12-04 02:41:35 UTC**
(exactly 30 days). Verified from two independent directions — the API
field, and live probes: `smart-link.ly`, `menu.smart-link.ly`,
`bot.smart-link.ly`, `order.smart-link.ly` ALL answer `402
DEPLOYMENT_DISABLED` (vercel.app deployment URLs too). Deployments are
paused account-wide: SmartBot's CI-green `2522399b` (pushed 03:36) has NO
deployment — the last successful production deployment is `070f4e00`
(02:10, 31 minutes before the block). **This is NOT a P42 regression**:
every W10 live verification was performed 2026-11-03, hours before the
block; the block is an account-level quota event of the same external
category as the EAS quota blocker. The program dashboard now carries a
live banner (driven by the same softBlock field + domain probes — it
clears itself automatically when the block lifts) and the owner options:
Pro upgrade (paid — explicit approval required, NOT purchased), wait for
auto-unpause 2026-12-04, or Vercel support (owner register §8).

**EAS re-verified read-only (GraphQL `api.expo.dev`):** the six W9 builds
unchanged (FINISHED, same IDs/SHAs; **no new builds since 2026-11-03
01:31** — the P43 waves pushed none); quota state unchanged (17 Android
builds in the November window ≥ 15 free limit; INTERNAL artifacts expire
2026-11-17, STORE 2026-12-03). Token status **CORRECTED vs 10c's note**:
EXPO_TOKEN_1 works — this session's inventory query ran on it (HTTP 200);
the 10c "revoked" reading was wrong. What actually broke is **schema
drift**: `App.platform` and `Build.buildNumber` no longer exist on the EAS
GraphQL schema (use `Build.platform`, `appBuildVersion`, `releaseChannel`)
— old queries 400/403 depending on token; TOKEN_2/_3 now 403 on account
queries (`me: null` — restricted scope). Credentials file annotated.

**Mobile-binary validity re-verified against the P43-advanced sources**
(compare API, file-by-file): smart-menu `7ebf6a9f..29a8936e` — 51 files,
**zero** `mobile/` or app-config files; smart-order `52a4dca..af1a5bf7` —
51 files, **zero**; smartbot `e9fa9fb5..2522399b` — 28 files, **zero**.
The four valid W9 binaries therefore remain valid for the current sources;
the smartbot pair remains stale-by-provenance (pre-F-01) and still must
not be uploaded or distributed.

**Workspace (dashboard repo) commits reconciled** — unchanged from 10c:
`7654215` (W10 remediation) → `6f78617` (dashboard verification fixes) →
`4c145bc` (10c session record); the workspace repo deliberately has NO
remote (credentials live in it; stated policy in
`download/p42-credentials.env`); the owner's continuous-push order applies
to the product repos, all verified pushed. This session's record stacks on
top locally.
