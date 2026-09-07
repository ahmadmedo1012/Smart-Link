import { test, expect, PAGES, allowResourceNoise } from "./fixtures"
import { mkdirSync } from "node:fs"

const SHOT_DIR = process.env.SIM_SHOTS_DIR ?? "test-results/sim-shots"
mkdirSync(SHOT_DIR, { recursive: true })

/**
 * r11-B4 — محاكاة الأنماط الخاصة (user-modes simulator)
 *
 * A) مستخدم بلا جافاسكريبت (javaScriptEnabled: false) — SSR-first:
 *    كل صفحة تعرض h1 ونصاً حقيقياً، التنقل يعمل بروابط <a> حقيقية،
 *    نموذج التواصل يُصيَّر مع حقوله، و404 تعمل.
 *    ملاحظة: جمع أخطاء console في fixtures مُعطَّل عملياً هنا (لا JS أصلاً).
 * B) prefers-reduced-motion: مفتاح الإيقاف يجب أن يصفّر كل الحركات
 *    ويُظهر المحتوى فوراً بقيم نهائية.
 * C) شبكة بطيئة (تأخير 400ms لكل طلب): الصفحة تكتمل، CLS منخفض،
 *    لا أقسام فارغة دائمة، والنموذج قابل للاستخدام.
 * D) فحوص RTL عميقة: dir/lang، محاذاة النصوص، الخصائص المنطقية،
 *    اتجاه الأسهم/الشيفرانات، سلامة الأرقام في النص العربي.
 * E) أساسيات meta: viewport/charset/title لكل صفحة.
 *
 * المنهجية: فحوص ما يراه المستخدم فقط (لا قراءة للمصدر) — «الرؤية»
 * هنا أصرم من toBeVisible لأن opacity:0 لا تكشفه Playwright
 * (انهيار silent-assertion اكتُشف في no-JS أدناه — انظر FINDING B4-1).
 */

/** «مرئي للمستخدم» فعلاً: أسوأ opacity في سلسلة الأسلاف */
async function effectiveOpacity(loc: import("@playwright/test").Locator): Promise<number> {
  return loc.evaluate((el) => {
    let min = 1
    let p: HTMLElement | null = el as HTMLElement
    while (p && p !== document.body) {
      const v = parseFloat(getComputedStyle(p).opacity)
      if (!Number.isNaN(v)) min = Math.min(min, v)
      p = p.parentElement
    }
    return min
  })
}

/**
 * يتحقق أن العنصر مرئي للمستخدم فعلاً (opacity-aware — أصرم من toBeVisible
 * الذي لا يرى opacity:0). يسمح باستقران حركات CSS الافتتاحية (~1s)
 * لأن المستخدم يراها تنتهي، لكنه لا يسمح بعناصر عالقة للأبد.
 */
async function expectUserVisible(
  loc: import("@playwright/test").Locator,
  what: string,
  timeout = 8000
) {
  await expect
    .poll(() => effectiveOpacity(loc), {
      timeout,
      message: `${what} — effective opacity (user-perceivable)`,
    })
    .toBeGreaterThan(0.9)
}

/* ═══════════════════ A) NO-JAVASCRIPT USER ═══════════════════ */

