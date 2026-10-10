import { test, expect, allowResourceNoise } from "./fixtures"
import { axeScan, hydrationGate } from "./helpers"

/* r10 (testing audit G5 + a11y audit E): the whole axe suite runs on
   the STATIC page — but the a11y findings of r10 lived exactly where
   no static scan looks: the open dropdown, the mobile menu, the form
   with visible field errors, and the alert/success boxes that only
   render after user interaction. These tests point axe at the
   INTERACTIVE states. */


test.describe("r10 — axe على الحالات التفاعلية (كان أعمى لها)", () => {
  /* r133 (A7 §1 re-base): القائمة المنسدلة كروم منتج — تستهدف /about
     (الرئيسية لها مِغامينو «المنصّة» الخاص، محروس في navigation.spec). */
  test("القائمة المنسدلة «خدماتنا» مفتوحة → صفر انتهاكات (كروم المنتج على /about)", async ({ page }) => {
    await page.goto("/about", { waitUntil: "domcontentloaded" })
    await hydrationGate(page)
    await page.getByRole("button", { name: /خدماتنا/ }).hover()
    await expect(page.locator(".menu-pop").first()).toBeVisible()
    expect(await axeScan(page)).toEqual([])
  })

  test("قائمة الجوال مفتوحة → صفر انتهاكات (درج الرئيسية)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto("/", { waitUntil: "domcontentloaded" })
    await hydrationGate(page)
    await page.getByRole("button", { name: "فتح القائمة" }).click()
    await expect(page.locator("nav[aria-label='قائمة الجوال']")).toBeVisible()
    expect(await axeScan(page)).toEqual([])
  })

  test("نموذج التواصل مع أخطاء الحقول الظاهرة → صفر انتهاكات", async ({ page }) => {
    /* r138 (استقرار الجناح تحت الحمل): البقية في هذا الملف تنتظر
       hydrationGate قبل التفاعل — هذا الاختبار وحده كان ينقر زر
       الإرسال فور domcontentloaded فيسبق الترطيب أحيانًا (نقرة بلا
       مستمع onSubmit = لا أخطاء حقول) وينقلب أحمر عشوائيًا تحت
       حمل المعالج المشترك؛ البوابة تلاقي نمط إخوته بلا أي تخفيف
       للتوكيدات. */
    await page.goto("/contact", { waitUntil: "domcontentloaded" })
    await hydrationGate(page)
    // إرسال فارغ → أخطاء عربية لكل حقل (aria-invalid + role=alert)
    await page.getByRole("button", { name: /إرسال الرسالة/ }).click()
    await expect(page.locator("#name-error")).toBeVisible()
    await expect(page.locator("#email-error")).toBeVisible()
    await expect(page.locator("#message-error")).toBeVisible()
    expect(await axeScan(page)).toEqual([])
  })

  test("صندوق خطأ الخادم مع روابط البدائل → صفر انتهاكات", async ({ page, consoleErrors }) => {
    /* r11 (F-G8): خطأ خادم مقصود (503) لعرض الصندوق. */
    allowResourceNoise(consoleErrors, /Failed to load resource.*503/)
    await page.goto("/contact", { waitUntil: "domcontentloaded" })
    await page.route("**/api/contact", (route) =>
      route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ error: "خدمة البريد غير مهيأة حالياً. تواصل معنا مباشرة عبر واتساب 0910089975" }),
      })
    )
    await page.getByLabel("الاسم").fill("اختبار")
    await page.getByLabel("البريد الإلكتروني").fill("test@example.com")
    await page.getByLabel("الرسالة").fill("رسالة اختبار الصندوق")
    await page.getByRole("button", { name: /إرسال الرسالة/ }).click()
    /* ملاحظة: Next يضيف route-announcer بـ role=alert أيضاً — حدد صندوقنا
       بالنص بدل الدور المزدوج. */
    const alert = page.getByRole("alert").filter({ hasText: "خدمة البريد غير مهيأة" })
    await expect(alert).toBeVisible()
    // روابط البدائل تظهر مع أي خطأ (r10 — فك اقتران السلاسل)
    await expect(alert.getByRole("link", { name: /واتساب/ })).toBeVisible()
    expect(await axeScan(page)).toEqual([])
  })

  test("صندوق النجاح role=status → صفر انتهاكات", async ({ page }) => {
    await page.goto("/contact", { waitUntil: "domcontentloaded" })
    await page.route("**/api/contact", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, message: "تم استلام رسالتك بنجاح. سنتواصل معك قريباً." }),
      })
    )
    await page.getByLabel("الاسم").fill("اختبار")
    await page.getByLabel("البريد الإلكتروني").fill("test@example.com")
    await page.getByLabel("الرسالة").fill("رسالة اختبار النجاح")
    await page.getByRole("button", { name: /إرسال الرسالة/ }).click()
    await expect(page.getByRole("status")).toBeVisible()
    expect(await axeScan(page)).toEqual([])
  })
})
