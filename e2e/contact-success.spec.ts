import { test, expect, allowResourceNoise } from "./fixtures"

/**
 * r9 — مسارات النموذج التي لم تكن مختبرة إطلاقاً (تدقيق P1-2/P1-3):
 * النجاح (role=status + رسالة الAPI الحقيقية + reset + timeout)،
 * أخطاء الحقول بالعربية (aria-invalid/describedby + نقل التركيز)،
 * وحواف الAPI التي كانت تقع في 500 أو تمر بلا سقوف.
 */

test.describe("r9 — مسار النجاح (كان مغطى فقط بالفشل)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact", { waitUntil: "networkidle" })
  })

  test("نجاح مُحاكى → role=status برسالة الAPI + الحقول تُفرَّغ + الزر يعود", async ({ page }) => {
    await page.route("**/api/contact", (r) =>
      r.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "تم استلام رسالتك بنجاح. سنتواصل معك قريباً.",
        }),
      })
    )
    await page.fill("#name", "مستخدم تجريبي")
    await page.fill("#email", "user@example.com")
    await page.selectOption("#subject", "menu")
    await page.fill("#message", "نص رسالة كافٍ للاختبار.")
    await page.getByRole("button", { name: /إرسال الرسالة/ }).click()

    // منطقة الحالة الحقيقية (r9 A2) — ليست aria-live على الزر
    const status = page.locator('form div[role="status"]')
    await expect(status).toBeVisible({ timeout: 8000 })
    await expect(status).toContainText("تم استلام رسالتك بنجاح")
    // الزر يعرض حالة الإرسال أيضاً
    await expect(page.getByRole("button", { name: /تم الإرسال/ })).toBeVisible()

    // الحقول فُرِّغت بعد النجاح
    await expect(page.locator("#name")).toHaveValue("")
    await expect(page.locator("#message")).toHaveValue("")

    // صندوق الحالة يختفي بعد المهلة (4s) — نمنح 7s للتقنية
    await expect(status).toBeHidden({ timeout: 7000 })
  })

  test("أثناء الإرسال: الزر معطّل ونصه «جارٍ الإرسال…»", async ({ page }) => {
    let release: (() => void) | undefined
    await page.route("**/api/contact", async (r) => {
      await new Promise<void>((resolve) => (release = resolve))
      /* r11: عقد النجاح الصارم يطالب برسالة نصية — المحاكاة تحاكي
         العقد الحقيقي للخادم (route.ts يرسل دائماً success+message). */
      await r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true, message: "تم استلام رسالتك بنجاح. سنتواصل معك قريباً." }) })
    })
    await page.fill("#name", "اسم")
    await page.fill("#email", "user@example.com")
    await page.fill("#message", "نص كافٍ.")
    await page.getByRole("button", { name: /إرسال الرسالة/ }).click()
    const btn = page.locator("form").getByRole("button")
    await expect(btn).toBeDisabled()
    await expect(btn).toContainText("جارٍ الإرسال")
    release?.()
    await expect(page.locator('form div[role="status"]')).toBeVisible({ timeout: 8000 })
  })

  test("أخطاء الحقول بالعربية مع aria-invalid/aria-describedby + نقل التركيز", async ({ page }) => {
    // لا route — الحقول الفارغة تُرفض في الواجهة قبل أي طلب شبكة
    await page.getByRole("button", { name: /إرسال الرسالة/ }).click()

    await expect(page.locator("#name-error")).toBeVisible()
    await expect(page.locator("#name-error")).toContainText("الاسم مطلوب")
    await expect(page.locator("#message-error")).toContainText("الرسالة مطلوبة")

    await expect(page.locator("#name")).toHaveAttribute("aria-invalid", "true")
    await expect(page.locator("#name")).toHaveAttribute("aria-describedby", "name-error")
    // التركيز انتقل لأول حقل مخالف
    await expect(page.locator("#name")).toBeFocused()

    // بريد غير صالح → خطأ الحقل (لا alert عام)
    await page.fill("#name", "اسم سليم")
    await page.fill("#email", "ليس-بريداً")
    await page.fill("#message", "نص كافٍ.")
    await page.getByRole("button", { name: /إرسال الرسالة/ }).click()
    await expect(page.locator("#email-error")).toContainText("البريد الإلكتروني غير صالح")
    await expect(page.locator("#email")).toBeFocused()
  })

  test("خطأ بريد من الخادم يُربط بحقل البريد (لا بصندوق عام)", async ({ page, consoleErrors }) => {
    /* r11 (F-G8): رد 400 مقصود. */
    allowResourceNoise(consoleErrors, /Failed to load resource.*400/)
    await page.route("**/api/contact", (r) =>
      r.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({ error: "البريد الإلكتروني غير صالح" }),
      })
    )
    await page.fill("#name", "اسم")
    await page.fill("#email", "server-reject@example.com")
    await page.fill("#message", "نص كافٍ.")
    await page.getByRole("button", { name: /إرسال الرسالة/ }).click()
    await expect(page.locator("#email-error")).toContainText("البريد الإلكتروني غير صالح")
    // لا صندوق خطأ عام (خدمة البريد ≠ حقل البريد — علة r9 الأولى)
    await expect(page.locator('form div[role="alert"]')).toHaveCount(0)
  })
})

