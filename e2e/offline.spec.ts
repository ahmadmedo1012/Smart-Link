import { test, expect } from "./fixtures"
import AxeBuilder from "@axe-core/playwright"
import { SITE } from "../src/lib/site"

/**
 * r14 (M7) — عقد صفحة/سلوك الأوفلاين.
 * ---------------------------------------------------------------------------
 * صفحة /offline تتبع سابقة 404 (أداة noindex بلا PAGES entry) لكن عقدها
 * أوفى: محتوى + ميتا + axe في الوضعين + السلوك الحقيقي للـSW بسياق
 * خاص (serviceWorkers:"allow") يفتحه هذا الـspec بنفسه بينما الجناح
 * كله محصون بحجب عالمي من playwright.config.
 *
 * لا POSTs إطلاقاً هنا — بلا تفاعل مع دلو المعدل.
 */

/* ── عقد الصفحة (SW محجوب — عرض خالص من الخادم) ── */
test.describe("offline — عقد الصفحة", () => {
  test("/offline — المحتوى والميتا: noindex، بلا canonical، واتساب، h1", async ({ page }) => {
    const res = await page.goto("/offline")
    expect(res?.status(), "الصفحة تعمل أونلاين كأي صفحة ثابتة").toBe(200)

    // noindex كامل (r10 نفس عقل 404: صفحة أداة لا تُفهرس)
    expect(await page.locator('meta[name="robots"]').getAttribute("content")).toBe(
      "noindex, nofollow"
    )
    // بلا canonical موروث (alternates:{} تقطع توريث الجذر)
    expect(await page.locator('link[rel="canonical"]').count()).toBe(0)
    // العنوان من قالب الجذر
    await expect(page).toHaveTitle(/لا يوجد اتصال بالإنترنت \| SmartLink/)
    // h1 + رقم الواتساب بdir=ltr (عقد العرض — CLAUDE.md)
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("لا يوجد اتصال بالإنترنت")
    const wa = page.locator("a", { hasText: "تواصل عبر واتساب" })
    await expect(wa).toHaveAttribute("href", SITE.whatsapp.url)
    await expect(page.locator("span[dir='ltr']")).toHaveText(SITE.whatsapp.display)
  })

  for (const theme of ["dark", "light"] as const) {
    test(`/offline — axe نظيف (${theme})`, async ({ page }) => {
      // الوضع عبر localStorage (الصفحة بلا زر تبديل — وضع الأداة)
      await page.addInitScript(
        (t) => localStorage.setItem("theme", t),
        theme
      )
      await page.goto("/offline")
      await expect(page.locator("html")).toHaveClass(new RegExp(`(^|\\s)${theme}(\\s|$)`))
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze()
      const violations = results.violations
      expect(
        violations.map((v) => v.id),
        `FINDING[a11y] /offline ${theme}: ${JSON.stringify(violations.map((v) => ({ id: v.id, help: v.help })))}`
      ).toEqual([])
    })
  }
})

/* ── السلوك الحقيقي (سياق خاص — SW مفعّل) ── */
test.describe("offline — سلوك Service Worker", () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test("SW يسجل وينشط ثم يخدم /offline عند انقطاع الشبكة، ويعود network-first", async ({ browser }) => {
    const context = await browser.newContext({ serviceWorkers: "allow" })
    const page = await context.newPage()
    const errors: string[] = []
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()))
    page.on("pageerror", (e) => errors.push(String(e)))

    try {
      // (1) التسجيل والانتظار حتى النشاط (install يجلب /offline للكاش)
      await page.goto("/", { waitUntil: "load" })
      await page.evaluate(() => navigator.serviceWorker.ready)
      const reg = await page.evaluate(
        () => navigator.serviceWorker.controller?.scriptURL ?? null
      )
      expect(reg, "الـSW يتحكم في الصفحة بعد التفعيل").toContain("/sw.js")

      // (2) انقطاع الشبكة → الملاحة تُخدَم من كاش الأوفلاين
      await context.setOffline(true)
      await page.goto("/", { waitUntil: "domcontentloaded", timeout: 20_000 })
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        "لا يوجد اتصال بالإنترنت"
      )
      await expect(page.locator("span[dir='ltr']")).toHaveText(SITE.whatsapp.display)

      // (3) عودة الشبكة → network-first: الملاحة التالية تعمل طبيعياً
      await context.setOffline(false)
      const res = await page.goto("/", { waitUntil: "load", timeout: 20_000 })
      expect(res?.status(), "أونلاين = الموقع الحي، لا كاش HTML إطلاقاً").toBe(200)
      await expect(page.getByRole("heading", { level: 1 })).not.toHaveText(
        "لا يوجد اتصال بالإنترنت"
      )

      // بوابة console يدوية (سياق خاص خارج fixture المشترك)
      expect(errors, `أخطاء SW غير متوقعة: ${JSON.stringify(errors)}`).toEqual([])
    } finally {
      await context.close()
    }
  })
})
