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

  /* r133 (A7 §1 re-base): أسئلة الرئيسية انتقلت من جزيرة الأكورديون
     إلى <details>/<summary> أصلي (LandingFaq — صفر JS، لوحة مفاتيح
     أصيلة، آمنة تحت reduced-motion). العقد الجديد: الأسئلة الستة
     موجودة، والفتح/الإغلاق بسمة open الأصلية، والإجابة كاملة ظاهرة. */
  test("/ — أسئلة ال landing الأصلية <details>: ستة أسئلة تفتح وتغلق", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" })
    const items = page.locator("details.ln-faq-item")
    await expect(items).toHaveCount(6)

    const first = items.nth(0)
    await first.locator("summary").scrollIntoViewIfNeeded()
    // مغلق افتراضياً ← الفتح بالنقر على السؤال (summary أصيل)
    await expect(first).not.toHaveAttribute("open")
    await first.locator("summary").click()
    await expect(first).toHaveAttribute("open")
    await expect(first.locator(".ln-faq-a")).toBeVisible()

    // الإجابة كاملة غير مقصوصة: ارتفاع المحتوى الفعلي == ارتفاع الصندوق
    await page.waitForTimeout(300)
    const unclipped = await first.locator(".ln-faq-a").evaluate((el) => el.scrollHeight > 0 && el.clientHeight >= el.scrollHeight - 1)
    expect(unclipped, "الإجابة يجب ألا تُقص").toBe(true)

    // الإغلاق بالنقر مجدداً
    await first.locator("summary").click()
    await expect(first).not.toHaveAttribute("open")
  })

  /* P14-P0B (regression — truth): جواب «هل الخدمة مجانية؟» على
     الرئيسية عاد مرة كاملة بعد إصلاح /pricing (P13-2a أصلح صفحة
     الأسعار ونسي سؤال الرئيسية). هذا الاختبار يمنع عودة الوعد
     المستقبلي بالباقات المدفوعة من أي مصدر محتوى مكرر: لا صياغة
     مستقبلية في جواب المجانية، والحقيقة الحيّة («متاحة اليوم»)
     حاضرة إيجابياً. */
  test("/ — جواب المجانية لا يعِد بأفق مدفوع مستقبلي (P14-P0B)", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" })
    const texts = await page.locator("details.ln-faq-item .ln-faq-a").allTextContents()
    expect(texts.length).toBeGreaterThanOrEqual(6)

    const freeAnswer = texts.find((t) => t.includes("بدون بطاقة ائتمان"))
    expect(freeAnswer, "جواب المجانية موجود").toBeTruthy()
    // لا وعد مستقبلي: كل أدوات المستقبل القديمة محظورة في هذا الجواب
    expect(freeAnswer).not.toMatch(/قريباً|قادمة|ستُطلَق|قادم/)
    // الحقيقة الحيّة موجودة إيجابياً: الباقات المدفوعة متاحة اليوم
    expect(freeAnswer).toMatch(/متاحة اليوم/)

    // وبأي جواب آخر: ذكر «مدفوع» لا يرافقه أفق زمني مستقبلي
    for (const t of texts) {
      if (t.includes("مدفوع")) {
        expect(t, `جواب يذكر المدفوع بلا أفق مستقبلي: ${t.slice(0, 60)}`).not.toMatch(/قريباً|قادمة|ستُطلَق/)
      }
    }
  })
})
