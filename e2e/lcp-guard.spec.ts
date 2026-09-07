import { test, expect } from "./fixtures"

/**
 * r9 — حارس إنجاز الجولات على HTML الخام (بلا تنفيذ JS عبر request):
 * جراحة r8 عمّمتها r9 على الصفحات الفرعية — h1 والمقدمة (عناصر LCP
 * المرجّحة) يجب أن تكون في إخراج الخادم خالصة من أي انتظار reveal.
 * لو عاد عنصر LCP ليُصيَّر client-side أو يُلف في reveal-up، يقع هذا
 * الاختبار قبل أن يصل الانحدار إلى الإنتاج.
 */

const LCP_MARKS: Record<string, { h1: string; intro?: string }> = {
  "/": { h1: "SmartLink", intro: "منصة موحدة تجمع حلولنا الرقمية المبتكرة" },
  "/about": { h1: "عن SmartLink", intro: "SmartLink منصة رقمية ليبية متكاملة" },
  "/pricing": { h1: "الخطط والأسعار", intro: "اختر الخطة المناسبة لعملك" },
  "/contact": { h1: "تواصل معنا", intro: "فريقنا جاهز لمساعدتك" },
  "/privacy": { h1: "سياسة الخصوصية" },
  "/terms": { h1: "شروط الاستخدام" },
}

test.describe("r9 — عناصر LCP في HTML الخام (تعميم جراحة r8)", () => {
  for (const [path, marks] of Object.entries(LCP_MARKS)) {
    test(`${path} — h1 والمقدمة حاضران قبل أي JS`, async ({ request }) => {
      const res = await request.get(path)
      expect(res.status()).toBe(200)
      const html = await res.text()
      expect(html).toContain(`<h1`)
      expect(html).toContain(marks.h1)
      if (marks.intro) {
        expect(html).toContain(marks.intro)
      }
    })
  }

  test("الصفحات الفرعية — h1 والمقدمة بلا reveal (عناصر LCP فورية)", async ({ request }) => {
    /* الترويسة كانت حاوية واحدة reveal-up تخفي h1 حتى 0.6s — الآن حاوية
       الترويسة عارية والشارة وحدها تحمل reveal-d1. نفحص وسما h1/وp
       المقدمة حرفياً بدل نافذة عامة (الشارة المشروعة تحمل reveal). */
    const tagAt = (html: string, idx: number) =>
      html.slice(idx, html.indexOf(">", idx) + 1)
    for (const [path, marks] of Object.entries(LCP_MARKS)) {
      if (path === "/") continue // الرئيسية محروسة باختبار r8 المخصص
      const html = await (await request.get(path)).text()
      const h1Idx = html.indexOf("<h1")
      expect(h1Idx).toBeGreaterThan(-1)
      expect(tagAt(html, h1Idx)).not.toContain("reveal")
      if (marks.intro) {
        const introIdx = html.indexOf(marks.intro)
        expect(introIdx).toBeGreaterThan(-1)
        // اجعل أقرب وسم <p قبل النص — المقدمة فقرة وليست داخل عنصر متحرك
        const pIdx = html.lastIndexOf("<p", introIdx)
        expect(pIdx).toBeGreaterThan(-1)
        expect(tagAt(html, pIdx)).not.toContain("reveal")
      }
    }
  })
})

test.describe("r9 — محتوى pricing الخادم (تدقيق P1-4)", () => {
  test("الخطتان والأسعار والميزات في HTML الخام + CTA للمنتج", async ({ request }) => {
    const res = await request.get("/pricing")
    const html = await res.text()

    // الخطتان
    expect(html).toContain("Smart Menu")
    expect(html).toContain("SmartBot")
    // السعر المعروض: مجاني لكل خطة (ظهوران على الأقل)
    expect(html.match(/مجاني/g)?.length ?? 0).toBeGreaterThanOrEqual(2)
    // ميزة جوهرية من كل خطة
    expect(html).toContain("منيو رقمي تفاعلي")
    expect(html).toContain("ردود تلقائية ذكية")
    // CTA الخطة يقود للمنتج مباشرة (r9 C10) وليس لنموذج التواصل
    expect(html).toContain('href="https://menu.smart-link.ly"')
    expect(html).toContain('href="https://bot.smart-link.ly"')
  })

  test("قائمة التنقل الرئيسية تعرض «الأسعار» (تدقيق L2)", async ({ page }) => {
    await page.goto("/pricing", { waitUntil: "domcontentloaded" })
    const nav = page.getByRole("navigation", { name: "التنقل الرئيسي" })
    await expect(nav.getByRole("link", { name: "الأسعار" })).toHaveAttribute("href", "/pricing")
  })
})