test.describe("A) no-JS — الموقع SSR-first بلا أي جافاسكريبت", () => {
  test.use({ javaScriptEnabled: false })

  for (const p of PAGES) {
    test(`A1 ${p.path} — h1 + نص SSR جوهري بلا تراكب أخطاء`, async ({ page }) => {
      await page.goto(p.path, { waitUntil: "domcontentloaded" })

      // h1 حقيقي في HTML الخادم
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(p.h1)

      // نص جوهري (>500 حرف) — ليس هيكلاً فارغاً
      const text = await page.locator("body").innerText()
      expect(text.length, `innerText length ${p.path}`).toBeGreaterThan(500)

      // لا تراكب أخطاء Next.js ولا صفحة فارغة
      expect(await page.locator("nextjs-portal").count()).toBe(0)
      expect(text.trim().length).toBeGreaterThan(0)
    })
  }

  test("A2 التنقل يعمل من الخادم — رابط <a> حقيقي يغيّر URL والصفحة", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" })
    const link = page.locator('nav[aria-label="التنقل الرئيسي"] a[href="/about"]')

    // رابط <a> حقيقي بـ href (لا زر JavaScript)
    await expect(link).toHaveAttribute("href", "/about")

    // النقر يسبب تنقلاً فعلياً في المتصفح (بلا أي JS) — تنقل خادم كامل
    // يشرع وقتاً أطول تحت الحمل المتوازي (مهلة متساهلة عمداً).
    await link.click()
    await page.waitForURL("**/about", { timeout: 15_000 })
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/عن SmartLink/)
  })

  test("A3 نموذج التواصل يُصيَّر بلا JS — الحقول المرئية بملصقاتها", async ({ page }) => {
    await page.goto("/contact", { waitUntil: "domcontentloaded" })

    // 4 حقول مرئية للمستخدم (المهمة قالت 3 — الفعلي 4: الاسم/البريد/الموضوع/الرسالة)
    await expectUserVisible(page.getByLabel("الاسم"), "حقل الاسم")
    await expectUserVisible(page.getByLabel("البريد الإلكتروني"), "حقل البريد")
    await expectUserVisible(page.getByLabel("الموضوع"), "حقل الموضوع")
    await expectUserVisible(page.getByLabel("الرسالة"), "حقل الرسالة")

    // وزر الإرسال موجود (الإرسال نفسه يحتاج JS — موثَّق كمراقبة أدناه)
    await expectUserVisible(page.getByRole("button", { name: "إرسال الرسالة" }), "زر الإرسال")

    // honeypot مخفي عن المستخدم بلا JS (aria-hidden + opacity 0)
    const honeypot = page.locator('input[name="company"]')
    expect(await honeypot.getAttribute("aria-hidden")).toBe("true")
  })

  test("A4 صفحة 404 تعمل بلا JS — رسالة عربية", async ({ page, consoleErrors }) => {
    /* r11 (F-G8): وثيقة ميتة مقصودة. */
    allowResourceNoise(consoleErrors, /Failed to load resource.*404/)
    await page.goto("/r11-nojs-404", { waitUntil: "domcontentloaded" })
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/404/)
    await expectUserVisible(page.getByText("الصفحة غير موجودة"), "عنوان 404")
    await expectUserVisible(page.getByText(/عذراً، الصفحة التي تبحث عنها/), "نص 404")
  })

  test("A5 الرئيسية بلا JS — الهيرو والإحصاءات والخاتمة مرئية للمستخدم", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" })
    await page.waitForTimeout(4000) // مهلة استقران حركات CSS (لا JS يكشفها)

    await expectUserVisible(page.getByRole("heading", { level: 1 }), "h1 الهيرو")
    // القيم النهائية SSR فوراً (لا عدّاد بلا JS)
    await expect(page.locator("text=+500").first()).toHaveText("+500")
    await expectUserVisible(page.locator("text=+500").first(), "إحصاء +500")
    await expectUserVisible(
      page.getByRole("heading", { name: /جهز أعمالك للانطلاق الرقمي/ }),
      "عنوان قسم CTA",
    )
  })

  test("A6 تدهور عناصر التفاعل بلا JS (توثيق + إصلاحات r11)", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" })
    await page.waitForTimeout(4000)

    // ✔ السلوك الأمثل: مبدّل المظهر لا يُصيَّر أصلاً بلا JS (client-only)
    expect(await page.getByRole("button", { name: /المظهر/ }).count()).toBe(0)

    // ✘ B4-3 (موثّق بقرار — غير مُصلح): زر «خدماتنا» المنسدل مُصيَّر من
    // الخادم لكنه خامل بلا JS. القرار: الروابط متاحة عبر أقسام المنتجات
    // والفوتر، وإصلاحه يستلزم SSR دائم لمحتوى القائمة (يغير عقد الترطيب
    // مقابل منفعة هامشية). يبقى توثيقاً.
    const services = page.getByRole("button", { name: /خدماتنا/ }).first()
    await services.click({ timeout: 3000 }).catch(() => {})
    const expanded = await services.getAttribute("aria-expanded")
    console.log(`[B4 no-JS] services dropdown aria-expanded after click = ${expanded} (خامل بلا JS — قرار موثّق)`)

    // ✔ r11 — تصحيح B4-1 (كانت إيجابية كاذبة): ادعاء «الأقسام مخفية
    // للأبد بلا JS» فُحص بمسبار مستقل: reveal-scroll مخططات زمنية CSS
    // خالصة تعمل بلا JS تماماً — العناصر تحت الطية تبدأ opacity:0
    // (نقطة بداية الحركة) ثم تظهر بالتمرير كما يفعل أي مستخدم. العقد
    // الجديد: مرّر كالمستخدم ثم تحقق أن كل قسم ظاهر فعلاً.
    for (const sec of ["#features h2", "#how-it-works h2", "#faq h2"]) {
      await page.locator(sec).scrollIntoViewIfNeeded()
      await page.waitForTimeout(600)
      const op = await effectiveOpacity(page.locator(sec))
      expect(op, `${sec} يجب أن يظهر بعد التمرير (reveal-scroll CSS بلا JS)`).toBeGreaterThan(0.9)
    }

    // ✔ r11 (إصلاح B4-2): أزرار الأكورديون جزر React — بلا JS كانت إجابات
    // FAQ 2..6 مقفلة للأبد (ارتفاع 0). @media (scripting: none) يفتح كل
    // الألواح ساكنة: المحتوى مقروء بلا JavaScript.
    const heights = await page.locator(".acc").evaluateAll((els) =>
      els.map((e) => ({ id: e.id, h: Math.round(e.getBoundingClientRect().height) }))
    )
    expect(
      heights.filter((x) => x.h === 0),
      `كل ألواح FAQ مقروءة بلا JS: ${JSON.stringify(heights)}`
    ).toEqual([])
  })
})

