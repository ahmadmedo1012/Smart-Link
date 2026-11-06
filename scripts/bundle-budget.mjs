#!/usr/bin/env node
/**
 * P45-W1 — حرس ميزانية الحزمة (per-route bundle budget gate).
 *
 * WHY THIS EXISTS
 * ───────────────
 * The landing ships three.js to real users (the ChainSculpture chunk:
 * 552,647 raw / ~136KB gzip — the «137KB transfer» of the mission brief)
 * with NO regression gate anywhere in CI. SmartBot (the sibling) has had a
 * 195KB cap for a long time; this repo had nothing. Before P45 adds any
 * new UI weight (finder island, comparison matrix, three hub pages), the
 * ceiling has to exist so growth is a decision, not an accident.
 *
 * MEASUREMENT METHODOLOGY (deliberate choices — both matter)
 * ─────────────────────────────────────────────────────────
 * 1. DISK, not runtime: the sculpture is webdriver-gated OFF in automated
 *    runs (ChainSculptureMount resolves to a null component for
 *    navigator.webdriver sessions), so a runtime/CDP measurement would
 *    systematically under-report what real users download. We read the
 *    build OUTPUT from disk instead.
 * 2. Per-route FIRST-LOAD JS = the sum of every `/_next/static` script the
 *    route's PRERENDERED HTML references (`.next/server/app/<route>.html`)
 *    — exactly the scripts a browser fetches before hydration. This is
 *    per-route by construction and survives chunk-hash renames.
 * 3. CHUNK POOL = the sum of EVERY `.js` file under `.next/static/chunks`
 *    (raw). This catches the LAZY chunks no HTML references — most
 *    importantly the three.js sculpture chunk (next/dynamic defers it out
 *    of first-load HTML). The pool is the gate the 137KB figure lives in.
 * 4. RAW bytes are the budgeted number, gzip is PRINTED for context only:
 *    raw sizes are byte-stable across environments, while gzip output
 *    varies with the zlib build/version of whichever machine runs CI —
 *    a gate that flakes on the runner's zlib is not a gate.
 * 5. A route with no pinned budget FAILS (new pages must be budgeted in
 *    the same commit that adds them — an ungated page is how the 137KB
 *    happened). A referenced script missing on disk also fails.
 *
 * Run: `npm run test:budget` AFTER `npm run build` (plain node, zero deps
 * — truth-gate/parity pattern). Exit 1 on any breach.
 *
 * Budgets = measured actuals at commit time (build of 77368f9+, Next
 * 16.4.5 Turbopack) + a documented safety margin of ~8% rounded up, so
 * normal hash-noise (a few bytes) passes while a real regression (a new
 * dependency, a heavier island) fails loudly.
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs"
import { join, relative } from "node:path"
import { gzipSync } from "node:zlib"
import { fileURLToPath } from "node:url"

const ROOT = fileURLToPath(new URL("..", import.meta.url))
const NEXT_DIR = join(ROOT, ".next")
const APP_DIR = join(NEXT_DIR, "server", "app")
const CHUNKS_DIR = join(NEXT_DIR, "static", "chunks")

/* ── PINNED BUDGETS (raw disk bytes) ──────────────────────────────────
 * Actuals measured at the P45-W1 baseline build:
 *   /               720,132  → 780,000   (+8.3%)
 *   /about          683,215  → 740,000   (+8.3%)
 *   /pricing        683,316  → 740,000   (+8.3%)
 *   /contact        690,982  → 750,000   (+8.5%)
 *   /privacy        682,040  → 740,000   (+8.5%)
 *   /terms          682,040  → 740,000   (+8.5%)
 *   /offline        682,040  → 740,000   (+8.5%)
 *   /_not-found     682,040  → 740,000   (+8.5%)
 *   /_global-error  573,197  → 620,000   (+8.2%)
 *   POOL (all JS in static/chunks, incl. the lazy three.js chunk)
 *                   1,342,026 → 1,450,000 (+8.0%)
 * Bump a budget ONLY with a deliberate, documented weight decision —
 * never to make a breach disappear. */
const ROUTE_BUDGETS = {
  "/": 780_000,
  "/about": 740_000,
  "/pricing": 740_000,
  "/contact": 750_000,
  "/privacy": 740_000,
  "/terms": 740_000,
  "/offline": 740_000,
  "/_not-found": 740_000,
  "/_global-error": 620_000,
}
const POOL_BUDGET = 1_450_000

/* ── helpers ────────────────────────────────────────────────────────── */

function fail(msg) {
  console.error(`✗ bundle-budget: ${msg}`)
  process.exit(1)
}

/** Map a prerendered html file under .next/server/app → its route key.
 *  `index.html` → `/`, `about.html` → `/about`, route-group directories
 *  `(x)` contribute no segment (they contribute none to the URL either). */
