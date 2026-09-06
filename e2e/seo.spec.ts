import { test, expect, PAGES, BASE } from "./fixtures"

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
      await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "ar_LY")

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
