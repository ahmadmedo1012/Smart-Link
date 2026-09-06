import { test, expect } from "./fixtures"

/**
 * عقد API الاتصال + سلوك النموذج في الواجهة.
 * في بيئة الاختبار لا يوجد RESEND_API_KEY — وهذا بالضبط ما يجعل
 * مسار «الفشل بصوت عالٍ» (r6: 503 بدل نجاح كاذب) قابلاً للاختبار
 * بشكل حتمي.
 *
 * الترتيب والاعتراض مقصودان: اختبار الواجهة يعترض fetch إلى
 * /api/contact ويحقق عقد 503 بنفسه — عزل كامل عن حالة محدد المعدل
 * (in-memory لكل خادم) وضمان الحتمية عبر إعادات المحاولة، بينما
 * يغطي فحص الـ API المباشر الخادم الحقيقي حتى استنفاد المعدل.
 */
const VALID = {
  name: "اختبار r7 الآلي",
  email: "r7-probe@example.com",
  subject: "other",
  message: "رسالة اختبارية من جناح E2E — تُرسل في بيئة بلا مفتاح بريد.",
}

test.describe("نموذج الاتصال — الواجهة", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact", { waitUntil: "networkidle" })
  })

  test("التحقق HTML الأصلي — فارغ غير صالح، معبأ صالح", async ({ page }) => {
    const form = page.locator("form")
    expect(await form.evaluate((f) => (f as HTMLFormElement).checkValidity())).toBe(false)

    await page.fill("#name", "اسم تجريبي")
    await page.fill("#email", "user@example.com")
    await page.selectOption("#subject", "menu")
    await page.fill("#message", "نص رسالة كافٍ للاختبار.")
    expect(await form.evaluate((f) => (f as HTMLFormElement).checkValidity())).toBe(true)
  })

  test("الحقول كلها موسومة بعناوين مرتبطة (label/for)", async ({ page }) => {
    for (const id of ["name", "email", "subject", "message"]) {
      const label = page.locator(`label[for="${id}"]`)
      await expect(label).toHaveCount(1)
      await expect(label).not.toBeEmpty()
    }
  })

  test("الإرسال دون مفتاح → خطأ role=alert مع بدائل التواصل المباشر", async ({ page }) => {
    // نحقق عقد 503 (فشل صوت عالٍ بلا مفتاح) عند مستوى الشبكة — لا
    // اعتماد على حالة الخادم أو محدد المعدل؛ الخادم الحقيقي مغطى أدناه
    await page.route("**/api/contact", (r) =>
      r.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({
          error:
            "خدمة البريد غير مهيأة حالياً. تواصل معنا مباشرة عبر واتساب 0910089975 أو ahmedmedo1012@gmail.com",
        }),
      })
    )
    await page.fill("#name", "اسم تجريبي")
    await page.fill("#email", "user@example.com")
    await page.selectOption("#subject", "support")
    await page.fill("#message", "نص رسالة كافٍ للاختبار.")
    await page.getByRole("button", { name: /إرسال الرسالة/ }).click()

    // داخل النموذج تحديداً — Next يضيف route-announcer بـ role=alert
    const alert = page.locator('form div[role="alert"]')
    await expect(alert).toBeVisible({ timeout: 8000 })
    await expect(alert).toContainText(/واتساب|تعذّر|غير مهيأة/)
    // بدائل الاتصال داخل رسالة الخطأ (a11y + UX)
    await expect(alert.locator('a[href="https://wa.me/218910089975"]')).toBeVisible()

    // honeypot موجود لكن مخفي عن التقنية المساعدة
    const honeypot = page.locator('input[name="company"]')
    await expect(honeypot).toHaveAttribute("aria-hidden", "true")
    await expect(honeypot).toHaveAttribute("tabindex", "-1")
  })
})

test.describe("عقد /api/contact", () => {
  test("حقول ناقصة → 400 برسالة عربية", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: { name: "فلان", email: "a@b.co" }, // message مفقود
    })
    expect(res.status()).toBe(400)
    const json = await res.json()
    expect(json.error).toContain("مملوءة")
  })

  test("بريد غير صالح → 400", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: { ...VALID, email: "ليس-بريداً" },
    })
    expect(res.status()).toBe(400)
    const json = await res.json()
    expect(json.error).toContain("البريد")
  })

  test("honeypot معبأ → نجاح زائف صامت (لا يصل البريد)", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: { ...VALID, company: "spam-bot" },
    })
    expect(res.status()).toBe(200)
    const json = await res.json()
    expect(json.ok).toBe(true)
  })

  test("طلب صالح بلا RESEND_API_KEY → 503 بصوت عالٍ + بديل واتساب (r6)", async ({ request }) => {
    const res = await request.post("/api/contact", { data: VALID })
    expect(res.status()).toBe(503)
    const json = await res.json()
    expect(json.error).toContain("واتساب")
    expect(json.error).toContain("ahmedmedo1012@gmail.com")
  })

  test("محدد المعدل → 429 خلال طلبات متتالية (r5)", async ({ request }) => {
    // الطلبات الصالحة السابقة (واجهة + 503) حُسبت بالفعل (نفس الخادم)
    const statuses: number[] = []
    for (let i = 0; i < 10; i++) {
      const res = await request.post("/api/contact", { data: VALID })
      statuses.push(res.status())
      if (res.status() === 429) {
        const json = await res.json()
        expect(json.error).toContain("دقيقة")
        break
      }
    }
    expect(statuses).toContain(429)
  })
})
