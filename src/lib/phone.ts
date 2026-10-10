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
 * r138 (توحيد الأسطولة — قرار r138-SO): العقد الليبي الموحّد للأسطولة:
 *  - محمول 09 بطول 9-10 خانات (0912345678 الكامل، و091234567 نموذج
 *    المشغّلين القصار المقبول هنا منذ r137)؛
 *  - أرضي 0[1-9] بعشر خانات (0211234567 طرابلس وأخواتها) — جديد عن
 *    r137: كان الأرضي يُرفض؛ Smart-Order اعتمد العقد الأوسع نفسه في
 *    r138-SO (كان 09 بعشر خانات فقط) فتوحّدت الأسطولة على شكل واحد.
 *  ما يزال خارج العقد: بوابة الدفع في Smart-Menu (payment-schema:
 *  09\d{8} قبل التطبيع) — مسجّلة لدى المنسق لجولة مستقبلية.
 *  مقايضة مقبولة عمدًا (نفس توثيق r138-SO): إسقاط خانة من محمول عشر
 *  خانات يُنتج قصيرًا صالحًا — أولوية القبول على الرفض.
 *  «واتساب أولاً» يبقى سلوك عرض لا شرط قبول: بريد المالك يستدعي
 *  toWaMeHref للمحمول فقط (contact-emails) — الأرضي يُعرض نصًا خامًا
 *  فلا يولد رابط wa.me ميتًا.
 */
export const LIBYAN_PHONE_RE = /^(?:09\d{7,8}|0[1-9]\d{8})$/;

/** Shared Arabic error (client + API ride the same string — r10 doctrine).
 *  r138: تسمّي العائلتين — الأرضي 021… مقبول الآن (عقد الأسطولة)
 *  فلا يجوز أن تنعَت الرسالة رقمًا ليبيًا صحيحًا بالخطأ؛ المحمول
 *  أولًا لأن الحقل «واتساب أولاً». */
export const PHONE_ERROR =
  "أدخل رقم هاتف ليبيًا صحيحًا (محمول 0912345678 أو أرضي 0211234567)";

/**
 * Normalize a user-typed Libyan phone to the canonical local form
 * `09XXXXXXXX`, or undefined when invalid. Accepts:
 *  - Eastern Arabic digits: ٠٩١٢٣٤٥٦٧٨
 *  - separators: spaces / dashes / parentheses
 *  - international spellings: +218 91… and 00218 91…
 * r138: the trunk-restore gate is the Smart-Order twin — ONLY a mobile
 * missing its trunk (9xxxxxxx / 9xxxxxxxx, 8–9 digits) gains the 0;
 * a landline typed without its trunk (212345678) rejects across the
 * whole fleet (SO included), and garbage (123456789) must never turn
 * into a landline through a blind prepend.
 * Invalid prefixes (not 0…) and wrong lengths (mobile ≠ 9–10 digits,
 * landline ≠ 10) reject.
 */
export function normalizeLibyanPhone(
  input: string | null | undefined
): string | undefined {
  const cleaned = normalizeCustomerPhone(input);
  if (!cleaned) return undefined;
  let digits = cleaned.replace(/^\+/, "");
  if (digits.startsWith("00218")) digits = digits.slice(5);
  else if (digits.startsWith("218")) digits = digits.slice(3);
  // a local number never starts with "218" (it starts with 0), so the
  // country-code strip above is unambiguous; restore the trunk zero only
  // for a MOBILE missing it — the r138 SO-twin gate (see the docblock).
  if (digits.startsWith("9") && (digits.length === 8 || digits.length === 9)) {
    digits = "0" + digits;
  }
  return LIBYAN_PHONE_RE.test(digits) ? digits : undefined;
}

/** wa.me href for a LOCAL `09…` phone → `https://wa.me/21891…` (no "+"). */
export function toWaMeHref(localPhone: string): string {
  return `https://wa.me/218${localPhone.slice(1)}`;
}
