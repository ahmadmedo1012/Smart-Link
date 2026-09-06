import { test, expect } from "./fixtures"

/**
 * ترويسات الأمان (r4/r5) والتخزين المؤقت غير القابل للتغيير (r4):
 * كل ترويسة أمنية من next.config.ts تُطبَّق فعلاً على الاستجابات الحية،
 * ولا كشف لـ X-Powered-By.
 */
test.describe("الترويسات الأمنية", () => {
  test("GET / — CSP + HSTS + nosniff + DENY + referrer + permissions", async ({ request }) => {
    const res = await request.get("/")
    const h = res.headers()

    const csp = h["content-security-policy"]
    expect(csp, "CSP must be present").toBeTruthy()
    // الموجهات الحاسمة للتطبيق
    expect(csp).toContain("default-src 'self'")
    expect(csp).toContain("frame-ancestors 'none'")
    expect(csp).toContain("base-uri 'self'")
    expect(csp).toContain("form-action 'self'")
    expect(csp).toContain("object-src 'none'")
    expect(csp).toContain("upgrade-insecure-requests")

    expect(h["strict-transport-security"]).toContain("max-age=31536000")
    expect(h["x-content-type-options"]).toBe("nosniff")
    expect(h["x-frame-options"]).toBe("DENY")
    expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin")
    expect(h["permissions-policy"]).toContain("camera=()")

    // بوابة الخصوصية: لا كشف لإطار العمل
    expect(h["x-powered-by"]).toBeUndefined()
  })

  test("الأصول العامة — تخزين immutable لسنة كاملة (r4)", async ({ request }) => {
    for (const path of [
      "/og-smartlink.jpg",
      "/logo.png",
      "/favicon-32.png",
      "/apple-touch-icon.png",
      "/icon-192.png",
      "/icon-512.png",
      "/icon-512-maskable.png",
      "/images/smart-menu.jpg",
    ]) {
      const res = await request.get(path)
      expect(res.status(), path).toBe(200)
      expect(res.headers()["cache-control"], path).toContain("immutable")
      expect(res.headers()["cache-control"], path).toContain("max-age=31536000")
    }
  })

  test("404 — تحمل نفس الترويسات الأمنية", async ({ request }) => {
    const res = await request.get("/no-such-page-security-probe")
    expect(res.status()).toBe(404)
    expect(res.headers()["content-security-policy"]).toContain("default-src 'self'")
    expect(res.headers()["x-content-type-options"]).toBe("nosniff")
  })

  test("API — JSON فقط ولا X-Powered-By", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: { name: "أ", email: "بريد-غير-صالح", message: "نص" },
    })
    expect(res.status()).toBe(400)
    expect(res.headers()["content-type"]).toContain("application/json")
    expect(res.headers()["x-powered-by"]).toBeUndefined()
  })
})
