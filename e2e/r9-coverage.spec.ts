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
    await page.locator("text=عميل نشط").first().scrollIntoViewIfNeeded()
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
  /* r133 (A7 §1 re-base): الفوتوران — صفحات المنتج تحمل فوتور المنتج
     (واتساب/بريد/اجتماعية)، والرئيسية تحمل LandingFooter (أعمدة الرحلة
     الحقيقية + المنتجان الخارجيان + القانونية). عقد كل سطح على حقيقته. */
  for (const p of PAGES.filter((x) => x.path !== "/")) {
    test(`${p.path} — واتساب/بريد/قانونية/منتجان بـ target وrel (فوتور المنتج)`, async ({ page }) => {
      await page.goto(p.path, { waitUntil: "domcontentloaded" })
      const footer = page.getByRole("contentinfo")

      // واتساب: رابط واحد على الأقل بـ wa.me و target/rel
      const wa = footer.locator('a[href^="https://wa.me/"]').first()
      await expect(wa).toHaveAttribute("target", "_blank")
      await expect(wa).toHaveAttribute("rel", "noopener noreferrer")

      // البريد — r126: الهوية العامة على نطاق الموقع (SITE.email)
      await expect(footer.locator('a[href^="mailto:"]').first()).toHaveAttribute(
        "href",
        /mailto:noreply@smart-link\.ly/
      )

      // الصفحتان القانونيتان
      await expect(footer.getByRole("link", { name: "سياسة الخصوصية" })).toHaveAttribute("href", "/privacy")
      await expect(footer.getByRole("link", { name: "شروط الاستخدام" })).toHaveAttribute("href", "/terms")

      // المنتجان الخارجيان بـ rel
      for (const href of [
        "https://menu.smart-link.ly",
        "https://bot.smart-link.ly",
      ] as const) {
        const link = footer.locator(`a[href="${href}"]`).first()
        await expect(link).toHaveAttribute("target", "_blank")
        await expect(link).toHaveAttribute("rel", "noopener noreferrer")
      }
    })
  }

  test("/ — عقد LandingFooter: أقسام الرحلة + المنتجان + القانونية + سطر الحقوق", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" })
    const footer = page.getByRole("contentinfo")

    // الأعمدة الأربعة بوجهاتها الحقيقية (r129 — لا روابط ميتة)
    for (const href of ["#products", "#journey", "#progress", "#platforms", "#roles"]) {
      await expect(footer.locator(`a[href="${href}"]`), `مرساة ${href}`).toHaveAttribute("href", href)
    }
    for (const href of ["/about", "/pricing", "/contact", "/privacy", "/terms"]) {
      await expect(footer.locator(`a[href="${href}"]`), `رابط ${href}`).toHaveAttribute("href", href)
    }

    // المنتجان الخارجيان بـ target/rel آمنين
    for (const href of ["https://menu.smart-link.ly", "https://bot.smart-link.ly"] as const) {
      const link = footer.locator(`a[href="${href}"]`).first()
      await expect(link).toHaveAttribute("target", "_blank")
      await expect(link).toHaveAttribute("rel", "noopener noreferrer")
    }

    // سطر الحقوق الكنسي: © السنة SmartLink + صُنع في ليبيا
    const year = new Date().getFullYear()
    await expect(footer.getByText(`© ${year} SmartLink`)).toBeVisible()
    await expect(footer.getByText("صُنع في ليبيا")).toBeVisible()
  })
})

test.describe("r9 — صمود no-JS (الموقع SSR-first بلا جافاسكريبت)", () => {
  test("الرئيسية تعرض المحتوى والقيم النهائية بلا أي JS", async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false })
    const page = await ctx.newPage()
    await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" })
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    await expect(page.locator("text=+500").first()).toBeVisible()
    // التنقل الديكوري لا يكسر الصفحة: عنوان فصل حقيقي موجود
    /* r133 (A7 §1): عنوان الفصل الكنسي لمدارات المنتجات (كان «منظومة
       متكاملة» قبل بناء Orbit-Ink في r128). */
    await expect(page.getByRole("heading", { name: /منتجان نشطان/ })).toBeVisible()
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

/* r10 (testing audit G10): footer social links, quick links and the
   copyright line had zero coverage (the r9 contract covered
   whatsapp/email/legal/products only). */
test.describe("r10 — عقد الفوتر: الاجتماعية والروابط السريعة والحقوق", () => {
  /* r133 (A7 §1 re-base): هذه عناصر فوتور المنتج — انتقلت معه إلى
     الصفحات الداخلية (LandingFooter لا يحمل اجتماعية/روابط سريعة). */
  test("روابط فيسبوك/إنستغرام بـ aria-label وtarget/rel آمنين (فوتور المنتج)", async ({ page }) => {
    await page.goto("/about", { waitUntil: "domcontentloaded" })
    const fb = page.locator("footer a[aria-label='فيسبوك']")
    const ig = page.locator("footer a[aria-label='إنستغرام']")
    await expect(fb).toHaveAttribute("href", "https://www.facebook.com/profile.php?id=61591502614404")
    await expect(ig).toHaveAttribute("href", "https://instagram.com/smart_link.0/")
    for (const l of [fb, ig]) {
      await expect(l).toHaveAttribute("target", "_blank")
      await expect(l).toHaveAttribute("rel", "noopener noreferrer")
    }
  })

  test("الروابط السريعة الأربعة تشير لمساراتها الصحيحة", async ({ page }) => {
    await page.goto("/about", { waitUntil: "domcontentloaded" })
    const quick = page.locator("footer h3:text('روابط سريعة') + ul a")
    const hrefs = await quick.evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).getAttribute("href")))
    expect(hrefs).toEqual(["/", "/about", "/contact", "/pricing"])
  })

  test("سطر الحقوق بصيغة © سنة SmartLink", async ({ page }) => {
    await page.goto("/about", { waitUntil: "domcontentloaded" })
    const year = new Date().getFullYear()
    await expect(page.locator("footer p", { hasText: new RegExp(`© ${year} SmartLink`) })).toBeVisible()
  })
})
