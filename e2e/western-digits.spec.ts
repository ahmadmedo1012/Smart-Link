import { test, expect } from "./fixtures"
import { PAGES } from "./fixtures"

/**
 * عقد الأرقام الغربية (E1 — مرحلة 9): كل نص يصل إلى DOM الواجهة يُعرض
 * بالأرقام الغربية 1234567890 فقط. العقد لا يمس تعليقات الكود (لا تُصيَّر)
 * ولا مدخلات المستخدم (money.ts/phone.ts يطبّعان المدخلات الشرقية إلى
 * غربية — اختبارات contact.spec تغطي ذلك الطريق).
 *
 * الانحدار المؤكد الذي ولّد هذا العقد: أرقام فصول العوالم ٠١/٠٢/٠٣
 * (worlds.ts → .ln-world-num) كانت ترسم العربية الشرقية على الشاشة.
 */
const ARABIC_INDIC = /[\u0660-\u0669]/

test.describe("الأرقام الغربية — لا أرقام عربية-هندية في أي DOM مصيَّر", () => {
  for (const p of PAGES) {
    test(`${p.path} — نص الصفحة كله أرقام غربية`, async ({ page }) => {
      await page.goto(p.path, { waitUntil: "networkidle" })
      const text = await page.evaluate(() => document.body.innerText)
      const hits = text.match(new RegExp(ARABIC_INDIC, "g"))
      expect(
        hits,
        `Arabic-Indic digits rendered in the DOM on ${p.path}: ${hits?.join(" ")}`
      ).toBeNull()
    })
  }
})
