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
 */

export const test = base.extend<{ consoleErrors: string[] }>({
  consoleErrors: [
    async ({ page }, use) => {
      await page.route("**/_vercel/insights/**", (r) =>
        r.fulfill({ status: 200, contentType: "application/javascript", body: "" })
      )
      await page.route("**/va.vercel-scripts.com/**", (r) =>
        r.fulfill({ status: 200, contentType: "application/javascript", body: "" })
      )
      const errors: string[] = []
      page.on("console", (m) => {
        if (m.type() === "error") errors.push(m.text())
      })
      page.on("pageerror", (e) => errors.push(String(e)))
      await use(errors)
    },
    { auto: true },
  ],
})

export { expect }

/** الصفحات الست + عناوينها — مصدر واحد للحقيقة لكل specs الصفحات/SEO/a11y */
export const PAGES = [
  { path: "/", h1: /SmartLink/, title: /SmartLink - منصة رقمية متكاملة/ },
  { path: "/about", h1: /عن SmartLink/, title: /عن المنصة \| SmartLink/ },
  { path: "/pricing", h1: /الخطط والأسعار/, title: /الخطط والأسعار \| SmartLink/ },
  { path: "/contact", h1: /تواصل معنا/, title: /تواصل معنا \| SmartLink/ },
  { path: "/privacy", h1: /سياسة الخصوصية/, title: /سياسة الخصوصية \| SmartLink/ },
  { path: "/terms", h1: /شروط الاستخدام/, title: /شروط الاستخدام \| SmartLink/ },
] as const

export const BASE = "https://smart-link.ly"
