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
 * SCOPE: every .ts/.tsx/.js/.jsx/.mjs/.json under src/, PLUS the three
 * curated living docs at the repo root (README.md, README.en.md,
 * PRODUCT.md — P21-W3-D). CHANGELOG.md is deliberately NOT walked: it is
 * a historical record whose entries quote dead claims to document their
 * removal — matching there is meta-discussion, not a shipped claim.
 * Roadmap statements that never promise an unavailable catalog (e.g.
 * «المزيد من الخدمات قريباً» — pure temporal intent) stay legal, but the
 * ADJECTIVAL availability promise («خدمات قادمة» — W6-B2 family below)
 * is banned: the mission bans false present-tense facts and promises of
 * things that do not exist, not future intent itself.
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs"
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

/* DOC-ONLY patterns (P21-W3-D — the curated docs walk). The English
 * doc family pluralises the noun and hyphenates the compound — shapes
 * the src patterns above never matched: «coming-soon paid tiers» /
 * «paid tiers are coming-soon» shipped verbatim in PRODUCT.md for 15+
 * waves while the gate walked src/ only (the exact P14-P0B lesson: a
 * retired claim returns through a source the gate cannot see). The
 * TRUE statement («paid tiers are actually live…») matches neither —
 * both patterns require the soon-marking. */
const DOC_BANNED = [
  /paid\s+(plans|tiers|packages)\b[^\n]{0,40}(coming|launching)\s*-?\s*soon/i,
  /(coming|launching)\s*-?\s*soon\s+paid\s+(plans|tiers|packages)/i,
]

/* W6-B2 — the future-SERVICES family. «خدمات قادمة» shipped on /about
 * from the two-product era (69152c19, 2026-10-08 — three days before
 * r137 made Smart-Order the third live product) until W6-B2, while the
 * SAME page's verified stat said «3 منتجات حيّة»: a promise of services
 * that do not exist, sailing past the paid-plan family above (its
 * regexes bind قريباً to مدفوعة/باقات). Each pattern below is a real
 * phrasing that shipped to production once; narrow on purpose —
 * temporal intent («قريباً») stays legal, the adjectival upcoming-
 * catalog promise does not. */
const SERVICES_BANNED = [
  // «…إلى خدمات قادمة تطمح لتغيير…» (the /about two-product-era promise)
  /خدمات\s*قادمة/u,
  // the same shape with «حلول» (solutions) as the noun
  /حلول\s*قادمة/u,
  // English surface (metadata/demos/docs)
  /upcoming\s+services/i,
]

const EXT = /\.(ts|tsx|js|jsx|mjs|json)$/
let files = 0
const hits = []

const scanFile = (p, patterns) => {
  const text = readFileSync(p, "utf8")
  const lines = text.split("\n")
  lines.forEach((line, i) => {
    for (const rx of patterns) {
      if (rx.test(line)) {
        hits.push(
          `${p.slice(ROOT.length)}:${i + 1}  [${rx.source}]  ${line.trim().slice(0, 100)}`,
        )
      }
    }
  })
}

const walk = (dir) => {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry)
    if (statSync(p).isDirectory()) {
      walk(p)
      continue
    }
    if (!EXT.test(entry)) continue
    files += 1
    scanFile(p, [...BANNED, ...SERVICES_BANNED])
  }
}

walk(SRC)

/* P21-W3-D: the curated living docs — the same ban list PLUS the
 * doc-only English shapes (a missing file is skipped, not an error:
 * the docs set is advisory-per-repo, the src walk stays the gate). */
const DOC_FILES = ["README.md", "README.en.md", "PRODUCT.md"]
for (const doc of DOC_FILES) {
  const p = join(ROOT, doc)
  if (!existsSync(p)) continue
  files += 1
  scanFile(p, [...BANNED, ...DOC_BANNED, ...SERVICES_BANNED])
}

/* ---------- P42-2d — CLAIM PINS (سقف المنيو الصادق) ---------- */

/* The bans above retire false claims; the pins below defend TRUE copy —
 * verified free-plan numbers that a future overzealous honesty pass must
 * not delete, and section-scoped so they cannot quietly drift back.
 * Trigger (P42-2d / audit M1): Smart-Menu enforces its free-plan order
 * cap as a LIFETIME total (its api/orders/route.ts counts every order
 * ever — no monthly window), so the Menu claim drops «شهريًا» (copy
 * follows enforcement); Smart-Order's cap IS a monthly window and
 * SmartBot's reply cap IS monthly (both verified against their own
 * backends), so their monthly wording stays verbatim. Section scoping
 * is the whole point: the true monthly claims live in the SAME files as
 * the Menu claim — a whole-file ban would force deleting true copy. A
 * rotted marker (refactor moved the section) fails loudly: the pin gets
 * repaired, never deleted. */
