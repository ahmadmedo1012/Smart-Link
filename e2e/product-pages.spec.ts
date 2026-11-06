import { test, expect } from "./fixtures"

/**
 * P45-W1 (المبادرة B+C) — عقد صفحات هبوط المنتجات على المظلة.
 *
 * المصدر الواحد: كل قدرات الصفحة وحدودها تأتي من سجل العوالم
 * (worlds.ts) المثبَّت بدبوس الوحدة على بطاقات /pricing — هذا الـspec
 * يثبّت أن الصفحة المُصيَّرة تحمل النصوص نفسها حرفياً (لا إعادة صياغة
 * تنفلت من المصدر)، وأن زرّي التحويل على عقد P40-5a (signupUrl أساسي
 * + جذر المنتج للتصفح)، وأن روابط المنظومة المتقاطعة حاضرة.
 *
 * بيانات التوقع هنا مثبَّتة نصياً (نمط الدبابيس) — إذا غيّر السجل
 * قيمةً، هذا الملف يفشل حتى يُحدَّث بعلم (نفس فلسفة parity).
 */

const PRODUCT_PAGES = [
  {
    path: "/menu",
    name: "Smart Menu",
    signupUrl: "https://menu.smart-link.ly/subscribe",
    url: "https://menu.smart-link.ly",
    cta: "شاهد المنيو الحي",
    problem: "قائمة الورق الثابتة: طباعة متكررة، ولا تحديث فوري، ولا تحليلات للطلبات",
    audience: "المطاعم والمقاهي وكل نشاط له قائمة طعام أو خدمات",
    channel: "الزبون يمسح QR الكود → يتصفح المنيو → يطلب عبر واتساب",
    claims: [
      "منيو تفاعلي بصور وأسعار بالدينار الليبي",
      "الطلبات تصل مباشرة على واتساب — بدون تطبيق ولا تسجيل",
      "QR كود مخصص لكل طاولة ولوحة تحكم عربية كاملة",
    ],
    freeLimits: ["منيو واحد و10 أصناف", "100 طلب", "طلبات عبر واتساب"],
    /* P42-2d: سقف المنيو إجمالي مدى الحياة — كلمة الشهر ممنوعة هنا. */
    bannedCap: /100\s*طلب\s*شهري/u,
    siblings: ["/bot", "/order"],
  },
  {
    path: "/bot",
    name: "SmartBot",
    signupUrl: "https://bot.smart-link.ly/subscribe",
    url: "https://bot.smart-link.ly",
    cta: "جرّب البوت",
    problem: "غرق الصفحة برسائل العملاء وإبطاء الرد عليها",
    audience: "أصحاب صفحات فيسبوك التجارية والوكالات التي تدير صفحات متعددة",
    channel: "رسالة تصل صفحتك → رد آلي فوري بتصنيف النية",
    claims: [
      "تصنيف نوايا العملاء تلقائياً وردود ذكية على المتكرر",
      "بث جماعي وإدارة الصفحات من لوحة عربية واحدة",
      "تقارير مباشرة ترفع لك المحادثات المهمة فقط",
    ],
    freeLimits: ["ردود تلقائية (100/شهر)", "صفحة فيسبوك واحدة", "5 قواعد رد"],
    bannedCap: null as RegExp | null,
    siblings: ["/menu", "/order"],
  },
  {
    path: "/order",
    name: "Smart Order",
    signupUrl: "https://order.smart-link.ly/register",
    url: "https://order.smart-link.ly",
    cta: "اطلب من متجر تجريبي",
    problem: "الطلبات الهاتفية المبعثرة: كل طلب يُدوَّن ويُتابع يدويًا",
    audience: "المتاجر التي تبيع منتجاتها وتوصلها لزبائنها",
    channel: "الزبون يفتح متجرك → يطلب ويدفع بطريقة محلية",
    claims: [
      "متجر يعمل فوراً: منتجاتك بأقسامها",
      "طرق دفع محلية ومنطقة توصيل قابلة للضبط",
      "الطلبات تصل مرتبة وواضحة — بطريقة الدفع ومنطقة التوصيل",
    ],
    freeLimits: ["15 منتجاً و3 أقسام", "100 طلب شهرياً", "منطقة توصيل واحدة"],
    bannedCap: null as RegExp | null,
    siblings: ["/menu", "/bot"],
  },
] as const

