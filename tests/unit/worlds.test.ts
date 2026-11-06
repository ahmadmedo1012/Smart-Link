/**
 * Unit — the WORLDS discovery registry (P45-W1).
 *
 * The registry now carries the comparison-matrix data (audience / problem
 * / channel / freeLimits / paidFrom / signupUrl). Its honesty contract
 * has TWO halves, both pinned here:
 *
 * 1. SHAPE — every world carries every discovery field, non-empty, and
 *    the signupUrls are SITE's own (never a hand-typed URL that can rot).
 *
 * 2. ANTI-DRIFT with /pricing (the page whose ladders are the repo's
 *    documented mirrors of the siblings' live catalogs — parity pin
 *    "the plan-ladder MIRRORS pinned to their P13-2a-documented
 *    sources"): the registry's freeLimits must appear VERBATIM in the
 *    pricing page's free-plan cards, and paidFrom must equal the lowest
 *    non-zero rung of the same product's ecosystem ladder. The two files
 *    cannot disagree in CI — a sibling price bump that updates
 *    pricing/page.tsx but misses worlds.ts (or vice versa) fails HERE.
 *    Source-text section pins, the truth-gate CLAIM_PINS pattern.
 *
 * 3. CAP DOCTRINE (P42-2d, mirrored from truth-gate): Smart-Menu's
 *    «100 طلب» is a LIFETIME total (no month-word within the limit
 *    string), while SmartBot's «(100/شهر)» and Smart-Order's
 *    «100 طلب شهرياً» ARE real monthly windows — copy follows
 *    enforcement, and the registry must never blur the line.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { WORLDS, worldById } from "../../src/components/landing/worlds.ts";
import { SITE } from "../../src/lib/site.ts";
import { formatLyd } from "../../src/lib/money.ts";

const pricingSrc = readFileSync(
  new URL("../../src/app/pricing/page.tsx", import.meta.url),
  "utf8",
);

/* ── 1. shape: every world carries the full discovery set ─────────── */

test("every world carries non-empty audience/problem/channel", () => {
  for (const w of WORLDS) {
    assert.ok(w.audience.length > 10, `${w.id}: audience too short`);
    assert.ok(w.problem.length > 10, `${w.id}: problem too short`);
    assert.ok(w.channel.includes("→"), `${w.id}: channel must state the flow`);
  }
});

test("every world carries exactly THREE free limits, verbatim SITE signupUrl", () => {
  const expectedSignup: Record<string, string> = {
    menu: SITE.products.menu.signupUrl,
    bot: SITE.products.bot.signupUrl,
    order: SITE.products.order.signupUrl,
  };
  for (const w of WORLDS) {
    assert.equal(w.freeLimits.length, 3, `${w.id}: exactly three limits`);
    for (const l of w.freeLimits) assert.ok(l.length > 3, `${w.id}: empty limit`);
    assert.equal(w.signupUrl, expectedSignup[w.id], `${w.id}: signupUrl must be SITE's own`);
  }
});

test("worldById resolves each id and rejects strangers", () => {
  for (const w of WORLDS) assert.equal(worldById(w.id)?.name, w.name);
  assert.equal(worldById("nope" as never), null);
  assert.equal(worldById(null), null);
});

/* ── 2. anti-drift: the registry vs the pricing page's own arrays ─── */

/** Slice the pricing source between two markers (truth-gate pattern). */
function section(from: string, to: string): string {
  const i = pricingSrc.indexOf(from);
  assert.ok(i !== -1, `pricing section marker missing: ${from}`);
  const j = to ? pricingSrc.indexOf(to, i + from.length) : -1;
  assert.ok(j !== -1 || !to, `pricing section end marker missing: ${to}`);
  return pricingSrc.slice(i, j === -1 ? undefined : j);
}

test("freeLimits appear VERBATIM in the pricing page's free cards", () => {
  for (const w of WORLDS) {
    // each product's card runs from its title marker to the next card's
    const order = ["menu", "bot", "order"];
    const titles: Record<string, [string, string]> = {
      menu: ['title: "Smart Menu"', 'title: "SmartBot"'],
      bot: ['title: "SmartBot"', 'title: "Smart Order"'],
      order: ['title: "Smart Order"', "const ecosystemPricing"],
    };
    const card = section(titles[w.id]![0]!, titles[w.id]![1]!);
    for (const l of w.freeLimits) {
      assert.ok(
        card.includes(`"${l}"`),
        `${w.id}: limit "${l}" not found in its pricing free card — the matrix may not claim what the pricing card does not`,
      );
    }
    assert.ok(order.includes(w.id));
  }
});

test("paidFrom equals the lowest non-zero rung of the live ladder mirror", () => {
  const eco = section("const ecosystemPricing", "const faqs");
  for (const w of WORLDS) {
    const titles: Record<string, string> = {
      menu: 'title: "Smart Menu"',
      bot: 'title: "SmartBot"',
      order: 'title: "Smart Order"',
    };
    const i = eco.indexOf(titles[w.id]!);
    assert.ok(i !== -1, `${w.id}: ecosystem ladder marker missing`);
    // the ladder runs to the next LINE-ANCHORED `title:` (a bare
    // indexOf("title:") would match inside "subtitle:" — found live)
    const rest = eco.slice(i + 10);
    const next = rest.match(/^\s*title:/m);
    const nextTitle = next ? i + 10 + (next.index ?? 0) : -1;
    const block = eco.slice(i, nextTitle === -1 ? undefined : nextTitle);
    const prices = [...block.matchAll(/price: (\d+)/g)].map((m) => Number(m[1]));
    const paid = prices.filter((p) => p > 0);
    assert.ok(paid.length > 0, `${w.id}: no paid rungs found in the mirror`);
    assert.equal(
      Math.min(...paid),
      w.paidFrom,
      `${w.id}: registry paidFrom ${w.paidFrom} ≠ the pricing mirror's lowest paid rung ${Math.min(...paid)} — the two files drifted`,
    );
  }
});

/* ── 3. cap doctrine (P42-2d — the registry mirrors the same law) ─── */

test("Smart-Menu's limit stays LIFETIME (no month-word); Bot/Order stay monthly", () => {
  const menu = worldById("menu")!;
  const bot = worldById("bot")!;
  const order = worldById("order")!;
  // Menu: the lifetime cap — the order limit is the BARE «100 طلب», never
  // month-qualified (its enforcement counts lifetime, not a window)
  assert.ok(
    menu.freeLimits.includes("100 طلب"),
    "menu: the bare lifetime cap must be present",
  );
  for (const l of menu.freeLimits) {
    assert.ok(
      !/طلب[^ ]* شهري/.test(l),
      `menu limit "${l}" must never carry a month-word (P42-2d: LIFETIME cap)`,
    );
  }
  // Bot: the reply cap IS monthly (bot /api/plans)
  assert.ok(bot.freeLimits.some((l) => l.includes("100/شهر")), "bot: the monthly reply cap must stay");
  // Order: the order window IS monthly (order api/plans)
  assert.ok(order.freeLimits.some((l) => l.includes("شهرياً")), "order: the monthly order window must stay");
});

test("paidFrom renders through formatLyd (the one money spelling)", () => {
  // the registry stores the NUMBER; every surface renders formatLyd(n).
  // Pin the spelling so no surface ever hand-rolls «19 د.ل».
  for (const w of WORLDS) {
    assert.equal(formatLyd(w.paidFrom), "19 د.ل");
  }
});
