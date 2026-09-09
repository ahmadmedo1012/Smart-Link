import { test, expect, PAGES, BASE, allowResourceNoise } from "./fixtures"

/**
 * فحوص SEO الفوقية: canonical لكل صفحة، بطاقة OG كاملة (عنوان/رابط/صورة)،
 * بطاقة تويتر، robots.txt، sitemap.xml بأسطر URL الست، والـ manifest.
 * (انحدار r6: الدمج الضحل كان يسقط og:image من الصفحات الفرعية.)
 */
test.describe("SEO — الميتاداتا الفوقية لكل صفحة", () => {
  for (const p of PAGES) {
    test(`${p.path} — canonical + og كامل + twitter card`, async ({ page }) => {
      await page.goto(p.path, { waitUntil: "domcontentloaded" })

      // canonical (home: Next يحذف الشرطة الختامية عند التحليل)
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        p.path === "/" ? BASE : `${BASE}${p.path}`
      )

      // بطاقة OpenGraph كاملة — كل حقل (r6)
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
        "content",
        /SmartLink/
      )
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
        "content",
        p.path === "/" ? BASE : `${BASE}${p.path}`
      )
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
        "content",
        /og-smartlink\.jpg/
      )
      await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute("content", "1200")
      await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute("content", "630")
      await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute("content", "SmartLink")
      await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "ar_AR")

      // بطاقة تويتر large image
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
        "content",
        "summary_large_image"
      )
      await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
        "content",
        /og-smartlink\.jpg/
      )

      // وصف meta موجود لكل صفحة
      await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.{20,}/)
    })
  }
})

test.describe("SEO — ملفات الزحف والتثبيت", () => {
  test("robots.txt — يسمح بالكل ويعلن الـ sitemap", async ({ request }) => {
    const res = await request.get("/robots.txt")
    expect(res.status()).toBe(200)
    const body = await res.text()
    expect(body).toContain("Allow: /")
    expect(body).toContain("Sitemap: https://smart-link.ly/sitemap.xml")
  })

  test("sitemap.xml — الـ URLs الست بلا نقص", async ({ request }) => {
    const res = await request.get("/sitemap.xml")
    expect(res.status()).toBe(200)
    expect(res.headers()["content-type"]).toContain("xml")
    const xml = await res.text()
    expect(xml).toContain("<urlset")
    for (const p of PAGES) {
      expect(xml).toContain(`<loc>${p.path === "/" ? BASE : `${BASE}${p.path}`}</loc>`)
    }
    // عدد المدخلات = 6 بالضبط
    expect(xml.match(/<loc>/g)?.length).toBe(6)
    // كل مدخل يحمل lastmod
    expect(xml.match(/<lastmod>/g)?.length).toBe(6)
  })

  test("manifest.webmanifest — PWA كامل بأيقوناته الثلاث", async ({ request }) => {
    const res = await request.get("/manifest.webmanifest")
    expect(res.status()).toBe(200)
    const m = await res.json()
    expect(m.name).toContain("SmartLink")
    expect(m.dir).toBe("rtl")
    expect(m.lang).toBe("ar")
    expect(m.display).toBe("standalone")
    const sizes = m.icons.map((i: { sizes: string }) => i.sizes)
    expect(sizes).toContain("192x192")
    expect(sizes).toContain("512x512")
    expect(m.icons.some((i: { purpose: string }) => i.purpose === "maskable")).toBe(true)
  })

  test("og-smartlink.jpg — يُخدم 200 بصورة jpeg", async ({ request }) => {
    const res = await request.get("/og-smartlink.jpg")
    expect(res.status()).toBe(200)
    expect(res.headers()["content-type"]).toContain("image/jpeg")
    const buf = await res.body()
    // JPEG magic bytes: FF D8 FF
    expect(buf[0]).toBe(0xff)
    expect(buf[1]).toBe(0xd8)
  })

  test("favicon-32 + apple-touch-icon — تُخدمان بنوع صحيح", async ({ request }) => {
    for (const [path, type] of [
      ["/favicon-32.png", "image/png"],
      ["/apple-touch-icon.png", "image/png"],
      ["/icon-192.png", "image/png"],
    ] as const) {
      const res = await request.get(path)
      expect(res.status()).toBe(200)
      expect(res.headers()["content-type"]).toContain(type)
    }
  })
})

