import { test, expect, PAGES, allowResourceNoise } from "./fixtures"
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
      /* r133 (A7 §1 re-base): الرئيسية بلا مبدّل مظهر منذ r128 (كروم
         المنتج انتقل للصفحات الداخلية). phase9 (E3): الرئيسية الآن تملك
         مرحلتها الفاتحة الخاصة (§15 landing.css) ومبدّلها في الهيدر —
         لكن هذا المسح يظل يستخدم مفتاح التخزين + سكربت الإقلاع (يغطي
         طريق الحفظ نفسه بلا الاعتماد على الترطيب) والمسح يفحص المرحلة
         الفاتحة الحقيقية التي يرسمها ال landing الآن. */
      if (p.path === "/") {
        await page.addInitScript(() => localStorage.setItem("theme", "light"))
      } else {
        await page.goto(p.path, { waitUntil: "networkidle" })
        // بدّل إلى الفاتح كما يفعل المستخدم
        await page.getByRole("button", { name: "تفعيل المظهر الفاتح" }).click()
      }
      await page.goto(p.path, { waitUntil: "networkidle" })
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
      /* كالأعلى — الرئيسية عبر مفتاح التخزين (سكربت الإقلاع يرسم الفئة
         قبل أي JS؛ المرحلة الفاتحة الحقيقية لل landing تُفحص هنا منذ
         phase9 — كانت المرحلة توضع بلا رسم فعلي قبلها). */
      if (p.path === "/") {
        await page.addInitScript(() => localStorage.setItem("theme", "light"))
        await page.goto(p.path, { waitUntil: "load" })
        await expect(page.locator("html")).toHaveClass(/light/)
      } else {
        await page.goto(p.path, { waitUntil: "load" })
        await hydrationGate(page)
        await page.getByRole("button", { name: "تفعيل المظهر الفاتح" }).click()
        await expect(page.locator("html")).toHaveClass(/light/)
      }
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

/* ═══ P21-W5-C2 (W5-A2 audit P3): الركن الغائب من مصفوفة axe — صفحة 404 ═══
 * كل الصفحات العامة تُمسح في الوضعين (المصفوفتان أعلاه) و/offline نالت
 * مسحها المخصص (offline.spec.ts — سابقة «صفحات الأدوات أوفى غطاءً») —
 * لكن الرابط الميت، السطح الذي يراه زائر حقيقي عند خطأ إملائي، لم
 * يُمسح قط: انحدار تباين/معلم على 404 كان سيسبح أخضر. هذا المسح يسدّ
 * الفجوة: الحالة 404 + نسخة h1 (الرقم + العنوان العربي) + axe نظيف
 * في الوضعين — الوضع عبر مفتاح التخزين (نفس نمط offline.spec.ts:
 * طريق الحفظ نفسه يُفحص بلا الاعتماد على الترطيب وزر التبديل). */
test.describe("axe-core — صفحة 404 (الرابط الميت — آخر الأسطح بلا مسح)", () => {
  for (const theme of ["dark", "light"] as const) {
    test(`رابط ميت → 404 + نسخة h1 + axe نظيف (${theme})`, async ({ page, consoleErrors }) => {
      /* طلب الوثيقة الميت نفسه يسجّل "Failed to load resource: 404" —
         ضوضية متوقعة معلنة (نفس عقد pages.spec.ts 404). */
      allowResourceNoise(consoleErrors, /Failed to load resource.*404/)
      await page.addInitScript(
        (t) => localStorage.setItem("theme", t),
        theme
      )
      const res = await page.goto("/dead-link-w5c2", { waitUntil: "networkidle" })
      expect(res?.status()).toBe(404)
      await expect(page.locator("html")).toHaveClass(new RegExp(`(^|\\s)${theme}(\\s|$)`))
      /* نسخة h1: الرقم «404» (رقم العرض — not-found.tsx) والعنوان
         العربي «الصفحة غير موجودة» h2 تحته — العقدان يمنعان انحدار
         النسخة لا مجرد الحالة. */
      await expect(page.locator("h1")).toContainText("404")
      await expect(
        page.getByRole("heading", { level: 2, name: "الصفحة غير موجودة" })
      ).toBeVisible()
      const violations = await axeScan(page)
      expect(
        violations.map((v) => `${v.id}: ${v.nodes.length} عقدة`),
        `FINDING[a11y-404] /dead-link-w5c2 (${theme}): ${JSON.stringify(
          violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) }))
        )}`
      ).toEqual([])
    })
  }
})
