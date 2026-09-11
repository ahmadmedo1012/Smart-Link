import { expect, type Page, type Route } from "@playwright/test"
import { mkdirSync } from "node:fs"
import AxeBuilder from "@axe-core/playwright"

/* r13 (code audit P1 — «جيش المحاكاة أعاد اختراع مساعده»): 115 اختبار
   المحاكاة كُتبت بأربع موجات متوازية، فحمل كل ملف مساعده الداخلية
   بدل تصديرها — ثلاث صيغ لعزل IP (spoofIp/iso/ISOLATED_IP)، نسختان
   حرفيتان من SHOT_DIR+mkdir، ثلاث صيغ لبوابة الترطيب، ستة mock
   نجاح متطابقة، 24 حرفياً لإطار العرض الجوال، وscan() مكررة.
   كلها هنا الآن — الملف الواحد هو المكان الوحيد لتعديل أي سلوك
   مشترك (مثلاً: تغيير نطاق IP المعزول أو إطار الجوال يعدّل سطراً
   واحداً لا تسعة ملفات). */

/* لقطات الشاشة: SIM_SHOTS_DIR قابل للضبط من CI — المسار الافتراضي
   داخل test-results يُرفع كـ artifact عند الفشل (r12: المسار المطلق
   القديم أفشل 12 اختباراً على عدّاد CI بـENOENT). */
export const SHOT_DIR = process.env.SIM_SHOTS_DIR ?? "test-results/sim-shots"
mkdirSync(SHOT_DIR, { recursive: true })

export const slug = (p: string) => (p === "/" ? "home" : p.replace(/^\//, ""))

/** بوابة الترطيب: زر المظهر يُصيَّر فقط بعد mount (r10) — قبل أي
 *  تفاعل بالهيدر (hover قبل اكتمال ترطيب React كان فشلاً متقطعاً
 *  حقيقياً تحت 4 عمال). */
export async function hydrationGate(page: Page) {
  await expect(page.getByRole("button", { name: /تفعيل المظهر/ })).toBeVisible()
}

/** إطار العرض الجوال القياسي (iPhone X-class — 375×812). */
export const MOBILE_VIEWPORT = { width: 375, height: 812 } as const

/** الفحص الأفقي كما يراه المستخدم: المستند والجسد لا يتجاوزان إطار العرض.
 *  (r14-M6: مرفوع من sim-devices.spec.ts حيث كان حرفياً محلياً — استخدامه
 *  الأول كان 375×812، والآن 320/landscape كذلك. المكان الواحد لتعديل
 *  سلوك الفحص المشترك.) */
export async function assertNoHScroll(page: Page, label: string) {
  const o = await page.evaluate(() => ({
    doc: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    body: document.body.scrollWidth - document.documentElement.clientWidth,
  }))
  expect(
    o.doc,
    `FINDING[h-scroll] ${label}: documentElement فائض ${o.doc}px`
  ).toBeLessThanOrEqual(0)
  expect(
    o.body,
    `FINDING[h-scroll] ${label}: body فائض ${o.body}px`
  ).toBeLessThanOrEqual(0)
}

/** تمرير طلب النموذج إلى الخادم الحقيقي بعنوان IP مزيف فريد (route
 *  handler يعدّل الترويسات ويستمر) — لعزل دلو المعدل لكل اختبار. */
export const spoofIp = (ip: string) => (route: Route) =>
  route.continue({ headers: { ...route.request().headers(), "x-forwarded-for": ip } })

/** عزل IP لطلبات request.post المباشرة (الصيغة الثانية للتrust نفسه —
 *  نطاق 198.51.100.* محجوز للتوثيق TEST-NET-2). */
export const isoHeaders = (n: number) => ({ "x-forwarded-for": `198.51.100.${n}` })

/** جسم النجاح الحقيقي للخادم (route.ts يرسل success+message دائماً) —
 *  الـmocks التي تحاكي الخادم تستخدمه فلا تنحرف عن العقد الصارم r11. */
export const SUCCESS_BODY = JSON.stringify({
  success: true,
  message: "تم استلام رسالتك بنجاح. سنتواصل معك قريباً.",
})

/** مسح axe-core بنفس وسوم a11y.spec — الوضعان يُفحصان عبر استدعاءات
 *  منفصلة بعد تبديل الثيم. */
export async function axeScan(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze()
  return results.violations
}
