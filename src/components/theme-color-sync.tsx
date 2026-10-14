"use client"
import { useEffect } from "react"
import { useTheme } from "next-themes"

/* r14-M7 (P1): شريط المتصفح/الحالة كان يتبع ثيم نظام التشغيل لا ثيم
   المستخدم — الوسمان في layout.tsx مقيّدان بـ media=prefers-color-scheme
   بينما defaultTheme="dark" والمفتاح ثنائي بلا خيار system. كل زائر أول
   على جهاز OS فاتح كان يحصل على: صفحة سوداء + شريط أبيض (ويمتد الأمر
   إلى شريط حالة التطبيق المثبت WebAPK).

   التصميم: يُصيَّر null — صفر markup من الخادم وصفر تغيير في HTML الأول،
   فلا وميض ولا أثر على قياسات LCP/CLS. يُركَّب داخل <ThemeProvider>
   لأنه يحتاج سياق next-themes. يعدّل content فقط ويبقي media كما هو —
   اختبار seo.spec القائم (يؤكد الوسمين بقيمتيهما على HTML الخادم)
   يبقى أخضر بلا تعديل. حالة system مستقبلاً تُحل تلقائياً:
   resolvedTheme يعيد قيمة OS والوسوم الفعلية للـmedia تكون مطابقة. */
/* r148 (19-AUDIT-SL D11): مصدر واحد للقيم — كان BAR يطابق يدويًا قيمتي
   --background المثبتتين في styles.css؛ لو أعاد الكانون ضبط الأرضيات
   لانحرف هذا الملف بصمت. الآن يُقرأ التوكن من CSS نفسه وقت التشغيل:
   getComputedStyle يحلّ --background من :root أو .light حسب الثيم
   الفعلي، فالمرآة اليدوية انقرضت. (القيم المعادة هي الحرفيات المعلنة
   نفسها — KODE '#050507'/'#F4F2ED' منذ r160 — فوسم meta يبقى سليمًا،
   واختبار seo الذي يثبت قيمتي الوسمين على HTML الخادم لم يُمس.) */

export function ThemeColorSync() {
  const { resolvedTheme } = useTheme()
  useEffect(() => {
    // resolvedTheme غير معرّف قبل الترطيب — تجاهل صامت (لا وميض)
    if (resolvedTheme !== "dark" && resolvedTheme !== "light") return
    // next-themes يطبّق صنف الثيم على <html> في أثر الأب (آثار الأبناء
    // تُستنفد أولًا) — القراءة المباشرة داخل الأثر تلتقط أرضية الثيم
    // السابق (تأخّر خطوة كاملة عند كل تبديل، تحقق حي). إطار واحد يكفي:
    // تفريغ الآثار السلبي متزامن، وكل ما يُجدول داخله يعمل بعده.
    const raf = requestAnimationFrame(() => {
      // .toUpperCase(): الحاسوب يطبّع hex إلى صيغة صغيرة (#070b16) بينما
      // عقد seo (e2e/seo.spec.ts:227) يثبت الحرفيات بحالتها المعلنة
      // (#070B16) — التطبيع يعيد القيمة المكتوبة نفسها ويبقي المصدر واحدًا.
      const color = getComputedStyle(document.documentElement)
        .getPropertyValue("--background")
        .trim()
        .toUpperCase()
      if (!color) return
      for (const meta of document.querySelectorAll<HTMLMetaElement>(
        'meta[name="theme-color"]'
      )) {
        if (meta.content !== color) meta.content = color
      }
    })
    return () => cancelAnimationFrame(raf)
  }, [resolvedTheme])
  return null
}
