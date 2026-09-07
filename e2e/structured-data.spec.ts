import { test, expect } from "./fixtures"

/**
 * البيانات المنظمة (JSON-LD): تحليل حي من DOM الصفحات، وليس من الشيفرة.
 * (انحدار r6: البريد كان مقلوب الأحرف أمام الزواحف.)
 */
async function ldScripts(page: import("@playwright/test").Page) {
  /* r9: @type may be an array (Organization+LocalBusiness) — byType checks
     both shapes, and the @graph script (the Services) is flattened too. */
  const flat = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((nodes) =>
      nodes.flatMap((n) => {
        const v = JSON.parse(n.textContent ?? "{}")
        return Array.isArray(v) ? v : [v]
      })
    )
  const isType = (obj: Record<string, unknown>, t: string) =>
    Array.isArray(obj["@type"]) ? (obj["@type"] as string[]).includes(t) : obj["@type"] === t
  const withGraphs = flat.flatMap((l) => {
    const g = (l as Record<string, unknown>)["@graph"]
    return Array.isArray(g) ? (g as unknown[]) : [l]
  })
  const byType = (t: string) =>
    withGraphs.filter((l) => isType(l as Record<string, unknown>, t))
  return { flat, withGraphs, byType }
}

test.describe("JSON-LD — الرئيسية", () => {
  test("Organization كاملة: بريد صحيح + منظمتان فرعيتان + روابط sameAs", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" })
    const { byType } = await ldScripts(page)
    const org = byType("Organization")[0]
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

  test("r9 — LocalBusiness: هاتف + ليبيا + ساعات دوام صادقة", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" })
    const { byType } = await ldScripts(page)
    const lb = byType("LocalBusiness")[0]
    expect(lb).toBeTruthy()
    expect(lb.telephone).toBe("+218910089975")
    expect(lb.address.addressCountry).toBe("LY")
    expect(lb.areaServed.name).toBe("ليبيا")
    const hours = lb.openingHoursSpecification[0]
    expect(hours.opens).toBe("09:00")
    expect(hours.closes).toBe("21:00")
    expect(hours.dayOfWeek).toHaveLength(7)
  })

  test("r9 — كيانات مترابطة @id + خدمتان مع Offer مجاني", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" })
    const { byType } = await ldScripts(page)
    const org = byType("Organization")[0]
    const site = byType("WebSite")[0]
    const services = byType("Service")

    expect(org["@id"]).toBe("https://smart-link.ly/#organization")
    expect(site.publisher["@id"]).toBe(org["@id"])
    expect(services).toHaveLength(2)
    for (const svc of services) {
      expect(svc.provider["@id"]).toBe(org["@id"])
      expect(svc.offers.price).toBe("0")
    }
    const svcNames = services.map((sv: { name: string }) => sv.name)
    expect(svcNames).toEqual(expect.arrayContaining(["Smart Menu", "SmartBot"]))
  })

  test("WebSite — اسم ولغة عربية", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" })
    const { byType } = await ldScripts(page)
    const site = byType("WebSite")[0]
    expect(site).toBeTruthy()
    expect(site.name).toBe("SmartLink")
    expect(site.inLanguage).toBe("ar")
  })

  test("FAQPage — ستة أسئلة بأجوبة غير فارغة (r6)", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" })
    const { byType } = await ldScripts(page)
    const faq = byType("FAQPage")[0]
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
    const { byType } = await ldScripts(page)
    const faq = byType("FAQPage")[0]
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
