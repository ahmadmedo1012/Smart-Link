/**
 * Unit — lib/contact-rules (the ONE shared client/server contract).
 *
 * r10's whole point: the form and the API ride the SAME module so the
 * two halves can never drift. These pins hold the contract: the email
 * regex, the length caps, the letter rule (r11 — symbol/emoji-only
 * names reject), the subject map (r13 — one source), and the success
 * message. Also pins the phone re-export surface.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import {
  EMAIL_RE,
  NAME_MAX,
  EMAIL_MAX,
  MESSAGE_MAX,
  PHONE_MAX,
  NAME_LETTER_RE,
  NAME_LETTER_ERROR,
  SUBJECTS,
  SUBJECT_LABELS,
  CONTACT_SUCCESS_MESSAGE,
  normalizeLibyanPhone,
  toWaMeHref,
  PHONE_ERROR,
} from "../../src/lib/contact-rules.ts";

/* ── EMAIL_RE ─────────────────────────────────────────────────────── */

test("EMAIL_RE accepts ordinary addresses", () => {
  assert.ok(EMAIL_RE.test("visitor@example.com"));
  assert.ok(EMAIL_RE.test("a.b+c@sub.domain.ly"));
  assert.ok(EMAIL_RE.test("x@y.co"));
});

test("EMAIL_RE rejects malformed addresses", () => {
  assert.equal(EMAIL_RE.test("plainstring"), false);
  assert.equal(EMAIL_RE.test("missing@tld"), false);
  assert.equal(EMAIL_RE.test("@no-local.com"), false);
  assert.equal(EMAIL_RE.test("a @space.com"), false);
  assert.equal(EMAIL_RE.test("a@b@c.com"), false);
  assert.equal(EMAIL_RE.test(""), false);
});

/* ── the length caps (r10 — one source for both halves) ──────────── */

test("the caps stay pinned to the audited values", () => {
  assert.equal(NAME_MAX, 100);
  assert.equal(EMAIL_MAX, 254);
  assert.equal(MESSAGE_MAX, 5000);
  assert.equal(PHONE_MAX, 24);
});

/* ── NAME_LETTER_RE (r11 — symbol/emoji-only names reject) ───────── */

test("names carrying at least one letter or digit pass the letter rule", () => {
  assert.ok(NAME_LETTER_RE.test("أحمد"));
  assert.ok(NAME_LETTER_RE.test("Ahmed Ali"));
  assert.ok(NAME_LETTER_RE.test("عبد الله 99"));
  assert.ok(NAME_LETTER_RE.test("John 👍 Smith")); // letters present
});

test("symbol/emoji-only names reject (the r11 adversarial pin)", () => {
  assert.equal(NAME_LETTER_RE.test("★★★"), false);
  assert.equal(NAME_LETTER_RE.test("👍🙏"), false);
  assert.equal(NAME_LETTER_RE.test("---"), false);
  assert.equal(NAME_LETTER_RE.test(""), false);
});

test("NAME_LETTER_ERROR is the one shared Arabic sentence", () => {
  assert.equal(NAME_LETTER_ERROR, "الاسم يجب أن يحتوي على أحرف");
});

/* ── SUBJECTS / SUBJECT_LABELS (r13 — the map lives once) ────────── */

test("the four subject keys are exactly the product/support set", () => {
  assert.deepEqual(
    SUBJECTS.map((s) => s.key),
    ["menu", "bot", "support", "other"],
  );
});

test("every subject carries a non-empty Arabic label", () => {
  for (const s of SUBJECTS) {
    assert.ok(s.label.length > 0, `label for ${s.key}`);
    assert.ok(s.label.includes(" ") || s.label.length > 3);
  }
});

test("SUBJECT_LABELS mirrors SUBJECTS exactly", () => {
  assert.equal(Object.keys(SUBJECT_LABELS).length, SUBJECTS.length);
  for (const s of SUBJECTS) {
    assert.equal(SUBJECT_LABELS[s.key], s.label);
  }
  assert.equal(SUBJECT_LABELS["not-a-key"], undefined);
});

/* ── the success message (r13 — one string at every send site) ──── */

test("CONTACT_SUCCESS_MESSAGE is pinned verbatim", () => {
  assert.equal(
    CONTACT_SUCCESS_MESSAGE,
    "تم استلام رسالتك بنجاح. سنتواصل معك قريباً.",
  );
});

/* ── the phone re-export surface rides the r138 fleet contract ───── */

test("the phone seam re-exports are the lib/phone twins", () => {
  assert.equal(typeof normalizeLibyanPhone, "function");
  assert.equal(typeof toWaMeHref, "function");
  assert.equal(typeof PHONE_ERROR, "string");
  // behavior spot-checks (full pins live in phone.test.ts):
  assert.equal(normalizeLibyanPhone("٠٩١٢٣٤٥٦٧٨"), "0912345678");
  assert.equal(toWaMeHref("0912345678"), "https://wa.me/218912345678");
});
