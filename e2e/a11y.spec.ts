import { test, expect, PAGES } from "./fixtures"
import { axeScan, hydrationGate } from "./helpers"

/**
 * فحوص الوصول الشاملة بـ axe-core (WCAG 2.x AA) — في الوضعين الداكن
 * والفاتح معاً. Lighthouse يفحص الوضع الافتراضي (الداكن) فقط؛ هذه
 * الجولة تضمن أن تبديل المظهر لا يكسر التباين أو أي قاعدة أخرى.
 */

test.describe("axe-core — صفر انتهاكات في الوضعين", () => {
  for (const p of PAGES) {
    test(`${p.path} — الوضع الداكن (الافتراضي)`, async ({ page }) => {
      await page.goto(p.path, { waitUntil: "networkidle" })
      const violations = await axeScan(page)
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
      const violations = await axeScan(page)
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

/* ═══ r14-M6: الركن الرابع الناقص من مصفوفة axe — الجوال في الوضع الفاتح ═══
 * CLAUDE.md يعد «صفر انتهاكات في الوضعين وعلى 375×812» لكن التغطية كانت
 * 3/4: داكن/فاتح لسطح المكتب + جوال داكن (r9-coverage). الجوال الفاتح
 * غاب — وفيه وُجد انتهاك /terms الحقيقي (4.28:1 نص ثانوي فوق طبقة التوهج
 * — أصلح r14 بتغميق --muted-foreground الفاتح إلى 0.52). بوابة الترطيب
 * قبل الضغط على المبدّل (درس r13) وإطار للرسوم الخلفية قبل المسح. */
test.describe("axe-core — جوال 375×812 في الوضع الفاتح (r14)", () => {
  for (const p of PAGES) {
    test(`${p.path} — جوال فاتح بلا انتهاكات WCAG 2.1 AA`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 })
      await page.goto(p.path, { waitUntil: "load" })
      await hydrationGate(page)
      await page.getByRole("button", { name: "تفعيل المظهر الفاتح" }).click()
      await expect(page.locator("html")).toHaveClass(/light/)
      await page.waitForTimeout(300)
      const violations = await axeScan(page)
      expect(
        violations.map((v) => `${v.id}: ${v.nodes.length} عقدة`),
        `FINDING[a11y-light-mobile] ${p.path}: ${JSON.stringify(
          violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) }))
        )}`
      ).toEqual([])
    })
  }
})