for (const p of PRODUCT_PAGES) {
  test.describe(`P45-W1 — صفحة ${p.path} (${p.name})`, () => {
    test("زرّا التحويل: الاشتراك (signupUrl) أساسي + المنتج الحي للتصفح — بعقد خارجي كامل", async ({ page }) => {
      await page.goto(p.path, { waitUntil: "domcontentloaded" })
      const main = page.locator("main")

      /* الأساسي: صفحة الاشتراك الخاصة بالمنتج (P40-5a) — Label-in-Name
         يبدأ بالنص المرئي ويسمّي المنتج ويصرّح بالخارجية. */
      const signup = main.locator(`a[href="${p.signupUrl}"]`).first()
      await expect(signup).toBeVisible()
      await expect(signup).toHaveAttribute("target", "_blank")
      await expect(signup).toHaveAttribute("rel", "noopener noreferrer")
      await expect(signup).toHaveAccessibleName(new RegExp(`^ابدأ مجاناً — ${p.name}، رابط خارجي$`))

      /* الثانوي: جذر المنتج الحي بفعل أخيه المنشور (worlds.ts cta). */
      const live = main.locator(`a[href="${p.url}"]`).first()
      await expect(live).toBeVisible()
      await expect(live).toHaveAttribute("target", "_blank")
      await expect(live).toHaveAttribute("rel", "noopener noreferrer")
      await expect(live).toHaveAccessibleName(new RegExp(`^${p.cta} — ${p.name}، رابط خارجي$`))
    })

    test("فصل المشكلة والحل يحمل نصوص السجل حرفياً (المصدر الواحد)", async ({ page }) => {
      await page.goto(p.path, { waitUntil: "domcontentloaded" })
      const text = await page.locator("main").textContent()
      expect(text).toContain(p.problem)
      expect(text).toContain(p.audience)
      expect(text).toContain(p.channel)
      for (const c of p.claims) expect(text).toContain(c)
    })

    test("بطاقة الخطة المجانية: حدود السجل حرفياً + أول درجة مدفوعة عبر التهجئة الواحدة", async ({ page }) => {
      await page.goto(p.path, { waitUntil: "domcontentloaded" })
      const text = await page.locator("main").textContent()
      for (const f of p.freeLimits) expect(text).toContain(f)
      /* formatLyd(19) = «19 د.ل» — لا تهجئة مال يدوية ثانية. */
      expect(text).toContain("19 د.ل")
      /* عقد السقف: لا كلمة شهر لسقف المنيو (P42-2d — إجمالي مدى الحياة). */
      if (p.bannedCap) expect(text).not.toMatch(p.bannedCap)
    })

    test("روابط المنظومة المتقاطعة: سلّم الأسعار + الصفحتان الشقيقتان + محدد المنتجات", async ({ page }) => {
      await page.goto(p.path, { waitUntil: "domcontentloaded" })
      const main = page.locator("main")
      /* مرساة فصل «المنظومة الحيّة» على /pricing (P45-W1: id=ecosystem). */
      await expect(main.locator('a[href="/pricing#ecosystem"]')).toBeVisible()
      for (const s of p.siblings) {
        await expect(main.locator(`a[href="${s}"]`).first(), `رابط الشقيق ${s}`).toBeVisible()
      }
      await expect(main.locator('a[href="/#finder"]')).toBeVisible()
    })

    test("FAQPage JSON-LD: ثلاثة أسئلة فعلية على الأقل بأجوبة غير فارغة", async ({ page }) => {
      await page.goto(p.path, { waitUntil: "domcontentloaded" })
      const scripts = await page.locator("script[type='application/ld+json']").allInnerTexts()
      const parsed = scripts.map((s) => JSON.parse(s))
      const flat = parsed.flatMap((o) => (Array.isArray(o) ? o : [o]))
      const faq = flat.find((o: Record<string, unknown>) => o["@type"] === "FAQPage")
      expect(faq, "FAQPage موجود").toBeTruthy()
      const items = (faq as { mainEntity: { name: string; acceptedAnswer: { text: string } }[] }).mainEntity
      expect(items.length).toBeGreaterThanOrEqual(3)
      for (const q of items) {
        expect(q.name.length).toBeGreaterThan(5)
        expect(q.acceptedAnswer.text.length).toBeGreaterThan(20)
      }
    })

    test("لا وعود مستقبلية في نص الصفحة (نظام الصدق)", async ({ page }) => {
      await page.goto(p.path, { waitUntil: "domcontentloaded" })
      const text = await page.locator("main").textContent()
      /* عائلة truth-gate (P14-P0B + W6-B2) على السطح المُصيَّر — المصدر
         يمشي src/ كله؛ هذا الدبوس يحرس الإخراج نفسه. */
      expect(text).not.toMatch(/خدمات\s*قادمة/)
      expect(text).not.toMatch(/حلول\s*قادمة/)
      expect(text).not.toMatch(/قريباً[^\n]{0,40}باقات\s*مدفوعة/)
      expect(text).not.toMatch(/باقات\s*مدفوعة[^\n]{0,40}قريباً/)
    })
  })
}

test.describe("P45-W1 — سطح الاكتشاف: بطاقات العوالم تصل لصفحات المنتجات", () => {
  test("/ — كل بطاقة عالم تحمل «اعرف المزيد» لصفحة المنتج + الفعل الخارجي الأساسي بلا تغيير", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" })
    const worlds = page.locator("#products")

    /* الرابط الثانوي الداخلي: ثلاثة، واحد لكل عالم، بالنص الكنوي. */
    const more = worlds.locator("a.ln-world-more")
    await expect(more).toHaveCount(3)
    const hrefs = await more.evaluateAll((els) =>
      els.map((e) => (e as HTMLAnchorElement).getAttribute("href"))
    )
    expect(hrefs).toEqual(["/menu", "/bot", "/order"])
    for (const el of await more.all()) {
      await expect(el).toContainText("اعرف المزيد")
    }

    /* الفعل الأساسي الخارجي لم يُمس (عقد P40-5a SL-3 e2e-pinned):
       «شاهد المنيو الحي» → جذر المنتج الحي بـ target/rel. */
    const primary = worlds.locator("a.ln-world-cta").first()
    await expect(primary).toHaveAttribute("href", "https://menu.smart-link.ly")
    await expect(primary).toHaveAttribute("target", "_blank")
    await expect(primary).toHaveAttribute("rel", "noopener noreferrer")
    await expect(primary).toHaveAccessibleName("شاهد المنيو الحي — Smart Menu، رابط خارجي")
  })
})
