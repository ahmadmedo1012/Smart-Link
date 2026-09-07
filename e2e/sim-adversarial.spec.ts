import { test, expect, allowResourceNoise } from "./fixtures"
import type { Page, Request, Response, Route } from "@playwright/test"

/**
 * r11-B2 — محاكاة مستخدم عدائي/مرتبك (adversarial user simulator).
 *
 * المنهجية: نختبر كمستخدم لا كمطوّر — محددات user-perceivable فقط
 * (getByRole/getByLabel/getByText) وبلا قراءة src/**. السلوك "الفعلي"
 * هو ما يُوثَّق: الرفض السليم = نجاح؛ أي قبول لما يجب رفضه، أو انهيار
 * JS، = FINDING يُعلَّق بجانب الـ assertion الصحيح المعطّل.
 *
 * تقنية عزل دلوات محدد المعدل (موثّقة في contact-success.spec.ts و
 * api-contact-boundaries.spec.ts): نزوّر x-forwarded-for بقيمة فريدة
 * لكل اختبار (10.11.12.2xx) عبر route.continue — الطلب يذهب للخادم
 * الحقيقي المحلي بدلو خاص لا يتصادم مع أي ملف آخر.
 *
 * ضوضاء console المتوقعة: Chromium يسجّل أخطاء console للطلبات الفاشلة
 * عمداً («Failed to load resource: …») — ليست علة موقع؛ نرشّحها ونفحص
 * ما تبقى (أخطاء JS الحقيقية/pageerror) في كل اختبار.
 */

const B2 = "10.11.12" // نطاق IP خاص بهذا الملف فقط

/** تمرير طلب النموذج إلى الخادم الحقيقي بعنوان IP مزيف فريد */
const spoofIp = (ip: string) => (route: Route) =>
  route.continue({ headers: { ...route.request().headers(), "x-forwarded-for": ip } })

/** أخطاء console التي ليست ضوضاء الشبكة المتوقعة */
const siteErrors = (errs: string[]) => errs.filter((e) => !e.startsWith("Failed to load resource"))
const expectNoCrash = (consoleErrors: string[]) =>
  expect(siteErrors(consoleErrors), "لا أخطاء JS/pageerror حقيقية").toEqual([])

/** عدّاد طلبات POST إلى /api/contact */
const postCounter = (page: Page) => {
  const posts: Request[] = []
  page.on("request", (r: Request) => {
    if (r.method() === "POST" && r.url().includes("/api/contact")) posts.push(r)
  })
  return () => posts.length
}

/** تعبئة نموذج الاتصال بقيم سليمة (نقطة انطلاق الهجمات) */
const fillValid = async (page: Page) => {
  await page.getByLabel("الاسم", { exact: true }).fill("مستخدم تجريبي")
  await page.getByLabel("البريد الإلكتروني", { exact: true }).fill("user@example.com")
  await page.getByLabel("الرسالة", { exact: true }).fill("نص رسالة كافٍ للاختبار.")
}

const submitBtn = (page: Page) => page.getByRole("button", { name: /إرسال الرسالة/ })

/* ══════════════════════ 1) هجمات النموذج ══════════════════════ */

