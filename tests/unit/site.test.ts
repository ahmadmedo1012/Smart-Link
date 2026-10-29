/**
 * Unit — lib/site (the single source of business truth, r9).
 *
 * The invariants that keep the fleet's contact identity coherent:
 * the WhatsApp number's three renderings stay mutually consistent,
 * every product URL is https on the owned domain, and the r134
 * surface-tagged deep links carry the encoded Arabic opener.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import { SITE, whatsappUrl } from "../../src/lib/site.ts";

/* ── the WhatsApp triple-rendering coherence (r9) ─────────────────── */

test("the three WhatsApp renderings describe the same number", () => {
  const bare = SITE.whatsapp.number; // "218910089975" — no plus
  assert.ok(/^\d{12}$/.test(bare), "international form is 12 digits, no +");
  assert.ok(bare.startsWith("218"), "international form carries 218");

  // display "+218 91 008 9975" — the same digits, spaced, with the plus:
  const displayDigits = SITE.whatsapp.display.replace(/\D/g, "");
  assert.equal(displayDigits, bare);

  // local "0910089975" — drop 218, prepend the trunk 0:
  assert.equal(SITE.whatsapp.local, `0${bare.slice(3)}`);

  // the wa.me url uses the bare international form (no plus):
  assert.equal(SITE.whatsapp.url, `https://wa.me/${bare}`);
});

test("the site email identities are on the owned domain", () => {
  assert.ok(SITE.email.endsWith("@smart-link.ly"));
  assert.ok(SITE.fromEmail.includes(SITE.email));
  // the private notification inbox is separate and never rendered:
  assert.notEqual(SITE.ownerEmail, SITE.email);
});

/* ── products (the fleet's three live siblings) ───────────────────── */

test("the three products are https URLs on the owned domain", () => {
  const products = [SITE.products.menu, SITE.products.bot, SITE.products.order];
  for (const p of products) {
    assert.ok(p.url.startsWith("https://"), p.url);
    assert.ok(p.url.endsWith("smart-link.ly") || p.url.includes(".smart-link.ly"));
    assert.ok(p.short.length > 0);
    assert.ok(p.label.includes(p.short));
    assert.ok(p.desc.length > 0);
  }
});

test("SmartBot is one word everywhere (r9 audit C3)", () => {
  assert.equal(SITE.products.bot.short, "SmartBot");
  assert.equal(SITE.products.bot.label.includes("SmartBot"), true);
});

/* ── hours (the r144 honesty fix — no 24/7 claim) ─────────────────── */

test("the support hours stay honest (no 24/7 claim)", () => {
  assert.equal(SITE.hours.support.includes("24"), false);
  assert.ok(SITE.hours.office.length > 0);
  assert.ok(/^\d{2}:\d{2}$/.test(SITE.hours.schemaOpens));
  assert.ok(/^\d{2}:\d{2}$/.test(SITE.hours.schemaCloses));
});

/* ── whatsappUrl (r134 — surface-tagged deep links) ───────────────── */

test("whatsappUrl builds on the bare url with an encoded opener", () => {
  const url = whatsappUrl("التذييل");
  assert.ok(url.startsWith(`${SITE.whatsapp.url}?text=`));
  // percent-encoded UTF-8 (wa.me wants it encoded, never raw):
  assert.equal(url.includes("مرحباً"), false);
  const decoded = decodeURIComponent(url.split("?text=")[1]!);
  assert.ok(decoded.includes("مرحباً"));
  assert.ok(decoded.includes("التذييل"));
  assert.ok(decoded.includes("الربط الذكي"));
});

test("different surfaces produce different links (the source signal)", () => {
  assert.notEqual(whatsappUrl("التذييل"), whatsappUrl("صفحة التواصل"));
  assert.notEqual(whatsappUrl("a"), whatsappUrl("b"));
});
