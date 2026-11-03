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
});

/* ── P42-8d (security audit P3): SITE never carries private keys ────
 * SITE is imported by client components (main-nav, contact-form,
 * LandingHeader), so the WHOLE object serializes into public JS
 * chunks. The owner's private notification inbox rode those bundles
 * for the site's life (6 public chunks at next 16.4) while every
 * comment promised "never displayed". The key now lives only inside
 * the server route (api/contact/route.ts). This pin fails the moment
 * a private-looking key sneaks back onto the object — the e2e twin
 * (bundle-secrets.spec) greps the BUILT chunks for the real value. */
test("SITE carries no private destination keys (client-bundle leak guard)", () => {
  const privateish = Object.keys(SITE).filter((k) =>
    /owner|private|secret|password|token|apikey|api_key/i.test(k)
  );
  assert.deepEqual(privateish, [], `SITE must stay client-safe, found: ${privateish.join(", ")}`);
  assert.equal("ownerEmail" in SITE, false, "ownerEmail moved to api/contact/route.ts (P42-8d)");
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

/* ── signupUrl (P40-5a / P1-1 — the deep-link routing contract) ──── */

test("every product carries a signupUrl on its OWN domain, distinct from the root", () => {
  /* P1-1: كل أزرار التحويل في المظلة تتعمّق لصفحة اشتراك المنتج —
     signupUrl هو نفسه مسار زر المنتج الأساسي (متحقَّق حياً 2026-10-31:
     منيو /subscribe ×6، بوت /subscribe ×4، أوردر /register ×6 على
     جذورهم المنشورة). العقد: https + نطاق المنتج نفسه + مسار غير الجذر. */
  const expected = new Set([
    "https://menu.smart-link.ly/subscribe",
    "https://bot.smart-link.ly/subscribe",
    "https://order.smart-link.ly/register",
  ]);
  const actual = new Set([
    SITE.products.menu.signupUrl,
    SITE.products.bot.signupUrl,
    SITE.products.order.signupUrl,
  ]);
  assert.deepEqual(actual, expected);
  for (const p of [SITE.products.menu, SITE.products.bot, SITE.products.order]) {
    assert.ok(p.signupUrl.startsWith(`${p.url}/`), `${p.signupUrl} must live under ${p.url}`);
    assert.notEqual(p.signupUrl, p.url);
  }
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