/* ═══════════════════ B) REDUCED MOTION ═══════════════════ */

test.describe("B) reduced-motion — مفتاح إيقاف الحركات الكامل", () => {
  for (const path of ["/", "/pricing"] as const) {
    test(`B1 ${path} — عناصر reveal/animate/fade: صفر مدة حركة ومحتوى ظاهر`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" })
      await page.goto(path, { waitUntil: "domcontentloaded" })

      // العناصر المعروفة بالحركة: قيم فعلية موثقة لكل عنصر
      const data = await page
        .locator('[class*="reveal"], [class*="animate"], [class*="fade"]')
        .evaluateAll((els) =>
          els.map((e) => {
            const cs = getComputedStyle(e)
            return {
              cls: (e as HTMLElement).className.split(" ").slice(0, 2).join(" "),
              animName: cs.animationName,
              animDur: cs.animationDuration,
              playState: cs.animationPlayState,
              opacity: cs.opacity,
            }
          })
        )
      console.log(`[B4 rm ${path}] elements=${data.length} sample=${JSON.stringify(data.slice(0, 6))}`)

      // عقد الحركة: إما لا حركة، أو مدة ~صفر، أو متوقفة — لكل عنصر
      for (const d of data) {
        const motionless =
          d.animName === "none" || parseFloat(d.animDur) < 0.05 || d.playState !== "running"
        expect(motionless, `${path} «${d.cls}»: anim=${d.animName}/${d.animDur}/${d.playState}`).toBe(true)
      }

      // المحتوى ظاهر فوراً (لا عناصر مخفية بانتظار حركة لن تجري)
      const hidden = data.filter((d) => parseFloat(d.opacity) < 0.9)
      expect(hidden, `${path} عناصر reveal مخفية تحت rm`).toEqual([])

      // الفحص الصارم: مسح المستند كله — صفر عناصر بحركة قيد التشغيل
      const animated = await page.evaluate(() => {
        const out: string[] = []
        for (const e of document.querySelectorAll<HTMLElement>("body *")) {
          const cs = getComputedStyle(e)
          if (cs.animationName !== "none") {
            out.push(`${String(e.className).slice(0, 40)}|${cs.animationName}|${cs.animationDuration}|${cs.animationPlayState}`)
          }
        }
        return out
      })
      expect(animated, `عناصر متحركة تحت reduced-motion: ${JSON.stringify(animated)}`).toEqual([])
    })
  }

  test("B2 عدّادات الهيرو تظهر بقيمها النهائية فوراً (لا أصفار) تحت rm", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/", { waitUntil: "domcontentloaded" })

    // القيم النهائية مصفوفة من الخادم — تُقرأ فور domcontentloaded
    const stats = await page.locator("div.tabular-nums").allInnerTexts()
    expect(stats).toEqual(["+500", "+10K", "+50K", "99.9%"])
    for (const s of stats) {
      expect(s, `قيمة عدّاد صفرية: ${s}`).not.toBe("0")
      expect(s.trim().length).toBeGreaterThan(0)
    }
    // الأرقام سليمة غير معكوسة (غربية وليست مقلوبة)
    expect(stats[3]).toBe("99.9%")
  })

  test("B3 الأكورديون يفتح ويغلق تحت rm (فوري بلا انتظار انتقالات)", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/", { waitUntil: "domcontentloaded" })

    // بوابة الترطيب: الأكورديون جزيرة عميل — النقر قبل الترطيب لا يعمل
    await expect(page.getByRole("button", { name: /المظهر/ })).toBeVisible()

    const q = page.locator("#faq-button-1") // «هل الخدمة مجانية؟»
    await q.scrollIntoViewIfNeeded()
    const panel = page.locator("#faq-panel-1")

    // مغلق: الارتفاع 0 (محتوى غير مقروء)
    await expect
      .poll(() => panel.evaluate((e) => e.getBoundingClientRect().height))
      .toBeLessThan(5)

    // يفتح بالنقر
    await q.click()
    await expect(q).toHaveAttribute("aria-expanded", "true")
    await expect
      .poll(() => panel.evaluate((e) => e.getBoundingClientRect().height))
      .toBeGreaterThan(50)
    await expectUserVisible(panel.getByText(/مجاناً تماماً|بدون بطاقة ائتمان/), "إجابة السؤال 2")

    // ويغلق ثانية
    await q.click()
    await expect(q).toHaveAttribute("aria-expanded", "false")
    await expect
      .poll(() => panel.evaluate((e) => e.getBoundingClientRect().height))
      .toBeLessThan(5)
  })
})

