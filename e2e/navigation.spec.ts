import { test, expect } from "./fixtures"
import { hydrationGate, MOBILE_VIEWPORT } from "./helpers"

/**
 * السلوكيات التفاعلية — القائمة الجوالة، Escape، القائمة المنسدلة،
 * مبدّل المظهر، واختبار انحدار زر «العودة للأعلى» (خلل r7 المؤكد بالدليل).
 *
 * r133 (A7 §1 re-base): r128 نقل كروم المنتج (القائمة المنسدلة/المبدّل/
 * العودة للأعلى/شريط التقدم CSS) من الرئيسية إلى الصفحات الداخلية —
 * الرئيسية لها كرومها الكنسي الخاص (LandingHeader: شريط --p إلزامي +
 * مِغامينو «المنصّة»). اختبارات كروم المنتج تستهدف /about (صفحة حقيقية
 * بكروم كامل)، واختبارات كروم ال landing تقيس أجهزته الفعلية.
 */
test.describe("التنقل — سطح المكتب (كروم المنتج على /about)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/about", { waitUntil: "networkidle" })
  })

  test("قائمة «خدماتنا» المنسدلة — تفتح بالتمرير وتغلق بـ Escape", async ({ page }) => {
    const trigger = page.getByRole("button", { name: /خدماتنا/ })
    /* r10: تحت حمل 4 عمال متوازيين قد يقع hover قبل اكتمال ترطيب React —
       مستمعات mouseenter غير موجودة بعد والقائمة لا تفتح (فشل متقطع
       حقيقي ظهر مع توسيع الجناح). بوابة الترطيب المشتركة (r13). */
    await hydrationGate(page)
    await trigger.hover()
    const menu = page.locator("nav[aria-label='التنقل الرئيسي'] >> text=Smart Menu — المنيو الرقمي")
    await expect(menu.first()).toBeVisible()
    await expect(trigger).toHaveAttribute("aria-expanded", "true")

    // روابط خارجية آمنة
    const link = page.locator('nav[aria-label="التنقل الرئيسي"] a[href="https://menu.smart-link.ly"]')
    await expect(link).toHaveAttribute("target", "_blank")
    await expect(link).toHaveAttribute("rel", "noopener noreferrer")

    // Escape يغلق
    await page.keyboard.press("Escape")
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
    await expect(menu.first()).toBeHidden()
  })

  test("مبدّل المظهر — داكن ← فاتح ← ثابت بعد إعادة التحميل", async ({ page }) => {
    // الافتراضي داكن
    await expect(page.locator("html")).toHaveClass(/dark/)

    const toggle = page.getByRole("button", { name: "تفعيل المظهر الفاتح" })
    await toggle.click()
    await expect(page.locator("html")).toHaveClass(/light/)
    await expect(page.getByRole("button", { name: "تفعيل المظهر الداكن" })).toBeVisible()

    // الاختيار يبقى بعد إعادة التحميل (next-themes localStorage)
    await page.reload({ waitUntil: "networkidle" })
    await expect(page.locator("html")).toHaveClass(/light/)
  })

  test("زر «العودة للأعلى» — مخفي أعلى الصفحة، ظاهر بعد التمرير (انحدار r7)", async ({ page }) => {
    const btn = page.locator('button[aria-label="العودة للأعلى"]')

    // أعلى الصفحة: مخفي بصرياً + خارج شجرة a11y + خارج ترتيب Tab
    await expect(btn).toHaveClass(/opacity-0/)
    expect(await btn.getAttribute("aria-hidden")).toBe("true")
    expect(await btn.getAttribute("tabindex")).toBe("-1")

    // بعد التمرير: ظاهر + داخل a11y + قابل للتركيز
    await page.evaluate(() => window.scrollTo(0, 900))
    await expect(btn).toHaveClass(/opacity-100/, { timeout: 5000 })
    expect(await btn.getAttribute("aria-hidden")).toBeNull()
    expect(await btn.getAttribute("tabindex")).toBe("0")

    // النقر يمرّر لأعلى الصفحة (تمرير سلس — poll)
    await btn.click()
    await expect
      .poll(async () => page.evaluate(() => window.scrollY), { timeout: 5000 })
      .toBeLessThan(60)

    // عاد ليختفي أعلى الصفحة
    await expect(btn).toHaveClass(/opacity-0/)
  })

  test("شريط تقدم التمرير يتقدّم مع التمرير", async ({ page }) => {
    const bar = page.locator(".scroll-progress")
    const scaleX = () => bar.evaluate((el) => getComputedStyle(el).transform)
    // CSS transform مصفوفة؛ القيمة الأخيرة scaleX
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2))
    await page.waitForTimeout(400)
    const mid = await scaleX()
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(400)
    const full = await scaleX()
    expect(mid).not.toBe(full)
  })
})

