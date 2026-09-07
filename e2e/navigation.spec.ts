import { test, expect } from "./fixtures"

/**
 * السلوكيات التفاعلية — القائمة الجوالة، Escape، القائمة المنسدلة،
 * مبدّل المظهر، واختبار انحدار زر «العودة للأعلى» (خلل r7 المؤكد بالدليل).
 */
test.describe("التنقل — سطح المكتب", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" })
  })

  test("قائمة «خدماتنا» المنسدلة — تفتح بالتمرير وتغلق بـ Escape", async ({ page }) => {
    const trigger = page.getByRole("button", { name: /خدماتنا/ })
    /* r10: تحت حمل 4 عمال متوازيين قد يقع hover قبل اكتمال ترطيب React —
       مستمعات mouseenter غير موجودة بعد والقائمة لا تفتح (فشل متقطع
       حقيقي ظهر مع توسيع الجناح). زر المظهر يُصيَّر فقط بعد الترطيب
       (mounted) — بوابة ترطيب مثالية قبل أي تفاعل بالهيدر. */
    await expect(page.getByRole("button", { name: /المظهر/ })).toBeVisible()
    await trigger.hover()
    const menu = page.locator("nav[aria-label='التنقل الرئيسي'] >> text=Smart Menu — المنيو الرقمي")
    await expect(menu.first()).toBeVisible()
    await expect(trigger).toHaveAttribute("aria-expanded", "true")

    // روابط خارجية آمنة
    const link = page.locator('nav[aria-label="التنقل الرئيسي"] a[href="https://menu.smart-link.ly"]')
    await expect(link).toHaveAttribute("target", "_blank")
    await expect(link).toHaveAttribute("rel", "noopener noreferrer")

    // Escape يغلق
    await page.keyboard.press("Escape")
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
    await expect(menu.first()).toBeHidden()
  })

  test("مبدّل المظهر — داكن ← فاتح ← ثابت بعد إعادة التحميل", async ({ page }) => {
    // الافتراضي داكن
    await expect(page.locator("html")).toHaveClass(/dark/)

    const toggle = page.getByRole("button", { name: "تفعيل المظهر الفاتح" })
    await toggle.click()
    await expect(page.locator("html")).toHaveClass(/light/)
    await expect(page.getByRole("button", { name: "تفعيل المظهر الداكن" })).toBeVisible()

    // الاختيار يبقى بعد إعادة التحميل (next-themes localStorage)
    await page.reload({ waitUntil: "networkidle" })
    await expect(page.locator("html")).toHaveClass(/light/)
  })

  test("زر «العودة للأعلى» — مخفي أعلى الصفحة، ظاهر بعد التمرير (انحدار r7)", async ({ page }) => {
    const btn = page.locator('button[aria-label="العودة للأعلى"]')

    // أعلى الصفحة: مخفي بصرياً + خارج شجرة a11y + خارج ترتيب Tab
    await expect(btn).toHaveClass(/opacity-0/)
    expect(await btn.getAttribute("aria-hidden")).toBe("true")
    expect(await btn.getAttribute("tabindex")).toBe("-1")

    // بعد التمرير: ظاهر + داخل a11y + قابل للتركيز
    await page.evaluate(() => window.scrollTo(0, 900))
    await expect(btn).toHaveClass(/opacity-100/, { timeout: 5000 })
    expect(await btn.getAttribute("aria-hidden")).toBeNull()
    expect(await btn.getAttribute("tabindex")).toBe("0")

    // النقر يمرّر لأعلى الصفحة (تمرير سلس — poll)
    await btn.click()
    await expect
      .poll(async () => page.evaluate(() => window.scrollY), { timeout: 5000 })
      .toBeLessThan(60)

    // عاد ليختفي أعلى الصفحة
    await expect(btn).toHaveClass(/opacity-0/)
  })

  test("شريط تقدم التمرير يتقدّم مع التمرير", async ({ page }) => {
    const bar = page.locator(".scroll-progress, div.fixed.top-0.h-\\[2px\\]").first()
    const scaleX = () => bar.evaluate((el) => getComputedStyle(el).transform)
    // CSS transform مصفوفة؛ القيمة الأخيرة scaleX
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2))
    await page.waitForTimeout(400)
    const mid = await scaleX()
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(400)
    const full = await scaleX()
    expect(mid).not.toBe(full)
  })
})

test.describe("التنقل — الجوال (375×812)", () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" })
  })

  test("القائمة الجوالة — فتح/قفل تمرير/إغلاق بـ Escape", async ({ page }) => {
    // زر البرجر يغيّر اسمه بعد الفتح (فتح → إغلاق) — نمط يطابق الحالتين
    const burger = page.getByRole("button", { name: /فتح القائمة|إغلاق القائمة/ })
    await burger.click()

    const mobileNav = page.locator('nav[aria-label="قائمة الجوال"]')
    await expect(mobileNav).toBeVisible()
    await expect(burger).toHaveAttribute("aria-expanded", "true")

    // قفل تمرير الجسد (r5)
    await expect
      .poll(async () => page.evaluate(() => document.body.style.overflow))
      .toBe("hidden")

    // Escape يغلق ويعيد التمرير
    await page.keyboard.press("Escape")
    await expect(mobileNav).toBeHidden()
    await expect
      .poll(async () => page.evaluate(() => document.body.style.overflow))
      .toBe("")
  })

  test("القائمة الجوالة — الروابط الداخلية تغلقها وتتنقل", async ({ page }) => {
    await page.getByRole("button", { name: /فتح القائمة|إغلاق القائمة/ }).click()
    await page.locator('nav[aria-label="قائمة الجوال"] a[href="/about"]').click()
    await expect(page).toHaveURL(/\/about$/)
    await expect(page.locator('nav[aria-label="قائمة الجوال"]')).toBeHidden()
  })

  test("القائمة الجوالة — خدمة فرعية بأكورديون صحيح", async ({ page }) => {
    await page.getByRole("button", { name: /فتح القائمة|إغلاق القائمة/ }).click()
    const servicesBtn = page.locator('nav[aria-label="قائمة الجوال"] button', { hasText: "خدماتنا" })
    await servicesBtn.click()
    await expect(servicesBtn).toHaveAttribute("aria-expanded", "true")
    const menuLink = page.locator('nav[aria-label="قائمة الجوال"] a[href="https://menu.smart-link.ly"]')
    await expect(menuLink).toBeVisible()
    await expect(menuLink).toHaveAttribute("target", "_blank")
    await expect(menuLink).toHaveAttribute("rel", "noopener noreferrer")
  })

  test("رابط تخطّي المحتوى يظهر عند التركيز", async ({ page }) => {
    await page.keyboard.press("Tab") // أول Tab = رابط التخطي
    const skip = page.locator('a[href="#main-content"]')
    await expect(skip).toBeFocused()
    await expect(skip).toBeVisible()
  })
})
