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
       الأربع تعرض بعد التمرير وتحمل القيمة النهائية لا 0.
       r143 (الصدق): القيم الأربع صارت القيم المنشورة القابلة
       للتحقق (3 منتجات، 19 د.ل، 0 د.ل، 100%) بدل +500/+10K/+50K/99.9%
       التي كانت بلا مصدر — العقد نفسه، القيم صادقة. */
    await page.goto("/", { waitUntil: "networkidle" })
    await page.locator("text=منتجات حيّة").first().scrollIntoViewIfNeeded()
    await expect(page.locator(".ln-trust .ln-stat", { hasText: "منتجات حيّة" })).toBeVisible({ timeout: 6000 })
    await expect(page.locator(".ln-trust .ln-stat", { hasText: "أقل باقة SmartBot" })).toBeVisible()
    await expect(page.locator(".ln-trust .ln-stat", { hasText: "باقة Smart Order الأساسية" })).toBeVisible()
    await expect(page.locator(".ln-trust .ln-stat", { hasText: "واجهة عربية" })).toBeVisible()
  })

  test("r144 — شعار العائلة الختامي يُصيَّر في فصل الوصول (انحدار QA P1: كان غائبًا عن الإنتاج)", async ({ page }) => {
    /* قرار P1 (W1-QA-LINK §7): r142 تقاعد شعار العائلة r141 عن نقطة
       البداية رغم مواصفته («family.webp float») فترك فراغًا ميتًا
       ~1200px قبل التذييل — r144 يعيده، وهذا الاختبار يمنع تكرار
       الغياب: الصورة موجودة في DOM، مرئية بعد التمرير، ومحمّلة فعلاً
       (complete + naturalWidth>0 — لا مسار مكسور). */
    await page.goto("/", { waitUntil: "networkidle" })
    const crest = page.locator(".ln-cta-family-img")
    await expect(crest).toHaveCount(1)
    await crest.scrollIntoViewIfNeeded()
    await expect(crest).toBeVisible()
    // محمّلة فعلاً (next/image يعيد ترميز العرض حسب sizes — العرض الطبيعي
    // ليس ثابتًا، لكن >0 يعني بيانات حقيقية لا مسارًا مكسورًا)
    await expect
      .poll(async () => {
        return crest.evaluate((img) => (img as HTMLImageElement).naturalWidth)
      })
      .toBeGreaterThan(0)
    // والشعار داخل قسم الختام الكنسي (عقد cta.spec نفسه)
    await expect(
      page.locator('section[aria-label="ابدأ رحلتك"] .ln-cta-family-img')
    ).toHaveCount(1)
  })

  test("r8 — العدّادات تُصيَّر بالقيم النهائية في HTML الخام قبل أي JS (انحدار LCP)", async ({ request }) => {
    /* إصلاح r8 المركزي: العدّادات كانت تُصيَّر "0" على السيرفر فكان LCP
       ينتظر الجافاسكريبت. الآن القيم النهائية في HTML الأولي — يُطلب
       عبر request (بلا تنفيذ JS) لضمان أنه إخراج السيرفر فعلاً. */
    const res = await request.get("/")
    const html = await res.text()
    /* r143 (الصدق): القيم المنشورة القابلة للتحقق بدل الأرقام بلا مصدر. */
    expect(html).toContain("منتجات حيّة")
    expect(html).toContain("أقل باقة SmartBot")
    expect(html).toContain("باقة Smart Order الأساسية")
    expect(html).toContain("100%")
    expect(html).not.toContain("+10K")
    expect(html).not.toContain("+50K")
    // وأيضاً: لم تعد أصفاراً مجردة في البطاقات
    expect(html).not.toMatch(/tabular-nums tracking-tight">0</)
  })
})