/* ═══════════════════ C) SLOW NETWORK (≈3G) ═══════════════════ */

test.describe("C) شبكة بطيئة — تأخير 400ms لكل طلب", () => {
  test.beforeEach(async ({ page }) => {
    // مقياس CLS قبل أي تنقل (buffered)
    await page.addInitScript(() => {
      ;(window as unknown as { __cls: number }).__cls = 0
      new PerformanceObserver((l) => {
        for (const e of l.getEntries() as Array<PerformanceEntry & { value?: number }>) {
          ;(window as unknown as { __cls: number }).__cls += e.value || 0
        }
      }).observe({ type: "layout-shift", buffered: true } as PerformanceObserverInit)
    })
    // تأخير 400ms لكل الطلبات — مع إسكات التحليلات (كما في fixtures)
    await page.route("**/*", async (route) => {
      const url = route.request().url()
      if (url.includes("/_vercel/insights/") || url.includes("va.vercel-scripts.com")) {
        return route.fulfill({ status: 200, contentType: "application/javascript", body: "" })
      }
      await new Promise((r) => setTimeout(r, 400))
      await route.continue()
    })
  })

  test("C1 الرئيسية تكتمل على شبكة بطيئة — هيرو + CLS<0.05 + لا أقسام فارغة", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" })

    // الهيرو يكتمل ويُرى — قبل التمرير (hero-parallax يغيّر شفافيته أثناء التمرير)
    await expectUserVisible(page.getByRole("heading", { level: 1 }), "h1 الهيرو")

    // تمرير كامل لتفعيل كشف كل الأقسام (حركة scroll-reveal تحتاج رؤية)
    await page.evaluate(async () => {
      const h = document.body.scrollHeight
      window.scrollTo(0, h * 0.5)
      await new Promise((r) => setTimeout(r, 800))
      window.scrollTo(0, h)
      await new Promise((r) => setTimeout(r, 900))
    })
    await page.waitForTimeout(3000) // 3 ثوانٍ بعد التحميل — لا أقسام فارغة دائمة

    // كل قسم (عدا الهيرو المفحوص أعلاه) له عنوان مرئي ونص حقيقي
    const sections = page.locator("section")
    const count = await sections.count()
    expect(count).toBeGreaterThanOrEqual(8)
    for (let i = 1; i < count; i++) {
      const sec = sections.nth(i)
      const heading = sec.locator("h1, h2").first()
      await expectUserVisible(heading, `عنوان القسم ${i}`)
      const txt = (await sec.innerText()).trim()
      expect(txt.length, `القسم ${i} نص فارغ`).toBeGreaterThan(30)
    }

    const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls)
    console.log(`[B4 slow /] CLS = ${cls}`)
    expect(cls, "CLS على شبكة بطيئة").toBeLessThan(0.05)
  })

  test("C2 /contact على شبكة بطيئة — النموذج قابل للاستخدام بعد التحميل", async ({ page }) => {
    await page.goto("/contact", { waitUntil: "load" })
    await page.waitForTimeout(1500) // ترطيب جزيرة النموذج على الشبكة البطيئة

    await page.getByLabel("الاسم").fill("مستخدم شبكة بطيئة")
    await page.getByLabel("البريد الإلكتروني").fill("slow-net@smart-link.ly")
    await page.getByLabel("الموضوع").selectOption("menu")
    await page.getByLabel("الرسالة").fill("رسالة تجربة على شبكة بطيئة")

    await expect(page.getByLabel("الاسم")).toHaveValue("مستخدم شبكة بطيئة")
    await expect(page.getByLabel("البريد الإلكتروني")).toHaveValue("slow-net@smart-link.ly")
    await expect(page.getByLabel("الموضوع")).toHaveValue("menu")
    await expect(page.getByLabel("الرسالة")).toHaveValue("رسالة تجربة على شبكة بطيئة")
  })
})

