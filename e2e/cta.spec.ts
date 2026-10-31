import { test, expect } from "./fixtures"
import { MOBILE_VIEWPORT } from "./helpers"

/* r10 (testing audit G4): the site's CONVERSION buttons had zero
   coverage — hero CTAs, the closing CTA and the pricing card buttons
   are the entire point of a marketing site. Every assertion here checks
   the real href/target/rel contract plus the actual click behavior.
   P40-5a: the suite grew the deep-link routing contract — every hub
   conversion CTA now lands on the product's own signup page
   (SITE.products.*.signupUrl), pinned end-to-end. */

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
    /* P40-5a (P1-1): زر الختام يتعمّق إلى صفحة اشتراك سمارت منيو
       نفسها (SITE.products.menu.signupUrl) — كان يهبط على جذر صفحة
       الهبوط فتضيع خطوة التسجيل. */
    await page.goto("/", { waitUntil: "domcontentloaded" })
    const cta = page.getByRole("link", { name: /ابدأ التجربة/ })
    await expect(cta).toHaveAttribute("href", "https://menu.smart-link.ly/subscribe")
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
  test("أزرار «ابدأ الآن» الثلاثة → صفحات اشتراك كل منتج بـ target/rel", async ({ page }) => {
    /* P40-5a (P1-1/P2-7): كل بطاقة تقود لصفحة الاشتراك الخاصة بمنتجها
       (منيو/بوت subscribe، أوردر register) — نفس مسار زرّها الأساسي —
       بدل جذور صفحات الهبوط. الدلالة موحّدة: بطاقة = ابدأ، وجدول
       «المنظومة الحيّة» = تفاصيل الخطط على منصّة المنتج. */
    await page.goto("/pricing", { waitUntil: "domcontentloaded" })
    const buttons = page.getByRole("link", { name: /ابدأ الآن/ })
    await expect(buttons).toHaveCount(3)
    // getAttribute وليس .href — المتصفح يطبّع العنوان بشرطة ختامية
    const hrefs = await buttons.evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).getAttribute("href")))
    expect(hrefs).toContain("https://menu.smart-link.ly/subscribe")
    expect(hrefs).toContain("https://bot.smart-link.ly/subscribe")
    expect(hrefs).toContain("https://order.smart-link.ly/register")
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

/* P40-5a — توجيه أزرار التحويل (P1-1 صدق التحويل + SL-1/SL-7 من
   المعايرة المقارنة): كل أزرار التحويل في المظلة كانت تهبط على جذور
   صفحات هبوط المنتجات، بينما أزرار المنتجات نفسها تتعمّق لصفحات
   الاشتراك. العقد الجديد (site.ts signupUrl):
   · الهيرو: أساسي واحد صادق الوجهة (سمارت منيو) + مساران ثانويان
     بنوايا معلنة (بوت/أوردر) — بروح Stripe: افتراض صريح واحد.
   · الهيدر (سطح مكتب + درج): الذهبي لاشتراك المنيو + ثانوي واتساب
     دائم بفتّاحة معبّأة وتأطير ساعات صادق (SITE.hours — لا 24/7).
   · بطاقات الأسعار: كل منتج لصفحة اشتراكه هو. */
test.describe("P40-5a — هيرو الرئيسية: الأساسي والمسارات الثانوية", () => {
  test("الزر الذهبي → اشتراك سمارت منيو مع لاحقة الوجهة المرئية", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" })
    const hero = page.locator(".ln-hero-actions .ln-btn-gold")
    await expect(hero).toHaveAttribute("href", "https://menu.smart-link.ly/subscribe")
    await expect(hero).toHaveAttribute("target", "_blank")
    await expect(hero).toHaveAttribute("rel", "noopener noreferrer")
    /* صدق الوجهة مرئي لا مسموعاً فقط: اللاحقة تسمّي سمارت منيو
       (Label-in-Name: النص المرئي داخل الاسم المتاح). */
    await expect(hero).toContainText("سمارت منيو")
    await expect(hero).toHaveAccessibleName(/ابدأ مجاناً — سمارت منيو، رابط خارجي/)
  })

  test("المساران الثانويان بنوايا معلنة → صفحتا اشتراك بوت/أوردر", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" })
    const bot = page.locator(".ln-hero-worlds").getByRole("link", { name: /تدير صفحة فيسبوك؟ جرّب سمارت بوت/ })
    await expect(bot).toHaveAttribute("href", "https://bot.smart-link.ly/subscribe")
    await expect(bot).toHaveAttribute("target", "_blank")
    await expect(bot).toHaveAttribute("rel", "noopener noreferrer")
    const order = page.locator(".ln-hero-worlds").getByRole("link", { name: /تبيع منتجات؟ جرّب سمارت أوردر/ })
    await expect(order).toHaveAttribute("href", "https://order.smart-link.ly/register")
    await expect(order).toHaveAttribute("target", "_blank")
    await expect(order).toHaveAttribute("rel", "noopener noreferrer")
  })
})

test.describe("P40-5a — الهيدر: الذهبي للاشتراك + ثانوي واتساب دائم (SL-7)", () => {
  /* سطح المكتب (1280): عنقود الأزرار ظاهر — الذهبي لاشتراك المنيو
     وواتساب بجانبه بفتّاحة معبّأة وساعات الدعم الصادقة في الاسم
     المتاح (SITE.hours: خلال أوقات العمل 9ص–9م — حكم r144: لا وعد
     24/7 على هذه القناة أبداً). */
  test("عنقود سطح المكتب: الذهبي → اشتراك المنيو؛ وواتساب → wa.me بفتّاحة وساعات صادقة", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" })
    const gold = page.locator(".landing-header-cta .ln-btn-gold")
    await expect(gold).toHaveAttribute("href", "https://menu.smart-link.ly/subscribe")
    await expect(gold).toHaveAttribute("target", "_blank")
    await expect(gold).toHaveAttribute("rel", "noopener noreferrer")
    const wa = page.locator(".landing-header-cta a[href^='https://wa.me/']")
    await expect(wa).toHaveAttribute("href", /^https:\/\/wa\.me\/218910089975\?text=/)
    await expect(wa).toHaveAttribute("target", "_blank")
    await expect(wa).toHaveAttribute("rel", "noopener noreferrer")
    await expect(wa).toHaveAccessibleName(/^تحدث معنا واتساب — خلال أوقات العمل.*رابط خارجي$/)
  })

  test("درج الجوال: الذهبي → اشتراك المنيو؛ وواتساب → wa.me بفتّاحة", async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await page.goto("/", { waitUntil: "domcontentloaded" })
    await page.getByRole("button", { name: /فتح القائمة/ }).click()
    const drawer = page.locator('nav[aria-label="قائمة الجوال"]')
    const gold = drawer.locator(".ln-btn-gold")
    await expect(gold).toHaveAttribute("href", "https://menu.smart-link.ly/subscribe")
    await expect(gold).toHaveAttribute("target", "_blank")
    await expect(gold).toHaveAttribute("rel", "noopener noreferrer")
    const wa = drawer.locator("a[href^='https://wa.me/']")
    await expect(wa).toHaveAttribute("href", /^https:\/\/wa\.me\/218910089975\?text=/)
    await expect(wa).toHaveAttribute("target", "_blank")
    await expect(wa).toHaveAttribute("rel", "noopener noreferrer")
    await expect(wa).toHaveAccessibleName(/^تحدث معنا واتساب — خلال أوقات العمل.*رابط خارجي$/)
  })
})
