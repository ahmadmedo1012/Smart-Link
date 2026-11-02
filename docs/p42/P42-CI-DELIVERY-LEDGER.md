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
