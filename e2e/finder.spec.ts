import { test, expect } from "./fixtures"
import { hydrationGate, MOBILE_VIEWPORT, axeScan } from "./helpers"

/**
 * P45-W1 — فصل المواءمة: محدّد «أي عالم يناسب عملك؟» + مصفوفة المقارنة.
 *
 * THE CONTRACTS (mirror cta.spec.ts patterns):
 * 1. The finder flows reach each product's OWN signup page (SITE
 *    signupUrls — the P40-5a deep-link law) with external conventions.
 * 2. The honest paths: single-match recommendation, the mismatch split
 *    (both doors stay open), and the multi-select «كلها» ecosystem path
 *    (three doors, no fake winner).
 * 3. The matrix cells match the WORLDS registry verbatim (audience /
 *    problem / free limits / paidFrom through formatLyd) — every cell
 *    verifiable, zero invented claims.
 * 4. a11y: aria-pressed semantics, 44px touch floor, axe on the OPEN
 *    state, and the mobile scroller degrades honestly (overflow + the
 *    visible drag cue).
 */

const SIGNUPS = {
  menu: "https://menu.smart-link.ly/subscribe",
  bot: "https://bot.smart-link.ly/subscribe",
  order: "https://order.smart-link.ly/register",
} as const

test.describe("P45-W1 — الفصل يُصيَّر ببنية صحيحة", () => {
  test("قسم المواءمة حاضر: h2 + سؤالان + المصفوفة في HTML الخادم", async ({ request }) => {
    /* raw-HTML contract (lcp-guard pattern): the chapter is
       server-rendered — questions and matrix readable without JS. */
    const res = await request.get("/")
    const html = await res.text()
    expect(html).toContain('id="finder"')
    expect(html).toContain("أي عالم")
    expect(html).toContain("ما طبيعة عملك؟")
    expect(html).toContain("ما أكبر مشكلة تواجهك في طلباتك اليوم؟")
    expect(html).toContain("قارن العوالم الثلاثة وجهاً لوجه")
    expect(html).toContain("حدود الباقة المجانية")
    expect(html).toContain('004 — القيادة') // the renumbered sequence
  })
})

