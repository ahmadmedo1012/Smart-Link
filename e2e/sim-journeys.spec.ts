import { test, expect, allowResourceNoise } from "./fixtures"

/**
 * r11-B1 — محاكاة رحلات المستخدم الحقيقية (user-journey simulation)
 *
 * المنهجية (gstack qa-patterns): نختبر كمستخدم لا كمطوّر —
 *   - محددات مُدرَكة فقط: getByRole / getByLabel / getByText / getByAltText / page.title() / URL
 *   - كل النصوص المفترضة اتّت من probe حي لـ document.body.innerText (لا قراءة src/**)
 *   - أخطاء console تُجمع تلقائياً عبر fixtures.ts وتُفحص في نهاية كل رحلة
 *
 * الملاحظات المكتشفة بالعين (source of truth من الـ probes):
 *   - nav الرئيسي (banner): الرئيسية(/) · خدماتنا (dropdown hover) · الأسعار(/pricing) · عن SmartLink(/about) · تواصل معنا(/contact)
 *   - الفوتر (contentinfo) يضيف: الخطط والأسعار · سياسة الخصوصية(/privacy) · شروط الاستخدام(/terms)
 *   - مفتاح المظهر: aria-label «تفعيل المظهر الفاتح» (حالة dark) ↔ «تفعيل المظهر الداكن» (حالة light)
 *   - زر العودة للأعلى: aria-label «العودة للأعلى»
 *   - نجاح النموذج: يعرض الخادم message — عقد النجاح الحقيقي
 *     { success: true, message: "تم استلام رسالتك بنجاح. سنتواصل معك قريباً." } (كما في contact-success.spec)
 */

/* ────────────────────────────────────────────────────────────────
 * ج1 — «زائر أول مرة»: هبوط ← h1 ← تمرير للفوتر ← جولة عبر كل روابط الـ nav
 * ──────────────────────────────────────────────────────────────── */
test("ج1 «زائر أول مرة»: الهبوط + الفوتر + كل صفحات الـ nav الرئيسي", async ({ page, consoleErrors }) => {
  await page.goto("/")

  // h1 ظاهر فور الهبوط (r12: مهلة كريمة 15s — رحلات المستخدم تُقاس
  // بالتجربة لا بالميلي ثانية، والجهاز المشترك يرتفع ضغطه إلى 7+)
  const h1 = page.locator("h1").first()
  await expect(h1).toBeVisible({ timeout: 15_000 })
  await expect(h1).toContainText("SmartLink")

  // تمرير حتى أسفل الصفحة → الفوتر (contentinfo) ظاهر
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  const footer = page.getByRole("contentinfo")
  await expect(footer).toBeVisible({ timeout: 15_000 })
  await expect(footer).toContainText("جميع الحقوق محفوظة")

  // جولة عبر كل رابط في nav الرئيسي (ما يراه الزائر في الترويسة)
  const navPages = [
    { name: "الرئيسية", url: "/", h1: /SmartLink/ },
    { name: "الأسعار", url: "/pricing", h1: /الخطط والأسعار/ },
    { name: "عن SmartLink", url: "/about", h1: /عن SmartLink/ },
    { name: "تواصل معنا", url: "/contact", h1: /تواصل معنا/ },
  ] as const
  const titles: string[] = []

  for (const nav of navPages) {
    await page.getByRole("banner").getByRole("link", { name: nav.name, exact: true }).click()
    await page.waitForURL(`**${nav.url}`)
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 15_000 })
    await expect(page.locator("h1").first()).toContainText(nav.h1)
    titles.push(await page.title())
  }

  // كل عنوان صفحة فريد
  expect(new Set(titles).size).toBe(navPages.length)

  await expect(consoleErrors, consoleErrors.join("\n")).toEqual([])
})

/* ────────────────────────────────────────────────────────────────
 * ج2 — «عميل مهتم»: الأسعار ← FAQ ← نموذج التواصل (نجاح) ← عودة للرئيسية
 * ──────────────────────────────────────────────────────────────── */