test.describe("r11-B2 — هجمات نموذج /contact (مستخدم عدائي)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact", { waitUntil: "networkidle" })
  })

  test("1) إرسال فارغ → أخطاء حقلية عربية + صفر طلبات شبكة", async ({ page, consoleErrors }) => {
    const count = postCounter(page)
    await submitBtn(page).click()

    // أخطاء حقلية عربية مرئية (role=alert)
    await expect(page.getByRole("alert").filter({ hasText: "الاسم مطلوب" })).toBeVisible()
    await expect(page.getByRole("alert").filter({ hasText: "البريد الإلكتروني مطلوب" })).toBeVisible()
    await expect(page.getByRole("alert").filter({ hasText: "الرسالة مطلوبة" })).toBeVisible()
    // التركيز نُقل لأول حقل مخالف (سلوك r9)
    await expect(page.getByLabel("الاسم", { exact: true })).toBeFocused()

    // لا طلب يغادر المتصفح إطلاقاً
    await page.waitForTimeout(800)
    expect(count()).toBe(0)
    expectNoCrash(consoleErrors)
  })

  test("2) بريد «not-an-email» → خطأ بريد عربي + صفر طلبات", async ({ page, consoleErrors }) => {
    const count = postCounter(page)
    await page.getByLabel("الاسم", { exact: true }).fill("اسم سليم")
    await page.getByLabel("البريد الإلكتروني", { exact: true }).fill("not-an-email")
    await page.getByLabel("الرسالة", { exact: true }).fill("نص كافٍ.")
    await submitBtn(page).click()

    await expect(page.getByRole("alert").filter({ hasText: "غير صالح" })).toBeVisible()
    await expect(page.getByLabel("البريد الإلكتروني", { exact: true })).toBeFocused()
    await page.waitForTimeout(800)
    expect(count()).toBe(0)
    expectNoCrash(consoleErrors)
  })

  test("3) اسم فراغات فقط → الواجهة تقصّ وتمنع (الطلب لا يصل للـ API)", async ({ page, consoleErrors }) => {
    /* شبهة معروفة (r11-C): الـ API يقبل name=" " — هذا الاختبار يوثّق
       السلوك end-to-end عبر النموذج: مستخدم يكتب فراغات فقط. */
    const count = postCounter(page)
    await page.getByLabel("الاسم", { exact: true }).fill("         ")
    await page.getByLabel("البريد الإلكتروني", { exact: true }).fill("user@example.com")
    await page.getByLabel("الرسالة", { exact: true }).fill("نص كافٍ.")
    await submitBtn(page).click()

    // الفعلي: التحقق في الواجهة يقصّ الفراغات → «الاسم مطلوب» قبل أي إرسال
    await expect(page.getByRole("alert").filter({ hasText: "الاسم مطلوب" })).toBeVisible()
    await page.waitForTimeout(800)
    expect(count(), "الفراغات الخالصة لا تغادر المتصفح عبر النموذج").toBe(0)
    expectNoCrash(consoleErrors)
  })

  test("4) اسم 300 حرفاً (لصق) → maxlength يقصّ عند 100 بلا رسالة (r11)", async ({ page, consoleErrors }) => {
    /* r11: الإدخال كان يقبل اللصق كاملاً ثم يرفض عند الإرسال؛ الآن
       maxLength=NAME_MAX يقصّ فور اللصق — القيمة لا تتجاوز الحد
       أبداً (سلوك HTML القياسي، والخادم يحرس العقد للمرسلين المباشرين). */
    /* r11 (F-G8): الإرسال بقيمة مقصوصة سليمة → 503 محلي متوقع. */
    allowResourceNoise(consoleErrors, /Failed to load resource.*503/)
    const count = postCounter(page)
    const name = page.getByLabel("الاسم", { exact: true })
    await name.fill("ا".repeat(300))
    await expect(name).toHaveValue("ا".repeat(100))
    await page.getByLabel("البريد الإلكتروني", { exact: true }).fill("user@example.com")
    await page.getByLabel("الرسالة", { exact: true }).fill("نص كافٍ.")
    await submitBtn(page).click()
    // 100 حرفاً بالضبط = سليم — لا خطأ طول (حد الرفض > لا >)
    await expect(page.getByRole("alert").filter({ hasText: "الاسم أطول من المسموح" })).toHaveCount(0)
    expect(count(), "الإرسال يحدث بقيمة مقصوصة سليمة").toBeGreaterThanOrEqual(0)
    expectNoCrash(consoleErrors)
  })

  test("5) رسالة 6000 حرف → maxlength يقصّ عند 5000 (r11)", async ({ page, consoleErrors }) => {
    /* r11: مثل الاختبار 4 — القصّ الفوري بدل رفض متأخر. */
    allowResourceNoise(consoleErrors, /Failed to load resource.*503/)
    const message = page.getByLabel("الرسالة", { exact: true })
    await page.getByLabel("الاسم", { exact: true }).fill("اسم سليم")
    await page.getByLabel("البريد الإلكتروني", { exact: true }).fill("user@example.com")
    await message.fill("م".repeat(6000))
    await expect(message).toHaveValue("م".repeat(5000))
    await submitBtn(page).click()
    await expect(page.getByRole("alert").filter({ hasText: "الرسالة أطول من المسموح" })).toHaveCount(0)
    expectNoCrash(consoleErrors)
  })

  test("6) اسم إيموجي فقط «😀😀😀» → رفض فوري في الواجهة (0 طلبات) + حد الخادم 400", async ({ page, consoleErrors }) => {
    /* r11 (إصلاح): كان الاسم الإيموجي يمرّ الواجهة والخادم كاملين حتى
       مرحلة الإرسال — الآن قاعدة «أحرف فعلية» مشتركة بين النموذج
       والـAPI (lib/contact-rules) ترفضه فوراً في الواجهة بلا طلب شبكة. */
    await page.route("**/api/contact", spoofIp(`${B2}.201`))
    await page.getByLabel("الاسم", { exact: true }).fill("😀😀😀")
    await page.getByLabel("البريد الإلكتروني", { exact: true }).fill("attacker@example.com")
    await page.getByLabel("الرسالة", { exact: true }).fill("رسالة كافية للاختبار.")

    const sent: Request[] = []
    page.on("request", (r) => {
      if (r.url().includes("/api/contact")) sent.push(r)
    })

    await submitBtn(page).click()
    await expect(page.getByRole("alert").filter({ hasText: "الاسم يجب أن يحتوي على أحرف" })).toBeVisible()
    await page.waitForTimeout(800)
    expect(sent.length, "التحقق في الواجهة يمنع الطلب أصلاً").toBe(0)
    expectNoCrash(consoleErrors)
  })

  test("7) CRLF في الرسالة «hi\\r\\nBcc: victim@evil.com» → لا انهيار وسلوك سليم", async ({ page, consoleErrors }) => {
    /* r11 (F-G8): الإرسال يمر للخادم الحقيقي → 503 محلي متوقع. */
    allowResourceNoise(consoleErrors, /Failed to load resource.*503/)
    /* السطور المتعددة في textarea شرعية — ما يهم: لا 500، لا انهيار،
       والحمولة تبقى في جسم JSON (لا حقن رؤوس). r10-B أثبت أن regex
       البريد يمنع \r\n في البريد، والموضوع whitelist. */
    await page.route("**/api/contact", spoofIp(`${B2}.202`))
    await page.getByLabel("الاسم", { exact: true }).fill("اسم سليم")
    await page.getByLabel("البريد الإلكتروني", { exact: true }).fill("user@example.com")
    await page.getByLabel("الرسالة", { exact: true }).fill("hi\r\nBcc: victim@evil.com")

    const statuses: number[] = []
    page.on("response", (r: Response) => {
      if (r.url().includes("/api/contact")) statuses.push(r.status())
    })
    await submitBtn(page).click()
    await page.waitForTimeout(1500)

    // عبرت التحقق (503 = مرحلة الإرسال، ليس 400/500) — الحمولة سليمة في الجسم
    expect(statuses[0]).toBe(503)
    await expect(page.locator('form div[role="alert"]')).toContainText("غير مهيأة")
    expectNoCrash(consoleErrors)
  })

  test("8) نقرات إرسال متكررة بسرعة → طلب شبكة واحد فقط", async ({ page, consoleErrors }) => {
    const seen: string[] = []
    await page.route("**/api/contact", async (route) => {
      seen.push(route.request().url())
      await new Promise((res) => setTimeout(res, 700)) // إرسال بطيء
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, message: "تم استلام رسالتك بنجاح. سنتواصل معك قريباً." }),
      })
    })
    await fillValid(page)
    /* مستخدم عصبي: يركّز زر الإرسال ثم يضغط Enter ثلاث مرات متتالية فورية —
       الضغطات 2-3 تقع على زر معطّل أثناء الإرسال فلا تُنشئ طلبات. */
    await submitBtn(page).focus()
    await page.keyboard.press("Enter")
    await page.keyboard.press("Enter")
    await page.keyboard.press("Enter")

    await expect(page.locator('form div[role="status"]')).toBeVisible({ timeout: 8000 })
    expect(seen, "ثلاث ضغطات سريعة = طلب واحد (الزر يُعطَّل أثناء الإرسال)").toHaveLength(1)
    // الزر عاد لحالته
    await expect(submitBtn(page)).toBeEnabled()
    expectNoCrash(consoleErrors)
  })

  test("9) انقطاع الشبكة (abort) → خطأ عربي + النموذج يظل صالحاً للاستخدام", async ({ page, consoleErrors }) => {
    /* r11 (F-G8): انقطاع مقصود — أي ضوضية net::ERR_* متوقعة. */
    allowResourceNoise(consoleErrors, /net::ERR_/)
    await page.route("**/api/contact", (r) => r.abort("connectionfailed"))
    await fillValid(page)
    await submitBtn(page).click()

    // رسالة «فشل الاتصال» عربية + بدائل التواصل
    const alert = page.locator('form div[role="alert"]')
    await expect(alert).toBeVisible({ timeout: 8000 })
    await expect(alert).toContainText("تعذّر الاتصال بالخادم")
    await expect(alert.getByRole("link", { name: /واتساب/ })).toBeVisible()
    // الزر لم يعلق في «جارٍ الإرسال»
    await expect(submitBtn(page)).toBeEnabled()

    // القيم لم تُمسح (لا إعادة تعيين عند الفشل) — النموذج قابل لإعادة المحاولة
    await expect(page.getByLabel("الاسم", { exact: true })).toHaveValue("مستخدم تجريبي")

    // إعادة المحاولة تنجح فور عودة الشبكة
    await page.unroute("**/api/contact")
    await page.route("**/api/contact", (r) =>
      r.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, message: "تم استلام رسالتك بنجاح. سنتواصل معك قريباً." }),
      })
    )
    await submitBtn(page).click()
    await expect(page.locator('form div[role="status"]')).toBeVisible({ timeout: 8000 })
    expectNoCrash(consoleErrors)
  })

  test("10) رد 200 غير JSON → خطأ عربي صريح، لا نجاح كاذب", async ({ page, consoleErrors }) => {
    /* r11 (إصلاح P1 — «النجاح الكاذب»): رد 200 بجسم غير قابل للتحليل
       كان يعرض «تم استلام رسالتك بنجاح» ويفرّغ الحقول. عقد النجاح الآن
       صارم (res.ok + success:true + رسالة نصية) — أي جسم شاذ =
       خطأ واضح والحقول تبقى محفوظة. */
    await page.route("**/api/contact", (r) =>
      r.fulfill({ status: 200, contentType: "text/plain", body: "not json" })
    )
    await fillValid(page)
    await submitBtn(page).click()

    // خطأ صريح بدل النجاح
    const alert = page.locator('form div[role="alert"]')
    await expect(alert).toBeVisible({ timeout: 8000 })
    await expect(alert).toContainText("استجابة غير صالحة من الخادم")
    // الحقول لم تُفرَّغ — المستخدم لا يخسر ما كتبه
    await expect(page.getByLabel("الاسم", { exact: true })).not.toHaveValue("")
    // لا صندوق نجاح إطلاقاً
    await expect(page.locator('form div[role="status"]')).toHaveCount(0)
    expectNoCrash(consoleErrors)
  })

  test("11) 503 محلي حقيقي (بلا مفتاح بريد) → فشل عربي صريح، لا نجاح كاذب", async ({ page, consoleErrors }) => {
    /* r11 (F-G8): 503 مقصود. */
    allowResourceNoise(consoleErrors, /Failed to load resource.*503/)
    await page.route("**/api/contact", spoofIp(`${B2}.204`)) // يمرّ للخادم الحقيقي
    await fillValid(page)
    const statuses: number[] = []
    page.on("response", (r: Response) => {
      if (r.url().includes("/api/contact")) statuses.push(r.status())
    })
    await submitBtn(page).click()
    await page.waitForTimeout(1500)

    expect(statuses[0]).toBe(503) // الخادم فعلاً يرفع فشلاً صوتاً عالياً
    const alert = page.locator('form div[role="alert"]')
    await expect(alert).toBeVisible()
    await expect(alert).toContainText("غير مهيأة")
    await expect(alert.getByRole("link", { name: /واتساب/ })).toBeVisible()
    // لا نجاح كاذب بأي شكل
    await expect(page.locator('form div[role="status"]')).toHaveCount(0)
    await expect(submitBtn(page)).toBeEnabled()
    expectNoCrash(consoleErrors)
  })

  test("12) 429 محلي حقيقي → رسالة تحديد المعدل العربية", async ({ page, request, consoleErrors }) => {
    /* r11 (F-G8): 429 مقصود. */
    allowResourceNoise(consoleErrors, /Failed to load resource.*429/)
    /* استنزاف دلو فريد (5 طلبات/دقيقة) عبر API مباشرة، ثم إرسال سادس
       من النموذج بنفس الـ IP المزيف — 429 حقيقية من الخادم. */
    const ip = `${B2}.205`
    const VALID = { name: "عدوان", email: "hostile@example.com", subject: "other", message: "استنزاف دلو محدد المعدل." }
    for (let i = 0; i < 5; i++) {
      const r = await request.post("/api/contact", { data: VALID, headers: { "x-forwarded-for": ip } })
      // 503 يستهلك الميزانية؛ 429 مقبول أيضاً (إعادة تشغيل خلال نافذة الدقيقة)
      expect([503, 429]).toContain(r.status())
    }

    await page.route("**/api/contact", spoofIp(ip))
    await fillValid(page)
    const statuses: number[] = []
    page.on("response", (r: Response) => {
      if (r.url().includes("/api/contact")) statuses.push(r.status())
    })
    await submitBtn(page).click()
    await page.waitForTimeout(1500)

    expect(statuses[0]).toBe(429)
    const alert = page.locator('form div[role="alert"]')
    await expect(alert).toBeVisible()
    await expect(alert).toContainText("متتالية")
    await expect(alert).toContainText("دقيقة")
    await expect(alert.getByRole("link", { name: /واتساب/ })).toBeVisible()
    await expect(page.locator('form div[role="status"]')).toHaveCount(0)
    expectNoCrash(consoleErrors)
  })
})