function htmlToRoute(rel) {
  const parts = rel.split("/")
  const file = parts.pop()
  const segs = parts.filter((p) => !/^\(.*\)$/.test(p))
  const name = file.replace(/\.html$/, "")
  if (name === "index") return segs.length ? `/${segs.join("/")}` : "/"
  return `/${[...segs, name].join("/")}`
}

/** Recursively collect *.html files under .next/server/app. */
function walkHtml(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry)
    if (statSync(p).isDirectory()) {
      out.push(...walkHtml(p))
    } else if (entry.endsWith(".html")) {
      out.push(p)
    }
  }
  return out
}

const fmt = (n) => n.toLocaleString("en-US")

/* ── gate: build output exists ──────────────────────────────────────── */
if (!existsSync(APP_DIR)) {
  fail("no .next/server/app — run `npm run build` first (this gate reads the build OUTPUT from disk)")
}

/* ── measure per-route first-load JS from the prerendered HTML ──────── */
const rows = []
const failures = []

const htmlFiles = walkHtml(APP_DIR)
for (const htmlPath of htmlFiles) {
  const route = htmlToRoute(relative(APP_DIR, htmlPath).replace(/\\/g, "/"))
  const html = readFileSync(htmlPath, "utf8")
  const srcs = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)]
    .map((m) => m[1])
    .filter((s) => s.startsWith("/_next/"))

  let raw = 0
  let gz = 0
  for (const src of srcs) {
    const disk = join(NEXT_DIR, src.replace("/_next/", "").split("?")[0])
    if (!existsSync(disk)) {
      failures.push(`${route}: script ${src} referenced in HTML but missing on disk`)
      continue
    }
    const buf = readFileSync(disk)
    raw += buf.length
    gz += gzipSync(buf).length
  }

  const budget = ROUTE_BUDGETS[route]
  rows.push({ route, files: srcs.length, raw, gz, budget })
  if (budget === undefined) {
    failures.push(`${route}: NO PINNED BUDGET (first-load ${fmt(raw)} B) — pin it in ROUTE_BUDGETS in the same commit that adds the page (an ungated page is how the three.js 137KB happened)`)
  } else if (raw > budget) {
    failures.push(`${route}: first-load JS ${fmt(raw)} B exceeds the pinned budget ${fmt(budget)} B (over by ${fmt(raw - budget)} B)`)
  }
}

/* ── measure the chunk pool (first-load + every lazy chunk) ─────────── */
let poolRaw = 0
let poolGz = 0
let poolFiles = 0
for (const f of readdirSync(CHUNKS_DIR)) {
  if (!f.endsWith(".js")) continue
  const buf = readFileSync(join(CHUNKS_DIR, f))
  poolRaw += buf.length
  poolGz += gzipSync(buf).length
  poolFiles += 1
}
if (poolRaw > POOL_BUDGET) {
  failures.push(`chunk pool ${fmt(poolRaw)} B exceeds the pinned budget ${fmt(POOL_BUDGET)} B (over by ${fmt(poolRaw - POOL_BUDGET)} B) — the pool carries the LAZY chunks too (the three.js sculpture chunk lands here; it never appears in first-load HTML because next/dynamic defers it)`)
}

/* ── report ─────────────────────────────────────────────────────────── */
const pad = (s, n) => String(s).padEnd(n)
console.log("bundle-budget — per-route first-load JS, measured from .next on disk (raw bytes; gzip context):\n")
console.log(`${pad("route", 15)}${pad("scripts", 9)}${pad("raw (budgeted)", 22)}${pad("gzip (context)", 16)}status`)
for (const r of rows.slice().sort((a, b) => b.raw - a.raw)) {
  const status = r.budget === undefined ? "UNPINNED" : r.raw > r.budget ? "OVER" : "ok"
  console.log(
    `${pad(r.route, 15)}${pad(r.files, 9)}${pad(`${fmt(r.raw)} / ${r.budget === undefined ? "—" : fmt(r.budget)}`, 22)}${pad(fmt(r.gz), 16)}${status}`
  )
}
console.log(
  `${pad("POOL (all JS)", 15)}${pad(poolFiles, 9)}${pad(`${fmt(poolRaw)} / ${fmt(POOL_BUDGET)}`, 22)}${pad(fmt(poolGz), 16)}${poolRaw > POOL_BUDGET ? "OVER" : "ok"}`
)
console.log("\n(pool = every .js under .next/static/chunks — includes lazy chunks no HTML references; the three.js sculpture chunk is gated HERE)")

if (failures.length > 0) {
  console.error(`\n✗ bundle-budget: ${failures.length} breach(es):`)
  for (const f of failures) console.error(`  • ${f}`)
  console.error("\nA budget is a decision. If the growth is deliberate, pin the new number WITH the commit that adds the weight (and say why in the budget table).")
  process.exit(1)
}

console.log(`\n✓ bundle-budget: ${rows.length} routes + the chunk pool all within their pinned budgets`)