/* r133 (A7 §1): شريط تقدم الرئيسية — جهاز ال landing الخاص: الشريط
   الإلزامي `--p` (LandingHeader يكتب قيمة واحدة لكل إطار rAF عبر
   مستمع تمرير خامل — صفر setState). العقد: القيمة تتقدم مع التمرير
   وتصل 1 عند القاع (نفس عقد المنتج بصيغة الجهاز الفعلية). */
test("الرئيسية — شريط --p الإلزامي يتقدم مع التمرير (LandingHeader)", async ({ page }) => {
  await page.goto("/", { waitUntil: "load" })
  await hydrationGate(page)
  const readP = () =>
    page.locator(".landing-progress-bar").evaluate((el) =>
      parseFloat(getComputedStyle(el).getPropertyValue("--p"))
    )
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2))
  await page.waitForTimeout(400)
  const mid = await readP()
  expect(mid).toBeGreaterThan(0.05)
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(400)
  const full = await readP()
  expect(full).toBeGreaterThan(mid)
  expect(Math.abs(full - 1)).toBeLessThan(0.01)
})

/* r133 (A7 §1 re-base): قائمة الجوال على السطحين — الرئيسية لها
   درج ال landing الكنسي (لوحة داخل هيدر sticky: تنقل بالروابط،
   إغلاق بالنقر على أي رابط — عقلية Madarek الأصلية، لا قفل جسد
   لأن اللوحة ليست overlay ملء الشاشة)، وصفحات المنتج تملك العقد
   الكامل (قفل الجسد + Escape + التركيز).
   r134 (R134-W1-SL P2): درج الرئيسية يملك الآن عقد Escape نفسه —
   يغلق ويعيد التركيز لزر البرجر (نمط MainNav). */
test.describe("التنقل — الجوال: درج ال landing (الرئيسية)", () => {
  test.use({ viewport: MOBILE_VIEWPORT })

  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" })
    await hydrationGate(page)
  })

  test("درج الرئيسية — فتح/إغلاق بالبرجر + روابط الرحلة الحقيقية", async ({ page }) => {
    const burger = page.getByRole("button", { name: /فتح القائمة|إغلاق القائمة/ })
    await burger.click()

    const mobileNav = page.locator('nav[aria-label="قائمة الجوال"]')
    await expect(mobileNav).toBeVisible()
    await expect(burger).toHaveAttribute("aria-expanded", "true")

    // روابط الدرج الكنسية: مراسي الرحلة + /contact + الرابط الخارجي
    for (const href of ["#products", "#journey", "/contact"]) {
      await expect(mobileNav.locator(`a[href="${href}"]`), `رابط ${href}`).toBeVisible()
    }
    const external = mobileNav.locator('a[href="https://menu.smart-link.ly"]')
    await expect(external).toHaveAttribute("target", "_blank")
    await expect(external).toHaveAttribute("rel", "noopener noreferrer")

    // الإغلاق بالنقر على البرجر مجدداً
    await burger.click()
    await expect(mobileNav).toBeHidden()
    await expect(burger).toHaveAttribute("aria-expanded", "false")
  })

  test("درج الرئيسية — رابط داخلي يغلقها وينتقل", async ({ page }) => {
    await page.getByRole("button", { name: /فتح القائمة|إغلاق القائمة/ }).click()
    await page.locator('nav[aria-label="قائمة الجوال"] a[href="/contact"]').click()
    await expect(page).toHaveURL(/\/contact$/)
    await expect(page.locator('nav[aria-label="قائمة الجوال"]')).toBeHidden()
  })

  test("رابط تخطّي المحتوى في الرئيسية — ln-skip-link (#main)", async ({ page }) => {
    await page.keyboard.press("Tab") // أول Tab = رابط التخطي الكنسي
    const skip = page.locator('a[href="#main"]')
    await expect(skip).toBeFocused()
    await expect(skip).toBeVisible()
  })

  test("r134 — درج الرئيسية: Escape يغلقها ويعيد التركيز للبرجر", async ({ page }) => {
    /* r134 (R134-W1-SL P2): الدرج كان الوحيد في الأسطول بلا Escape —
       الآن يحمل عقد MainNav (main-nav.tsx:392-398): إغلاق + عودة
       التركيز لزر البرجر. التركيز يجب أن يكون داخل الدرج أولاً —
       المعالج على عنصر nav (لا يوجد مستمع نافذة هنا). */
    const burger = page.getByRole("button", { name: /فتح القائمة|إغلاق القائمة/ })
    await burger.click()
    const mobileNav = page.locator('nav[aria-label="قائمة الجوال"]')
    await expect(mobileNav).toBeVisible()

    await mobileNav.locator('a[href="/contact"]').focus()
    await page.keyboard.press("Escape")
    await expect(mobileNav).toBeHidden()
    await expect(burger).toBeFocused()
  })
})

