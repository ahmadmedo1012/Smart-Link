import { test, expect } from "./fixtures"
import { hydrationGate } from "./helpers"

/**
 * r14 — عقود المنصة (ThemeColorSync + حماية hover CSS)
 * ---------------------------------------------------------------------------
 * عقود سلوكية/معمارية من جولة الجوال:
 *  1. theme-color يتبع اختيار المستخدم لا نظام التشغيل (M7-P1: الزائر
 *     الأول على جهاز OS فاتح كان يرى شريط متصفح أبيض فوق صفحة سوداء —
 *     والحالة الافتراضية للموقع داكنة).
 *  2. عقد CSS: كل :hover مكتوب يدوياً خارج Tailwind يجب أن يعيش داخل
 *     @media (hover:hover) وإلا التصق على لمسة iOS (M5: Tailwind v4 يحرس
 *     الـ36 محدداً تلقائياً — القواعد اليدوية وحدها تحتاج هذا الحارس).
 */

/* ═══ 1) theme-color الديناميكي ═══ */
test.describe("r14 — theme-color يتبع المستخدم", () => {
  test("OS داكن + المستخدم يبدّل للفاتح → الوسمان يتبعانه (لا OS)", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" })
    await page.goto("/", { waitUntil: "load" })
    await hydrationGate(page)
    // النظام داكن + الموقع داكن (الافتراضي) → الشريط داكن
    const metas = page.locator('meta[name="theme-color"]')
    await expect(metas).toHaveCount(2)
    await expect(metas.first()).toHaveAttribute("content", "#000000")
    await expect(metas.nth(1)).toHaveAttribute("content", "#000000")
    // المستخدم يبدّل إلى الفاتح → الوسمان يتبعانه رغم بقاء OS داكناً
    await page.getByRole("button", { name: "تفعيل المظهر الفاتح" }).click()
    await expect(page.locator("html")).toHaveClass(/light/)
    await expect(metas.first()).toHaveAttribute("content", "#fafafa")
    await expect(metas.nth(1)).toHaveAttribute("content", "#fafafa")
  })
})

/* ═══ 2) عقد حماية hover اليدوي ═══ */
/* الاستثناءات الموثقة (قواعد تخص سطح المكتب أو قتّال حركة — لا تأثير لها
   على اللمس): شريط تمرير سطح المكتب، ونسخة قتل الحركة داخل
   prefers-reduced-motion (animation:none — لم تصنع أي حركة أصلاً). */
const HOVER_OUTSIDE_GUARD_ALLOWLIST = [
  /scrollbar-thumb:hover/,
  /\.group:hover \.cta-shine/,
]

test("r14 — عقد CSS: لا :hover بلا حماية (hover:hover) خارج القائمة الموثقة", async ({ request }) => {
  const html = await (await request.get("/")).text()
  const cssHref = html.match(/href="(\/_next\/static\/chunks\/[^"]+\.css[^"]*)"/)?.[1]
  expect(cssHref, "FINDING[sticky-hover] لم يُعثر على CSS في الصفحة").toBeTruthy()
  const css = await (await request.get(cssHref!)).text()

  /* جرذ كتل hover:hover بموازنة أقواس حقيقية (regex الكتل المتداخلة
     هش — M6 نبّه عليه؛ الموازنة تعمل مهما تعشّق البناء). */
  const stripped: string[] = []
  const needle = "@media (hover:hover){"
  let i = 0
  while (true) {
    const j = css.indexOf(needle, i)
    if (j === -1) {
      stripped.push(css.slice(i))
      break
    }
    stripped.push(css.slice(i, j))
    let depth = 0
    let k = j + needle.length - 1
    while (k < css.length) {
      if (css[k] === "{") depth++
      else if (css[k] === "}") {
        depth--
        if (depth === 0) break
      }
      k++
    }
    i = k + 1
  }
  const unguarded = (stripped.join("").match(/[^{}]*:hover[^{]*\{/g) ?? []).map((s) =>
    s.trim().slice(0, 60)
  )
  const violating = unguarded.filter(
    (s) => !HOVER_OUTSIDE_GUARD_ALLOWLIST.some((re) => re.test(s))
  )
  expect(
    violating,
    `FINDING[sticky-hover] قواعد :hover خارج @media(hover:hover) — تلتصق على اللمس: ${JSON.stringify(violating)}`
  ).toEqual([])
})