test.describe("r9 — إشارات الزحف والـ PWA المضافة", () => {
  test("404 — robots noindex + بلا canonical (حل تعارض الإشارات)", async ({ request }) => {
    /* r9 (SEO audit P2-1): 404 كان يرث robots «index, follow» الجذري
       مقابل «noindex» الذي يضيفه Next — إشارتان متعارضتان + canonical
       للرئيسية على رابط ميت. الصفحة تُصيَّر بلا JS عبر request. */
    const res = await request.get("/صفحة-ميتة-للاختبار")
    expect(res.status()).toBe(404)
    const html = await res.text()
    // لا «index, follow» بعد الآن — فقط noindex بصيغتيه
    expect(html).not.toContain('content="index, follow"')
    expect(html).toContain('name="robots" content="noindex"')
    // description خاصة بالـ 404 بدل وصف الرئيسية الموروث
    expect(html).toContain('الصفحة التي تبحث عنها غير متوفرة')
    /* r10 (SEO audit P1): العنوان كان يدّعي «بلا canonical» ولا يفحصه —
       الرابط الميت كان يصدّر canonical="https://smart-link.ly" (وراثة من
       الجذر) فيعارض noindex. الآن الجذر يُقص بـ alternates:{} + بطاقة
       OG خاصة بلا og:url موروث. */
    expect(html).not.toContain('rel="canonical"')
    expect(html).not.toContain('property="og:url"')
  })

  test("404 — html المُصيَّر: رابطا العودة والتواصل", async ({ page, consoleErrors }) => {
    /* r11 (F-G8): وثيقة ميتة مقصودة — ضوضية 404 متوقعة. */
    allowResourceNoise(consoleErrors, /Failed to load resource.*404/)
    await page.goto("/dead-link-r9", { waitUntil: "domcontentloaded" })
    const main = page.locator("#main-content")
    await expect(main.getByRole("link", { name: /العودة للرئيسية/ })).toHaveAttribute("href", "/")
    await expect(main.getByRole("link", { name: /تواصل معنا/ })).toHaveAttribute("href", "/contact")
  })

  test("robots.txt — يمنع /api/ (r9)", async ({ request }) => {
    const res = await request.get("/robots.txt")
    const body = await res.text()
    expect(body).toContain("Disallow: /api/")
  })

  test("manifest — id صريح + اختصارات التنقل (r9)", async ({ request }) => {
    const res = await request.get("/manifest.webmanifest")
    const m = await res.json()
    expect(m.id).toBe("/")
    const shortcuts = m.shortcuts.map((sc: { url: string }) => sc.url)
    expect(shortcuts).toContain("/pricing")
    expect(shortcuts).toContain("/contact")
  })

  test("sitemap — القانونية بختم ثابت والشبه ثابتة بختم محتوى (r10)", async ({ request }) => {
    const res = await request.get("/sitemap.xml")
    const xml = await res.text()
    /* r10 (SEO audit P3 + testing audit G12): كان العدّ النصي للتاريخ
       قنبلة موقوتة (بناء يوم 2026-07-01 يجعل العدد 6). الآن: عدّ مدخلات
       كل مجموعة من عناصر <loc> نفسها وقارن ختمها المتوقع. */
    const lastmod = (loc: string) => {
      const m = xml.match(new RegExp(`<loc>[^<]*${loc}</loc>\\s*<lastmod>([^<]+)</lastmod>`))
      return m?.[1] ?? ""
    }
    // القانونيتان بتاريخ محتواهما الحقيقي (سبتمبر 2026 — r13: تغيّر
    // المحتوى فعلاً في سبتمبر فصار ختم يوليو ادعاءً كاذباً حيّاً)
    expect(lastmod("/privacy")).toBe("2026-09-09T00:00:00.000Z")
    expect(lastmod("/terms")).toBe("2026-09-09T00:00:00.000Z")
    // about/contact بختم محتوى ثابت (r10 — ليست وقت البناء بعد الآن)
    expect(lastmod("/about")).toBe("2026-09-07T00:00:00.000Z")
    expect(lastmod("/contact")).toBe("2026-09-07T00:00:00.000Z")
    // home/pricing لا يزالان بتاريخ البناء (ديناميكيان فعلاً)
    expect(lastmod("smart-link.ly")).not.toBe("2026-07-01T00:00:00.000Z")
    expect(lastmod("smart-link.ly")).not.toBe("")
    expect(lastmod("/pricing")).not.toBe("")
  })

  test("apple-mobile-web-app-capable موجود (r9)", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" })
    await expect(page.locator('meta[name="apple-mobile-web-app-capable"]')).toHaveAttribute("content", "yes")
  })
})