test("ج2 «عميل مهتم»: الأسعار + FAQ + إرسال النموذج (mocked 200) + العودة", async ({ page, consoleErrors }) => {
  await page.goto("/")

  // يذهب من الرئيسية إلى الأسعار عبر الـ nav
  await page.getByRole("banner").getByRole("link", { name: "الأسعار", exact: true }).click()
  await page.waitForURL("**/pricing")
  await expect(page.locator("h1").first()).toContainText("الخطط والأسعار")

  // الخطط ظاهرة: منتجان + مجانية
  await expect(page.getByText("Smart Menu").first()).toBeVisible()
  await expect(page.getByText("SmartBot").first()).toBeVisible()
  await expect(page.getByText("مجاني").first()).toBeVisible()

  // يفتح سؤالاً من أسئلة الأسعار الشائعة (accordion)
  const q = page.getByRole("button", { name: "ما الفرق بين الخطة المجانية والمدفوعة؟" })
  const answer = page.getByText("الخطة المجانية توفر الميزات الأساسية")
  await expect(q).toHaveAttribute("aria-expanded", "false")
  await q.click()
  await expect(q).toHaveAttribute("aria-expanded", "true")
  // الجواب صار بجوار السؤال (نفس منطقة الأسئلة) وظاهراً
  await expect(answer).toBeVisible()
  const qBox = await q.boundingBox()
  const aBox = await answer.boundingBox()
  expect(qBox && aBox && aBox.y - (qBox.y + qBox.height)).toBeLessThan(80)

  // ينتقل إلى التواصل عبر الـ nav
  await page.getByRole("banner").getByRole("link", { name: "تواصل معنا", exact: true }).click()
  await page.waitForURL("**/contact")
  await expect(page.locator("h1").first()).toContainText("تواصل معنا")

  // مستخدم ليبي واقعي — محاكاة نجاح الخادم (كما لو خدمة البريد تعمل):
  // عقد النجاح الحقيقي { success, message }
  await page.route("**/api/contact", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        message: "تم استلام رسالتك بنجاح. سنتواصل معك قريباً.",
      }),
    })
  )
  await page.getByLabel("الاسم", { exact: true }).fill("أحمد المهدي")
  await page.getByLabel("البريد الإلكتروني").fill("ahmed@example.ly")
  await page.getByLabel("الموضوع").selectOption({ label: "استفسار عن Smart Menu" })
  await page
    .getByLabel("الرسالة")
    .fill("السلام عليكم، أرغب في تفعيل Smart Menu لمطعمي في طرابلس. كم عدد الأقسام المسموح بها في الخطة المجانية؟")

  await page.getByRole("button", { name: "إرسال الرسالة" }).click()

  // تأكيد نجاح عربي واضح + الزر يعرض حالة الإرسال
  await expect(page.getByText("تم استلام رسالتك بنجاح. سنتواصل معك قريباً.")).toBeVisible()
  await expect(page.getByText("تم الإرسال ✓")).toBeVisible()

  // يعود إلى الرئيسية — الموقع ما زال يعمل
  await page.getByRole("banner").getByRole("link", { name: "الرئيسية", exact: true }).click()
  await page.waitForURL("**/")
  await expect(page.locator("h1").first()).toContainText("SmartLink")

  await expect(consoleErrors, consoleErrors.join("\n")).toEqual([])
})

/* ────────────────────────────────────────────────────────────────
 * ج3 — «روابط مباشرة»: دخول مباشر لكل URL ظهر في الـ nav/الفوتر
 * ──────────────────────────────────────────────────────────────── */
test("ج3 «روابط مباشرة»: كل الصفحات الست عبر goto مباشر", async ({ page, consoleErrors }) => {
  const pages = [
    { url: "/", h1: /SmartLink/, content: "Smart Menu" },
    { url: "/about", h1: /عن SmartLink/, content: "SmartLink" },
    { url: "/pricing", h1: /الخطط والأسعار/, content: "مجاني" },
    { url: "/contact", h1: /تواصل معنا/, content: "إرسال الرسالة" },
    { url: "/privacy", h1: /سياسة الخصوصية/, content: "SmartLink" },
    { url: "/terms", h1: /شروط الاستخدام/, content: "SmartLink" },
  ] as const

  for (const p of pages) {
    await page.goto(p.url)
    await expect(page.locator("h1").first()).toBeVisible()
    await expect(page.locator("h1").first()).toContainText(p.h1)
    // محتوى ذو معنى (وليست صفحة فارغة)
    await expect(page.getByText(p.content, { exact: false }).first()).toBeVisible()
    const mainLen = await page.evaluate(() => document.querySelector("main")?.innerText.length ?? 0)
    expect(mainLen).toBeGreaterThan(300)
  }

  await expect(consoleErrors, consoleErrors.join("\n")).toEqual([])
})

/* ────────────────────────────────────────────────────────────────
 * ج4 — «زر الرجوع/التقدم»: الرئيسية ← عن ← الأسعار ثم back×2 + forward
 * ──────────────────────────────────────────────────────────────── */
