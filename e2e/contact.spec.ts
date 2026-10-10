import { test, expect, allowResourceNoise } from "./fixtures"

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
    /* r137: + الهاتف الاختياري — نفس عقد بقية الحقول. */
    for (const id of ["name", "email", "phone", "subject", "message"]) {
      const label = page.locator(`label[for="${id}"]`)
      await expect(label).toHaveCount(1)
      await expect(label).not.toBeEmpty()
    }
  })

  test("الإرسال دون مفتاح → خطأ role=alert مع بدائل التواصل المباشر", async ({ page, consoleErrors }) => {
    /* r11 (F-G8): رد 503 مقصود — ضوضية الشبكة متوقعة ومصرَّح بها. */
    allowResourceNoise(consoleErrors, /Failed to load resource.*503/)
    // نحقق عقد 503 (فشل صوت عالٍ بلا مفتاح) عند مستوى الشبكة — لا
    // اعتماد على حالة الخادم أو محدد المعدل؛ الخادم الحقيقي مغطى أدناه
    await page.route("**/api/contact", (r) =>
      r.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({
          error:
            "خدمة البريد غير مهيأة حالياً. تواصل معنا مباشرة عبر واتساب 0910089975 أو noreply@smart-link.ly",
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
    // r134 (fix 8): رابط واتساب يحمل ?text= مُعبّأً (كان الرابط المجرد)
    await expect(alert.locator('a[href^="https://wa.me/218910089975?text="]')).toBeVisible()

    // honeypot موجود لكن مخفي عن التقنية المساعدة
    const honeypot = page.locator('input[name="company"]')
    await expect(honeypot).toHaveAttribute("aria-hidden", "true")
    await expect(honeypot).toHaveAttribute("tabindex", "-1")
  })

  test("r137 — هاتف واتساب اختياري: الصالح الدولي يُطبَّع قبل الإرسال، غير الصالح خطأ حقل", async ({ page, consoleErrors }) => {
    /* r137 (ليبي أولاً): الحقل اختياري — التحقق عند الامتلاء فقط؛
       التطبيع (أرقام شرقية/فواصل/+218) عقد lib/phone.ts المشترك مع
       الـAPI. الاعتراض على مستوى الشبكة كالاختبار أعلاه (عزل عن
       محدد المعدل). */
    allowResourceNoise(consoleErrors, /Failed to load resource.*503/)
    await page.fill("#name", "اسم تجريبي")
    await page.fill("#email", "user@example.com")
    await page.selectOption("#subject", "menu")
    await page.fill("#message", "نص رسالة كافٍ للاختبار.")

    // غير صالح → خطأ الحقل العربي + aria-invalid (لا شبكة إطلاقاً)
    await page.fill("#phone", "12345")
    await page.getByRole("button", { name: /إرسال الرسالة/ }).click()
    const err = page.locator("#phone-error")
    await expect(err).toBeVisible()
    await expect(err).toContainText("أدخل رقمًا ليبيًا صحيحًا")
    await expect(page.locator("#phone")).toHaveAttribute("aria-invalid", "true")
    await expect(page.locator("#phone")).toBeFocused()

    // صالح بالصيغة الدولية → يُرسل مُطبَّعاً 09… (لا خطأ حقل؛ 503 المُعترض)
    let captured = ""
    await page.route("**/api/contact", (route) => {
      captured = route.request().postData() ?? ""
      return route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({
          error:
            "خدمة البريد غير مهيأة حالياً. تواصل معنا مباشرة عبر واتساب 0910089975 أو noreply@smart-link.ly",
        }),
      })
    })
    await page.fill("#phone", "+218 91 234 5678")
    await page.getByRole("button", { name: /إرسال الرسالة/ }).click()
    const alert = page.locator('form div[role="alert"]').filter({ hasText: /غير مهيأة/ })
    await expect(alert).toBeVisible({ timeout: 8000 })
    await expect(page.locator("#phone-error")).toHaveCount(0)
    // العقد: الهاتف المُرسل هو الشكل المُطبَّع، لا كما كتبه الزائر
    expect(JSON.parse(captured).phone).toBe("0912345678")
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

  test("r137 — هاتف ممتلئ غير صالح → 400 مختوم field:phone (لا يستهلك المعدل)", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: { ...VALID, phone: "12345" },
    })
    expect(res.status()).toBe(400)
    const json = await res.json()
    expect(json.error).toContain("رقمًا ليبيًا")
    expect(json.field).toBe("phone")
  })

  test("r137 — هاتف شرقي/بفواصل يُطبَّع ويمر (503 بلا مفتاح — دليل اجتياز التحقق)", async ({ request }) => {
    /* دلو معزول — الطلب الصالح يستهلك ميزانية المعدل قبل 503. */
    const res = await request.post("/api/contact", {
      data: { ...VALID, phone: "٠٩١-٢٣٤ ٥٦٧٨" },
      headers: { "x-forwarded-for": "198.51.100.77" },
    })
    expect(res.status()).toBe(503)
  })

  test("honeypot معبأ → نجاح زائف صامت (لا يصل البريد)", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: { ...VALID, company: "spam-bot" },
    })
    expect(res.status()).toBe(200)
    const json = await res.json()
    /* r10 (security): الرد صار مطابقاً بالبايت لشكل النجاح الحقيقي —
       مسبار شكل يستطيع تمييز الفخ عن الحقيقي. */
    expect(json.success).toBe(true)
    expect(json.message).toBe("تم استلام رسالتك بنجاح. سنتواصل معك قريباً.")
  })

  test("طلب صالح بلا RESEND_API_KEY → 503 بصوت عالٍ + بديل واتساب (r6)", async ({ request }) => {
    /* r10 (testing audit G1): دلو IP معزول — اختبار محدد المعدل أدناه كان
       يشارك دلو هذا الاختبار (IP الخادم المشترك) تحت fullyParallel، فإذا
       استيقظ 429 أولاً تسلم هذا 429 بدل 503 (CI أحمر لمد 60 ثانية). */
    const res = await request.post("/api/contact", {
      data: VALID,
      headers: { "x-forwarded-for": "198.51.100.50" },
    })
    expect(res.status()).toBe(503)
    const json = await res.json()
    expect(json.error).toContain("واتساب")
    expect(json.error).toContain("noreply@smart-link.ly")
  })

  test("محدد المعدل — الحدود بالضبط: 1-5 تمر (503) والسادس 429 مع Retry-After (r10)", async ({ request }) => {
    /* r10 (testing audit G1): العدّ الحديّ الدقيق يثبت عدم الحجب المبكر
       (الطلبات 1-5 لا تُحجب أبداً) وأن السادس يحجب برأس Retry-After —
       مهما كان ترتيب التشغيل، بفضل الدلو المعزول. */
    const ip = { "x-forwarded-for": "198.51.100.60" }
    for (let i = 1; i <= 5; i++) {
      const res = await request.post("/api/contact", { data: VALID, headers: ip })
      expect(res.status(), `الطلب ${i} من 5 يجب أن يمر (لا حجب مبكر)`).toBe(503)
    }
    const sixth = await request.post("/api/contact", { data: VALID, headers: ip })
    expect(sixth.status()).toBe(429)
    expect(sixth.headers()["retry-after"]).toBe("60")
    const json = await sixth.json()
    expect(json.error).toContain("دقيقة")
  })
})
