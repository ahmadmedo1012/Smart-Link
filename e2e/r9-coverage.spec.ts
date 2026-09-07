import { test, expect, PAGES } from "./fixtures"
import AxeBuilder from "@axe-core/playwright"

/**
 * r9 — الفجوات المسجلة في تدقيق الاختبارات (P2) التي لم يغطها الجناح:
 * reduced-motion (بُني لها CSS مركزي وأكواد r7/r8 بلا اختبار واحد)،
 * مسح axe على viewport الجوال (الفحوص كلها desktop)، عقد footer
 * (روابط واتساب/بريد/قانونية على كل صفحة)، وصمود no-JS.
 */

test.describe("r9 — prefers-reduced-motion", () => {
  test("الرئيسية: القيم النهائية فورية والمحتوى مرئي بلا انتظار كشف", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/", { waitUntil: "domcontentloaded" })
    // العدّادات تُصيَّر بالقيم النهائية في الخادم — تظهر فوراً بلا عدّ
    await expect(page.locator("text=+500").first()).toBeVisible({ timeout: 5000 })
    await expect(page.locator("text=99.9%").first()).toBeVisible()
    // h1 الرئيسية مرئي (جراحة r8: بلا reveal انتظاري)
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
  })

  test("العدّاد لا يُصفِّر إلى 0 بعد الإدخال في viewport (انحدار r8/r5)", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/", { waitUntil: "networkidle" })
    await page.locator("text=عميل نشط").scrollIntoViewIfNeeded()
    await page.waitForTimeout(600)
    // في reduced-motion القيم النهائية تبقى — لا عودة إلى الأصفار
    await expect(page.locator("text=+500").first()).toBeVisible()
  })
})

test.describe("r9 — مسح axe على viewport الجوال (375×812)", () => {
  for (const p of PAGES) {
    test(`${p.path} — جوال بلا انتهاكات WCAG 2.1 AA`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 })
      await page.goto(p.path, { waitUntil: "networkidle" })
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze()
      expect(results.violations).toEqual([])
    })
  }
})

test.describe("r9 — عقد footer (روابط التواصل على كل صفحة)", () => {
  for (const p of PAGES) {
    test(`${p.path} — واتساب/بريد/قانونية/منتجان بـ target وrel`, async ({ page }) => {
      await page.goto(p.path, { waitUntil: "domcontentloaded" })
      const footer = page.getByRole("contentinfo")

      // واتساب: رابط واحد على الأقل بـ wa.me و target/rel
      const wa = footer.locator('a[href^="https://wa.me/"]').first()
      await expect(wa).toHaveAttribute("target", "_blank")
      await expect(wa).toHaveAttribute("rel", "noopener noreferrer")

      // البريد
      await expect(footer.locator('a[href^="mailto:"]').first()).toHaveAttribute(
        "href",
        /mailto:ahmedmedo1012@gmail\.com/
      )

      // الصفحتان القانونيتان
      await expect(footer.getByRole("link", { name: "سياسة الخصوصية" })).toHaveAttribute("href", "/privacy")
      await expect(footer.getByRole("link", { name: "شروط الاستخدام" })).toHaveAttribute("href", "/terms")

      // المنتجان الخارجيان بـ rel
      for (const [label, href] of [
        ["Smart Menu", "https://menu.smart-link.ly"],
        ["SmartBot", "https://bot.smart-link.ly"],
      ] as const) {
        const link = footer.locator(`a[href="${href}"]`).first()
        await expect(link).toHaveAttribute("target", "_blank")
        await expect(link).toHaveAttribute("rel", "noopener noreferrer")
      }
    })
  }
})

test.describe("r9 — صمود no-JS (الموقع SSR-first بلا جافاسكريبت)", () => {
  test("الرئيسية تعرض المحتوى والقيم النهائية بلا أي JS", async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false })
    const page = await ctx.newPage()
    await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" })
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    await expect(page.locator("text=+500").first()).toBeVisible()
    // التنقل الديكوري لا يكسر الصفحة: h2 أقسام موجودة
    await expect(page.getByRole("heading", { name: /منظومة متكاملة/ })).toBeVisible()
    await ctx.close()
  })

  test("pricing بلا JS: الخطط والأسعار كاملة", async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false })
    const page = await ctx.newPage()
    await page.goto("http://localhost:3000/pricing", { waitUntil: "domcontentloaded" })
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    await expect(page.locator("text=مجاني").first()).toBeVisible()
    await ctx.close()
  })
})
