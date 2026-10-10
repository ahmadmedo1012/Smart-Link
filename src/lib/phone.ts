/**
 * r137 (ليبي أولاً): تطبيع وتحقق رقم الهاتف الليبي — optional WhatsApp-first
 * field for the contact form.
 *
 * PORTED SEAM: this is a minimal port of the Smart-Menu r136 phone seam
 * (fleet/Smart-Menu/src/lib/phone.ts — normalizeCustomerPhone: fold the
 * Eastern Arabic digits ٠٩١٢… to Western first, then strip every
 * non-digit; the fleet's single normalization lesson). Smart-Link adds
 * the Libyan-specific validation on top (the Smart-Menu twin stays
 * deliberately format-neutral because it normalizes STORED data; this
 * form validates BEFORE sending, so it must also accept/expand the
 * international spellings a visitor types).
 */

/**
 * The cleaned phone (Eastern digits folded to Western, separators
 * stripped, leading "+" preserved) or undefined when nothing digits-like
 * remains — verbatim contract of the Smart-Menu r136 seam.
 */
export function normalizeCustomerPhone(
  input: string | null | undefined
): string | undefined {
  if (!input) return undefined;
  const western = input.replace(/[٠-٩]/g, (d) =>
    String("٠١٢٣٤٥٦٧٨٩".indexOf(d))
  );
  const plus = western.trimStart().startsWith("+");
  const digits = western.replace(/[^\d]/g, "");
  if (!digits) return undefined;
  return (plus ? "+" : "") + digits;
}

/**
 * A valid Libyan mobile in its LOCAL form: `09` + 7–8 more digits
 * (0912345678 = 10 digits; the 9-digit short operators stay valid too).
 */
export const LIBYAN_PHONE_RE = /^09\d{7,8}$/;

/** Shared Arabic error (client + API ride the same string — r10 doctrine). */
export const PHONE_ERROR = "أدخل رقمًا ليبيًا صحيحًا (مثال: 0912345678)";

/**
 * Normalize a user-typed Libyan phone to the canonical local form
 * `09XXXXXXXX`, or undefined when invalid. Accepts:
 *  - Eastern Arabic digits: ٠٩١٢٣٤٥٦٧٨
 *  - separators: spaces / dashes / parentheses
 *  - international spellings: +218 91… and 00218 91…
 * Invalid prefixes (not 09X) and wrong lengths (≠ 9–10 digits) reject.
 */
export function normalizeLibyanPhone(
  input: string | null | undefined
): string | undefined {
  const cleaned = normalizeCustomerPhone(input);
  if (!cleaned) return undefined;
  let digits = cleaned.replace(/^\+/, "");
  if (digits.startsWith("00218")) digits = digits.slice(5);
  else if (digits.startsWith("218")) digits = digits.slice(3);
  // a local number never starts with "218" (it starts with 09), so the
  // country-code strip above is unambiguous; restore the trunk zero only
  // when the national significant number follows (9XXXXXXXX).
  if (!digits.startsWith("09")) digits = "0" + digits;
  return LIBYAN_PHONE_RE.test(digits) ? digits : undefined;
}

/** wa.me href for a LOCAL `09…` phone → `https://wa.me/21891…` (no "+"). */
export function toWaMeHref(localPhone: string): string {
  return `https://wa.me/218${localPhone.slice(1)}`;
}
