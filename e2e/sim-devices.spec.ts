import type { Page } from "@playwright/test"
import { test, expect, PAGES } from "./fixtures"
import { SHOT_DIR, slug, hydrationGate, MOBILE_VIEWPORT, assertNoHScroll } from "./helpers"

/**
 * r11-B3 — محاكاة الأجهزة والبصريات (gstack user-perceivable qa-patterns)
 * ---------------------------------------------------------------------------
 * منهجية: فحوصات يُدركها المستخدم فقط — لا قراءة لـ src/**، كل الاستنتاجات
 * من DOM المُصيَّر والأنماط المحسوبة عبر page.evaluate.
 *
 * مصفوفة الأجهزة:
 *   1. MOBILE 375×812: كل صفحة = اختبار (بلا تمرير أفقي + برجر + h1 + فوتر)
 *   2. MOBILE FORM: /contact حقول + زر، تعبئة بريد طويل بلا فائض
 *   3. DESKTOP 1280×800: لقطات الوضعين (dark+light) لكل صفحة
 *   4. MOBILE لقطات الوضع الفاتح
 *   5. CONSOLE SWEEP: صفر أخطاء console/pageerror (سطح مكتب + جوال)
 *   6. LINK SWEEP: HEAD لكل رابط نفس-الأصل (200/308)، خارجي = https،
 *      mailto/tel/wa.me جيدة التشكيل، المرساة لها عنصر هدف
 *   7. IMAGES: naturalWidth>0 لكل صورة (بعد تمرير المستخدم — lazy-load)
 *   8. CLS على / و/pricing أقل من 0.02
 *   9. FAVICON/META: كل link[rel=icon|apple-touch-icon|manifest] → 200
 *
 * ملاحظة واقعية (اكتشفتها بالتحري المباشر): المظهر الافتراضي للموقع داكن
 * (html.dark، localStorage فارغ) — لذلك اللقطات تُسمّى بالوضع الفعلي
 * المُتحقَّق منه من class عنصر html، لا بترتيب الضغط.
 *
 * لقطات jpeg بجودة 60 (fullPage) — المسار قابل للتهيئة:
 *   SIM_SHOTS_DIR=... (خارج المستودع محلياً)، والافتراضي داخل
 *   test-results/sim-shots (يعمل على أي بيئة بما فيها CI — يُرفع
 *   كـ artifact عند الفشل تلقائياً). r11: المسار المطلق القديم
 *   أفشل 12 اختبار لقطة على عدّاد CI (ENOENT).
 */



/** تمرير المستخدم الحقيقي عبر الصفحة (يشغّل lazy-load) ثم العودة للقمة */
async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    const h = document.body.scrollHeight
    for (let y = 0; y <= h; y += 400) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 120))
    }
    window.scrollTo(0, h)
    await new Promise((r) => setTimeout(r, 900))
  })
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(200)
}

/* r14-M6: assertNoHScroll رُفع إلى helpers.ts (المكان الواحد) — حذفت
   النسخة المحلية هنا. */

async function shot(page: Page, name: string) {
  await page.screenshot({
    path: `${SHOT_DIR}/${name}.png`,
    type: "jpeg",
    quality: 60,
    fullPage: true,
  })
}

/** كل صور الصفحة محمّلة فعلاً (complete + naturalWidth>0) بعد التمرير */
async function assertImagesLoaded(page: Page, label: string) {
  const broken = await page.evaluate(() =>
    Array.from(document.querySelectorAll("img"))
      .filter((i) => !(i.complete && i.naturalWidth > 0))
      .map((i) => i.currentSrc || i.getAttribute("src") || "(no src)")
  )
  expect(broken, `FINDING[img] ${label}: صور مكسورة ${JSON.stringify(broken)}`).toEqual([])
}

