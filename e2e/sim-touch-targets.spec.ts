import { test, expect, PAGES } from "./fixtures"
import { hydrationGate, MOBILE_VIEWPORT } from "./helpers"

/**
 * r14-M6 — أهداف اللمس (WCAG 2.5.8 AA / 2.5.5 AAA)
 * ---------------------------------------------------------------------------
 * r11 وثّق إصلاح 44px للبرغر/مبدّل المظهر/العودة للأعلى بتعليقات في الكود
 * — لكن لا اختبار يقيس أي عنصر منها: انحدار إلى p-2.5 (36px) يمر عبر CI
 * أخضر.
 *
 * خط الأساس قبل r14 (m2-touch-targets.json): 8-10 أهداف <24px في كل صفحة
 * (روابط الفوتر 16-20px وبطاقات contact 23px). إصلاح r14-C4 رفعها كلها
 * فوق 24px — لذلك خط الأساس الآن صفر، وأي هدف صغير جديد يكسر البوابة.
 */

/** قياس هدف تفاعلي ظاهر (boundingBox مع رسالة عربية موحدة) */
function expectAtLeast44(box: { width: number; height: number } | null, what: string) {
  expect(box, `FINDING[touch-target] ${what}: غير موجود/بلا أبعاد`).toBeTruthy()
  expect(
    box!.width,
    `FINDING[touch-target] ${what}: العرض ${box!.width}px < 44px (إصلاح r11 المنقوص)`
  ).toBeGreaterThanOrEqual(44)
  expect(
    box!.height,
    `FINDING[touch-target] ${what}: الارتفاع ${box!.height}px < 44px`
  ).toBeGreaterThanOrEqual(44)
}

test.describe("r14 — أهداف اللمس الأساسية ≥ 44×44 (حراسة إصلاحات r11)", () => {
  test.use({ viewport: MOBILE_VIEWPORT })

  test("البرغر ومبدّل المظهر ≥ 44×44 على كل الصفحات", async ({ page }) => {
    for (const p of PAGES) {
      await page.goto(p.path, { waitUntil: "load" })
      await hydrationGate(page)
      expectAtLeast44(
        await page
          .getByRole("button", { name: /فتح القائمة|إغلاق القائمة/ })
          .boundingBox(),
        `${p.path}: زر القائمة`
      )
      expectAtLeast44(
        await page.getByRole("button", { name: /تفعيل المظهر/ }).boundingBox(),
        `${p.path}: مبدّل المظهر`
      )
    }
  })

  test("زر العودة للأعلى ≥ 44×44 (بعد التمرير)", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" })
    await hydrationGate(page)
    await page.evaluate(() => window.scrollTo(0, 900))
    const btn = page.getByRole("button", { name: "العودة للأعلى" })
    await expect(btn).toBeVisible({ timeout: 5000 })
    expectAtLeast44(await btn.boundingBox(), "زر العودة للأعلى")
  })

  test("جرد <24px (WCAG 2.5.8) — صفر بعد إصلاح r14 للفوتر وبطاقات التواصل", async ({ page }) => {
    for (const p of PAGES) {
      await page.goto(p.path, { waitUntil: "load" })
      await hydrationGate(page)
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      await page.waitForTimeout(300)
      const small = await page.evaluate(() =>
        Array.from(document.querySelectorAll("a[href], button"))
          .filter((e) => {
            const r = e.getBoundingClientRect()
            if (r.width === 0 || r.height === 0) return false // مخفي (قائمة مغلقة إلخ)
            const cs = getComputedStyle(e)
            return cs.visibility !== "hidden" && cs.display !== "none"
          })
          .filter((e) => {
            const r = e.getBoundingClientRect()
            return r.height < 24 || r.width < 24
          })
          .map((e) => {
            const r = e.getBoundingClientRect()
            return `${(e.textContent || e.getAttribute("aria-label") || "").trim().slice(0, 24)} ${Math.round(r.width)}×${Math.round(r.height)}`
          })
      )
      expect(
        small.length,
        `FINDING[touch-target] ${p.path}: ${small.length} هدف <24px — أهداف صغيرة دخلت الصفحة (${JSON.stringify(small)})`
      ).toBe(0)
    }
  })
})