test.describe("التنقل — الجوال: قائمة المنتج (عقد r5/r13 الكامل على /about)", () => {
  test.use({ viewport: MOBILE_VIEWPORT })

  test.beforeEach(async ({ page }) => {
    await page.goto("/about", { waitUntil: "networkidle" })
    await hydrationGate(page)
  })

  test("القائمة الجوالة — فتح/قفل تمرير/إغلاق بـ Escape", async ({ page }) => {
    // زر البرجر يغيّر اسمه بعد الفتح (فتح → إغلاق) — نمط يطابق الحالتين
    const burger = page.getByRole("button", { name: /فتح القائمة|إغلاق القائمة/ })
    await burger.click()

    const mobileNav = page.locator('nav[aria-label="قائمة الجوال"]')
    await expect(mobileNav).toBeVisible()
    await expect(burger).toHaveAttribute("aria-expanded", "true")

    // قفل تمرير الجسد (r5)
    await expect
      .poll(async () => page.evaluate(() => document.body.style.overflow))
      .toBe("hidden")

    // Escape يغلق ويعيد التمرير
    await page.keyboard.press("Escape")
    await expect(mobileNav).toBeHidden()
    await expect
      .poll(async () => page.evaluate(() => document.body.style.overflow))
      .toBe("")
  })

  test("القائمة الجوالة — الروابط الداخلية تغلقها وتتنقل", async ({ page }) => {
    await page.getByRole("button", { name: /فتح القائمة|إغلاق القائمة/ }).click()
    await page.locator('nav[aria-label="قائمة الجوال"] a[href="/pricing"]').click()
    await expect(page).toHaveURL(/\/pricing$/)
    await expect(page.locator('nav[aria-label="قائمة الجوال"]')).toBeHidden()
  })

  test("القائمة الجوالة — خدمة فرعية بأكورديون صحيح", async ({ page }) => {
    await page.getByRole("button", { name: /فتح القائمة|إغلاق القائمة/ }).click()
    const servicesBtn = page.locator('nav[aria-label="قائمة الجوال"] button', { hasText: "خدماتنا" })
    await servicesBtn.click()
    await expect(servicesBtn).toHaveAttribute("aria-expanded", "true")
    const menuLink = page.locator('nav[aria-label="قائمة الجوال"] a[href="https://menu.smart-link.ly"]')
    await expect(menuLink).toBeVisible()
    await expect(menuLink).toHaveAttribute("target", "_blank")
    await expect(menuLink).toHaveAttribute("rel", "noopener noreferrer")
  })

  test("رابط تخطّي المحتوى يظهر عند التركيز (الكروم العام #main-content)", async ({ page }) => {
    await page.keyboard.press("Tab") // أول Tab = رابط التخطي
    const skip = page.locator('a[href="#main-content"]')
    await expect(skip).toBeFocused()
    await expect(skip).toBeVisible()
  })
})

/* ══════════════════════════════════════════════════════════════
 * r13 (testing audit F-P2) — حد الإطار 768px
 *
 * نقطة التبديل (md: 768px) بين سطح المكتب والجوال لم تُختبر قط:
 * انزياح الحد (xs: أو نقطة مختلفة) كان سيقلب تجربة فئة كاملة دون
 * أن يلاحظ CI. البرغر يظهر تحت الحد بالضبط ويختفي عنده.
 * ══════════════════════════════════════════════════════════════ */
test("r13 — حد 767/768 على صفحات المنتج: البرغر يظهر تحته ويختفي فوقه (نقطة md)", async ({ page }) => {
  await page.setViewportSize({ width: 767, height: 812 })
  await page.goto("/about")
  await expect(page.getByRole("button", { name: /فتح القائمة|إغلاق القائمة/ })).toBeVisible()
  // التنقل السطحي مخفي تحته
  await expect(page.getByRole("navigation", { name: "التنقل الرئيسي" })).toBeHidden()

  await page.setViewportSize({ width: 768, height: 812 })
  await expect(page.getByRole("button", { name: /فتح القائمة|إغلاق القائمة/ })).toBeHidden()
  await expect(page.getByRole("navigation", { name: "التنقل الرئيسي" })).toBeVisible()
})