test("ج4 «زر الرجوع/التقدم»: التاريخ يعمل بالاتجاهين", async ({ page, consoleErrors }) => {
  await page.goto("/")
  await expect(page.locator("h1").first()).toContainText("SmartLink")

  // الرئيسية → عن SmartLink → الأسعار (تنقّل مستخدم حقيقي بالنقر)
  await page.getByRole("banner").getByRole("link", { name: "عن SmartLink", exact: true }).click()
  await page.waitForURL("**/about")
  await expect(page.locator("h1").first()).toContainText("عن SmartLink")
  await page.getByRole("banner").getByRole("link", { name: "الأسعار", exact: true }).click()
  await page.waitForURL("**/pricing")
  await expect(page.locator("h1").first()).toContainText("الخطط والأسعار")

  // رجوع ← عن SmartLink
  await page.goBack()
  await page.waitForURL("**/about")
  await expect(page.locator("h1").first()).toContainText("عن SmartLink")

  // رجوع ← الرئيسية
  await page.goBack()
  await page.waitForURL("**/")
  await expect(page.locator("h1").first()).toContainText("SmartLink")

  // تقدم ← عن SmartLink
  await page.goForward()
  await page.waitForURL("**/about")
  await expect(page.locator("h1").first()).toContainText("عن SmartLink")

  await expect(consoleErrors, consoleErrors.join("\n")).toEqual([])
})

/* ────────────────────────────────────────────────────────────────
 * ج5 — «تبديل المظهر»: زر المظهر ← light ← persists ← رجوع dark
 * ──────────────────────────────────────────────────────────────── */
test("ج5 «تبديل المظهر»: التبديل + الاستمرارية عبر الصفحات", async ({ page, consoleErrors }) => {
  await page.goto("/")

  // الوضع الافتراضي: dark على <html>
  const htmlClass = () => page.evaluate(() => document.documentElement.className)
  expect(await htmlClass()).toContain("dark")

  // زر المظهر باسمه المتاح للمستخدم: «تفعيل المظهر الفاتح»
  await page.getByRole("button", { name: "تفعيل المظهر الفاتح" }).click()
  await expect.poll(htmlClass).toContain("light")
  expect(await htmlClass()).not.toContain("dark")

  // الانتقال لصفحة أخرى → المظهر مستمر
  await page.goto("/pricing")
  await expect(page.locator("h1").first()).toContainText("الخطط والأسعار")
  expect(await htmlClass()).toContain("light")

  // زر التبديل غيّر اسمه ليعكس الحالة الجديدة
  await page.getByRole("button", { name: "تفعيل المظهر الداكن" }).click()
  await expect.poll(htmlClass).toContain("dark")
  expect(await htmlClass()).not.toContain("light")

  await expect(consoleErrors, consoleErrors.join("\n")).toEqual([])
})

/* ────────────────────────────────────────────────────────────────
 * ج6 — «رابط ميت»: 404 عربي + طريق عودة للرئيسية
 * ──────────────────────────────────────────────────────────────── */
test("ج6 «رابط ميت»: صفحة 404 عربية + العودة للرئيسية", async ({ page, consoleErrors }) => {
  /* r11 (F-G8): وثيقة ميتة مقصودة. */
  allowResourceNoise(consoleErrors, /Failed to load resource.*404/)
  await page.goto("/r11-dead-link-test")

  // رسالة «غير موجودة» عربية واضحة + اعتذار
  await expect(page.getByText("الصفحة غير موجودة")).toBeVisible()
  await expect(page.getByText("عذراً، الصفحة التي تبحث عنها غير متوفرة أو تم نقلها.")).toBeVisible()

  // طريق العودة للرئيسية ثم فتحها
  const backHome = page.getByRole("link", { name: "العودة للرئيسية" })
  await expect(backHome).toBeVisible()
  await backHome.click()
  await page.waitForURL("**/")
  await expect(page.locator("h1").first()).toContainText("SmartLink")

  // فحص console: رسالة المتصفح «Failed to load resource: 404» متوقَّعة
  // حتماً لرابط ميت (فشل تحميل الوثيقة نفسها — سلوك المتصفح لا خطأ الموقع)،
  // فنستثنيها ونطلب صفر أخطاء JS حقيقية فوقها.
  const siteErrors = consoleErrors.filter((e) => !/Failed to load resource.*404/i.test(e))
  await expect(siteErrors, siteErrors.join("\n")).toEqual([])
})

/* ────────────────────────────────────────────────────────────────
 * ج7 — «سفينة سليمة»: كل صفحة dir=rtl + lang=ar + viewport meta
 * ──────────────────────────────────────────────────────────────── */
