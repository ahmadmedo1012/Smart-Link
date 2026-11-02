# P42 — CI DELIVERY LEDGER

Commit-by-commit main delivery with gate evidence. All pushes by P42
(integrator identity: ahmadmedo1012, matching repo history). "CI" = the
repo's main quality-gate workflow conclusion on that SHA.

## SmartBot — `832044d3 → 7d8bb1bb` (3 commits)

| Commit | Subject | Local gates | CI |
|---|---|---|---|
| `fa7d9b4e` | fix(trust,P42) F2 — plan cards stop promising instant support | ruff · pytest schema 6/6 + plan-gates 18/18 · tsc · vitest 598/598 · parity 588 · build 44/44 · bundle 193.1KB ≤195 · i18n/a11y/contrast gates · secret-scan | ✅ |
| `629b4b2c` | fix(trust,P42) F1 — 13 reachable intents, not a decorative 14th | (same suite) | ✅ |
| `7d8bb1bb` | fix(trust,P42) — pricing footnote sells updates within the plan | (same suite) | ✅ success @ `7d8bb1bb1` |

## Smart-Link — `fdc5f24 → 0a9bceb` (4 commits)

| Commit | Subject | Local gates | CI |
|---|---|---|---|
| `ec42800` | fix(pricing,P42-2d) — Menu claim drops «شهريًا» (lifetime cap truth) + 9 section-scoped truth-gate pins (negative-tested) | audit/lint/unit 44/44/parity 595/truth-gate 59 files/build · e2e 333 passed +1 flaky | ✅ success (run 148) |
| `9b8bae7` | chore(deps,P42) root minimatch ^11.0.1 + zod 4.4.3→4.6.7 | prod-audit exit 0 · lint 0 · unit 44 · parity 595 · tsc-strict build | ✅ |
| `a6590be` | chore(deps,P42) mobile overrides minimatch+glob (glob 13.0.6→14.0.3) | mobile: typecheck · vitest 5/5 · expo lint · CI=1 expo export → .hbc | ✅ |
| `0a9bceb` | chore(deps,P42) dependabot.yml /mobile entry | YAML-validated | ✅ success (run 151; 149/150 cancelled-by-concurrency, not failures) |

## Smart-Menu — `c98b183b → 72e4e2c9` (7 commits)

| Commit | Subject | Local gates | CI |
|---|---|---|---|
| `85957634` | fix(pricing,P42) — CountUp retired from contract numbers + r92 render pins (Free 1/10/100, no «حتى 0») | tsc · eslint · lint:idioms (4 gates/517 files) · test:coverage 2877 pass | see 72e4e2c9 |
| `c95b5bc3` | fix(mobile,P42) — free card «مجاني/مجانية للأبد» | mobile tsc · parity 365 · eslint | see 72e4e2c9 |
| `307786a5` | chore(qa-seed,P42) — QA ladder matches the sold ladder | (covered by CI seed battery) | see 72e4e2c9 |
| `884d6bf0` | test(P42) — live demo canary (nightly, env-gated) | targeted: 49 pass, canary correctly skips offline | see 72e4e2c9 |
| `300a7851` | docs(runbook,P42) — the Review-FK step + pinned row IDs | — (docs) | see 72e4e2c9 |
| `31c5053c` | chore(deps,P42) root — minimatch 11 · brace-exp 1.1.20/5.0.11 · vite 8.1.6 · vitest 4.1.12 (16→2 advisories, prod clean) | tsc · eslint · test:coverage 2877 · audit prod clean | superseded by concurrency |
| `72e4e2c9` | chore(deps,P42) mobile — exact pins minimatch 11.0.3 + glob 14.0.3 (pnpm-overrides precedence documented) | mobile tsc · parity 365 · eslint · CI=1 expo export android | ✅ success (run 41383525642: triage + prod-qa + mobile [expo export on overrides] + lint-build-test all green) |

## Smart-Order — `b26efe0 → 3221aff` (5 commits)