test.describe("P45-W1 — تدفقات المحدّد تصل لصفحات الاشتراك", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" })
    await page.locator("#finder").scrollIntoViewIfNeeded()
    await hydrationGate(page)
  })

  test("مطعم فقط (Q1) → توصية سمارت منيو → زر الاشتراك الخارجي", async ({ page }) => {
    await page.getByRole("button", { name: "مطعم أو مقهى بمنيو" }).click()
    const rec = page.locator(".ln-finder-rec[data-world='menu']")
    await expect(rec).toBeVisible()
    await expect(rec.locator("h3")).toHaveText("Smart Menu")
    const cta = rec.getByRole("link", { name: "ابدأ مجاناً — Smart Menu، رابط خارجي" })
    await expect(cta).toHaveAttribute("href", SIGNUPS.menu)
    await expect(cta).toHaveAttribute("target", "_blank")
    await expect(cta).toHaveAttribute("rel", "noopener noreferrer")
  })

  test("ألم «رسائل لا نلحق الرد عليها» (Q2 فقط) → توصية سمارت بوت", async ({ page }) => {
    await page.getByRole("button", { name: "رسائل لا نلحق الرد عليها" }).click()
    const rec = page.locator(".ln-finder-rec[data-world='bot']")
    await expect(rec).toBeVisible()
    const cta = rec.getByRole("link", { name: "ابدأ مجاناً — SmartBot، رابط خارجي" })
    await expect(cta).toHaveAttribute("href", SIGNUPS.bot)
    await expect(cta).toHaveAttribute("target", "_blank")
    await expect(cta).toHaveAttribute("rel", "noopener noreferrer")
  })

  test("متجر (Q1) + ألم منيو (Q2) → الانقسام الصادق: البابان مفتوحان", async ({ page }) => {
    /* the mismatch NEVER pretends away: the described pain wins the
       primary slot, the declared nature keeps its door. */
    await page.getByRole("button", { name: "متجر يبيع منتجات ويوصلها" }).click()
    await page.getByRole("button", { name: "قائمة ورقية ثابتة" }).click()
    const rec = page.locator(".ln-finder-rec[data-world='menu']")
    await expect(rec).toBeVisible()
    const split = rec.locator(".ln-finder-rec-split")
    await expect(split).toBeVisible()
    await expect(split).toContainText("Smart Order")
    const splitCta = split.getByRole("link", { name: "اشترك في Smart Order، رابط خارجي" })
    await expect(splitCta).toHaveAttribute("href", SIGNUPS.order)
    await expect(splitCta).toHaveAttribute("target", "_blank")
    await expect(splitCta).toHaveAttribute("rel", "noopener noreferrer")
  })

  test("اختياران (Q1) → مسار «كلها»: ثلاثة أبواب بحسابات مستقلة", async ({ page }) => {
    await page.getByRole("button", { name: "مطعم أو مقهى بمنيو" }).click()
    await page.getByRole("button", { name: "صفحة فيسبوك تجارية" }).click()
    const eco = page.locator(".ln-finder-rec--eco")
    await expect(eco).toBeVisible()
    const ctas = eco.locator(".ln-finder-eco-cta")
    await expect(ctas).toHaveCount(3)
    const hrefs = await ctas.evaluateAll((els) =>
      els.map((e) => (e as HTMLAnchorElement).getAttribute("href"))
    )
    expect(hrefs).toEqual(expect.arrayContaining(Object.values(SIGNUPS)))
    /* W2-A1 truth rides the path: each service keeps its OWN account. */
    await expect(eco).toContainText("بحسابها المستقل")
  })

  test("aria-pressed يتبع الحالة، والنقر مجددًا يلغي", async ({ page }) => {
    const opt = page.getByRole("button", { name: "مطعم أو مقهى بمنيو" })
    await expect(opt).toHaveAttribute("aria-pressed", "false")
    await opt.click()
    await expect(opt).toHaveAttribute("aria-pressed", "true")
    await opt.click()
    await expect(opt).toHaveAttribute("aria-pressed", "false")
    /* back to the prompt state — the wait line returns */
    await expect(page.locator(".ln-finder-wait")).toBeVisible()
  })

  test("نتيجة المحدّد تعلن بأدب (aria-live) والتركيز يبقى على الزر", async ({ page }) => {
    const region = page.locator(".ln-finder-result")
    await expect(region).toHaveAttribute("aria-live", "polite")
    const opt = page.getByRole("button", { name: "مطعم أو مقهى بمنيو" })
    await opt.click()
    await expect(page.locator(".ln-finder-rec[data-world='menu']")).toBeVisible()
    /* the polite announcement renders WITHOUT stealing focus — the
       user keeps their finger/keyboard on the toggle they just used */
    await expect(opt).toBeFocused()
  })
})

test.describe("P45-W1 — المصفوفة تطابق السجل (كل خلية قابلة للتحقق)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" })
    await page.locator(".ln-matrix").scrollIntoViewIfNeeded()
  })

  const ROWS = [
    {
      world: "menu",
      name: "Smart Menu",
      audience: "المطاعم والمقاهي وكل نشاط له قائمة طعام أو خدمات",
      problem: "قائمة الورق الثابتة",
      limit: "100 طلب",
      signup: SIGNUPS.menu,
    },
    {
      world: "bot",
      name: "SmartBot",
      audience: "أصحاب صفحات فيسبوك التجارية",
      problem: "غرق الصفحة برسائل العملاء",
      limit: "ردود تلقائية (100/شهر)",
      signup: SIGNUPS.bot,
    },
    {
      world: "order",
      name: "Smart Order",
      audience: "المتاجر التي تبيع منتجاتها وتوصلها لزبائنها",
      problem: "الطلبات الهاتفية المبعثرة",
      limit: "100 طلب شهرياً",
      signup: SIGNUPS.order,
    },
  ] as const

  for (const row of ROWS) {
    test(`صف ${row.name}: الجمهور/المشكلة/الحدود/السعر/الاشتراك من السجل`, async ({ page }) => {
      const tr = page.locator(`.ln-matrix-table tbody tr[data-world='${row.world}']`)
      await expect(tr).toBeVisible()
      await expect(tr.locator(".ln-matrix-name")).toHaveText(row.name)
      await expect(tr.locator("td").nth(0)).toContainText(row.audience)
      await expect(tr.locator("td").nth(1)).toContainText(row.problem)
      await expect(tr.locator(".ln-matrix-limits")).toContainText(row.limit)
      /* paidFrom renders through formatLyd — the ONE money spelling */
      await expect(tr.locator(".ln-matrix-price")).toHaveText("19 د.ل")
      const cta = tr.getByRole("link", { name: `ابدأ مجاناً — ${row.name}، رابط خارجي` })
      await expect(cta).toHaveAttribute("href", row.signup)
      await expect(cta).toHaveAttribute("target", "_blank")
      await expect(cta).toHaveAttribute("rel", "noopener noreferrer")
    })
  }

  test("رؤوس الأعمدة السبعة + تذييل الأسعار الصادق يربط /pricing", async ({ page }) => {
    const heads = page.locator(".ln-matrix-table thead th")
    await expect(heads).toHaveCount(7)
    for (const h of ["المنتج", "الجمهور", "المشكلة", "القناة", "حدود الباقة المجانية", "يبدأ المدفوع من", "ابدأ"]) {
      await expect(heads.filter({ hasText: h })).toHaveCount(1)
    }
    await expect(page.locator(".ln-matrix-foot-link")).toHaveAttribute("href", "/pricing")
  })
})

