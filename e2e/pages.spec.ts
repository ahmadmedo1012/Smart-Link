import { test, expect, PAGES, allowResourceNoise } from "./fixtures"

/**
 * فحوص الدخان: كل صفحة تُخدم بنجاح، RTL عربية، عنوان h1، عنوان تبويب
 * صحيح، وصفر أخطاء console/JS — في الوضع الافتراضي (داكن).
 */
test.describe("الدخان — الصفحات الست", () => {
  for (const p of PAGES) {
    test(`صفحة ${p.path} — 200 + RTL + h1 + عنوان التبويب`, async ({ page, consoleErrors }) => {
      const res = await page.goto(p.path, { waitUntil: "networkidle" })
      expect(res?.status()).toBe(200)

      // RTL عربية على مستوى html
      await expect(page.locator("html")).toHaveAttribute("dir", "rtl")
      await expect(page.locator("html")).toHaveAttribute("lang", "ar")

      // h1 واحد بالضبط يحمل عنوان الصفحة (r10: العدّ الصارم — first() كان
      // سيخفي صفحة بها اثنان)
      await expect(page.locator("h1")).toHaveCount(1)
      await expect(page.locator("h1").first()).toHaveText(p.h1)

      // عنوان التبويب
      await expect(page).toHaveTitle(p.title)

      // صفر أخطاء console (الموارد الخارجية مُسكَتة — الباقي علينا)
      expect(
        consoleErrors,
        `console errors on ${p.path}:\n${consoleErrors.join("\n")}`
      ).toEqual([])
    })
  }

  test("404 — حالة 404 + صفحة عربية بعنوان تبويب خاص", async ({ page, consoleErrors }) => {
    /* r11 (F-G8): ضوضية مقصودة — طلب الوثيقة الميت نفسه يسجّل 404. */
    allowResourceNoise(consoleErrors, /Failed to load resource.*404/)
    const res = await page.goto("/صفحة-غير-موجودة-r7", { waitUntil: "networkidle" })
    expect(res?.status()).toBe(404)
    await expect(page.locator("h1")).toContainText("404")
    await expect(page).toHaveTitle(/الصفحة غير موجودة \| SmartLink/)
    // طلب المستند نفسه يسجّل "Failed to load resource: 404" — سلوك متوقع
    // للمسار الميت؛ نستثنيه ونفحص أن لا شيء آخر انكسر
    expect(consoleErrors.filter((e) => !e.includes("404"))).toEqual([])
  })

  test("الرئيسية — القيم النهائية للإحصائيات حاضرة بعد التمرير (SSR يحمي LCP — r8/r10)", async ({ page }) => {
    /* r13 (testing audit): كان الاسم «تعدّ حتى قيمها» والفحص نص واحد
       مرئي — حقيقة بديهية منذ جراحة r8 (القيم النهائية في SSR نفسه،
       ومحكومة أصلاً بـlcp-guard). العقد الحقيقي المتبقي: كل القيم
       الأربع تعرض بعد التمرير وتحمل القيمة النهائية لا 0. */
    await page.goto("/", { waitUntil: "networkidle" })
    await page.locator("text=عميل نشط").scrollIntoViewIfNeeded()
    await expect(page.locator("text=+500").first()).toBeVisible({ timeout: 6000 })
    await expect(page.locator("text=+10K").first()).toBeVisible()
    await expect(page.locator("text=+50K").first()).toBeVisible()
    await expect(page.locator("text=99.9%").first()).toBeVisible()
  })

  test("r8 — العدّادات تُصيَّر بالقيم النهائية في HTML الخام قبل أي JS (انحدار LCP)", async ({ request }) => {
    /* إصلاح r8 المركزي: العدّادات كانت تُصيَّر "0" على السيرفر فكان LCP
       ينتظر الجافاسكريبت. الآن القيم النهائية في HTML الأولي — يُطلب
       عبر request (بلا تنفيذ JS) لضمان أنه إخراج السيرفر فعلاً. */
    const res = await request.get("/")
    const html = await res.text()
    expect(html).toContain("+500")
    expect(html).toContain("+10K")
    expect(html).toContain("+50K")
    expect(html).toContain("99.9%")
    // وأيضاً: لم تعد أصفاراً مجردة في البطاقات
    expect(html).not.toMatch(/tabular-nums tracking-tight">0</)
  })
})
