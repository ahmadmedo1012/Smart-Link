import { test, expect } from "./fixtures"
import { hydrationGate } from "./helpers"

/**
 * عقد مبدّل المظهر على الرئيسية (E3 — مرحلة 9؛ P13-2a re-base إلى r160):
 * المبدّل الوظيفي في LandingHeader (توأم main-nav: نفس التسميات العربية،
 * حارس الترطيب، 44px)، والمرحلة الفاتحة §15 تعني شيئًا حقيقيًا على
 * الأرض KODE — التوكن المحسوب على .landing ينقلب (حبر #050507 ↔ ورق
 * #F4F2ED)، العنوان يصبح أبيض المسرح على الحبر ثم حبرًا على الورق،
 * حبة CTA الاستثنائية تعبئة برتقالية بفيض #FF4C00 وحبرها #050507،
 * والمنحوتة الحية (ChainSculpture — WebGL) تعيد قراءة توكناتها عبر
 * MutationObserver فتعيد الرسم (مقارنة بكسل لقطتي المُركِّب تتغيّر بين
 * الوضعين — لو تجاهل المحرك الثيم لبقيت العينتان متقاربتين).
 */

test.describe("مبدّل مظهر الرئيسية — المرحلة الفاتحة", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" })
    await hydrationGate(page)
  })

  test("المبدّل حاضر بحجم 44px وتسمية العائلة", async ({ page }) => {
    const toggle = page.locator(".landing-theme-toggle")
    await expect(toggle).toBeVisible()
    await expect(toggle).toHaveAttribute("aria-label", "تفعيل المظهر الفاتح")
    const box = await toggle.boundingBox()
    expect(box?.height, "44px touch floor").toBeGreaterThanOrEqual(44)
    expect(box?.width, "44px touch floor").toBeGreaterThanOrEqual(44)
  })

  test("التبديل يقلب المرحلة: التوكن + العنوان + CTA البرتقالية", async ({ page }) => {
    const stage = page.locator(".landing")

    // الوضع الداكن الافتراضي (r160 KODE): أرض الحبر + عنوان أبيض المسرح
    // (P13-2a re-pin: كان الرملي #F2EFE6 على ليل مدارك #070B16)
    await expect(page.locator("html")).toHaveClass(/dark/)
    expect(
      await stage.evaluate((el) => getComputedStyle(el).getPropertyValue("--ln-ink").trim().toLowerCase())
    ).toBe("#050507")
    expect(
      await page.locator(".ln-hero-title").evaluate((el) => getComputedStyle(el).color)
    ).toBe("rgb(255, 255, 255)")

    await page.locator(".landing-theme-toggle").click()

    // المرحلة الفاتحة: html.light + أرض ورقية + عنوان حبر KODE
    await expect(page.locator("html")).toHaveClass(/light/)
    await expect(page.locator(".landing-theme-toggle")).toHaveAttribute(
      "aria-label",
      "تفعيل المظهر الداكن"
    )
    expect(
      await stage.evaluate((el) => getComputedStyle(el).getPropertyValue("--ln-ink").trim().toLowerCase())
    ).toBe("#f4f2ed")
    expect(
      await page.locator(".ln-hero-title").evaluate((el) => getComputedStyle(el).color)
    ).toBe("rgb(10, 10, 10)")

    // الاستثناء الكنوني (P13-2a KODE retirement): الحبة الاستثنائية
    // تبقى تعبئة مضيئة في النهار — لكن بفيض KODE #FF4C00 وحبره #050507
    // (كانت الذهب #E9B44C بحبر #1A0F06). الحبة تنتقل لونها عبر
    // var(--ln-t-base) 240ms — expect.poll ينتظر الحالة النهائية
    // المستقرة بدل سباق منتصف الانتقال (القيم الوسيطة تُعاد من
    // getComputedStyle أثناء transition).
    const cta = page.locator(".ln-hero-actions .ln-btn-gold")
    await expect
      .poll(() => cta.evaluate((el) => getComputedStyle(el).backgroundColor))
      .toBe("rgb(255, 76, 0)")
    await expect
      .poll(() => cta.evaluate((el) => getComputedStyle(el).color))
      .toBe("rgb(5, 5, 7)")

    // عودةً إلى الداكن — التبديل مزدوج الاتجاه
    await page.locator(".landing-theme-toggle").click()
    await expect(page.locator("html")).toHaveClass(/dark/)
    expect(
      await stage.evaluate((el) => getComputedStyle(el).getPropertyValue("--ln-ink").trim().toLowerCase())
    ).toBe("#050507")
  })

  test("المنحوتة الحية تعيد الرسم عند التبديل (مقارنة بكسل لقطة المسرح)", async ({ page }) => {
    /* P13-2a Wave-3: this probe screenshots the FULL 1280×1242 stage box
     * THREE times and folds ~1.9M pixels in-page — under software raster
     * the 30s default starves mid-flow (setup+poll+3 shots). Legitimately
     * heavy contract → tripled budget, same assertions. */
    test.slow()
    /* P13-2a re-author: الكوكبة تقاعدت مع r160 — ChainSculpture محرك
       WebGL بلا preserveDrawingBuffer، فأي قراءة getContext('2d')
       للكانفس تعيد فراغًا دائمًا (المسبار القديم كان يقيس محركًا لم
       يعد موجودًا). المسبار الصادق الأرخص: لقطتا مُركِّب (element
       screenshot لمسرح .ln-hero-canvas — دائمًا يعكس ما يراه المستخدم)
       تُفكّان داخل الصفحة نفسها (Image → 2D canvas → getImageData)
       وتُقارنان كمتوسط إضاءة. لعزل المحرك عن خلفية CSS (أرض .landing
       تنقلب مع الثيم أصلًا فتلوّث أي مقارنة) تُثبَّت الأرض على رمادي
       محايد قبل القياسين: الفرق الباقي مصدره بكسلات الكانفس نفسها —
       معدن السلسلة (#17171C → #D6D6DC) وضباب المشهد وضوء الحافة كلها
       يعاد قراءتها من التوكنات (readStage عبر MutationObserver) ثم
       يعاد الرسم. لو تجاهل المحرك الثيم لبقيت اللقطتان متقاربتين
       (الأرض الرمادية ثابتة والحركة الدورانية لا تغيّر المتوسط). */
    const engineCanvas = page.locator(".ln-hero-canvas canvas")
    await expect(engineCanvas, "كانفس المنحوتة حي").toBeAttached()
    await expect
      .poll(() => engineCanvas.evaluate((el) => getComputedStyle(el).opacity), {
        timeout: 10_000,
        message: "دخول المنحوتة يستقر على opacity 1",
      })
      .toBe("1")
    // تخطّي نافذة دخول المشهد (380ms+160ms) قبل القياس الأول
    await page.waitForTimeout(600)

    // أرض محايدة ثابتة للقياسين — تقفل مساهمة خلفية CSS خارج الكانفس
    await page.evaluate(() => {
      const landing = document.querySelector<HTMLElement>(".landing")
      if (landing) landing.style.background = "#808080"
    })

    /* P13-2a (Wave-3 recalibration): the original >15 mean-luminance
     * threshold assumed the full-quality render (shadows + env). The
     * honest low-power path (no shadows/env — software raster boxes)
     * shrinks the MEAN diff to ~4-6 while the repaint stays plainly
     * measurable: live measurement on the sandbox build = theme flip
     * changes 21.7% of stage pixels by >60 luminance vs 11.1% pure
     * rotation noise (same stage, 600ms apart) → a +10.6pp signature.
     * The probe below self-calibrates: it measures the flip-fraction
     * AND a same-stage control fraction in the same run, then demands
     * the flip signature exceed the machine's own noise floor by a
     * fixed margin — machine-speed-proof, no magic constant. */
    const stageStats = async () => {
      const png = await page.locator(".ln-hero-canvas").screenshot()
      return page.evaluate(async (b64) => {
        const img = new Image()
        img.src = `data:image/png;base64,${b64}`
        await img.decode()
        const c = document.createElement("canvas")
        c.width = img.naturalWidth
        c.height = img.naturalHeight
        const ctx = c.getContext("2d")
        if (!ctx) return null
        ctx.drawImage(img, 0, 0)
        const data = ctx.getImageData(0, 0, c.width, c.height).data
        const lum: number[] = []
        for (let i = 0; i < data.length; i += 4) {
          lum.push(0.2126 * data[i]! + 0.7152 * data[i + 1]! + 0.0722 * data[i + 2]!)
        }
        return lum
      }, png.toString("base64"))
    }
    const changedFraction = (a: number[] | null, b: number[] | null) => {
      if (!a || !b || a.length !== b.length) return null
      let changed = 0
      for (let i = 0; i < a.length; i++) if (Math.abs(a[i]! - b[i]!) > 60) changed++
      return (100 * changed) / a.length
    }

    const dark = await stageStats()
    expect(dark, "قياس المسرح الداكن موجود").not.toBeNull()

    await page.locator(".landing-theme-toggle").click()
    await expect(page.locator("html")).toHaveClass(/light/)
    // المراقب يعمل في نفس الدورة + إطار واحد للرسم — مهلة صغيرة تكفي
    await page.waitForTimeout(400)
    const light = await stageStats()
    expect(light, "قياس المسرح الفاتح موجود").not.toBeNull()

    // عيّنة ضابطة على نفس المسرح: أرضية ضوضاء الدوران لهذه الآنة تحديدًا
    await page.waitForTimeout(600)
    const control = await stageStats()

    const flip = changedFraction(dark, light)
    const noise = changedFraction(light, control)
    expect(flip, "كسر البكسلات المتغيرة بالتبديل قابل للقياس").not.toBeNull()
    expect(noise, "أرضية الضوضاء قابلة للقياس").not.toBeNull()
    // توقيع إعادة الرسم: التبديل يتجاوز ضوضاء الدوران بهامش ثابت
    // (المترجم يتجاهل الثيم → flip ≈ noise → الفارق ~0)
    expect(
      (flip as number) - (noise as number),
      "التبديل يغيّر المسرح فوق أرضية الضوضاء (توقيع إعادة الرسم)"
    ).toBeGreaterThan(5)
  })

  test("الاختيار يثبت عبر إعادة التحميل (next-themes + سكربت الإقلاع)", async ({ page }) => {
    await page.locator(".landing-theme-toggle").click()
    await expect(page.locator("html")).toHaveClass(/light/)
    await page.reload({ waitUntil: "networkidle" })
    await expect(page.locator("html"), "الوضع الفاتح يبقى بعد إعادة التحميل").toHaveClass(/light/)
    // P13-2a KODE re-pin: ورق #F4F2ED (كان رملي مدارك #F2EFE6)
    expect(
      await page.locator(".landing").evaluate((el) =>
        getComputedStyle(el).getPropertyValue("--ln-ink").trim().toLowerCase()
      )
    ).toBe("#f4f2ed")
  })
})