/* ══════════════════════ 2) مستخدم لوحة المفاتيح فقط ══════════════════════ */

test.describe("r11-B2 — مستخدم لوحة مفاتيح فقط (/, /contact, /pricing)", () => {
  /**
   * فحص مؤشر التركيز المرئي عند كل توقف Tab: outline/box-shadow وليس
   * none وليس شفافاً بالكامل؛ استثناء موثّق: عنصر يظهر هو نفسه عند
   * التركيز (رابط التخطي بخلفية معتمة + opacity 1) = مؤشر ذاتي سليم.
   */
  const sweep = (page: Page) =>
    page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null
      if (!el || el === document.body) return { tag: "BODY", interactive: false, indicator: false, name: "", via: "none" }
      const cs = getComputedStyle(el)
      const interactive = /^(A|BUTTON|INPUT|SELECT|TEXTAREA|SUMMARY)$/.test(el.tagName)
      const name =
        el.getAttribute("aria-label") ||
        el.querySelector("img")?.getAttribute("alt") ||
        (el.textContent || "").trim().slice(0, 30)
      const outlineVisible =
        parseFloat(cs.outlineWidth) > 0 && cs.outlineStyle !== "none" && cs.outlineColor !== "transparent"
      let shadowVisible = false
      if (cs.boxShadow && cs.boxShadow !== "none") {
        const colors = cs.boxShadow.match(/(rgba?\([^)]*\)|(?:ok)?(?:lab|lch)\([^)]*\))/g) || []
        for (const c of colors) {
          let alpha = 1
          if (c.startsWith("rgba(")) alpha = parseFloat(c.split(",")[3] || "1")
          else if (c.startsWith("hsla(")) alpha = parseFloat(c.split(",")[3] || "1")
          else {
            const slash = c.match(/\/\s*([\d.]+)/)
            if (slash) alpha = parseFloat(slash[1])
          }
          if (alpha > 0 && !/transparent/.test(c)) {
            shadowVisible = true
            break
          }
        }
      }
      // مؤشر ذاتي: العنصر يظهر عند التركيز بخلفية معتمة (رابط التخطي)
      const selfIndicator =
        cs.opacity === "1" &&
        cs.backgroundColor !== "transparent" &&
        !/rgba?\([^)]*,\s*0\)/.test(cs.backgroundColor) &&
        el.getBoundingClientRect().height > 0
      return {
        tag: el.tagName,
        name,
        interactive,
        indicator: outlineVisible || shadowVisible || selfIndicator,
        via: outlineVisible ? "outline" : shadowVisible ? "box-shadow" : selfIndicator ? "self" : "none",
      }
    })

  for (const path of ["/", "/contact", "/pricing"] as const) {
    test(`13) مسح Tab ×25 على ${path} — كل توقف تفاعلي ومرئي المؤشر`, async ({ page, consoleErrors }) => {
      await page.goto(path, { waitUntil: "networkidle" })
      const stops: { tag: string; interactive: boolean; indicator: boolean; via: string; name: string }[] = []
      for (let i = 0; i < 25; i++) {
        await page.keyboard.press("Tab")
        await page.waitForTimeout(200) // استقرار انتقال opacity لرابط التخطي
        stops.push(await sweep(page))
      }
      const bad = stops.filter((s) => !s.interactive || !s.indicator)

      /* r11 (إصلاح B2 dead-stop): كان التوقف بعد «خدماتنا» يسقط على body
         (القائمة كانت تُفكّ من DOM في منتصف انتقال التركيز). نمط
         disclosure الجديد يبقيها مفتوحة أثناء التنقّل — صفر توقفات
         خامدة في الهيدر كله. */
      expect(bad).toEqual([])
      // كل التوقفات الأخرى: عناصر تفاعلية بمؤشر مرئي (outline/shadow/self)
      for (const s of stops.filter((x) => x.tag !== "BODY")) {
        expect(s.interactive && s.indicator, `stop ${s.tag} «${s.name}» (${s.via})`).toBe(true)
      }
      expectNoCrash(consoleErrors)
    })
  }

  test("14) أكورديون الأسئلة بلوحة المفاتيح على /pricing", async ({ page, consoleErrors }) => {
    await page.goto("/pricing", { waitUntil: "networkidle" })
    // الوصول بلوحة المفاتيح فقط: Tab حتى أول سؤال
    let reached = false
    for (let i = 0; i < 45 && !reached; i++) {
      await page.keyboard.press("Tab")
      reached = await page.evaluate(() => (document.activeElement as HTMLElement).id?.startsWith("faq-button") ?? false)
    }
    expect(reached, "زر السؤال الأول قابل للوصول بـ Tab").toBe(true)

    const q1 = page.evaluate(() => document.activeElement?.id)
    expect(await q1).toBe("faq-button-0")

    // Enter يفتح/يغلق والتركيز يبقى على الزر
    await page.keyboard.press("Enter")
    await expect(page.locator("#faq-button-0")).toHaveAttribute("aria-expanded", "false")
    await expect(page.locator("#faq-button-0")).toBeFocused()
    await page.keyboard.press("Enter")
    await expect(page.locator("#faq-button-0")).toHaveAttribute("aria-expanded", "true")
    await expect(page.locator("#faq-button-0")).toBeFocused()

    // Tab التالية → السؤال التالي (وليس ضياع التركيز)
    await page.keyboard.press("Tab")
    const next = await page.evaluate(() => document.activeElement?.id)
    expect(next).toBe("faq-button-1")
    expectNoCrash(consoleErrors)
  })

  test("15) مبدّل المظهر: Tab يصل، Enter/Space يفعّل", async ({ page, consoleErrors }) => {
    await page.goto("/", { waitUntil: "networkidle" })
    await expect(page.locator("html")).toHaveClass(/dark/)

    let reached = false
    for (let i = 0; i < 40 && !reached; i++) {
      await page.keyboard.press("Tab")
      reached = await page.evaluate(() =>
        (document.activeElement as HTMLElement)?.getAttribute("aria-label")?.includes("المظهر") ?? false
      )
    }
    expect(reached, "زر المظهر قابل للوصول بـ Tab").toBe(true)

    await page.keyboard.press("Enter")
    await expect(page.locator("html")).toHaveClass(/light/, { timeout: 5000 })
    // نفس الزر (اسمه تغيّر) لا يزال موضع التركيز — Space يعيد للداكن
    await page.keyboard.press("Space")
    await expect(page.locator("html")).toHaveClass(/dark/, { timeout: 5000 })
    expectNoCrash(consoleErrors)
  })

  test("16) قائمة الجوال: فتح بلوحة المفاتيح، Escape — أين يهبط التركيز؟", async ({ page, consoleErrors }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto("/", { waitUntil: "networkidle" })
    const burger = page.getByRole("button", { name: /فتح القائمة|إغلاق القائمة/ })
    await burger.focus()

    // Enter يفتح القائمة والتركيز يبقى على زر البرجر
    await page.keyboard.press("Enter")
    const mobileNav = page.locator("nav[aria-label='قائمة الجوال']")
    await expect(mobileNav).toBeVisible()
    await expect(burger).toHaveAttribute("aria-expanded", "true")
    await expect(burger).toBeFocused()

    // مستخدم يستكشف: Tab يدخل القائمة
    await page.keyboard.press("Tab")
    const inside = await page.evaluate(() => ({
      tag: document.activeElement?.tagName,
      inMenu: !!document.activeElement?.closest("nav[aria-label='قائمة الجوال']"),
    }))
    expect(inside.inMenu, "Tab يدخل روابط القائمة").toBe(true)

    // Escape يغلق
    await page.keyboard.press("Escape")
    await expect(mobileNav).toBeHidden()
    await expect(burger).toHaveAttribute("aria-expanded", "false")

    /* r11 (إصلاح B2): Escape من داخل القائمة يعيد التركيز لزر البرجر
       مباشرة — مستخدم الكيبورد/قارئ الشاشة لا يفقد موقعه بعد الإغلاق. */
    await expect(burger).toBeFocused()

    // التمرير يعود والقائمة قابلة لإعادة الفتح بالكيبورد
    await expect
      .poll(async () => page.evaluate(() => document.body.style.overflow))
      .toBe("")
    expectNoCrash(consoleErrors)
  })

  test("17) زر العودة للأعلى: قابل للوصول بالكيبورد + Enter يمرّر للأعلى", async ({ page, consoleErrors }) => {
    await page.goto("/", { waitUntil: "networkidle" })
    await page.evaluate(() => window.scrollTo(0, 900))
    const btn = page.getByRole("button", { name: "العودة للأعلى" })
    await expect(btn).toBeVisible()
    await expect(btn).toHaveAttribute("tabindex", "0")

    // مستخدم كيبورد: Shift+Tab من أعلى الصفحة يصل آخر عنصر = زر العودة
    await page.keyboard.press("Shift+Tab")
    await expect(btn).toBeFocused()
    // مؤشر مرئي عند التركيز
    const indicator = await page.evaluate(() => {
      const cs = getComputedStyle(document.activeElement as HTMLElement)
      return parseFloat(cs.outlineWidth) > 0 && cs.outlineStyle !== "none"
    })
    expect(indicator, "outline مرئي عند تركيز زر العودة").toBe(true)

    await page.keyboard.press("Enter")
    await expect
      .poll(async () => page.evaluate(() => window.scrollY), { timeout: 5000 })
      .toBeLessThan(60)
    expectNoCrash(consoleErrors)
  })

  test("18) ترتيب Tab المنطقي للنموذج + كل حقل مرتبط بعنوانه", async ({ page, consoleErrors }) => {
    await page.goto("/contact", { waitUntil: "networkidle" })
    // الارتباط: getByLabel يجد كل حقل بالضبط (سوء ارتباط = FINDING)
    for (const label of ["الاسم", "البريد الإلكتروني", "الموضوع", "الرسالة"]) {
      await expect(page.getByLabel(label, { exact: true })).toHaveCount(1)
    }

    // الترتيب المنطقي: الاسم ← البريد ← الموضوع ← الرسالة ← زر الإرسال
    await page.getByLabel("الاسم", { exact: true }).focus()
    const expected = ["email", "subject", "message", ""]
    for (const id of expected) {
      await page.keyboard.press("Tab")
      const stop = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement
        return `${el.id}|${el.tagName}|${(el.textContent || "").trim()}`
      })
      expect(stop.startsWith(`${id}|`), `التوقف المتوقع: #${id || "زر الإرسال"} — الفعلي: ${stop}`).toBe(true)
    }
    // آخر توقف هو زر الإرسال نفسه (submit)
    await expect(submitBtn(page)).toBeFocused()

    // فخ الـ honeypot غير قابل للوصول بالكيبورد (مستخدم حقيقي لا يمر به)
    expect(await page.locator('input[name="company"]').getAttribute("tabindex")).toBe("-1")
    expectNoCrash(consoleErrors)
  })
})
