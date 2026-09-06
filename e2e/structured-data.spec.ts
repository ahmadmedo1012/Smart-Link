import { test, expect } from "./fixtures"

/**
 * البيانات المنظمة (JSON-LD): تحليل حي من DOM الصفحات، وليس من الشيفرة.
 * (انحدار r6: البريد كان مقلوب الأحرف أمام الزواحف.)
 */
async function ldScripts(page: import("@playwright/test").Page) {
  /* pricing يبث مصفوفة [{FAQPage},{BreadcrumbList}] في script واحد —
     نسطّح المصفوفات ليتعامل الفاحص مع كل كائن على حدة. */
  return page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((nodes) =>
      nodes.flatMap((n) => {
        const v = JSON.parse(n.textContent ?? "{}")
        return Array.isArray(v) ? v : [v]
      })
    )
}

test.describe("JSON-LD — الرئيسية", () => {
  test("Organization كاملة: بريد صحيح + منظمتان فرعيتان + روابط sameAs", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" })
    const lds = await ldScripts(page)
    const org = lds.find((l) => l["@type"] === "Organization")
    expect(org).toBeTruthy()

    // انحدار r6: البريد الموحّد عبر كل الأسطح
    expect(org.contactPoint.email).toBe("ahmedmedo1012@gmail.com")
    expect(org.contactPoint.availableLanguage).toContain("ar")
    expect(org.url).toBe("https://smart-link.ly")
    expect(org.logo["@type"]).toBe("ImageObject")

    // المنظومتان الفرعيتان
    const subNames = org.subOrganization.map((s: { name: string }) => s.name)
    expect(subNames).toEqual(expect.arrayContaining(["Smart Menu", "SmartBot"]))

    // روابط الحضور
    expect(org.sameAs).toContain("https://wa.me/218910089975")
    expect(org.sameAs).toContain("https://menu.smart-link.ly")
    expect(org.sameAs).toContain("https://bot.smart-link.ly")
  })

  test("WebSite — اسم ولغة عربية", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" })
    const lds = await ldScripts(page)
    const site = lds.find((l) => l["@type"] === "WebSite")
    expect(site).toBeTruthy()
    expect(site.name).toBe("SmartLink")
    expect(site.inLanguage).toBe("ar")
  })

  test("FAQPage — ستة أسئلة بأجوبة غير فارغة (r6)", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" })
    const lds = await ldScripts(page)
    const faq = lds.find((l) => l["@type"] === "FAQPage")
    expect(faq).toBeTruthy()
    expect(faq.mainEntity).toHaveLength(6)
    for (const q of faq.mainEntity) {
      expect(q.name.length).toBeGreaterThan(5)
      expect(q.acceptedAnswer.text.length).toBeGreaterThan(20)
    }
  })
})

test.describe("JSON-LD — /pricing", () => {
  test("FAQPage حاضر بأسئلة كافية (تكافؤ الرصيف مع الرئيسية)", async ({ page }) => {
    await page.goto("/pricing", { waitUntil: "domcontentloaded" })
    const lds = await ldScripts(page)
    const faq = lds.find((l) => l["@type"] === "FAQPage")
    expect(faq).toBeTruthy()
    expect(faq.mainEntity.length).toBeGreaterThanOrEqual(4)
  })
})

test.describe("JSON-LD — سلامة كل الصفحات", () => {
  const routes = ["/", "/about", "/pricing", "/contact", "/privacy", "/terms"]
  for (const r of routes) {
    test(`${r} — كل scripts صالحة JSON`, async ({ page }) => {
      await page.goto(r, { waitUntil: "domcontentloaded" })
      const nodes = await page.locator('script[type="application/ld+json"]').all()
      expect(nodes.length).toBeGreaterThanOrEqual(1)
      // التحليل يرمي لو JSON تالف — evaluateAll يفشل الاختبار تلقائياً
      await ldScripts(page)
    })
  }
})
