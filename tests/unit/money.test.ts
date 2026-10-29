/**
 * Unit — lib/money (the LYD display seam, r137 fleet money policy).
 *
 * The ONE fleet convention pinned: Western digits + dot thousands
 * grouping + " د.ل" suffix, hand-rolled (hydration-safe — byte-identical
 * on server and client regardless of ICU build). Dirham fractions
 * render at Libya's native 3-decimal precision (1 LYD = 1000 dirham).
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import { formatLyd } from "../../src/lib/money.ts";

test("whole dinars render clean with the د.ل suffix", () => {
  assert.equal(formatLyd(19), "19 د.ل");
  assert.equal(formatLyd(0), "0 د.ل");
  assert.equal(formatLyd("19"), "19 د.ل");
});

test("fractional parts render at 3-decimal dirham precision, padded", () => {
  assert.equal(formatLyd(19.5), "19.500 د.ل");
  assert.equal(formatLyd("19.5"), "19.500 د.ل");
  assert.equal(formatLyd("19.50"), "19.500 د.ل");
  assert.equal(formatLyd("19.125"), "19.125 د.ل");
});

test("dirham digits beyond 3 are truncated (never rounded/invented)", () => {
  assert.equal(formatLyd("19.5678"), "19.567 د.ل");
  assert.equal(formatLyd("19.9999"), "19.999 د.ل");
});

test("the Arabic decimal comma is accepted and normalized", () => {
  assert.equal(formatLyd("19,5"), "19.500 د.ل");
  assert.equal(formatLyd("١٩,٥"), "19.500 د.ل");
});

test("Eastern Arabic digits fold to Western", () => {
  assert.equal(formatLyd("١٩"), "19 د.ل");
  assert.equal(formatLyd("١٢٥٠٠٠٠٠"), "12.500.000 د.ل");
});

test("dot thousands grouping on the integer part", () => {
  assert.equal(formatLyd(12500000), "12.500.000 د.ل");
  assert.equal(formatLyd(1000), "1.000 د.ل");
  assert.equal(formatLyd(999), "999 د.ل");
});

test("combined grouping + fraction", () => {
  assert.equal(formatLyd("12500000.5"), "12.500.000.500 د.ل");
});

test("no digits at all renders the empty string", () => {
  assert.equal(formatLyd(""), "");
  assert.equal(formatLyd("abc"), "");
  assert.equal(formatLyd("د.ل فقط"), "");
});

test("stray non-digit characters are stripped before parsing", () => {
  assert.equal(formatLyd("19 د.ل"), "19 د.ل");
  assert.equal(formatLyd(" 19.500 "), "19.500 د.ل");
});
