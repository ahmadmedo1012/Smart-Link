#!/usr/bin/env node
/**
 * regen-logo-light.mjs — regenerate public/logo-light.png (phase6, P6-2-a4).
 *
 * The repo ships NO SVG wordmark source (the `.svg` was deleted in r9 —
 * social crawlers don't support SVG); the two brand rasters are the
 * source of truth. `public/logo.png` is the night-gold twin (gold
 * ≈#E9B44C glyph on transparent). This script re-inks the LIGHT twin
 * from it:
 *
 *   · every glyph pixel's RGB → deep gold #8A6420 — the phase6
 *     light-gold ruling's TEXT grade (5.13:1 on the cream ground
 *     #FBFAF9, ≥ 4.5 — the r131 copper #B57438 raster is retired);
 *   · the ALPHA channel is preserved byte-for-byte (truly
 *     alpha-identical to the gold twin — the anti-aliased edges
 *     composite the deep gold over the cream);
 *   · same path, same 600×409 geometry, PNG (rgba).
 *
 * Usage:  node scripts/regen-logo-light.mjs   (run from the repo root).
 * The script pixel-verifies its own output and exits 1 on any drift —
 * run it in the same commit as any future re-ink.
 */
import sharp from "sharp";
import { access } from "node:fs/promises";

const SRC = "public/logo.png";
const OUT = "public/logo-light.png";
const DEEP_GOLD = [138, 100, 32]; // #8A6420 — phase6 light text-grade gold
const CREAM = [251, 250, 249]; // #FBFAF9 — the light ground
const RETIRED_COPPER = [181, 116, 56]; // #B57438 — must be gone

/** WCAG 2.x contrast ratio between two sRGB triples. */
function contrast(a, b) {
  const lum = (rgb) => {
    const lin = rgb.map((c) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
  };
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

const fail = (msg) => {
  console.error(`✗ regen-logo-light: ${msg}`);
  process.exit(1);
};

await access(SRC).catch(() => fail(`${SRC} not found`));

const { data: srcRaw, info: srcInfo } = await sharp(SRC)
  .raw()
  .toBuffer({ resolveWithObject: true });

if (srcInfo.channels !== 4) fail(`source is ${srcInfo.channels}-channel, expected RGBA`);

// ── Recolor: RGB → deep gold, alpha byte-identical ──────────────────
const out = Buffer.from(srcRaw); // copy (keeps alpha bytes verbatim)
for (let i = 0; i < out.length; i += 4) {
  out[i] = DEEP_GOLD[0];
  out[i + 1] = DEEP_GOLD[1];
  out[i + 2] = DEEP_GOLD[2];
}

await sharp(out, {
  raw: { width: srcInfo.width, height: srcInfo.height, channels: 4 },
})
  .png({ compressionLevel: 9 })
  .toFile(OUT);

// ── Pixel verification (independent re-read of what we wrote) ───────
const { data: check, info: checkInfo } = await sharp(OUT)
  .raw()
  .toBuffer({ resolveWithObject: true });

if (checkInfo.width !== srcInfo.width || checkInfo.height !== srcInfo.height)
  fail(`geometry drifted: ${checkInfo.width}×${checkInfo.height} vs ${srcInfo.width}×${srcInfo.height}`);
if (checkInfo.channels !== 4) fail("output lost its alpha channel");

let glyphPx = 0;
let copperPx = 0;
let alphaMismatch = 0;
for (let i = 0; i < check.length; i += 4) {
  if (check[i + 3] !== srcRaw[i + 3]) alphaMismatch++;
  if (check[i + 3] > 8) {
    glyphPx++;
    const px = [check[i], check[i + 1], check[i + 2]];
    if (px.some((c, k) => Math.abs(c - DEEP_GOLD[k]) > 2)) fail(`non-gold glyph pixel at byte ${i}: ${px}`);
    if (px.every((c, k) => Math.abs(c - RETIRED_COPPER[k]) <= 2)) copperPx++;
  }
}
if (alphaMismatch !== 0) fail(`alpha channel drifted on ${alphaMismatch} pixels — must be byte-identical`);
if (glyphPx === 0) fail("no glyph pixels — the re-ink erased the wordmark");
if (copperPx !== 0) fail(`${copperPx} copper pixels survived`);

// corners transparent (ground)
const corners = [
  [0, 0],
  [checkInfo.width - 1, 0],
  [0, checkInfo.height - 1],
  [checkInfo.width - 1, checkInfo.height - 1],
];
for (const [x, y] of corners) {
  const a = check[(y * checkInfo.width + x) * 4 + 3];
  if (a !== 0) fail(`corner (${x},${y}) is not transparent (alpha ${a})`);
}

const ratio = contrast(DEEP_GOLD, CREAM);
console.log(
  `✓ ${OUT} re-inked: ${checkInfo.width}×${checkInfo.height} rgba · ` +
    `${glyphPx} glyph px @ rgb(${DEEP_GOLD}) (#8A6420) · ` +
    `alpha byte-identical to ${SRC} · corners transparent · ` +
    `glyph-on-cream contrast ${ratio.toFixed(2)}:1 (ruling floor ≥ 4.5) · ` +
    `copper #B57438 pixels: 0`
);
if (ratio < 4.5) fail(`glyph contrast ${ratio.toFixed(2)}:1 is below the 4.5 ruling floor`);
