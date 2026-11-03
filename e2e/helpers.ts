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

/* r-phase6 (P6-2-a): منفذ الاختبار — نفس منطق playwright.config.ts.
   اختبارات الـ socket الخام وno-JS كانت تحفر 3000 حرفياً فتضرب أياً
   كان يستمع هناك (في بيئة الصندوق المشترك هذا خادم mission-control
   — تطبيق مختلف كلياً!). الآن الجميع يقرأ E2E_PORT نفسه (الافتراضي
   3111)، والـ CI بلا ضبط يحصل على الافتراضي كما هو. */
export const E2E_PORT = Number(process.env.E2E_PORT || 3111)
export const E2E_ORIGIN = `http://localhost:${E2E_PORT}`

export const slug = (p: string) => (p === "/" ? "home" : p.replace(/^\//, ""))

/** بوابة الترطيب: إثبات أن React اكتمل ترطيبه قبل أي تفاعل بالهيدر
 *  (hover قبل اكتمال الترطيب كان فشلاً متقطعاً حقيقياً تحت 4 عمال).
 *
 *  r133 (A7 §1 re-base): البوابة كانت تنتظر مبدّل المظهر وحده — وهذا
 *  مستحيل على الرئيسية منذ r128 (تقسيم الكروم: الرئيسية عالم مدارك Night الخاص
 *  بلا مبدّل). الآن تُثبت الترطيب حسب السطح:
 *  · صفحات المنتج: المبدّل يُصيَّر بعد mount فقط — أقوى إشارة.
 *  · الرئيسية: حزام useReveal يضيف `in-view` لحاجب الهيرو بعد الترطيب
 *    (مركب SSR بلا الفئة) — كتابة DOM نقية ما بعد الترطيب. */
export async function hydrationGate(page: Page) {
  const isLanding = await page.evaluate(
    () => document.querySelector(".landing") !== null
  )
  if (isLanding) {
    await expect(page.locator(".ln-hero-eyebrow.in-view")).toBeVisible()
  } else {
    await expect(page.getByRole("button", { name: /تفعيل المظهر/ })).toBeVisible()
  }
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

/** وسوم قواعد axe — المصدر الواحد لكل مسح في الجناح (P42-8d: كانت
 *  حرفية في ثلاثة أماكن). wcag22aa وُلدت هذه الجولة: axe-core 4.14
 *  يحمل قاعدة واحدة بهذا الوسم — target-size (WCAG 2.5.8) — وهي
 *  تغطي فئة جرد اللمس المخصص (sim-touch-targets) لا يراها: أهداف
 *  المؤشر التي ليست a[href]/button (summary/details الأصيلة في
 *  أسئلة ال landing، وحقول النموذج input/select/textarea). فُحصت
 *  نظيفة قبل التثبيت: 8 أسطح × وضعان × إطاران (1280/375) + 4 حالات
 *  تفاعلية (درج الجوال مفتوح، القائمة المنسدلة، أخطاء النموذج،
 *  الأسئلة المفتوحة) — صفر انتهاكات. باقي معايير 2.2 AA (2.4.11
 *  التركيز غير المحجوب، 2.5.7 السحب، 3.3.8 المصادقة) لا تحملها
 *  قواعد axe 4.14 أصلاً — المسح اليدوي لهذه الجولة غطاها (سجّل
 *  P42-8d): التركيز مرئي دائماً (حرّاس sim-adversarial 13)، لا
 *  وظيفة تُنجَز بالسحب (الـChainSculpture فن زخرفي aria-hidden —
 *  دورانه بالسحب ترفيهي لا تشغيلي ويُلغى تحت reduced-motion)،
 *  ولا مصادقة على الإطلاق. */
export const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] as const

/** مسح axe-core بنفس وسوم a11y.spec — الوضعان يُفحصان عبر استدعاءات
 *  منفصلة بعد تبديل الثيم.
 *  r15: يُفحص بحالة prefers-reduced-motion — الموقع يدعمها أصلاً
 *  (styles.css @media reduce يسقط كل animation/transition إلى 0.01ms).
 *  لماذا: axe كان يفحص DOM «حية» أثناء حركات الدخول (reveal-up 0.6s,
 *  menu-pop 0.2s) — عنصر عند opacity<0.5 يُقرأ تباينه مختلطاً نحو خلفية
 *  الصفحة (#010101) فيفشل color-contrast بشكل متقطع (فلّاك) تحت التحميل.
 *  التقييد يسقط الحركات لحالتها النهائية: لا انتظار، لا CSS مُحقن، ولا
 *  ألوان مصطنعة — وبما أن reduce يغيّر المدة فقط لا اللون، يستحيل أن
 *  يخفي انتهاكاً حقيقياً للوضع المستقر.
 *  r192 (إغلاق ثغرة r15): قلب المواصفة — تغيير transition-duration لا
 *  يمسّ انتقالًا «بدأ فعلًا»: مدة الانتقال تُثبَّت لحظة بدئه، فالعنصر في
 *  منتصف تدرّج الدخول يُكمل مدته الأصلية (0.6s + تأخيرات d1-d5) رغم
 *  تقليد reduce، ويقرأ axe تباينه عند شفافية جزئية. الدليل: التشغيلة
 *  41029201829 (push على فرع التحقق) — 58 انتهاك color-contrast وهميًا
 *  على .ln-btn-gold (fg #220d06 على خلفية مركّبة داكنة) بينما مسار PR
 *  على نفس SHA بالضبط أخضر دقيقة قبله؛ فشل السطر a11y-states.spec.ts:23
 *  ثلاث محاولات ثم نجح أخوه a11y.spec.ts:66 بعد إعادة. الحل الحتمي تحت
 *  نفس سقف r15 (لا تخفيف توكيد ولا تخطي): بعد التقليد، انتظار حتى يبلغ
 *  كل .reveal-up.in-view حالته النهائية (opacity 1) — نافذة أقل من
 *  ثانية، تُغلق السباق للأبد. */
export async function axeScan(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" })
  /* r192: الشيك على opacity وحدها عمداً — التحويل لا يُمسّ لأن أزرار
     الهيرو تحمل translate(var(--mag-x/y)) دائمة (المؤثر المغناطيسي،
     landing.css:479/486/530) فلا تبلغ "none" أبدًا؛ والموضع لا علاقة
     له بقاعدة color-contrast أصلاً (الشفافية الفعّالة هي ما يُقرأ). */
  await page.waitForFunction(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal-up.in-view")
    for (const el of els) {
      if (getComputedStyle(el).opacity !== "1") return false
    }
    return true
  })
  const results = await new AxeBuilder({ page })
    .withTags([...AXE_TAGS])
    .analyze()
  return results.violations
}