test.describe("r9 — حواف /api/contact (كانت تقع في 500 أو تمر بلا سقوف)", () => {
  /* IP وهمي خاص ب هذا الملف: الخادم يقيّد المعدل لكل IP (5/دقيقة)
   على خادم اختبارات واحد مشترك — بدون هذا كانت هذه الطلبات الحية
   تستهلك ميزانية contact.spec القديم فيتحول اختباره 503 إلى 429
   (فئة الهشاشة المسجلة في تدقيق الاختبارات P2-تقارن). */
  const ISOLATED_IP = { "x-forwarded-for": "198.51.100.77" }

  const VALID = {
    name: "اختبار r9",
    email: "r9-edge@example.com",
    subject: "other",
    message: "رسالة حافة من جناح r9.",
  }

  test("جسم غير JSON → 400 عربي (كان 500 «خطأ في الإرسال» مضللاً)", async ({ request }) => {
    /* content-type نصي حتى يُرسل الجسم خاماً (Playwright يُسلسل نصوص
       application/json) — الخادم يستدعي req.json() فيفشل التحليل. */
    const res = await request.post("/api/contact", {
      headers: { "Content-Type": "text/plain", ...ISOLATED_IP },
      data: "ليس-json{{{",
    })
    expect(res.status()).toBe(400)
    const json = await res.json()
    expect(json.error).toContain("غير صالح")
  })

  test("بريد أطول من 254 (سقف RFC) → 400 (كان يمر إلى Resend ويفشل 502)", async ({ request }) => {
    const res = await request.post("/api/contact", {
      headers: ISOLATED_IP,
      data: { ...VALID, email: `${"a".repeat(250)}@x.co` },
    })
    expect(res.status()).toBe(400)
    expect((await res.json()).error).toContain("البريد")
  })

  test("اسم أطول من 100 → 400", async ({ request }) => {
    const res = await request.post("/api/contact", {
      headers: ISOLATED_IP,
      data: { ...VALID, name: "ن".repeat(101) },
    })
    expect(res.status()).toBe(400)
  })

  test("رسالة أطول من 5000 → 400", async ({ request }) => {
    const res = await request.post("/api/contact", {
      headers: ISOLATED_IP,
      data: { ...VALID, message: "ن".repeat(5001) },
    })
    expect(res.status()).toBe(400)
  })

  test("subject رقم أو غائب → 400/خطأ صريح لا 500 (حارس انحدار r5)", async ({ request }) => {
    // غائب: الحقول الإلزامية الثلاثة مكتملة → لا يجب أن يسقط الخادم
    const res = await request.post("/api/contact", {
      headers: ISOLATED_IP,
      data: { name: "س", email: "a@b.co", message: "م" },
    })
    expect([400, 429, 503]).toContain(res.status()) // لا 500 إطلاقاً
    // رقم: sanitize يعالجه — لا 500
    const res2 = await request.post("/api/contact", {
      headers: ISOLATED_IP,
      data: { ...VALID, subject: 123 },
    })
    expect([400, 429, 503]).toContain(res2.status())
  })
})
