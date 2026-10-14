import { test, expect, allowResourceNoise } from "./fixtures"
import { PAGES } from "./fixtures"

/**
 * عقد الأرقام الغربية (E1 — مرحلة 9): كل نص يصل إلى DOM الواجهة يُعرض
 * بالأرقام الغربية 1234567890 فقط. العقد لا يمس تعليقات الكود (لا تُصيَّر)
 * ولا مدخلات المستخدم (money.ts/phone.ts يطبّعان المدخلات الشرقية إلى
 * غربية — اختبارات contact.spec تغطي ذلك الطريق).
 *
 * الانحدار المؤكد الذي ولّد هذا العقد: أرقام فصول العوالم ٠١/٠٢/٠٣
 * (worlds.ts → .ln-world-num) كانت ترسم العربية الشرقية على الشاشة.
 *
 * P10-1c (امتداد السياسة «كل الواجهة» ما بعد الرئيسية): حلقة PAGES
 * الست غطّت المسارات التسويقية فقط — أسطح الأدوات/الحدود خارجها
 * (/offline بلا دخول PAGES بعقد seo/axe، و404 مسار ميت) دخلت هنا
 * بنفس العقد: نص الصفحة المُصيَّر كله أرقام غربية (رقم الواتساب في
 * /offline، ورقم 404 نفسه على الحدّ).
 */
const ARABIC_INDIC = /[\u0660-\u0669]/

test.describe("الأرقام الغربية — لا أرقام عربية-هندية في أي DOM مصيَّر", () => {
  for (const p of PAGES) {
    test(`${p.path} — نص الصفحة كله أرقام غربية`, async ({ page }) => {
      await page.goto(p.path, { waitUntil: "networkidle" })
      const text = await page.evaluate(() => document.body.innerText)
      const hits = text.match(new RegExp(ARABIC_INDIC, "g"))
      expect(
        hits,
        `Arabic-Indic digits rendered in the DOM on ${p.path}: ${hits?.join(" ")}`
      ).toBeNull()
    })
  }
})

test.describe("الأرقام الغربية — أسطح الأدوات/الحدود خارج PAGES (P10-1c)", () => {
  test("/offline — نص الصفحة كله أرقام غربية", async ({ page }) => {
    /* سابقة offline.spec: صفحة الأداة تُزار مباشرة (SW محجوب عالمياً
       في الجناح — عرض خالص من الخادم). */
    await page.goto("/offline", { waitUntil: "networkidle" })
    const text = await page.evaluate(() => document.body.innerText)
    const hits = text.match(new RegExp(ARABIC_INDIC, "g"))
    expect(
      hits,
      `Arabic-Indic digits rendered in the DOM on /offline: ${hits?.join(" ")}`
    ).toBeNull()
  })

  test("404 (مسار ميت) — نص الصفحة كله أرقام غربية", async ({ page, consoleErrors }) => {
    /* سابقة pages.spec: ضوضية طلب الوثيقة الميت نفسه (404) معلنة
       صراحة — كل ما عداها يبقى قاتلاً. */
    allowResourceNoise(consoleErrors, /Failed to load resource.*404/)
    await page.goto("/صفحة-غير-موجودة-p10-1c", { waitUntil: "networkidle" })
    const text = await page.evaluate(() => document.body.innerText)
    const hits = text.match(new RegExp(ARABIC_INDIC, "g"))
    expect(
      hits,
      `Arabic-Indic digits rendered in the DOM on the 404 boundary: ${hits?.join(" ")}`
    ).toBeNull()
  })
})