/* -------------------------------------------------------------------------- */
/* 0) مصفوفة الصفحات — استكشاف الروابط من ترويسة/تذييل / (مصدر حقيقة الاختبار) */
/* -------------------------------------------------------------------------- */
test.describe("r11-B3 — مصفوفة الصفحات", () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  test("/ — روابط الترويسة والتذييل تغطي الصفحات الست", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" })
    await hydrationGate(page)
    const links = await page.evaluate(() => ({
      header: Array.from(document.querySelectorAll("header a[href]")).map((a) => a.getAttribute("href") ?? ""),
      footer: Array.from(document.querySelectorAll("footer a[href]")).map((a) => a.getAttribute("href") ?? ""),
    }))
    // internal (تبدأ بـ /) من الترويسة والتذييل معاً
    const internal = new Set(
      [...links.header, ...links.footer].filter((h) => h.startsWith("/"))
    )
    for (const p of PAGES) {
      expect(internal.has(p.path), `رابط ${p.path} غير موجود في ترويسة/تذييل /`).toBe(true)
    }
  })
})

/* -------------------------------------------------------------------------- */
/* 1) MOBILE 375×812 — صفحة واحدة = اختبار واحد */
/* -------------------------------------------------------------------------- */
test.describe("MOBILE 375×812 — الصفحات الست", () => {
  test.use({ viewport: MOBILE_VIEWPORT })

  for (const p of PAGES) {
    test(`${p.path} — بلا تمرير أفقي + برجر يفتح ويغلق + h1 + فوتر`, async ({ page }) => {
      await page.goto(p.path, { waitUntil: "load" })
      await hydrationGate(page)

      // (أ) لا تمرير أفقي قبل أي تفاعل
      await assertNoHScroll(page, `375px ${p.path}`)

      // (ب) زر البرجر ظاهر والقائمة مغلقة
      const burger = page.getByRole("button", { name: /فتح القائمة|إغلاق القائمة/ })
      await expect(burger).toBeVisible()
      const mobileNav = page.locator('nav[aria-label="قائمة الجوال"]')
      await expect(mobileNav).toBeHidden()

      // (ج) الفتح: القائمة + روابطها مرئية
      await burger.click()
      await expect(mobileNav).toBeVisible()
      await expect(burger).toHaveAttribute("aria-expanded", "true")
      for (const href of ["/about", "/pricing", "/contact"]) {
        await expect(mobileNav.locator(`a[href="${href}"]`), `رابط ${href} في قائمة الجوال`).toBeVisible()
      }

      // (د) الإغلاق بالنقر على البرجر مجدداً
      await burger.click()
      await expect(mobileNav).toBeHidden()

      // (هـ) لا فائض أفقي بعد التفاعل أيضاً
      await assertNoHScroll(page, `375px ${p.path} (بعد البرجر)`)

      // (و) عنوان القسم الرئيسي مرئي
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(p.h1)

      // (ز) التذييل مرئي
      await expect(page.locator("footer").first()).toBeVisible()
    })
  }
})

