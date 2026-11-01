# P41 — RELEASE MATRIX

All builds verified 2026-11-01 by Job 490778 run 2 (evidence: EAS build:list + artifact download + keytool + APK v2-block parse + live assetlinks fetch).

## Android (dispatched 2026-11-01 00:25–00:27 UTC, EAS free, account rh2011)

| App | Version/Build | Profile | Distribution | Build ID | Commit | Status | Artifact |
|---|---|---|---|---|---|---|---|
| SmartBot | per app.json (autoIncrement) | production | STORE (AAB) | `4e696cde-8421-4217-888c-2af66abcbeb2` | `832044d3` | FINISHED ✅ | https://expo.dev/artifacts/eas/4IkW8U-2-6OFpAmJTFtS1FOd5UoIOeJSBdmx0UMGakc.aab (78.7 MB) |
| SmartBot | preview | INTERNAL (APK) | `0090eff8-5082-47ea-a0ff-19587a58b608` | `832044d3` | FINISHED ✅ | local: download/android-builds-2026-11-01/SmartBot-preview.apk (110.5 MB) |
| Smart-Menu | production | STORE (AAB) | `e718483b-29b9-49f6-b828-2f30149f9292` | `c98b183b` | FINISHED ✅ | https://expo.dev/artifacts/eas/kanTGdvVfypD2HJDWvX-6ygpie6ZB11Nsoi2uVG9Ulk.aab (73.0 MB) |
| Smart-Menu | preview | INTERNAL (APK) | `9e642e41-2b91-4547-ab4b-7f420eb12c9d` | `c98b183b` | FINISHED ✅ | local: download/android-builds-2026-11-01/Smart-Menu-preview.apk (109.5 MB) |
| Smart-Order | production | STORE (AAB) | `85b14884-e858-408d-87c1-315093bac0db` | `b26efe0` | FINISHED ✅ | https://expo.dev/artifacts/eas/o_V6K3LPLCeFySVcQrmbBNwNzgjJw7pjyXubgMVA83U.aab (74.3 MB) |
| Smart-Order | preview | INTERNAL (APK) | `99ea5050-498a-46c7-9db8-41be28a1f7b1` | `b26efe0` | FINISHED ✅ | local: download/android-builds-2026-11-01/Smart-Order-preview.apk (107.9 MB) |

## Signature & identity verification

| App | Signing cert SHA-256 | AAB=APK keystore | Package ID (manifest-extracted) | assetlinks[0] (live fetch) |
|---|---|---|---|---|
| SmartBot | `39:AE:40:E7:DA:9F:55:C5:18:41:B9:B0:FA:DD:C0:88:15:4D:90:97:53:32:A2:CA:6C:13:7E:76:98:D0:1F:A4` | ✅ | `ly.smartlink.smartbot` | n/a — custom scheme (`smartbot://`), no assetlinks by design |
| Smart-Menu | `7B:5D:FC:9C:61:AF:11:49:68:AA:9A:46:49:A2:6B:8F:CA:85:03:FC:09:74:70:71:E9:61:D9:F0:A0:D8:C1:2D` | ✅ | `ly.smartlink.smartmenu` | ✅ exact match |
| Smart-Order | `8E:C7:C9:2F:0A:B3:E8:AB:BF:A3:32:FA:48:2D:CF:69:C3:8A:1D:76:8F:14:44:A1:01:7B:84:05:A3:D4:58:E5` | ✅ | `ly.smartlink.smartorder` | ✅ exact match |

Notes: Smart-Menu assetlists carries a 2nd fingerprint (`A1:F3:…:30:B8`) — does NOT match build cert; consistent with an upload/Play-signing key; entry [0] is the release cert and matches. No keystores were regenerated; no credentials replaced.

## iOS

No iOS builds dispatched in the November cycle yet. Standing dependency: Apple developer credentials + APNs key (Owner). Simulator/profile feasibility to be assessed in Wave 3. Do not fabricate iOS readiness.

## Verdict (Android channel)

All three Native apps: **PRODUCTION-READY** — correct source (main HEAD), correct package IDs, verified signatures, deep-link asset match. Remaining: Play Console upload (Owner or `eas submit`), store listing assets, real-device smoke/Maestro pass.