/* r133 (A7 §1): حد ال landing الخاص — 1080px (r129 P0-10 الكنسي؛
   كان 1024). نطاق 1025–1080 كله يطوى في الدرج مثل الهيدر الكنسي. */
test("r133 — حد 1080/1081 على الرئيسية: درج ال landing (نقطة r129 الكنسية)", async ({ page }) => {
  await page.setViewportSize({ width: 1080, height: 812 })
  await page.goto("/")
  await expect(page.getByRole("button", { name: /فتح القائمة|إغلاق القائمة/ })).toBeVisible()
  await expect(page.getByRole("navigation", { name: "أقسام الرحلة" })).toBeHidden()

  await page.setViewportSize({ width: 1081, height: 812 })
  await expect(page.getByRole("button", { name: /فتح القائمة|إغلاق القائمة/ })).toBeHidden()
  await expect(page.getByRole("navigation", { name: "أقسام الرحلة" })).toBeVisible()
})

/* r14 (M5-F2/M6-F5): القائمة داخل هيدر fixed — أي رابط تحت حافة الشاشة
 * مستحيل الوصول (تمرير الصفحة لا يحرك الهيدر). قبل إصلاح r14: قاع
 * القائمة+الفرعية 430px في landscape 375 → «تواصل معنا» و«الأسعار»
 * خارج الشاشة (قياس r14-findings/m5 §menu-height). بعد الإصلاح
 * (max-h + overflow-y-auto): القائمة تتمرر داخلياً — العقد: كل رابط
 * يمكن إحضاره داخل الشاشة والنقر عليه. */
test("r14 — landscape: كل روابط القائمة (والفرعية) قابلة للوصول فعلاً (كروم المنتج على /about)", async ({ page }) => {
  await page.setViewportSize({ width: 667, height: 375 })
  await page.goto("/about", { waitUntil: "load" })
  await hydrationGate(page)
  await page.getByRole("button", { name: /فتح القائمة|إغلاق القائمة/ }).click()
  const mobileNav = page.locator('nav[aria-label="قائمة الجوال"]')
  await expect(mobileNav).toBeVisible()
  // افتح القائمة الفرعية (أسوأ حالة ارتفاع — قياس M5: 430px قبل الإصلاح)
  await mobileNav.locator("button", { hasText: "خدماتنا" }).click()
  await expect(
    mobileNav.locator('a[href="https://menu.smart-link.ly"]')
  ).toBeVisible()

  // العقد: كل رابط يمكن إحضاره داخل إطار العرض (تمريراً داخلياً بعد
  // الإصلاح) ثم النقر ينجح — قبل الإصلاح العنصر داخل هيدر fixed مقصوص
  // بلا تمرير داخلي → scrollIntoViewIfNeeded تنهر والاختبار أحمر.
  const contact = mobileNav.locator('a[href="/contact"]')
  await contact.scrollIntoViewIfNeeded({ timeout: 4000 })
  await contact.click()
  await expect(page).toHaveURL(/\/contact$/)
  await expect(mobileNav).toBeHidden()
})

/* r133 (A7 §1): نفس عقد الوصول في landscape على درج الرئيسية —
   اللوحة داخل هيدر sticky؛ عقد ال landing: كل روابط الدرج قابلة
   للإحضار داخل الشاشة والنقر ينجح (لا تحتاج القفل الفرعي). */
test("r133 — landscape: روابط درج الرئيسية قابلة للوصول فعلاً", async ({ page }) => {
  await page.setViewportSize({ width: 667, height: 375 })
  await page.goto("/", { waitUntil: "load" })
  await hydrationGate(page)
  await page.getByRole("button", { name: /فتح القائمة|إغلاق القائمة/ }).click()
  const mobileNav = page.locator('nav[aria-label="قائمة الجوال"]')
  await expect(mobileNav).toBeVisible()
  const contact = mobileNav.locator('a[href="/contact"]')
  await contact.scrollIntoViewIfNeeded({ timeout: 4000 })
  await contact.click()
  await expect(page).toHaveURL(/\/contact$/)
  await expect(mobileNav).toBeHidden()
})
