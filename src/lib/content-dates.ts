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

/** سياسة الخصوصية + شروط الاستخدام — آخر تغيير نصي حقيقي: r138 (2026-10-10). */
export const LEGAL_UPDATED = {
  iso: "2026-10-10",
  label: "أكتوبر 2026",
} as const;

/** عن الوكالة — آخر تغيير نصي حقيقي: r143 (2026-10-11، موجة الصدق). */
export const ABOUT_UPDATED = {
  iso: "2026-10-11",
} as const;

/** تواصل معنا — آخر تغيير نصي حقيقي: r134 (2026-10-09). */
export const CONTACT_UPDATED = {
  iso: "2026-10-09",
} as const;
