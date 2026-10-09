import { test as base, expect } from "@playwright/test"

/**
 * Fixture مشترك لكل الاختبارات:
 * 1) إسكات الموارد الخارجية (analytics) — محلياً `/_vercel/insights/*`
 *    يعيد 404 من خادم next start ويولّد ضوضاء console كاذبة تُفشل فحص
 *    «صفر أخطاء console». نستوفيها بردود فارغة بدلاً من تجاهل الأخطاء
 *    (إسكات أقوى من تصفية لأن الأخطاء الحقيقية تبقى ظاهرة).
 *    (r9: مسار unsplash أُزيل — الموقع يخدم صفر صور خارجية بعد حذف
 *    remotePatterns).
 * 2) جمع أخطاء console و pageerror — كل spec يفحصها في النهاية.
 *
 * r11 (F-G8 — بوابة عالمية): فرض «صفر أخطاء console» كان مسؤولية كل
 * spec على حدة، وبعضها نسيه (نفس صنف الثغرة التي أخفت انحدار
 * 404-canonical في r9: اختبار يدّعي ما لا يفحصه). الآن البوابة عالمية
 * في teardown الـfixture — آخر خطوة بعد كل اختبار، فتفشل أي حالة تسرّب
 * خطأ console/pageerror أياً كان spec الذي شغّلها.
 * الاستثناء الوحيد: الأزرار `allow` — اختبار يستفز عمداً فشل شبكة
 * (503/429/abort/صفحة-404) يعلن الضوضية المتوقعة صراحة، وكل ما عداها
 * يبقى قاتلاً.
 */

/** مصفوفة أخطاء + قائمة أنماط مسموحة لهذا الاختبار تحديداً */
export type ConsoleErrors = string[] & { allow: RegExp[] }

export const test = base.extend<{ consoleErrors: ConsoleErrors }>({
  consoleErrors: [
    async ({ page }, use) => {
      await page.route("**/_vercel/insights/**", (r) =>
        r.fulfill({ status: 200, contentType: "application/javascript", body: "" })
      )
      await page.route("**/va.vercel-scripts.com/**", (r) =>
        r.fulfill({ status: 200, contentType: "application/javascript", body: "" })
      )
      /* r11: `allow` غير قابلة للعدّ — خاصية قابلة للعدّ على المصفوفة
         كانت تكسر expect(consoleErrors).toEqual([]) العميق في كل spec
         قديم ("serializes to the same string" — JSON يتجاهل غير القابلة
         للعدّ فينجو الاثنان معاً: البوابة تعمل والمقارنات القديمة سليمة). */
      const errors = [] as string[]
      Object.defineProperty(errors, "allow", {
        value: [] as RegExp[],
        enumerable: false,
        writable: true,
      })
      page.on("console", (m) => {
        if (m.type() === "error") errors.push(m.text())
      })
      page.on("pageerror", (e) => errors.push(String(e)))
      await use(errors as ConsoleErrors)
      /* F-G8: البوابة العالمية — أي خطأ console/pageerror غير مُصرَّح به
         يفشل الاختبار حتى لو نجحت كل assertions فيه. مهلة استقرار قصيرة
         تلتقط أحداث console المتأخرة (fetch يعقب assertions مباشرة أحياناً). */
      await page.waitForTimeout(300).catch(() => {})
      const gate = errors as ConsoleErrors
      const relevant = errors.filter((e) => !gate.allow.some((re) => re.test(e)))
      if (relevant.length > 0) {
        throw new Error(
          `[console-gate] ${relevant.length} خطأ console غير متوقع:\n${relevant.join("\n")}`
        )
      }
    },
    { auto: true },
  ],
})

/** إعلان ضوضية شبكة مقصودة لاختبار بعينه (مثال: صفحة 404، رد 503) */
export function allowResourceNoise(errors: ConsoleErrors, pattern: RegExp) {
  errors.allow.push(pattern)
}

export { expect }

/** الصفحات الست + عناوينها — مصدر واحد للحقيقة لكل specs الصفحات/SEO/a11y
 *
 * r133 (A7 §1 re-base): r128 Stage B (F2b) نقل كروم المنتج (MainNav/
 * Footer/BackToTop/مبدّل المظهر) من ال landing إلى الصفحات الداخلية —
 * الرئيسية صارت عالم Orbit-Ink خاصاً بها (LandingHeader/LandingFooter).
 * عنوان h1 للرئيسية هو نص الهيرو الحقيقي «كلُّ عملٍ يبدأ رابطًا ويصبح
 * منظومةً» (page.tsx:99-102) — لا يحمل كلمة SmartLink إطلاقاً. كل spec
 * يبني على هذه المصفوفة يرث العقد المصحّح تلقائياً. */
export const PAGES = [
  { path: "/", h1: /كلُّ عملٍ يبدأ رابطًا/, title: /SmartLink — منصة رقمية متكاملة/ },
  { path: "/about", h1: /عن SmartLink/, title: /عن SmartLink — منصة ليبية متكاملة \| SmartLink/ },
  { path: "/pricing", h1: /الخطط والأسعار/, title: /الخطط والأسعار — ابدأ مجاناً اليوم \| SmartLink/ },
  { path: "/contact", h1: /تواصل معنا/, title: /تواصل معنا — فريق SmartLink جاهز للمساعدة \| SmartLink/ },
  { path: "/privacy", h1: /سياسة الخصوصية/, title: /سياسة الخصوصية وحماية بياناتك \| SmartLink/ },
  { path: "/terms", h1: /شروط الاستخدام/, title: /شروط الاستخدام وأحكام التعاقد \| SmartLink/ },
] as const

export const BASE = "https://smart-link.ly"
