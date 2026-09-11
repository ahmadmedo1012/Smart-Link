import { test, expect, PAGES } from "./fixtures"
import { hydrationGate, assertNoHScroll } from "./helpers"

/**
 * r14-M6 — الجوال المصغّر: 320px وiPhone SE والـlandscape
 * ---------------------------------------------------------------------------
 * WCAG 1.4.10 (Reflow): المحتوى يعمل عند 320 CSS px بلا تمرير ثنائي الاتجاه.
 * الجناح كله كان يختبر 375×812 فقط (MOBILE_VIEWPORT) — 320 وlandscape لم
 * يمرا عبر CI قط، ولا أي اختبار بسياق لمس حقيقي (hasTouch صفر في e2e/).
 *
 * القياس المرجعي (سبتمبر 2026، الخادم المحلي): الصفحات الست تجتاز 320×562
 * و568×320 بصفر فائض أفقي — هذه المواصفة حراسة انحدار، لا اكتشاف عيب.
 * ملاحظة M5: القائمة الفرعية المفتوحة في landscape كانت تقص الروابط —
 * سلوكها التفاعلي محروس في navigation.spec (Spec E)، وهنا الreflow الساكن.
 */

/* ═══ A) 320×562 — WCAG 1.4.10 على كل الصفحات ═══ */
test.describe("r14 — 320×562: reflow بلا تمرير أفقي (WCAG 1.4.10)", () => {
  for (const p of PAGES) {
    test(`${p.path} — صفر فائض أفقي عند 320px + h1 + برجر + فوتر`, async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 562 })
      await page.goto(p.path, { waitUntil: "load" })
      await hydrationGate(page)
      await assertNoHScroll(page, `320px ${p.path}`)
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
      const burger = page.getByRole("button", { name: /فتح القائمة|إغلاق القائمة/ })
      await expect(burger, "FINDING[320] البرغر غير ظاهر عند 320px").toBeVisible()
      // البرجر يفتح فعلاً عند أصغر عرض (أيضاً بلا فائض أفقي بعد الفتح)
      await burger.click()
      await expect(page.locator('nav[aria-label="قائمة الجوال"]')).toBeVisible()
      await assertNoHScroll(page, `320px ${p.path} (قائمة مفتوحة)`)
      await expect(page.locator("footer").first()).toBeVisible()
    })
  }
})

/* ═══ B) جهاز لمس مصغّر 320×568 — أول سياق لمس حقيقي في الجناح ═══
 * 320×568 · hasTouch · isMobile (iPhone SE هندسياً — لكن بلا defaultBrowserType
 *  لـwebkit: المشروع chromium فقط، والمحاكاة اليدوية تعطي نفس مسار أحداث
 *  اللمس). tap() وليس click() — مسار أحداث اللمس. قفل تمرير الجسد هنا
 *  يعقد عقد r5 نفسه لكن تحت اللمس. */
test.describe("r14 — لمس حقيقي (320×568)", () => {
  test.use({ viewport: { width: 320, height: 568 }, hasTouch: true, isMobile: true })

  test("فتح القائمة بقلمسة والتنقل بقلمسة + قفل تمرير الجسد في سياق لمس", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" })
    await hydrationGate(page)
    const burger = page.getByRole("button", { name: /فتح القائمة|إغلاق القائمة/ })
    await burger.tap()
    const mobileNav = page.locator('nav[aria-label="قائمة الجوال"]')
    await expect(mobileNav).toBeVisible()
    await expect(burger).toHaveAttribute("aria-expanded", "true")
    /* عقد r5 نفسه (navigation.spec) — لكن تحت أحداث لمس لا نقر فأرة،
       وبقفل r14 iOS (position:fixed داخل cssText مع overflow:hidden) */
    await expect
      .poll(() => page.evaluate(() => document.body.style.overflow))
      .toBe("hidden")
    await expect
      .poll(() => page.evaluate(() => document.body.style.position))
      .toBe("fixed")
    await mobileNav.locator('a[href="/about"]').tap()
    await expect(page).toHaveURL(/\/about$/)
    await expect(mobileNav).toBeHidden()
  })

  test("viewport meta — لا حجب لتكبير المستخدم (WCAG 1.4.4)", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" })
    const content =
      (await page.locator('meta[name="viewport"]').getAttribute("content")) ?? ""
    expect(
      content,
      `FINDING[zoom-lock] الميتا الحالية: "${content}"`
    ).toContain("width=device-width")
    expect(
      content,
      "FINDING[zoom-lock] user-scalable=no يحجب تكبير المستخدم (WCAG 1.4.4)"
    ).not.toContain("user-scalable=no")
    expect(
      content,
      "FINDING[zoom-lock] maximum-scale=1 يحجب تكبير المستخدم (WCAG 1.4.4)"
    ).not.toMatch(/maximum-scale\s*=\s*1(\.0)?\s*(,|$)/)
  })
})

/* ═══ C) landscape — أصغر ارتفاعات حقيقية ═══ */
test.describe("r14 — landscape: بلا فائض أفقي (الارتفاع 320)", () => {
  for (const [name, vp] of [
    ["iPhone SE landscape 568×320", { width: 568, height: 320 }],
    ["Galaxy S9+ landscape 658×320", { width: 658, height: 320 }],
  ] as const) {
    test(`${name} — الرئيسية reflow سليم + h1 + برجر`, async ({ page }) => {
      await page.setViewportSize(vp)
      await page.goto("/", { waitUntil: "load" })
      await hydrationGate(page)
      await assertNoHScroll(page, name)
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
      await expect(
        page.getByRole("button", { name: /فتح القائمة|إغلاق القائمة/ }),
        `FINDING[landscape] البرغر غير ظاهر في ${name}`
      ).toBeVisible()
    })
  }
})
