# P41 — MASTER WORKLOG

Chronological record of P41 work. Severity: P0 critical → P3 polish. All evidence durable (this file lives in `/home/z/my-project/download/p41/` and is mirrored to the Smart-Link repo under `docs/p41/`).

## 2026-11-01 (Wave 0 — Recovery & Baseline)

**W0-1 · P39 Phase 2 completion (Job 490778 run 2)** — Owner delivered rotated credentials (GitHub PAT `ahmadmedo1012`, Vercel, EXPO×3 as rh2011) via IM; stored chmod-600, never printed. Four repos re-cloned; mobile deps installed; eas-cli authenticated.
- `eas build:list` (read-only): all 6 dispatched Android builds FINISHED at main HEADs.
- Downloaded 3 AABs + 3 APKs → keytool (AAB) + custom APK v2-signing-block parser (APK, v2-only signed) → all certs = EAS keystore, AAB=APK; package IDs exact (`ly.smartlink.{smartbot,smartmenu,smartorder}`).
- Live assetlinks fetch: Smart-Menu ✅ match, Smart-Order ✅ match (entry [0]).
- **Verdict: Android PRODUCTION-READY ×3.** Evidence: `P41-RELEASE-MATRIX.md`, `download/P39-ANDROID-VERIFICATION.md`, artifacts in `download/android-builds-2026-11-01/`, parser at `scripts/apk-v2-cert.py`.
- Quota: 6/15 Android used this cycle (9 left Android, 15 iOS).

**W0-2 · Baseline captured** — HEADs: SmartBot `832044d3`, Smart-Menu `c98b183b`, Smart-Order `b26efe0`, Smart-Link `e0f9b92`; all clean on main; CI quality gates green ×4. Dependabot bump workflows failing on Smart-Order (minimatch/glob /mobile) + Smart-Link (minimatch) → housekeeping issue. Git identity configured to match history. See `P41-RECOVERY-AND-BASELINE.md`.

**W0-3 · Discovery wave launched** — parallel specialist agents: Smart-Link / SmartBot / Smart-Menu / Smart-Order (Task IDs P41-2-a…d) + competitive research (P41-2-e). Backend/pricing integrity, native parity, cross-cutting a11y/perf/RTL/SEO to follow (P41-2-f…h).

## Open leads under investigation (from mission, to verify — not predetermined facts)

1. Smart-Link homepage primary free-start CTA appears to default to Smart-Menu — product-selection flow may serve visitors better.
2. Pricing consistency: Smart-Link advertised free-plan limits (Menu: 1 menu/10 items/100 orders; Order: 15 products/3 categories/100 orders) vs standalone pricing pages reportedly showing zero for some limits. Verify DB plan records + UI + backend entitlements + registration/upgrade flows.
3. Smart-Menu demo route `/menu/al-waha-cafe` previously contained test records (`TestLimitItem`, `كابتشينو اختبار 2`) — P40 added demo guard; re-check live.
4. Dependabot failing bump PRs (minimatch/glob/zod in /mobile dirs).

## Constraints honored

- P38 financial guarantees (server-side repricing, idempotency, payment validation, delivery fees, role permissions, order-state integrity, image sync, staff seat limits) are protected — no regression allowed.
- P40 honesty wave (no fabricated claims) continues.
- No credential rotation/revocation during P41 (mission §2.3). No secrets in logs/commits.
- Arabic/RTL primary; Libyan market terminology.