/* -------------------------------------------------------------------------- */
/* 2) MOBILE FORM — /contact على 375px */
/* -------------------------------------------------------------------------- */
test.describe("MOBILE 375×812 — نموذج التواصل", () => {
  test.use({ viewport: MOBILE_VIEWPORT })

  test("/contact — الحقول وزر الإرسال ظاهرة قابلة للتعبئة، بريد طويل بلا فائض", async ({ page }) => {
    await page.goto("/contact", { waitUntil: "load" })
    await hydrationGate(page)

    const name = page.locator("#name")
    const email = page.locator("#email")
    const message = page.locator("#message")
    const subject = page.locator("#subject")
    const submit = page.getByRole("button", { name: /إرسال الرسالة/ })

    // الظهور والتفعيل
    for (const [label, el] of [
      ["#name", name],
      ["#email", email],
      ["#message", message],
      ["#subject", subject],
    ] as const) {
      await expect(el, `الحقل ${label} غير ظاهر على 375px`).toBeVisible()
      await expect(el, `الحقل ${label} معطّل`).toBeEnabled()
    }
    await expect(submit, "زر الإرسال غير ظاهر").toBeVisible()
    await expect(submit).toBeEnabled()

    // التعبئة — بريد طويل جداً (اختبار الفائض الأفقي)
    await name.fill("مستخدم تجريبي للجوال")
    const longEmail =
      "mobile-user-with-a-very-long-email-address.0123456789.abcdefghijklmnopqrstuvwxyz@gmail.com"
    await email.fill(longEmail)
    await message.fill(
      "رسالة تجريبية طويلة نسبياً لاختبار امتلاء حقل النص على شاشة عرضها 375 بكسل دون أي فائض أفقي."
    )
    await subject.selectOption({ index: 1 })

    // القيم مقروءة فعلاً (قابلة للتعبئة)
    expect(await name.inputValue()).toContain("تجريبي")
    expect(await email.inputValue()).toBe(longEmail)
    expect(await message.inputValue()).toContain("375")

    // لا فائض أفقي بعد التعبئة (المستخدم يرى الصفحة كاملة العرض)
    await assertNoHScroll(page, "375px /contact (بعد تعبئة بريد طويل)")

    // ملاحظة: لا نضغط «إرسال» — لا نريد طلب API فعلياً (حد المعدل/البريد)
  })
  test("/contact — خط الحقول ≥ 16px (حرّاس iOS zoom — إصلاح r10 غير المحروس)", async ({ page }) => {
    await page.goto("/contact", { waitUntil: "load" })
    await hydrationGate(page)
    /* r14-M6 (F4): أي حقل دون 16px يجعل iOS Safari يزوّم الصفحة كلها عند
       تركيزه — إصلاح r10 (text-base في inputBase) كان موثقاً بتعليقات فقط.
       انحداراً واحداً إلى text-sm يمر CI أخضر على كل مستخدمي iPhone في
       صفحة التحويل الوحيدة. getByLabel مؤكد (contact.spec يثبت label/for). */
    const FIELD_LABELS: Record<string, string> = {
      name: "الاسم",
      email: "البريد الإلكتروني",
      subject: "الموضوع",
      message: "الرسالة",
    }
    for (const [id, label] of Object.entries(FIELD_LABELS)) {
      const size = await page
        .getByLabel(label, { exact: true })
        .evaluate((el) => parseFloat(getComputedStyle(el).fontSize))
      expect(
        size,
        `FINDING[ios-zoom] ${id}: font-size ${size}px < 16 — iOS يقرب الصفحة عند تركيز الحقل`
      ).toBeGreaterThanOrEqual(16)
    }
  })
})

/* -------------------------------------------------------------------------- */
/* 3) DESKTOP 1280×800 — لقطات الوضعين لكل صفحة */
/* -------------------------------------------------------------------------- */
test.describe("DESKTOP 1280×800 — لقطات داكن + فاتح", () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  for (const p of PAGES) {
    test(`${p.path} — لقطة fullPage للوضعين (jpeg q60)`, async ({ page }) => {
      await page.goto(p.path, { waitUntil: "load" })
      await hydrationGate(page)
      await page.waitForTimeout(300)
      // تمرير حقيقي أولاً: يُحمّل الصور lazy قبل اللقطة الكاملة
      await scrollThrough(page)

      // الوضع الفعلي الافتراضي: داكن (defaultTheme=dark — تحقّق مباشر من html)
      await expect(page.locator("html")).toHaveClass(/(^|\s)dark(\s|$)/)
      await shot(page, `${slug(p.path)}-dark`)

      // التبديل إلى الفاتح عبر اسم الوصول (aria-label) ثم مهلة 300ms
      await page.getByRole("button", { name: "تفعيل المظهر الفاتح" }).click()
      await expect(page.locator("html")).toHaveClass(/(^|\s)light(\s|$)/)
      await page.waitForTimeout(300)
      await shot(page, `${slug(p.path)}-light`)
    })
  }
})

/* -------------------------------------------------------------------------- */
/* 4) MOBILE 375×812 — لقطات الوضع الفاتح */
/* -------------------------------------------------------------------------- */
test.describe("MOBILE 375×812 — لقطات الوضع الفاتح", () => {
  test.use({ viewport: MOBILE_VIEWPORT })

  for (const p of PAGES) {
    test(`${p.path} — لقطة fullPage فاتح (jpeg q60)`, async ({ page }) => {
      await page.goto(p.path, { waitUntil: "load" })
      await hydrationGate(page)
      await page.getByRole("button", { name: "تفعيل المظهر الفاتح" }).click()
      await expect(page.locator("html")).toHaveClass(/(^|\s)light(\s|$)/)
      await page.waitForTimeout(300)
      await scrollThrough(page)
      await shot(page, `mobile-${slug(p.path)}`)
    })
  }
})

