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
const BAR = { dark: "#000000", light: "#fafafa" } as const

export function ThemeColorSync() {
  const { resolvedTheme } = useTheme()
  useEffect(() => {
    // resolvedTheme غير معرّف قبل الترطيب — تجاهل صامت (لا وميض)
    if (resolvedTheme !== "dark" && resolvedTheme !== "light") return
    const color = BAR[resolvedTheme]
    for (const meta of document.querySelectorAll<HTMLMetaElement>(
      'meta[name="theme-color"]'
    )) {
      if (meta.content !== color) meta.content = color
    }
  }, [resolvedTheme])
  return null
}