| Commit | Subject | Local gates | CI |
|---|---|---|---|
| `bbe895c` | feat(plan-truth,P42) — per-plan resource caps (Free 3 cats/1 zone; paid 500/200; 409 PLAN_LIMIT + Arabic copy; X-lock in-tx) | unit 258/258 · lint · parity 508 · build (strict tsc) · bun audit clean · api-e2e syntax | see 3221aff |
| `ac47c36` | fix(dashboard,P42) — badge truth for planless businesses | (same) | see 3221aff |
| `ff6feb6` | fix(landing,P42) — quantifier honesty <10 + wallet-cap copy + contract tests | (same) | see 3221aff |
| `d95fa4b` | fix(seeds,P42) — demo wallets de-realized (upsert heals on deploy) + Free catalog | (same + seed idempotency) | see 3221aff |
| `3221aff` | chore(deps,P42) — mobile overrides + first dependabot.yml | mobile: tsc · vitest 44/44 · eslint (expo export in CI) | ✅ success @ `3221aff00` |

## Notes
- **Final Wave-1 verdict (all repos): main CI GREEN at final HEAD · production
  deployed at final HEAD (Vercel READY) · live changes verified on production**
  — smartlink @ `9ba91d9` (docs) behind `0a9bceb` code · smart-menu @ `72e4e2c9` ·
  smart-order @ `3221aff` · smartbot-frontend + smart-bot-api @ `7d8bb1bb`.
- Cancellation semantics: Smart-Menu/Smart-Link CI workflows use
  cancel-in-progress concurrency — intermediate SHAs' runs may show
  `cancelled` when superseded; the final HEAD's run is the verdict of record.