/* -------------------------------------------------------------------------- */
/* 5) CONSOLE SWEEP — سطح المكتب + الجوال، صفر أخطاء (fixture يجمعها) */
/* -------------------------------------------------------------------------- */
async function consoleSweep(
  page: Page,
  errors: string[],
  path: string,
  context: string
) {
  await page.goto(path, { waitUntil: "load" })
  await page.waitForTimeout(1500)
  // إن لم يكن فارغاً فهذه FINDING — الرسائل تُطبع في نص الفشل
  expect(
    errors,
    `FINDING[console] ${context} ${path}: ${JSON.stringify(errors)}`
  ).toEqual([])
}

test.describe("CONSOLE SWEEP — desktop 1280×800", () => {
  test.use({ viewport: { width: 1280, height: 800 } })
  for (const p of PAGES) {
    test(`${p.path} — صفر أخطاء console/pageerror`, async ({ page, consoleErrors }) => {
      await consoleSweep(page, consoleErrors, p.path, "desktop")
    })
  }
})

test.describe("CONSOLE SWEEP — mobile 375×812", () => {
  test.use({ viewport: MOBILE_VIEWPORT })
  for (const p of PAGES) {
    test(`${p.path} — صفر أخطاء console/pageerror`, async ({ page, consoleErrors }) => {
      await consoleSweep(page, consoleErrors, p.path, "mobile")
    })
  }
})

/* -------------------------------------------------------------------------- */
/* 6) LINK SWEEP — كل a[href] في كل صفحة (سطح المكتب) */
/* -------------------------------------------------------------------------- */
test.describe("LINK SWEEP — desktop 1280×800", () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  for (const p of PAGES) {
    test(`${p.path} — كل الروابط صالحة (داخلي 200/308، خارجي https، mailto/wa.me سليم)`, async ({ page }) => {
      await page.goto(p.path, { waitUntil: "load" })
      await hydrationGate(page)

      const hrefs = await page.evaluate(() =>
        Array.from(
          new Set(
            Array.from(document.querySelectorAll("a[href]")).map(
              (a) => a.getAttribute("href") ?? ""
            )
          )
        )
      )
      expect(hrefs.length, `${p.path} بلا روابط؟`).toBeGreaterThan(0)

      const origin = new URL(page.url()).origin
      for (const href of hrefs) {
        // (أ) مرساة داخلية: يجب أن يوجد عنصر بهذا المعرف
        if (href.startsWith("#")) {
          const exists = await page.evaluate(
            (h) => !!document.getElementById(decodeURIComponent(h.slice(1))),
            href
          )
          expect(exists, `FINDING[link] ${p.path}: المرساة ${href} بلا عنصر هدف`).toBe(true)
          continue
        }
        // (ب) mailto/tel: محتوى غير فارغ بعد البادئة
        if (/^(mailto|tel):/i.test(href)) {
          const prefix = href.slice(0, href.indexOf(":") + 1)
          expect(
            href.length > prefix.length + 2,
            `FINDING[link] ${p.path}: ${prefix} فارغ/مبتور "${href}"`
          ).toBe(true)
          continue
        }
        // (ج) تحليل العنوان
        let u: URL | null = null
        try {
          u = new URL(href, page.url())
        } catch {
          u = null
        }
        expect(u, `FINDING[link] ${p.path}: رابط غير قابل للتحليل "${href}"`).not.toBeNull()
        if (!u) continue

        if (u.origin === origin) {
          // (د) نفس الأصل: HEAD → 200 (أو 308 لإعادة التوجيه)
          const res = await page.request.head(u.toString())
          const ok = res.status() === 200 || res.status() === 308
          expect(
            ok,
            `FINDING[link] ${p.path}: HEAD ${u.pathname}${u.search} → ${res.status()}`
          ).toBe(true)
          continue
        }
        // (هـ) خارجي: https إلزامي — http خارجي = محتوى مختلط FINDING
        expect(
          u.protocol,
          `FINDING[link] ${p.path}: محتوى مختلط — رابط خارجي غير آمن "${href}"`
        ).toBe("https:")
        // (و) wa.me: رقم هاتف رقمي بعد البادئة
        if (u.hostname === "wa.me") {
          expect(
            /^\d+$/.test(u.pathname.slice(1)),
            `FINDING[link] ${p.path}: wa.me برقم غير رقمي "${href}"`
          ).toBe(true)
        }
      }
    })
  }
})

