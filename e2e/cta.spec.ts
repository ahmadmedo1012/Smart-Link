import { test, expect } from "./fixtures"

/* r10 (testing audit G4): the site's CONVERSION buttons had zero
   coverage — hero CTAs, the closing CTA and the pricing card buttons
   are the entire point of a marketing site. Every assertion here checks
   the real href/target/rel contract plus the actual click behavior. */

test.describe("r10 — أزرار التحويل (hero)", () => {
  /* r133 (A7 §1 re-base): أزرار ال landing الحقيقية — «اكتشف المنتجات"
     (مرساة #products) و«عن SmartLink» في فوتر ال landing. أسماء ما قبل
     r128 لم تعد موجودة في الواجهة. */
  test("«اكتشف العوالم» → يمرّر فعلاً إلى قسم العوالم", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" })
    const cta = page.getByRole("link", { name: /اكتشف العوالم/ })
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

  /* W6-B2 (توصيل الرصاصة — تدقيق W6-A2 1g): رصاصة «تواصل واتساب مباشر»
     كانت نصاً خاماً في شريط الهيرو — الدوم المصيَّر للرئيسية كان بلا أي
     رابط wa.me (السائح الليبي الواتسابي يحتاج نقرتين عبر /contact).
     العقد: الرصاصة رابط wa.me حقيقي بفتّاحة معبأة (عرف r134) مع
     اصطلاح الروابط الخارجية — يمتد عقد r9 ولا يضعفه. */
  test("W6-B2 — «تواصل واتساب مباشر» (رصاصة الهيرو) → رابط wa.me بفتّاحة معبأة وtarget/rel آمنين", async ({ page }) => {
    /* P16-4a (fit pass): على الشاشات القصيرة (ارتفاع < 960px) يطوى شريط
       الهيرو كله (حقائقه الثلاث تعيش في الماركي والتذييل أيضاً) — الفحص
       على إطارٍ طويل يجعل الرصاصة مرئية وقابلة للنقر كما تُصيَّر فعلاً. */
    await page.setViewportSize({ width: 1280, height: 1024 })
    await page.goto("/", { waitUntil: "domcontentloaded" })
    const wa = page.locator(".ln-hero-meta").getByRole("link", { name: /تواصل واتساب مباشر/ })
    await expect(wa).toHaveAttribute("href", /^https:\/\/wa\.me\/218910089975\?text=/)
    await expect(wa).toHaveAttribute("target", "_blank")
    await expect(wa).toHaveAttribute("rel", "noopener noreferrer")
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
  test("أزرار «ابدأ الآن» الثلاثة → روابط خارجية بـ target/rel", async ({ page }) => {
    /* r137 (صدق الأسطول): بطاقة ثالثة — Smart Order حيّ. */
    await page.goto("/pricing", { waitUntil: "domcontentloaded" })
    const buttons = page.getByRole("link", { name: /ابدأ الآن/ })
    await expect(buttons).toHaveCount(3)
    // getAttribute وليس .href — المتصفح يطبّع العنوان بشرطة ختامية
    const hrefs = await buttons.evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).getAttribute("href")))
    expect(hrefs).toContain("https://menu.smart-link.ly")
    expect(hrefs).toContain("https://bot.smart-link.ly")
    expect(hrefs).toContain("https://order.smart-link.ly")
    for (const el of await buttons.all()) {
      await expect(el).toHaveAttribute("target", "_blank")
      await expect(el).toHaveAttribute("rel", "noopener noreferrer")
    }
  })

  /* P13-2a (T2): بطاقة «قريباً» تقاعدت مع وصول الحقيقة — الخطط
     المدفوعة حيّة على منصات المنتجات، والفصل الاستبدالي (01 —
     المنظومة الحيّة) يقود لصفحة أسعار كل منتج مباشرة. */
  test("فصل المنظومة الحيّة → ثلاثة روابط لصفحات أسعار المنتجات", async ({ page }) => {
    await page.goto("/pricing", { waitUntil: "domcontentloaded" })
    const links = page.getByRole("link", { name: /تفاصيل الخطط على منصّة/ })
    await expect(links).toHaveCount(3)
    const hrefs = await links.evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).getAttribute("href")))
    expect(hrefs).toContain("https://bot.smart-link.ly/pricing")
    expect(hrefs).toContain("https://menu.smart-link.ly/pricing")
    expect(hrefs).toContain("https://order.smart-link.ly/pricing")
    for (const el of await links.all()) {
      await expect(el).toHaveAttribute("target", "_blank")
      await expect(el).toHaveAttribute("rel", "noopener noreferrer")
    }
  })
})