- The failing Dependabot workflows seen on branch heads are PR-branch runs
  ( Dependabot's own update branches), NOT main-branch failures. On main,
  all Dependabot runs post-fix are green.
- e2e batteries (Smart-Menu Playwright suite, Smart-Order api-e2e) run in
  CI's dedicated jobs; both repos' final-HEAD CI includes them.

## Wave 2 — 2026-11-02 (continuation)

| Repo | Commit | Subject | Branch gates before main | Main CI @ commit |
|---|---|---|---|---|
| Smart-Order | `c5314a3` | fix(pricing,P42) — CountUp retired from plan-limit rows + unit source-scan pin + browser SSR/no-JS pins | unit guard 1/1 local; browser battery via CI | ✅ at `8494d2f` (browser e2e first run caught the ISR-stale test-env premise; spec fixed to poll stale-while-revalidate, then green) |
| Smart-Order | `8494d2f` | fix(test,P42) — pricing spec rides ISR stale-while-revalidate | — | ✅ all four jobs |
| Smart-Order | `ccb0bd8` | fix(checkout,P42) — zero-payment-methods empty state + WhatsApp lifeline | code-read + prop-typecheck via CI | ✅ at `d25f840` (ccb0bd8's own runs cancelled-by-concurrency — superseded semantics) |
| Smart-Order | `d25f840` | chore(deps,P42-2) — mobile zod override ^4.6.6 | lockfile-only regen; mobile job in CI | ✅ all jobs + 4/4 Dependabot checks green |
| Smart-Menu | `0cf7a20` (from branch `0fa2e02`) | chore(deps,P42-2) — mobile security wave: 20/21 advisories closed | ✅ branch CI: mobile ✓ + lint-build-test ✓ + triage ✓ | ✅ (repo alerts 21→1) |
| Smart-Menu | `819ed4b` | docs(runbook,P42-2) — executed-state update + pinned 13-order owner decision | docs-only (triage) | ✅ |
| Smart-Menu | `4c6dd1c` | fix(owner,P42-2) — item delete P2003→409 blocker-specific remedies + UI error surfacing | code-read; full battery via CI | in flight at ledger time (prod-qa ✓ triage ✓ mobile skipped=no-mobile-change) |
| SmartBot | `c4716a8` (branch = main ff) | chore(deps,P42-2) — zod override trial + deepmerge documented exception | ✅ branch CI: mobile (the @expo/cli-on-zod-4 smoke) ✓ + quality-gates ✓ + osv ✓ + secret-scan ✓ | ✅ all |

**Temporary tooling (never merges):** `p42/demo-cleanup-tool` on Smart-Menu
(SHA-256-guarded cleanup route; `[skip ci]` commits; SSO protection disabled
only inside the two execution windows and restored; branch deleted after
delete-final executes). Merged temp branches deleted: Smart-Menu
`p42/deps-mobile`, SmartBot `p42/zod-override`.

### Wave-2 ledger closures (post-merge verification)

- Smart-Menu `4c6dd1c` main CI: **✅ all green** (lint-build-test ✓ prod-qa ✓
  triage ✓; mobile skipped = no mobile change). Production deployed READY;
  live check: delete-item 409 copy shipped.
- Smart-Order `d25f840` final HEAD: **✅ all four jobs + 4/4 Dependabot
  checks green**. Production READY; live check: /pricing renders the sold
  ladder with ZERO CountUp attributes and zero «حتى 0» in the document.
- SmartBot `c4716a8` main CI: **✅ all** (quality-gates, mobile, osv,
  secret-scan, Dependabot).
- Smart-Link `a8834cb` (branch-gated: mobile export = the SDK-57 zod smoke
  ✓ + lint/build/e2e ✓) → merged as main `$(git rev-parse --short HEAD)`
  (this commit); branch deleted.
- Smart-Menu demo imagery: live-checked — all four curated Unsplash IDs
  render on the public demo; the wrong salad-as-basbousa image is gone.
- Family Dependabot state after the wave: every repo carries at most the
  single unpatched deepmerge advisory (documented exceptions with upgrade
  triggers); Smart-Link's 5 open alerts (zod, decode-uri-component ×2,
  deepmerge ×2) close on the npm-lock rescan following the merge.

## Wave 2.5 — 2026-11-02 (local verification; push blocked on credential re-delivery)

**Environment:** sandbox recycling (×2) destroyed the workspace + credential
store. Fresh anonymous clones (now in the persistent project tree, with
format-patch backups in `download/p42-w3-patches/`). The GitHub PAT (and
Vercel/EAS tokens) must be re-delivered by the Owner before anything reaches
`main`. Every unit below is committed locally with full gate evidence; CI +
deploy + production verification fire the moment push access returns.

| Repo | Local commit | Subject | Local gates | CI / deploy |
|---|---|---|---|---|
| Smart-Menu | `cb04b1c` | feat(archive,P42-W3) — real item archival: schema + guarded migration (712/767/778/779) + all public-surface filters + owner tooling + 18 contract tests + runbook decision record | tsc-strict ✓ · eslint 0 ✓ · lint:idioms 4/4 ✓ · vitest 2896/2896 ✓ · next build (page-data) ✓ · migration-parity + e2e ride CI | pending push |
| SmartBot | `9bdec1c` | feat(dashboard,P42-W3) — W2-BOT-1/2/3 + W2-BOT-4 (connect dead-end, CSV export UI, usage counter + endpoint, honest suspended state) | FE: tsc ✓ eslint-0 ✓ vitest 604/604 ✓ parity 588 ✓ · BE: ruff ✓ pytest 41/41 | pending push |
| Smart-Link | `b3fa8b8` | feat(pwa,P42-W3) — W2-LNK-1 styled offline shell (sw.js offline disk + e2e proof) + P42 records + P42-OWNER-DECISIONS.md | e2e offline suite 4/4 (incl. real-SW styled-shell proof) ✓ · build ✓ · lint ✓ · unit 44/44 ✓ · truth-gate ✓ · parity 595 ✓ | pending push |

**Durable backups (survive sandbox recycling):** format-patches for all
three commits live in the persistent project tree under
`download/p42-w3-patches/` — verified to apply cleanly on a fresh clone of
remote `main` (Smart-Menu's checked: 18 files, +741/−36). If the workspace
is lost again before credentials arrive, the recovery path is:
clone → `git am download/p42-w3-patches/*.patch` → push.

**On push (the moment credentials arrive):** Smart-Menu main → CI
(migration-parity gate arbitrates the new migration) → Vercel deploy (build
runs `migrate deploy` → the guarded UPDATE archives the 4 items) → live
verification: both demo routes clean (16/25 items, zero test vocabulary),
canary green the following night. SmartBot main → CI (quality-gates, mobile,
osv, secret-scan) → deploy. Smart-Link main → CI → deploy (SW VERSION bump
re-caches the offline disk on next visit). Then delete
`p42/demo-cleanup-tool` branch (Smart-Menu remote).

## Wave 3 — 2026-11-02 (credentials restored: everything pushed, deployed, production-verified)

**Environment:** Owner re-delivered credentials over IM (GitHub PAT + Vercel
+ EAS ×3). Stored OUTSIDE all repos (`~/.p42/credentials.env`, 600) + git
credential store — never committed (secret-scan gates stay green). The
standing directive from this point: **commit and push to main continuously**
so no batch is ever hostage to a sandbox recycle again.

### The Wave-2.5 batch ships (was "pending push")

| Repo | Commit | CI | Deploy | Production verification |
|---|---|---|---|---|
| Smart-Menu | `cb04b1c` (archival) | [success](https://github.com/ahmadmedo1012/Smart-Menu/actions/runs/41458373464) | Vercel prod READY | **Direct live probes:** `/api/public/menu/al-waha-cafe` 16 items + `al-waha-cafe-demo` 25 items — zero test vocabulary in either; menu HTML pages 0 occurrences; print pages 0 real occurrences (2 CSS-comment false-positives only — «عقد الاختبار» in a contrast note); sitemap 0 refs. Migration ran at deploy (build-time `migrate deploy`): items visible before → gone immediately after the READY deploy. Order/review-row integrity is UPDATE-only by design (no DELETE in the guarded migration; 18 contract tests green in this CI run) — private dashboards by design, Owner can spot-check /owner/orders (the 13 mixed orders must list normally). |
| SmartBot | `9bdec1c` (W2-BOT-1..4) | [success](https://github.com/ahmadmedo1012/SmartBot/actions/runs/41458377429) | smartbot-frontend + smart-bot-api READY | Dashboard surfaces are auth-gated by design; behavior pinned by the batch's unit tests (CSV export row, usage endpoint+card, suspended classifier) running green in CI. Landing + API probe 200. |
| Smart-Link | `76858f7` (W2-LNK-1) | [success](https://github.com/ahmadmedo1012/Smart-Link/actions/runs/41458383953) | smartlink READY | **Direct live probe:** `https://smart-link.ly/sw.js` serves `VERSION = "v2"` + `CACHE = smartlink-offline-v2` + the page-derived offline disk — the styled-offline-shell contract is live. |

### Cleanup-path lockdown (Owner directive #3 — was blocked on push access)

- `git push origin --delete p42/demo-cleanup-tool` — **executed**; remote
  now carries `main` only (verified via ls-remote).
- **8 residual preview deployments deleted** from Vercel (6 ×
  `p42/demo-cleanup-tool` incl. both ERROR-state ones, 2 × `p42/deps-mobile`
  whose branch was already gone) — project list now shows main-only
  production deployments.
- Live probe `https://menu.smart-link.ly/api/p42-cleanup` → **404** (was
  already verified; re-verified after the wave).

### New work this wave (continuous-push cadence)

| Repo | Commit | Subject | Gates | CI / deploy |
|---|---|---|---|---|
| SmartBot | `3ce58c3` | **W2-BOT-5** plan-lock rollout: broadcast gate message joins the canonical GATE_MESSAGES family (ends «رقِّ خطتك» — was invisible to isPlanLocked); shared PremiumLockCard; scheduled page locks the composer (list stays — creation-gate doctrine); broadcast page locks create+send (send = downgrade path closes the confirm dialog); 6 render contracts (PlanLockRollout.test.tsx) incl. the v24-C2 confirm-enabled wait. sequences: no backend gate exists (documented) — nothing to lock; calendar page is view-only (no gated call). | BE ruff ✓ pytest 102/102 gate-family ✓ · FE tsc ✓ eslint-0 ✓ vitest 610/610 ✓ | [success](https://github.com/ahmadmedo1012/SmartBot/actions/runs/41461087752) · both Vercel projects READY |
| Smart-Menu | `50a76c2` | **W2-MEN-1** QR ZIP: «تحميل الكل» now downloads ONE archive (was N sequential PNGs). Pure-lib STORE-method ZIP builder (no dependency — r106-N2 philosophy), byte-level EOCD contract tests (the first draft's +12-byte central-size bug was caught by an INDEPENDENT verifier (python zipfile), not by our structural tests — the lesson is pinned: tests now assert the full EOCD contract; a generated archive unzips clean with CRCs verified by python). Button label + toast tell the single-file story; per-table filenames unchanged inside the archive. | tsc ✓ eslint-0 ✓ vitest 2883 passed + env-gated 24/24 (CI provides env) ✓ | in flight at write time → links to follow in worklog |

**Standing cadence from this wave:** every completed unit is pushed to main
immediately (Owner directive); CI + deploy links land in the worklog the
moment they complete; nothing accumulates unpushed.

### Wave 3 continuation (same day — the P3 polish wave, continuous-push cadence)

| Repo | Commit | Items | Gates | CI / deploy |
|---|---|---|---|---|
| Smart-Link | `551b787` | **W2-LNK-4/5/6**: WhatsApp door in the landing footer (twin of the P40-5a header, e2e-pinned), schema Service description = SmartBot's own published identity (last «مدار الساعة» in the fleet retired), back-to-top + install-prompt safe-area insets (parity-pinned 595→598). W2-LNK-2 documented deliberate (manifest = default-dark brand splash; ThemeColorSync corrects live chrome); W2-LNK-3 verified already-consistent (header/drawer exact twins since P40-5a). | parity 598 ✓ · unit ✓ · tsc/lint ✓ · build ✓ · e2e r9+seo+structured-data 56/56 ✓ | [success](https://github.com/ahmadmedo1012/Smart-Link/actions/runs/41465386308) · smartlink READY (sw.js v2 live-verified earlier) |
| Smart-Order | `6fa9c27` | **W2-ORD-2/3/4**: checkout totals re-derived from LIVE prices (the store endpoint already shipped them; pure `checkout-refresh` lib + 7 node:test contracts — changed lines marked, unavailable lines block submit), cross-store cart replace gets an explicit confirm (was silent wipe), staff page shows the seat counter + upgrade door from the same source of truth that refuses the POST (was a fill-then-fail dead end). | tsc ✓ · eslint-0 ✓ · unit 266/266 (7 new) ✓ · parity 508/508 ✓ · schema-twins ✓ · build ✓ | [success](https://github.com/ahmadmedo1012/Smart-Order/actions/runs/41468811751) · smart-order READY |
| SmartBot | `e2fae51` | **W2-BOT-6..9**: first UI consumer of /api/ai/generate-reply (in-thread suggest plants a DRAFT — human sends; empty reply surfaces the server's WHY; button gated on thread load — the same disabled-click race we hit and pinned in the send-confirm test), stale sequences contract comment fixed + the N+1 parallel detail fetch retired (step_count rides the row since v24-C4 — the contract test now pins the one-request shape), 2 bare Loader2 loading states → shape-matched skeletons, unsubscribe/resubscribe endpoints (tenant-scoped, editor-gated, Arabic 400 guards) + two-step confirm in the audience page. | FE tsc ✓ eslint-0 ✓ vitest 612/612 (4 new contracts) ✓ · BE ruff ✓ pytest families + 5 new endpoint contracts ✓ | run [41472976066](https://github.com/ahmadmedo1012/SmartBot/actions/runs/41472976066) at write time — deploys building |

**Honest implementation notes kept in the commits:** the ZIP builder's first
draft passed our structural tests but was refused by python's zipfile (a +12
EOCD-preamble byte in the central-directory size) — the independent verifier
caught what the tests missed, and the EOCD contract is now pinned in the
suite. The AI-assist button initially fired on a still-loading thread (empty
context error) — it now disables until the thread lands, and the test pins
the wait-for-enabled race. Both lessons are the same one: a passing test is
only as good as the contract it actually pins.

### Wave 3 continuation — evening batch (W3-7..W3-10)

| Repo | Commit | Subject | Gates (local) | CI / deploy |
|---|---|---|---|---|
| Smart-Menu | `ea2a01bb` | **W3-7** r93 propagation completeness: per-restaurant pending block (index-mirroring probe), every new menu starts FREE caps, M-3 approval under restaurant row-lock + tier re-check (409/404 mapped, co-owner double-fee rejected); user-plan bump kept deliberately → owner-decision §6 | author ✓ lint ✓ lint:idioms ✓ tsc ✓ vitest **2927 passed** (16 new) ✓ build ✓ (embedded PG per repo docs) | run [41512968562](https://github.com/ahmadmedo1012/Smart-Menu/actions/runs/41512968562) — triage ✓, lint-build-test + prod-qa in flight at ledger-write time; links completed in the worklog |
| Smart-Order | `591cbd4` | **W3-8** W2-ORD-5 completion: caps in GET categories/delivery-zones from the POST gate's own source + counter chips + upgrade doors on both pages | tsc ✓ eslint ✓ unit 269/269 (3 new) ✓ parity 511/511 (3 new) ✓ build ✓ | run [41512974099](https://github.com/ahmadmedo1012/Smart-Order/actions/runs/41512974099) — **success ×4 checks** (E2E API · Browser e2e · lint+parity+build · mobile) |
| Smart-Link | (docs) | **W3-9/W3-10** P42-EXPO-SDK58-EVALUATION.md (P2-5 superseded-by-facts + staged 58.0.22 patch-wave plan) · PARITY-MATRIX feature-level expansion + Wave-4 GAP register · register/owner-decisions/worklog updates | docs-only (no code gates apply) | this commit |

### Wave 4 — the plan-lock family on native (2026-11-02 night)

| Repo | Commit | Subject | Gates (local) | CI |
|---|---|---|---|---|
| SmartBot | `81c86768` | **W4-1** GAP-X1 + GAP-BOT-1: plan-lock classifier twin (GATE_MESSAGES family) + PremiumLock component + locks on scheduled/broadcast/calendar-create/analytics + the suspended-tenant full-page honest state (support doors alive under suspension, 60s recheck w/ cache-eviction) | mobile tsc ✓ lint ✓ vitest 145/145 (56 new) ✓ expo-export 4.5MB hbc ✓ | run [41520894595](https://github.com/ahmadmedo1012/SmartBot/actions/runs/41520894595) — **success ×4** (quality-gates · osv · mobile · secret-scan) |
| Smart-Menu | `5e74620f` | **W4-2** GAP-X1: plan-limit classifier (both web copy markers) + PlanLimitLockSheet + the REAL upgrade destination (OwnerSubscribeScreen — the native "subscribe" was a signup-only wizard, never mounted for owners) | mobile tsc ✓ lint ✓ parity 365/365 ✓ expo-export ✓ · root author/lint/idioms/tsc ✓ vitest 2950 ✓ | run [41519408673](https://github.com/ahmadmedo1012/Smart-Menu/actions/runs/41519408673) — **failure (root job only)**: vite:oxc nearest-tsconfig discovery on the imported mobile file vs un-installed mobile deps in the root job; mobile job green. **Root-caused + fixed same-session** ↓ |
| Smart-Menu | `f90bf213` | **W4-2 fix** — standalone nested `mobile/src/lib/tsconfig.json` (no extends) wins nearest-first discovery in every environment; proven by simulating the broken extends locally (same failure → 23/23 both states); lesson kept in the commit | all re-run green (mobile + root + full suite 2950) | run [41522449902](https://github.com/ahmadmedo1012/Smart-Menu/actions/runs/41522449902) — **success ×4** (triage · lint-build-test · prod-qa · mobile) |
| Smart-Order | `b58953ba` | **W4-3** GAP-SO-1: reports LockedState + staff 409 door + seats counter + **the first native pricing screen** (numbers from the same GET /api/plans as web, 23 anti-drift pins reading web sources); work completed from an interrupted agent session — every pin re-verified before acceptance | mobile tsc ✓ lint ✓ 85/85 (41 new) ✓ expo-export ✓ · root tsc/lint/unit 269/parity 511 ✓ | run [41517848357](https://github.com/ahmadmedo1012/Smart-Order/actions/runs/41517848357) — **success ×4** (E2E API · Browser e2e · lint+parity+build · mobile) |
