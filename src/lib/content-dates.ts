/**
 * مصدر الحقيقة الوحيد لتواريخ محتوى الصفحات شبه الثابتة — r144 (P4-4SL).
 *
 * One source of truth for the near-static pages' content dates. Before
 * this module the sitemap claimed `2026-09-09` for the legal pages while
 * both pages rendered «آخر تحديث: أكتوبر 2026» — the exact trust-erosion
 * the repo's own r9 doctrine bans (an inflated OR stale lastmod both
 * erode the signal). Every consumer reads THESE constants:
 *
 *   · `iso`   → the sitemap's `lastModified` (day precision, from the
 *     real git date of the last text change — never bumped decoratively).
 *   · `label` → the human Arabic month stamp the pages render.
 *
 * RULE: when a page's TEXT actually changes, bump its entry here in the
 * same commit — the on-page stamp and the sitemap can never disagree
 * again because they are the same value.
 */

/** سياسة الخصوصية + شروط الاستخدام — آخر تغيير نصي حقيقي: W6-B2
 *  (2026-10-18، صدق القنوات: قسم التواصل في الصفحتين صار واتساب +
 *  النموذج بدل بريد noreply@ الذي لا يملك صندوقًا مراقَبًا). */
export const LEGAL_UPDATED = {
  iso: "2026-10-18",
  label: "أكتوبر 2026",
} as const;

/** عن الوكالة — آخر تغيير نصي حقيقي: W6-B2 (2026-10-18، صدق القصة:
 *  «قصتنا» تختم على المنتجات الثلاثة الحيّة بدل وعد بخدمات مستقبلية
 *  من حقبة المنتجين — نفس موجة r143/r137). */
export const ABOUT_UPDATED = {
  iso: "2026-10-18",
} as const;

/** تواصل معنا — آخر تغيير نصي حقيقي: W6-B2 (2026-10-18، صدق
 *  القنوات: بطاقة البريد رحلت؛ واتساب + النموذج هما القناتان
 *  المعلنتان). */
export const CONTACT_UPDATED = {
  iso: "2026-10-18",
} as const;