test("ج7 «سفينة سليمة»: RTL + lang=ar + viewport على كل الصفحات (ومنها 404)", async ({ page, consoleErrors }) => {
  /* r11 (F-G8): القائمة تشمل رابطاً ميتاً عمداً. */
  allowResourceNoise(consoleErrors, /Failed to load resource.*404/)
  const urls = ["/", "/about", "/pricing", "/contact", "/privacy", "/terms", "/r11-dead-link-test"]
  for (const url of urls) {
    await page.goto(url)
    const attrs = await page.evaluate(() => ({
      dir: document.documentElement.getAttribute("dir"),
      lang: document.documentElement.getAttribute("lang"),
      viewport: document.querySelector('meta[name="viewport"]')?.getAttribute("content"),
    }))
    expect(attrs.dir, `${url}: dir`).toBe("rtl")
    expect(attrs.lang, `${url}: lang`).toBe("ar")
    expect(attrs.viewport, `${url}: viewport meta`).toBeTruthy()
  }

  // نفس استثناء ج6: خطأ الشبكة المتوقع للرابط الميت فقط
  const siteErrors = consoleErrors.filter((e) => !/Failed to load resource.*404/i.test(e))
  await expect(siteErrors, siteErrors.join("\n")).toEqual([])
})

/* ────────────────────────────────────────────────────────────────
 * ج8 — «العودة للأعلى»: تمرير عميق ← زر يظهر ← نقرة ← القمة
 * ──────────────────────────────────────────────────────────────── */
test("ج8 «العودة للأعلى»: الزر يظهر بعد التمرير ويعيد للقمة", async ({ page, consoleErrors }) => {
  await page.goto("/")
  await expect(page.locator("h1").first()).toBeVisible()

  // تمرير عميق بعجلة الفأرة (كما يفعل مستخدم حقيقي)
  await page.mouse.wheel(0, 4000)
  await page.waitForFunction(() => window.scrollY > 1000, undefined, { timeout: 5000 })
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(1000)

  // زر «العودة للأعلى» يظهر — مهلة أطول: الزر جزيرة عميل تحتاج
  // ترطيباً + حدث تمرير، وتحت حمل 4 عمال متوازيين كان 5s متقطعاً.
  const toTop = page.getByRole("button", { name: "العودة للأعلى" })
  await expect(toTop).toBeVisible({ timeout: 12_000 })
  await toTop.click()

  // عاد للقمة
  await expect
    .poll(() => page.evaluate(() => window.scrollY), { timeout: 5000 })
    .toBe(0)

  await expect(consoleErrors, consoleErrors.join("\n")).toEqual([])
})

/* ────────────────────────────────────────────────────────────────
 * ج+ — «خدماتنا» في الترويسة: hover يعمل · لوحة المفاتيح لا (FINDING)
 * ──────────────────────────────────────────────────────────────── */
test("ج+ قائمة «خدماتنا»: تفتح بالماوس وتعرض رابطي الخدمتين", async ({ page, consoleErrors }) => {
  await page.goto("/")

  const servicesBtn = page.getByRole("button", { name: "خدماتنا" })
  await expect(servicesBtn).toHaveAttribute("aria-haspopup", "true")

  // الماوس فوق الزر → القائمة تنفتح (aria-expanded=true + روابط الخدمتين)
  const box = await servicesBtn.boundingBox()
  expect(box).toBeTruthy()
  await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2, { steps: 5 })
  await expect(servicesBtn).toHaveAttribute("aria-expanded", "true")
  await expect(page.getByRole("banner").getByRole("link", { name: /Smart Menu — المنيو الرقمي/ })).toBeVisible()
  await expect(page.getByRole("banner").getByRole("link", { name: /SmartBot — البوت الذكي/ })).toBeVisible()

  // ابتعد بالماوس أولاً — mouseleave يغلق القائمة (حالة نظيفة
  // لاختبار لوحة المفاتيح؛ الإفصاح يبدأ من مغلق).
  await page.mouse.move(8, 600)
  await expect(servicesBtn).toHaveAttribute("aria-expanded", "false")

  // r11: نمط disclosure — القائمة تفتح بلوحة المفاتيح (إصلاح B1-K1:
  // كان Enter/Space لا يفعلان شيئاً — انتهاك WCAG 2.1.1). الآن:
  // Enter يفتح، وEscape يغلق ويعيد التركيز للزر نفسه.
  await servicesBtn.focus()
  await page.keyboard.press("Enter")
  await expect(servicesBtn).toHaveAttribute("aria-expanded", "true")
  await expect(page.getByRole("banner").getByRole("link", { name: /Smart Menu — المنيو الرقمي/ })).toBeVisible()

  // التابع (Tab) من الزر يدخل روابط القائمة — القائمة لا تنهار
  // (كانت تُفكّ من DOM في منتصف انتقال التركيز — إصلاح B2 dead-stop)
  await page.keyboard.press("Tab")
  await expect(page.getByRole("banner").getByRole("link", { name: /Smart Menu — المنيو الرقمي/ })).toBeFocused()

  // Escape يغلق ويعيد التركيز للزر
  await page.keyboard.press("Escape")
  await expect(servicesBtn).toHaveAttribute("aria-expanded", "false")
  await expect(servicesBtn).toBeFocused()

  await expect(consoleErrors, consoleErrors.join("\n")).toEqual([])
})
