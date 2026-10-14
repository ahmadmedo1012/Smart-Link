import { test, expect } from "./fixtures"
import { hydrationGate } from "./helpers"

/**
 * عقد مبدّل المظهر على الرئيسية (E3 — مرحلة 9): المبدّل الوظيفي في
 * LandingHeader (توأم main-nav: نفس التسميات العربية، حارس الترطيب،
 * 44px)، والمرحلة الفاتحة §15 تعني شيئًا حقيقيًا على الأرض — التوكن
 * المحسوب على .landing ينقلب، العنوان يصبح حبرًا على ورق، حبة CTA الذهبية
 * تبقى مضيئة بزوج الطبقة المنتجة (#E9B44C + #1A0F06)، والكوكبة الحية
 * (الكانفس) تعيد قراءة توكناتها فتعيد الرسم (عيّنة بكسلات مركز النواة
 * تتغيّر بين الوضعين — لو تجاهل المحرك الثيم لبقيت العينة نفسها).
 */
const CORE_BOX = 16

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

  test("التبديل يقلب المرحلة: التوكن + العنوان + CTA الذهبية", async ({ page }) => {
    const stage = page.locator(".landing")

    // الوضع الداكن الافتراضي: أرض ليلية + عنوان رملي
    await expect(page.locator("html")).toHaveClass(/dark/)
    expect(
      await stage.evaluate((el) => getComputedStyle(el).getPropertyValue("--ln-ink").trim().toLowerCase())
    ).toBe("#070b16")
    expect(
      await page.locator(".ln-hero-title").evaluate((el) => getComputedStyle(el).color)
    ).toBe("rgb(242, 239, 230)")

    await page.locator(".landing-theme-toggle").click()

    // المرحلة الفاتحة: html.light + أرض ورقية + عنوان حبر
    await expect(page.locator("html")).toHaveClass(/light/)
    await expect(page.locator(".landing-theme-toggle")).toHaveAttribute(
      "aria-label",
      "تفعيل المظهر الداكن"
    )
    expect(
      await stage.evaluate((el) => getComputedStyle(el).getPropertyValue("--ln-ink").trim().toLowerCase())
    ).toBe("#f2efe6")
    expect(
      await page.locator(".ln-hero-title").evaluate((el) => getComputedStyle(el).color)
    ).toBe("rgb(7, 11, 22)")

    // الاستثناء الكنسي: الحبة الذهبية تبقى ذهبًا مضيئًا بحبر غامق (9.95:1).
    // الحبة تنتقل لونها عبر var(--ln-t-base) 240ms — expect.poll ينتظر
    // الحالة النهائية المستقرة بدل سباق منتصف الانتقال (القيم الوسيطة
    // تُعاد من getComputedStyle أثناء transition).
    const cta = page.locator(".ln-hero-actions .ln-btn-gold")
    await expect
      .poll(() => cta.evaluate((el) => getComputedStyle(el).backgroundColor))
      .toBe("rgb(233, 180, 76)")
    await expect
      .poll(() => cta.evaluate((el) => getComputedStyle(el).color))
      .toBe("rgb(26, 15, 6)")

    // عودةً إلى الداكن — التبديل مزدوج الاتجاه
    await page.locator(".landing-theme-toggle").click()
    await expect(page.locator("html")).toHaveClass(/dark/)
    expect(
      await stage.evaluate((el) => getComputedStyle(el).getPropertyValue("--ln-ink").trim().toLowerCase())
    ).toBe("#070b16")
  })

  test("الكوكبة الحية تعيد الرسم عند التبديل (عيّنة بكسل النواة)", async ({ page }) => {
    // الوصول إلى وضع نهائي مستقر: تخطّ نافذة الدخول (1400ms) قبل القياس
    await page.waitForTimeout(1900)
    const sampleCore = () =>
      page.evaluate((box: number) => {
        const canvas = document.querySelector<HTMLCanvasElement>(".ln-hero-canvas")
        if (!canvas) return null
        const ctx = canvas.getContext("2d")
        if (!ctx) return null
        // هندسة المحرك نفسها (resize في EcosystemConstellation) — DPR 1 في
        // السياق الرئيسي فالإحداثيات المنطقية = إحداثيات الجهاز
        const w = canvas.width
        const h = canvas.height
        const systemR = Math.min(h * 0.4, w * 0.34)
        const cx = w * 0.5 + -0.35 * Math.max(0, w * 0.5 - systemR * 1.08)
        const cy = h * 0.47
        const data = ctx.getImageData(
          Math.round(cx - box / 2),
          Math.round(cy - box / 2),
          box,
          box
        ).data
        let sum = 0
        let n = 0
        for (let i = 0; i < data.length; i += 4) {
          sum += 0.2126 * data[i]! + 0.7152 * data[i + 1]! + 0.0722 * data[i + 2]!
          n += 1
        }
        return sum / Math.max(1, n)
      }, CORE_BOX)

    const darkMean = await sampleCore()
    expect(darkMean, "the dark core sample exists").not.toBeNull()

    await page.locator(".landing-theme-toggle").click()
    await expect(page.locator("html")).toHaveClass(/light/)
    // المراقب يعمل في نفس الدورة + إطار واحد للرسم — مهلة صغيرة تكفي
    await page.waitForTimeout(400)
    const lightMean = await sampleCore()
    expect(lightMean, "the light core sample exists").not.toBeNull()

    // النواة: رملية فاتحة على الليل، حبرية داكنة على الورق — الفرق جوهري.
    // لو تجاهل المحرك الثيم لظلّت العينتان متطابقتين (delta < 5)
    expect(Math.abs((darkMean as number) - (lightMean as number))).toBeGreaterThan(50)
  })

  test("الاختيار يثبت عبر إعادة التحميل (next-themes + سكربت الإقلاع)", async ({ page }) => {
    await page.locator(".landing-theme-toggle").click()
    await expect(page.locator("html")).toHaveClass(/light/)
    await page.reload({ waitUntil: "networkidle" })
    await expect(page.locator("html"), "الوضع الفاتح يبقى بعد إعادة التحميل").toHaveClass(/light/)
    expect(
      await page.locator(".landing").evaluate((el) =>
        getComputedStyle(el).getPropertyValue("--ln-ink").trim().toLowerCase()
      )
    ).toBe("#f2efe6")
  })
})
