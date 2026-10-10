/**
 * r137 (ليبي أولاً — LYD readiness): the pricing-page money seam.
 *
 * FLEET POLICY (documented decision): Smart-Link is an ar-LY product and
 * the fleet's ONE money convention is WESTERN digits with dot thousands
 * grouping + the "د.ل" suffix —
 *  - madarek frontend/src/utils/numbers.ts `formatNum` (Intl "ar-LY":
 *    CLDR resolves the locale to latn digits, `1.234.567,5`);
 *  - Smart-Order src/lib/plan-types.ts `toArabicNumber` + src/lib/money.ts
 *    `formatLyd` ("12.500 د.ل", r133 A12 S1/R6: ONE grouping regime).
 * The grouping below is hand-rolled, not Intl, so the output is
 * byte-identical on server and client regardless of ICU build
 * (hydration-safe family policy; matches Intl ar-LY exactly).
 *
 * r137 DECISION (honesty over invention): every Smart-Link plan today is
 * «مجاني» and the paid tiers are «قريباً» — NO real LYD price exists on
 * the site, so the pricing page renders no invented amounts. When a real
 * price lands, author it in whole dinars (19) or with dirhams ("19.500")
 * and render it through `formatLyd` — never hand-roll a second spelling.
 */

/** Dot-group the integer part (ar-LY regime): "12500000" → "12.500.000". */
function groupDots(intStr: string): string {
  return intStr.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * Format a LYD amount for display: Western digits + dot grouping +
 * " د.ل". Accepts Eastern Arabic digits and the Arabic decimal comma
 * ("١٩,٥" → "19.500 د.ل"). Whole dinars stay clean ("19 د.ل"); a
 * fractional part renders at Libya's native 3-decimal dirham precision
 * (1 د.ل = 1000 dirham — the Smart-Order `formatLyd` twin contract).
 */
export function formatLyd(amount: number | string): string {
  const western = typeof amount === "string"
    ? amount.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    : String(amount);
  const cleaned = western.replace(/,/g, ".").replace(/[^\d.]/g, "");
  const parts = cleaned.split(".");
  if (!parts[0] && !parts[1]) return "";
  const whole = groupDots(parts[0] || "0");
  const fracRaw = (parts[1] ?? "").slice(0, 3);
  const frac = fracRaw ? `.${fracRaw.padEnd(3, "0")}` : "";
  return `${whole}${frac} د.ل`;
}