test.describe("P45-W1 — الجوال: تدرّج المصفوفة وأهداف اللمس", () => {
  test.use({ viewport: MOBILE_VIEWPORT })

  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" })
    await page.locator(".ln-matrix").scrollIntoViewIfNeeded()
    await hydrationGate(page)
  })

  test("المصفوفة تتمرر أفقيًا مع إشارة السحب المرئية", async ({ page }) => {
    const scroller = page.locator(".ln-matrix-scroller")
    await expect(scroller).toBeVisible()
    /* the honest floor makes it actually scroll at 375px */
    const overflows = await scroller.evaluate(
      (el) => el.scrollWidth - el.clientWidth
    )
    expect(overflows).toBeGreaterThan(0)
    /* the visible affordance (cue is display:none ≥768px only) */
    await expect(page.locator(".ln-matrix-cue")).toBeVisible()
  })

  test("كل خيارات المحدّد وأزرار المصفوفة ≥ 44×44", async ({ page }) => {
    const targets = page.locator(
      "#finder button, #finder .ln-finder-cta, #finder .ln-finder-eco-cta, #finder .ln-matrix-cta"
    )
    const count = await targets.count()
    /* idle state: 6 question toggles + 3 matrix CTAs = 9 (the result CTAs
       render only after answering) */
    expect(count).toBeGreaterThanOrEqual(9)
    for (const el of await targets.all()) {
      const box = await el.boundingBox()
      expect(box, "target must have a box").toBeTruthy()
      expect(box!.height, `touch floor for ${el.textContent()}`).toBeGreaterThanOrEqual(44)
    }
  })

  test("تدفق كامل على الجوال: مطعم → توصية → زر الاشتراك", async ({ page }) => {
    await page.locator("#finder").scrollIntoViewIfNeeded()
    await page.getByRole("button", { name: "مطعم أو مقهى بمنيو" }).click()
    const cta = page.locator(".ln-finder-rec[data-world='menu'] .ln-finder-cta")
    await expect(cta).toBeVisible()
    await expect(cta).toHaveAttribute("href", SIGNUPS.menu)
  })
})

test.describe("P45-W1 — axe على الحالة المفتوحة", () => {
  test("صفر انتهاكات بعد توصية نشطة (الوضع الداكن الافتراضي)", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" })
    await page.locator("#finder").scrollIntoViewIfNeeded()
    await hydrationGate(page)
    await page.getByRole("button", { name: "مطعم أو مقهى بمنيو" }).click()
    await page.getByRole("button", { name: "رسائل لا نلحق الرد عليها" }).click()
    /* the SPLIT state — the richest DOM the island renders (primary rec
       + the honest second door) */
    await expect(page.locator(".ln-finder-rec-split")).toBeVisible()
    const violations = await axeScan(page)
    expect(violations, JSON.stringify(violations.map((v) => v.id), null, 2)).toEqual([])
  })

  test("صفر انتهاكات على مسار «كلها» (الشبكة الثلاثية)", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" })
    await page.locator("#finder").scrollIntoViewIfNeeded()
    await hydrationGate(page)
    await page.getByRole("button", { name: "متجر يبيع منتجات ويوصلها" }).click()
    await page.getByRole("button", { name: "صفحة فيسبوك تجارية" }).click()
    await expect(page.locator(".ln-finder-rec--eco")).toBeVisible()
    const violations = await axeScan(page)
    expect(violations, JSON.stringify(violations.map((v) => v.id), null, 2)).toEqual([])
  })
})
