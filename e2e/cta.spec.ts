import { test, expect } from "./fixtures"

/* r10 (testing audit G4): the site's CONVERSION buttons had zero
   coverage — hero CTAs, the closing CTA and the pricing card buttons
   are the entire point of a marketing site. Every assertion here checks
   the real href/target/rel contract plus the actual click behavior. */

test.describe("r10 — أزرار التحويل (hero)", () => {
  /* r133 (A7 §1 re-base): أزرار ال landing الحقيقية — «اكتشف المنتجات"
     (مرساة #products) و«عن SmartLink» في فوتر ال landing. أسماء ما قبل
     r128 لم تعد موجودة في الواجهة. */
  test("«اكتشف المنتجات» → يمرّر فعلاً إلى قسم المنتجات", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" })
    const cta = page.getByRole("link", { name: /اكتشف المنتجات/ })
    await expect(cta).toHaveAttribute("href", "#products")
    await cta.click()
    // scroll-padding يحرّ القسم تحت الترويسة الثابتة — تحقق أن القسم صار داخل الشاشة
    await expect
      .poll(async () => {
        const box = await page.locator("#products").boundingBox()
        return box ? Math.round(box.y) : -1
      })
      .toBeLessThan(200)
  })

  test("«عن SmartLink» (فوتر ال landing) → /about بعنوان h1 صحيح", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" })
    await page.getByRole("contentinfo").getByRole("link", { name: "عن SmartLink" }).click()
    await expect(page).toHaveURL(/\/about$/)
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/عن SmartLink/)
  })
})

test.describe("r10 — CTA الختامي", () => {
  test("«ابدأ التجربة» → رابط خارجي للمنتج بـ target/rel آمنين", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" })
    const cta = page.getByRole("link", { name: /ابدأ التجربة/ })
    await expect(cta).toHaveAttribute("href", "https://menu.smart-link.ly")
    await expect(cta).toHaveAttribute("target", "_blank")
    await expect(cta).toHaveAttribute("rel", "noopener noreferrer")
  })

  test("«تواصل معنا» الختامي → /contact (قسم الوصول في ال landing)", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" })
    /* r133 (A7 §1 re-base): قسم الختام الكنسي هو ln-cta بعنوان
       «ابدأ رحلتك» (كان #cta قبل r128) — الزر داخل القسم وحده. */
    const finale = page.locator('section[aria-label="ابدأ رحلتك"]')
    await finale.scrollIntoViewIfNeeded()
    const cta = finale.getByRole("link", { name: /تواصل معنا/ })
    await expect(cta).toHaveAttribute("href", "/contact")
  })
})

test.describe("r10 — أزرار بطاقات التسعير", () => {
  test("زرّا «ابدأ الآن» → رابطان خارجيان بـ target/rel", async ({ page }) => {
    await page.goto("/pricing", { waitUntil: "domcontentloaded" })
    const buttons = page.getByRole("link", { name: /ابدأ الآن/ })
    await expect(buttons).toHaveCount(2)
    // getAttribute وليس .href — المتصفح يطبّع العنوان بشرطة ختامية
    const hrefs = await buttons.evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).getAttribute("href")))
    expect(hrefs).toContain("https://menu.smart-link.ly")
    expect(hrefs).toContain("https://bot.smart-link.ly")
    for (const el of await buttons.all()) {
      await expect(el).toHaveAttribute("target", "_blank")
      await expect(el).toHaveAttribute("rel", "noopener noreferrer")
    }
  })

  test("بطاقة «قريباً» → رابطها الداخلي /contact", async ({ page }) => {
    await page.goto("/pricing", { waitUntil: "domcontentloaded" })
    const soon = page.getByRole("link", { name: /تواصل معنا لمعرفة المزيد/ })
    await expect(soon).toHaveAttribute("href", "/contact")
  })
})
