import { test, expect } from "./fixtures"

/**
 * الأكورديون المشترك (FaqAccordion): grid-rows 0fr→1fr،
 * aria-expanded/aria-controls متبادلان، وفريم واحد مفتوح.
 * (انحدار r6: كان القص بحد maxHeight ثابت على الرئيسية.)
 */
test.describe("أسئلة JSON — أكورديون الرئيسية و/الأسعار", () => {
  test("/pricing — الفريم الأول مفتوح افتراضياً والثاني يعمل", async ({ page }) => {
    await page.goto("/pricing", { waitUntil: "networkidle" })

    const first = page.locator("#faq-button-0")
    const second = page.locator("#faq-button-1")
    await expect(first).toHaveAttribute("aria-expanded", "true")
    await expect(page.locator("#faq-panel-0")).toBeVisible()

    // الثاني مغلق → افتحه
    await expect(second).toHaveAttribute("aria-expanded", "false")
    await second.click()
    await expect(second).toHaveAttribute("aria-expanded", "true")
    await expect(page.locator("#faq-panel-1")).toBeVisible()
    // panel مرتبط بزرّه (aria-controls)
    await expect(second).toHaveAttribute("aria-controls", "faq-panel-1")

    // فريم واحد فقط: الأول انغلق (توغّل، ليس مفتوحين معاً)
    await expect(first).toHaveAttribute("aria-expanded", "false")
    await expect(page.locator("#faq-panel-0")).toBeHidden()

    // إغلاق الثاني بالنقر مجدداً
    await second.click()
    await expect(second).toHaveAttribute("aria-expanded", "false")
  })

  test("/ — أكورديون الأسئلة يفتح ويغلق بإدارة التركيز الصحيحة", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" })
    await page.locator("#faq").scrollIntoViewIfNeeded()

    const first = page.locator("#faq-button-0")
    await expect(first).toBeVisible()
    await first.click() // يغلق الافتراضي المفتوح
    await expect(first).toHaveAttribute("aria-expanded", "false")
    await expect(page.locator("#faq-panel-0")).toBeHidden()
    await first.click() // يعيد فتحه
    await expect(first).toHaveAttribute("aria-expanded", "true")

    // انتظار اكتمال انتقال grid-rows (0.2s) قبل قياس عدم القص
    await page.waitForTimeout(500)
    // الإجابة كاملة غير مقصوصة: ارتفاع المحتوى الفعلي == ارتفاع الصندوق
    const panel = page.locator("#faq-panel-0")
    const unclipped = await panel.evaluate((el) => {
      const inner = el.firstElementChild as HTMLElement
      return inner.scrollHeight > 0 && el.clientHeight >= inner.scrollHeight - 1
    })
    expect(unclipped, "الإجابة يجب ألا تُقص (انحدار r6)").toBe(true)
  })

  test("/ — الأسئلة الستة كلها موجودة في الواجهة", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" })
    const buttons = page.locator('[id^="faq-button-"]')
    await expect(buttons).toHaveCount(6)
  })
})