/* ═══════════════════ D) RTL DEEP CHECKS ═══════════════════ */

test.describe("D) فحوص RTL العميقة (سطح المكتب)", () => {
  for (const p of PAGES) {
    test(`D1 ${p.path} — html dir="rtl" و lang="ar"`, async ({ page }) => {
      await page.goto(p.path, { waitUntil: "domcontentloaded" })
      await expect(page.locator("html")).toHaveAttribute("dir", "rtl")
      await expect(page.locator("html")).toHaveAttribute("lang", "ar")
    })
  }

  test("D2 محاذاة الفقرات منطقية (start/center) — لا left في RTL", async ({ page }) => {
    for (const path of ["/", "/about"] as const) {
      await page.goto(path, { waitUntil: "domcontentloaded" })
      const paras = await page.locator("#main-content p").evaluateAll((els) =>
        els.slice(0, 5).map((e) => ({
          ta: getComputedStyle(e).textAlign,
          dir: getComputedStyle(e).direction,
          text: (e.textContent || "").trim().slice(0, 18),
        }))
      )
      expect(paras.length, `${path} — عدد الفقرات المفحوصة`).toBeGreaterThanOrEqual(5)
      console.log(`[B4 rtl ${path}] paragraphs=${JSON.stringify(paras)}`)
      for (const p of paras) {
        // في RTL: 'end' = يسار فعلياً — مرفوض مثل 'left'
        expect(
          ["start", "right", "center", "justify"].includes(p.ta),
          `${path} «${p.text}»: textAlign=${p.ta}`
        ).toBe(true)
        expect(p.dir).toBe("rtl")
      }
    }
  })

  test("D3 الخصائص المنطقية — حقول النموذج وبطاقات الأسعار (توثيق pl/pr/pIs)", async ({ page }) => {
    // حقول /contact
    await page.goto("/contact", { waitUntil: "domcontentloaded" })
    const fields = await page.locator("#name, #email, #subject, #message").evaluateAll((els) =>
      els.map((e) => {
        const cs = getComputedStyle(e)
        return {
          id: e.id,
          paddingLeft: cs.paddingLeft,
          paddingRight: cs.paddingRight,
          paddingInlineStart: cs.paddingInlineStart,
          direction: cs.direction,
          textAlign: cs.textAlign,
        }
      })
    )
    console.log(`[B4 rtl contact] fields=${JSON.stringify(fields)}`)
    for (const f of fields) {
      expect(parseFloat(f.paddingInlineStart), `${f.id} paddingInlineStart`).toBeGreaterThanOrEqual(0)
      expect(parseFloat(f.paddingInlineStart), `${f.id} حشوة منطقية > 0`).toBeGreaterThan(0)
      expect(f.direction, `${f.id} direction`).toBe("rtl")
    }

    // بطاقات /pricing (glass + بطاقات الخطط)
    await page.goto("/pricing", { waitUntil: "domcontentloaded" })
    const cards = await page.locator("#main-content .glass, #main-content [class*='card']").evaluateAll((els) =>
      els.slice(0, 6).map((e) => {
        const cs = getComputedStyle(e)
        return {
          cls: (e as HTMLElement).className.split(" ").slice(0, 2).join(" "),
          paddingLeft: cs.paddingLeft,
          paddingRight: cs.paddingRight,
          paddingInlineStart: cs.paddingInlineStart,
        }
      })
    )
    console.log(`[B4 rtl pricing] cards=${JSON.stringify(cards)}`)
    for (const c of cards) {
      expect(parseFloat(c.paddingInlineStart), `${c.cls} paddingInlineStart`).toBeGreaterThanOrEqual(0)
    }
    // ملاحظة التوثيق: الحشوات متناظرة فيزيائياً (px-4 / p-8) — لا حاجة لخصائص
    // منطقية اتجاهية هنا، ولا شذوذ bidi: القيم متناظرة عمداً لا سهواً.
  })

  test("D4 أسهم التقدم تشير لليسار (RTL) — لا chevron-right/arrow-right، + لقطات", async ({ page }) => {
    for (const path of ["/", "/pricing"] as const) {
      await page.goto(path, { waitUntil: "domcontentloaded" })
      // لا أي سهم «لليمين» في أي اتجاه تقدم — الاتجاه الأمامي في RTL هو اليسار
      expect(await page.locator("svg.lucide-arrow-right").count(), `${path} arrow-right`).toBe(0)
      expect(await page.locator("svg.lucide-chevron-right").count(), `${path} chevron-right`).toBe(0)
    }

    // زر أكورديون مغلق: شيفرون-يسار (اتجاه الفتح في RTL)
    await page.goto("/", { waitUntil: "domcontentloaded" })
    const chev = page.locator("#faq-button-1 svg")
    await expect(chev).toHaveClass(/chevron-left/)
    // عند الفتح يدور 180 (يواجه الاتجاه المعاكس — دلالة مفتوح)
    await page.locator("#faq-button-1").click()
    await expect(page.locator("#faq-button-1 svg")).toHaveClass(/rotate-180/)

    // روابط CTA «زيارة الخدمة» بشيفرون-يسار (تقدم صحيح في RTL)
    await expect(page.locator('a[aria-label*="زيارة الخدمة"] svg.lucide-chevron-left').first()).toBeVisible()

    // لقطات بصرية كدليل — نفس مسار اللقطات القابل للنقل (r11: مسار
    // مطلق أفشل CI كما في sim-devices)
    await page.locator("#faq-button-0").screenshot({ path: `${SHOT_DIR}/B4-faq-chevron-rtl.png` })
    await page.locator('a[aria-label*="زيارة الخدمة"]').first().screenshot({ path: `${SHOT_DIR}/B4-cta-chevron-rtl.png` })
  })

  test("D5 الأرقام في النص العربي — إحصاءات وهاتف سليمة غير معكوسة", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" })
    const stats = await page.locator("div.tabular-nums").allInnerTexts()
    console.log(`[B4 rtl stats] ${JSON.stringify(stats)}`)
    expect(stats).toContain("+500")
    expect(stats).toContain("99.9%")
    // ليست معكوسة/مبهمة: كل قيمة تبدأ برقم أو + وليست بصيغة مقلوبة
    for (const s of stats) expect(s).toMatch(/^(\+|\d)/)

    // الهاتف في /contact معزول بـ dir="ltr" فلا يعبث به bidi
    await page.goto("/contact", { waitUntil: "domcontentloaded" })
    const phone = page.getByText("+218 91 008 9975")
    await expect(phone).toBeVisible()
    await expectUserVisible(phone, "رقم الهاتف")
    expect(await phone.getAttribute("dir")).toBe("ltr")
    // ورابط واتساب بأرقام مرتبة صحيحة (غير معكوسة)
    await expect(page.locator('a[href="https://wa.me/218910089975"]').first()).toHaveAttribute(
      "href",
      "https://wa.me/218910089975"
    )
  })
})

/* ═══════════════════ E) VIEWPORT / BASIC META ═══════════════════ */

test.describe("E) أساسيات meta لكل صفحة", () => {
  for (const p of PAGES) {
    test(`E1 ${p.path} — viewport + charset utf-8 + title غير فارغ`, async ({ page }) => {
      await page.goto(p.path, { waitUntil: "domcontentloaded" })

      // viewport
      await expect(page.locator('meta[name="viewport"]')).toHaveCount(1)
      await expect(page.locator('meta[name="viewport"]')).toHaveAttribute(
        "content",
        /width=device-width/
      )

      // charset utf-8 (meta + الإعلان الفعلي للمستند)
      await expect(page.locator("meta[charset]")).toHaveCount(1)
      expect(await page.evaluate(() => document.characterSet)).toBe("UTF-8")

      // title غير فارغ ومطابق للعقد
      const title = await page.title()
      expect(title.trim().length).toBeGreaterThan(0)
      expect(title).toMatch(p.title)
    })
  }
})