/* -------------------------------------------------------------------------- */
/* 7) IMAGES — كل صفحة × الوضعين (بعد تمرير المستخدم) */
/* -------------------------------------------------------------------------- */
test.describe("IMAGES — الوضع الداكن (الافتراضي)", () => {
  test.use({ viewport: { width: 1280, height: 800 } })
  for (const p of PAGES) {
    test(`${p.path} — كل الصور محمّلة (dark)`, async ({ page }) => {
      await page.goto(p.path, { waitUntil: "load" })
      await hydrationGate(page)
      await scrollThrough(page)
      await assertImagesLoaded(page, `${p.path} dark`)
    })
  }
})

test.describe("IMAGES — الوضع الفاتح", () => {
  test.use({ viewport: { width: 1280, height: 800 } })
  for (const p of PAGES) {
    test(`${p.path} — كل الصور محمّلة (light)`, async ({ page }) => {
      await page.goto(p.path, { waitUntil: "load" })
      await hydrationGate(page)
      await page.getByRole("button", { name: "تفعيل المظهر الفاتح" }).click()
      await expect(page.locator("html")).toHaveClass(/(^|\s)light(\s|$)/)
      await page.waitForTimeout(300)
      await scrollThrough(page)
      await assertImagesLoaded(page, `${p.path} light`)
    })
  }
})

/* -------------------------------------------------------------------------- */
/* 8) CLS — استقرار التخطيط على / و/pricing */
/* -------------------------------------------------------------------------- */
test.describe("CLS — استقرار التخطيط", () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  for (const path of ["/", "/pricing"]) {
    test(`${path} — CLS أقل من 0.02`, async ({ page }) => {
      await page.goto(path, { waitUntil: "load" })
      const cls = await page.evaluate(() =>
        new Promise<number>((resolve) => {
          let cls = 0
          new PerformanceObserver((list) => {
            for (const e of list.getEntries()) {
              const shift = e as PerformanceEntry & { hadRecentInput?: boolean; value: number }
              if (!shift.hadRecentInput) cls += shift.value
            }
            resolve(cls)
          }).observe({ type: "layout-shift", buffered: true })
          setTimeout(() => resolve(cls), 3000)
        })
      )
      expect(cls, `FINDING[cls] ${path}: CLS=${cls}`).toBeLessThan(0.02)
    })
  }
})

/* -------------------------------------------------------------------------- */
/* 9) FAVICON + META — كل href يعيد 200 */
/* -------------------------------------------------------------------------- */
test.describe("FAVICON + META", () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  test("/ — icon وapple-touch-icon وmanifest كلها تعيد 200 (HEAD)", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" })
    await hydrationGate(page)
    const hrefs = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll(
          'link[rel~="icon" i], link[rel="apple-touch-icon" i], link[rel="manifest" i]'
        )
      ).map((l) => l.getAttribute("href") ?? "")
    )
    // على الأقل: favicon.ico + favicon-32 + apple-touch + manifest
    expect(hrefs.length, `روابط الأيقونات الموجودة: ${JSON.stringify(hrefs)}`).toBeGreaterThanOrEqual(3)
    for (const href of hrefs) {
      const abs = new URL(href, page.url()).toString()
      const res = await page.request.head(abs)
      expect(res.status(), `FINDING[icon] HEAD ${href} → ${res.status()}`).toBe(200)
    }
  })
})
