import { test, expect, PAGES } from "./fixtures"
import AxeBuilder from "@axe-core/playwright"

/**
 * فحوص الوصول الشاملة بـ axe-core (WCAG 2.x AA) — في الوضعين الداكن
 * والفاتح معاً. Lighthouse يفحص الوضع الافتراضي (الداكن) فقط؛ هذه
 * الجولة تضمن أن تبديل المظهر لا يكسر التباين أو أي قاعدة أخرى.
 */
async function scan(page: import("@playwright/test").Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze()
  return results.violations
}

test.describe("axe-core — صفر انتهاكات في الوضعين", () => {
  for (const p of PAGES) {
    test(`${p.path} — الوضع الداكن (الافتراضي)`, async ({ page }) => {
      await page.goto(p.path, { waitUntil: "networkidle" })
      const violations = await scan(page)
      expect(
        violations.map((v) => `${v.id}: ${v.nodes.length} عقدة`),
        `axe violations on ${p.path} (dark):\n${JSON.stringify(
          violations.map((v) => ({ id: v.id, help: v.help, nodes: v.nodes.map((n) => n.target) })),
          null,
          2
        )}`
      ).toEqual([])
    })
  }

  for (const p of PAGES) {
    test(`${p.path} — الوضع الفاتح (بعد التبديل)`, async ({ page }) => {
      await page.goto(p.path, { waitUntil: "networkidle" })
      // بدّل إلى الفاتح كما يفعل المستخدم
      await page.getByRole("button", { name: "تفعيل المظهر الفاتح" }).click()
      await expect(page.locator("html")).toHaveClass(/light/)
      // رسومات الخلفية التوليدية تحتاج إطاراً لتتطلب
      await page.waitForTimeout(300)
      const violations = await scan(page)
      expect(
        violations.map((v) => `${v.id}: ${v.nodes.length} عقدة`),
        `axe violations on ${p.path} (light):\n${JSON.stringify(
          violations.map((v) => ({ id: v.id, help: v.help, nodes: v.nodes.map((n) => n.target) })),
          null,
          2
        )}`
      ).toEqual([])
    })
  }
})
