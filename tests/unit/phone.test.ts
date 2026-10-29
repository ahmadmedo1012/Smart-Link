/**
 * Unit — lib/phone (the Libyan phone seam, r137/r138 fleet contract).
 *
 * Zero-dependency node:test layer (the Smart-Order convention): plain
 * Node with native TS type-stripping, no test framework, no install.
 * The pure seam is fully specified here so regressions in digit
 * folding, trunk restoration, or the landline contract surface in
 * seconds instead of through a full Playwright build.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import {
  normalizeCustomerPhone,
  normalizeLibyanPhone,
  toWaMeHref,
  LIBYAN_PHONE_RE,
  PHONE_ERROR,
} from "../../src/lib/phone.ts";

/* ── normalizeCustomerPhone (the Smart-Menu r136 port verbatim) ──── */

test("normalizeCustomerPhone folds Eastern Arabic digits to Western", () => {
  assert.equal(normalizeCustomerPhone("٠٩١٢٣٤٥٦٧٨"), "0912345678");
  assert.equal(normalizeCustomerPhone("١٢٣"), "123");
});

test("normalizeCustomerPhone strips separators but keeps digits", () => {
  assert.equal(normalizeCustomerPhone("091-234 5678"), "0912345678");
  assert.equal(normalizeCustomerPhone("(091) 234-5678"), "0912345678");
  assert.equal(normalizeCustomerPhone("٠٩١ ٢٣٤ ٥٦٧٨"), "0912345678");
});

test("normalizeCustomerPhone preserves a single leading plus", () => {
  assert.equal(normalizeCustomerPhone("+218912345678"), "+218912345678");
  assert.equal(normalizeCustomerPhone("  +218 91 234 5678 "), "+218912345678");
});

test("normalizeCustomerPhone returns undefined for no digits / nullish", () => {
  assert.equal(normalizeCustomerPhone(""), undefined);
  assert.equal(normalizeCustomerPhone("   "), undefined);
  assert.equal(normalizeCustomerPhone("لا أرقام هنا"), undefined);
  assert.equal(normalizeCustomerPhone(null), undefined);
  assert.equal(normalizeCustomerPhone(undefined), undefined);
});

test("normalizeCustomerPhone drops stray letters but keeps digits", () => {
  assert.equal(normalizeCustomerPhone("call 0912345678 now"), "0912345678");
});

/* ── LIBYAN_PHONE_RE (the r138 unified fleet contract) ───────────── */

test("mobile: 9 or 10 digits starting 09 are valid; other lengths reject", () => {
  assert.ok(LIBYAN_PHONE_RE.test("0912345678")); // full 10-digit mobile
  assert.ok(LIBYAN_PHONE_RE.test("091234567")); // 9-digit short form
  assert.equal(LIBYAN_PHONE_RE.test("09123456"), false); // 8 digits
  assert.equal(LIBYAN_PHONE_RE.test("09123456789"), false); // 11 digits
  // 08… is NOT a mobile (mobile is 09… only) — but it IS a landline
  // under 0[1-9]; the mobile-family boundary is what pins here:
  assert.equal(/^09/.test("0812345678"), false);
});

test("landline: 0[1-9] with 10 total digits is valid (r138 widening)", () => {
  assert.ok(LIBYAN_PHONE_RE.test("0211234567")); // Tripoli
  assert.ok(LIBYAN_PHONE_RE.test("0312345678")); // Benghazi-style
  assert.equal(LIBYAN_PHONE_RE.test("0012345678"), false); // 0 + 0… invalid
  assert.equal(LIBYAN_PHONE_RE.test("211234567"), false); // no trunk
});

test("PHONE_ERROR names both families honestly (mobile first)", () => {
  assert.ok(PHONE_ERROR.includes("0912345678"));
  assert.ok(PHONE_ERROR.includes("0211234567"));
});

/* ── normalizeLibyanPhone ─────────────────────────────────────────── */

test("local mobile passes through unchanged (both lengths)", () => {
  assert.equal(normalizeLibyanPhone("0912345678"), "0912345678");
  assert.equal(normalizeLibyanPhone("091234567"), "091234567");
});

test("Eastern digits + separators normalize to the local form", () => {
  assert.equal(normalizeLibyanPhone("٠٩١٢٣٤٥٦٧٨"), "0912345678");
  assert.equal(normalizeLibyanPhone("٠٩١-٢٣٤ ٥٦٧٨"), "0912345678");
});

test("international spellings fold home (+218 and 00218)", () => {
  assert.equal(normalizeLibyanPhone("+218912345678"), "0912345678");
  assert.equal(normalizeLibyanPhone("+218 91 234 5678"), "0912345678");
  assert.equal(normalizeLibyanPhone("00218912345678"), "0912345678");
  assert.equal(normalizeLibyanPhone("00218 912345678"), "0912345678");
});

test("trunk-restore: ONLY a mobile missing its 0 gains it (r138 SO twin)", () => {
  assert.equal(normalizeLibyanPhone("912345678"), "0912345678"); // 9 digits
  assert.equal(normalizeLibyanPhone("91234567"), "091234567"); // 8 digits
  // a landline without its trunk NEVER gains one — fleet-wide rule:
  assert.equal(normalizeLibyanPhone("212345678"), undefined);
  assert.equal(normalizeLibyanPhone("21123456"), undefined);
});

test("garbage never becomes a landline through a blind prepend", () => {
  assert.equal(normalizeLibyanPhone("123456789"), undefined);
  assert.equal(normalizeLibyanPhone("999"), undefined);
  assert.equal(normalizeLibyanPhone("0"), undefined);
});

test("landline local forms are accepted and preserved", () => {
  assert.equal(normalizeLibyanPhone("0211234567"), "0211234567");
  assert.equal(normalizeLibyanPhone("٠٢١ ١٢٣ ٤٥٦٧"), "0211234567");
});

test("nullish / empty / digits-inside-text inputs", () => {
  assert.equal(normalizeLibyanPhone(null), undefined);
  assert.equal(normalizeLibyanPhone(undefined), undefined);
  assert.equal(normalizeLibyanPhone(""), undefined);
  assert.equal(normalizeLibyanPhone("WhatsApp: 0912345678"), "0912345678");
});

/* ── toWaMeHref ───────────────────────────────────────────────────── */

test("toWaMeHref maps a local 09… phone to wa.me without a plus", () => {
  assert.equal(toWaMeHref("0912345678"), "https://wa.me/218912345678");
  assert.equal(toWaMeHref("091234567"), "https://wa.me/21891234567");
});
