# P41 — RECOVERY AND BASELINE (Wave 0)

**Date:** 2026-11-01 · **Status:** Wave 0 COMPLETE · **Environment:** reconstructed after sandbox recycle

## 1. Workspace reconstruction

Previous sandbox was recycled (P39 Job 490778 first run BLOCKED). Reconstructed on 2026-11-01 ~14:00 UTC:

| Item | State |
|---|---|
| Repos | Re-cloned from github.com/ahmadmedo1012 (public, HTTPS): `SmartBot`, `Smart-Menu`, `Smart-Order`, `Smart-Link` → `/home/z/p35-work/repos/` |
| Mobile deps | Installed: SmartBot (npm), Smart-Menu (pnpm), Smart-Order (npm) |
| eas-cli | Installed globally; authenticated as Expo account `rh2011` |
| Credentials | Rotated set (Owner-delivered 2026-11-01 via IM) at `/home/z/p35-work/secrets/cred-store-rotated-2026-11-01.txt` (chmod 600): GitHub PAT (verified: user `ahmadmedo1012`), Vercel token, EXPO_1/2/3 (EXPO_1 verified). Values never printed. Per mission §2.3: no rotation/revocation will be performed during P41. |
| Durable docs | `/home/z/my-project/download/p41/` (survives sandbox recycles) + program docs pushed to Git (Smart-Link repo `docs/p41/`) |
| Git identity | ahmadmedo1012 <ahmadmedo1012@users.noreply.github.com> (matches repo history) |

## 2. Repository baseline (all clean, on main, zero dirty files)

| Repo | HEAD | Subject | CI (quality gates) | Deployed |
|---|---|---|---|---|
| SmartBot | `832044d3` | P40-5b honesty wave | ✅ CI — quality gates success | bot.smart-link.ly (+ api.smart-link.ly) |
| Smart-Menu | `c98b183b` | P40 WhatsApp secondary | ✅ (Keep-Alive + Nightly Flake green; CI green at push) | menu.smart-link.ly |
| Smart-Order | `b26efe0` | P40 WhatsApp CTA | ✅ CI success | order.smart-link.ly |
| Smart-Link | `e0f9b92` | P40-5a conversion CTAs | ✅ CI success | smart-link.ly |

Known CI noise (not main-CI): Dependabot `npm_and_yarn` bump workflows failing on Smart-Order (`minimatch`, `glob` in /mobile) and Smart-Link (`minimatch`) — dependency-PR housekeeping, logged in issue register.

## 3. Recovered P39 evidence (Job 490778 + companion 491329) — VERIFIED

All six Android EAS builds dispatched 2026-11-01 00:25–00:27 UTC are **FINISHED**, built from current main, fully verified:

| App | Commit | STORE AAB (id) | INTERNAL APK (id) | Cert SHA-256 (verified) | Package | assetlinks[0] |
|---|---|---|---|---|---|---|
| SmartBot | `832044d3` | `4e696cde-8421-4217-888c-2af66abcbeb2` | `0090eff8-5082-47ea-a0ff-19587a58b608` | `39:AE:40:E7:…:1F:A4` | `ly.smartlink.smartbot` | n/a (custom scheme) |
| Smart-Menu | `c98b183b` | `e718483b-29b9-49f6-b828-2f30149f9292` | `9e642e41-2b91-4547-ab4b-7f420eb12c9d` | `7B:5D:FC:9C:…:C1:2D` | `ly.smartlink.smartmenu` | ✅ MATCH |
| Smart-Order | `b26efe0` | `85b14884-e858-408d-87c1-315093bac0db` | `99ea5050-498a-46c7-9db8-41be28a1f7b1` | `8E:C7:C9:2F:…:58:E5` | `ly.smartlink.smartorder` | ✅ MATCH |

- AAB certs via keytool; APK certs via custom APK Signing Block v2 parser (`scripts/apk-v2-cert.py`) — APKs are v2-only signed (no v1 JAR sig), same EAS keystore as AABs confirmed.
- gitCommitHash = current GitHub HEAD for all six. Preview APKs copied to `download/android-builds-2026-11-01/`; AAB URLs are public EAS artifact links (see P41-RELEASE-MATRIX.md).
- Discrepancy note: build IDs differ from the truncated IDs in the continuation-summary dispatch record — that record was lossy; EAS records (createdAt 00:25–00:27 UTC, correct commits) are authoritative.
- **Android verdict: PRODUCTION-READY (all 3 apps)** — Play upload is the remaining Owner-side step.

## 4. EAS quota posture (free plan, resets monthly)

November cycle: 6 Android builds consumed (this dispatch) → ~9 Android, 15 iOS remaining (30 total/month). Rule for P41: inspect existing builds before submitting; batch native changes; never submit duplicate builds.

## 5. Standing external dependencies (documented, not blockers)

- FCM v1 key + APNs key (real push delivery unverifiable without provider credentials + real device)
- Apple developer credentials (iOS device builds/signing) — do not fabricate; iOS sim builds only where possible
- SmartBot Facebook Push Protection toggle (Owner-side)
- Real Android device/emulator for Maestro E2E (none in sandbox)

## 6. Next executable actions

1. Discovery agents (per-product + competitive + backend + native parity + cross-cutting) → consolidated P41-ISSUE-REGISTER.md
2. Wave 1: critical correctness (pricing zero-limits lead, Smart-Link free-start routing lead, Smart-Menu demo data lead, dependabot housekeeping)
3. Waves 2–8 per mission §23