const CLAIM_PINS = [
  // web /pricing — Smart Menu free card: the LIFETIME cap, no month-word
  { file: "src/app/pricing/page.tsx", from: `title: "Smart Menu"`, to: `title: "SmartBot"`,
    must: [`"منيو واحد و10 أصناف"`, `"100 طلب"`],
    mustNot: [/100\s*طلب\s*شهري/u] },
  // web /pricing — SmartBot free card: the monthly reply cap STAYS
  { file: "src/app/pricing/page.tsx", from: `title: "SmartBot"`, to: `title: "Smart Order"`,
    must: [`"ردود تلقائية (100/شهر)"`] },
  // web /pricing — Smart Order free card: the monthly window is REAL
  { file: "src/app/pricing/page.tsx", from: `title: "Smart Order"`, to: `const ecosystemPricing`,
    must: [`"15 منتجاً و3 أقسام"`, `"100 طلب شهرياً"`] },
  // web /pricing — first FAQ answer: the Menu lifetime cap, no month-word
  { file: "src/app/pricing/page.tsx", from: `{ q: "`, to: `{ q: "`,
    must: [`و100 طلب`],
    mustNot: [/100\s*طلب\s*شهري/u] },
  // web landing cockpit — the flagship verifiable datum (Bot monthly cap)
  { file: "src/components/landing/CockpitSection.tsx", from: `const STATS`, to: `export function CockpitSection`,
    must: [`100 رد في الشهر`] },
  // mobile — Smart Menu free entry: the LIFETIME cap, no month-word
  { file: "mobile/src/constants/content.ts", from: `key: 'menu'`, to: `key: 'bot'`,
    must: [`'منيو واحد و10 أصناف'`, `'100 طلب'`],
    mustNot: [/100\s*طلب\s*شهري/u] },
  // mobile — SmartBot entry: the monthly reply cap STAYS
  { file: "mobile/src/constants/content.ts", from: `key: 'bot'`, to: `key: 'order'`,
    must: [`'ردود تلقائية (100/شهر)'`] },
  // mobile — Smart Order entry: the monthly window is REAL
  { file: "mobile/src/constants/content.ts", from: `key: 'order'`, to: `export const ECOSYSTEM_PRICING`,
    must: [`'15 منتجًا و3 أقسام'`, `'100 طلب شهريًا'`] },
  // mobile — first FAQ answer: the Menu lifetime cap, no month-word
  { file: "mobile/src/constants/content.ts", from: `q: '`, to: `q: '`,
    must: [`و100 طلب`],
    mustNot: [/100\s*طلب\s*شهري/u] },
]

let pinsRun = 0
for (const pin of CLAIM_PINS) {
  const p = join(ROOT, pin.file)
  if (!existsSync(p)) {
    hits.push(`${pin.file}  [P42-2d pin]  file missing — pin cannot run`)
    continue
  }
  const text = readFileSync(p, "utf8")
  const start = text.indexOf(pin.from)
  const end = pin.to ? text.indexOf(pin.to, start + pin.from.length) : -1
  if (start === -1 || (pin.to && end === -1)) {
    hits.push(
      `${pin.file}  [P42-2d pin]  section markers rotted (${pin.from} … ${pin.to ?? "EOF"}) — repair the pin, never delete it`,
    )
    continue
  }
  const section = text.slice(start, end === -1 ? undefined : end)
  for (const needle of pin.must) {
    if (!section.includes(needle)) {
      hits.push(
        `${pin.file}  [P42-2d pin]  expected ${JSON.stringify(needle)} in the (${pin.from} …) section — the verified free-plan claim vanished`,
      )
    }
  }
  for (const rx of pin.mustNot ?? []) {
    if (rx.test(section)) {
      hits.push(
        `${pin.file}  [P42-2d pin]  /${rx.source}/ matched in the (${pin.from} …) section — the Smart-Menu cap is a LIFETIME total; only Order/Bot caps are monthly (verified). Copy follows enforcement.`,
      )
    }
  }
  pinsRun += 1
}

if (hits.length) {
  console.error(`✗ truth-gate: ${hits.length} hit(s) — future-paid-plan / future-service claims (P14-P0B + W6-B2 bans) or claim-pin failures (P42-2d):\n`)
  for (const h of hits) console.error(`  ${h}`)
  console.error("\nThe fleet's paid plans are LIVE (P13-2a, verified: bot /api/plans, menu /pricing).")
  console.error("The platform's services are THREE and LIVE (r137/r143) — promising upcoming ones contradicts the same page's own stats.")
  console.error("Fix the claim — do not weaken the gate.")
  process.exit(1)
}
console.log(`✓ truth-gate: ${files} files (src/ + 3 curated docs) — zero future-paid-plan and zero future-service claims (P14-P0B + W6-B2 bans hold) + ${pinsRun} claim pins hold (P42-2d: Menu lifetime cap · Order/Bot monthly caps — copy follows enforcement)`)
