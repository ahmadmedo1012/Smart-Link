#!/usr/bin/env node
/**
 * P14-P0B truth gate — the source-level ban sweep.
 *
 * WHY: the «paid plans as a future horizon» claim was fixed on /pricing
 * (P13-2a) and then reappeared from a second content source — the
 * homepage FAQ — shipping the stale promise to users AND into the
 * FAQPage JSON-LD (organized lying to crawlers, per the repo's own
 * r138 vocabulary). Page-level e2e checks can't see a claim that lives
 * in a not-yet-rendered source file; this gate walks ALL of src/ so the
 * obsolete claim cannot come back through ANY surface: pages, FAQs,
 * metadata, JSON-LD builders, data files, or comments (the stale-comment
 * family — money.ts r137 / schema.ts r138 — misled two honesty passes
 * before P14).
 *
 * Run: `npm run test:truth` (plain node, zero deps — parity.mjs pattern).
 * CI-able: wired into .github/workflows/ci.yml right after parity.
 * Exit 1 on any hit.
 *
 * SCOPE: every .ts/.tsx/.js/.jsx/.mjs/.json under src/. Roadmap statements that never
 * mention paid plans (e.g. «المزيد من الخدمات قريباً» — intent phrasing,
 * not a commercial-availability claim) are deliberately NOT banned: the
 * mission bans false present-tense facts, not future intent.
 */
import { readdirSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = fileURLToPath(new URL("..", import.meta.url))
const SRC = join(ROOT, "src")

/* Claim shapes that assert paid plans are NOT available today. Narrow on
 * purpose: each pattern is a real phrasing that shipped to production
 * once. Meta-discussion in comments is fine — these patterns only match
 * the claim itself, never its critique. */
const BANNED = [
  // «ستُطلَق قريباً خطط مدفوعة…» (the live homepage FAQ, pre-P14)
  /ستُ?طلَق\s*قريباً?\s*خطط?\s*مدفوعة/u,
  // «خطط/باقات مدفوعة … قريباً» in either order
  /خطط?\s*مدفوعة[^\n]{0,40}قريباً/u,
  /قريباً[^\n]{0,40}خطط?\s*مدفوعة/u,
  /باقات\s*مدفوعة[^\n]{0,40}قريباً/u,
  /قريباً[^\n]{0,40}باقات\s*مدفوعة/u,
  // English surface (metadata/demos)
  /paid plans (are |will be )?(coming|launching) soon/i,
  // the stale comment family (money.ts r137 / schema.ts r138, pre-P14)
  /paid tiers are «?قريباً/u,
  /والمدفوع «?قريباً/u,
]

const EXT = /\.(ts|tsx|js|jsx|mjs|json)$/
let files = 0
const hits = []

const walk = (dir) => {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry)
    if (statSync(p).isDirectory()) {
      walk(p)
      continue
    }
    if (!EXT.test(entry)) continue
    files += 1
    const text = readFileSync(p, "utf8")
    const lines = text.split("\n")
    lines.forEach((line, i) => {
      for (const rx of BANNED) {
        if (rx.test(line)) {
          hits.push(
            `${p.slice(ROOT.length)}:${i + 1}  [${rx.source}]  ${line.trim().slice(0, 100)}`,
          )
        }
      }
    })
  }
}

walk(SRC)

if (hits.length) {
  console.error(`✗ truth-gate: ${hits.length} future-paid-plan claim(s) in src/ (P14-P0B ban):\n`)
  for (const h of hits) console.error(`  ${h}`)
  console.error("\nThe fleet's paid plans are LIVE (P13-2a, verified: bot /api/plans, menu /pricing).")
  console.error("Fix the claim — do not weaken the gate.")
  process.exit(1)
}
console.log(`✓ truth-gate: ${files} src files — zero future-paid-plan claims (P14-P0B ban holds)`)
