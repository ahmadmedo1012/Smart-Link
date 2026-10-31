"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Share } from "lucide-react"

/* P36-G (تلميح التثبيت): beforeinstallprompt كان حدثاً يُطلق بلا
   مستمع — الموقع قابل للتثبيت بمعاييره الكاملة منذ r14 (مانيفست +
   أيقونات maskable + عامل خدمة) لكن لا شيء كان يدفع الزائر نحو
   التثبيت. هذا المكوّن «تلميح» لا «إغراء»:
   - كروم/إيدج/أندرويد: preventDefault عند الحدث فنملك نحن واجهة
     التلميح بدل شريط المتصفح المصغّر، وprompt() لا يُستدعى إلا من
     زرّ «تثبيت» — بعد 2.5s من الحدث (خارج نافذة LCP الحساسة؛
     تسجيل الـSW نفسه أُجّل إلى idle بذات المنطق r14-post).
   - سفاري iOS لا يُطلق الحدث إطلاقاً — البطاقة ذاتها تتحول إلى
     التعليمات اليدوية «زرّ المشاركة ← إضافة إلى الشاشة الرئيسية»
     (تدقيق P36: تدعم فقط إذا كان تابعاً لنمطنا — هو كذلك: نفس
     البطاقة، بلا زر تثبيت، ببُعد واحد إضافي).
   - «لا، شكراً» أو Escape أو رفض النافذة الأصلية: تذكّر دائم في
     localStorage — لا إلحاح في أي زيارة لاحقة.
   - لا حجب للمحتوى أبداً: بلا خلفية شاملة، pointer-events على
     البطاقة وحدها، ثابت fixed بلا تدفق (CLS صفر)، ويُصيَّر فارغاً
     تماماً في الخادم وفي متصفحات الاختبار (الحدث لا يُطلق هناك)
     فتبقى عقود e2e/axe/touch-targets كما هي بلا ضيفاء جدد.
   - الوصول: زرّان بمساحة لمس ≥44px (قاعدة الأسطول)، حلقة تركيز
     --ring الكنسية، دخول لطيف عبر --t-base (يَصفُر تلقائياً تحت
     prefers-reduced-motion — طبقة تصفير التوكنات في styles.css)،
     وإعلان aria-live مهذّب للقارئات عند الظهور. */

const DISMISS_KEY = "smartlink-install-hint-dismissed"
/* المهل: الآلي 2.5s بعد الحدث، واليدوي (iOS) 4s — تلميح لا يستعجل
   أول نظرة على الصفحة. */
const INSTALL_DELAY_MS = 2500
const IOS_DELAY_MS = 4000

/* beforeinstallprompt ليس في مكتبة DOM عند TS — أصغر سطح نستهلكه. */
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

/** "install" = قبلنا الحدث (نافذة أصلية متاحة) · "ios-manual" = تعليمات A2HS اليدوية. */
type Hint = "install" | "ios-manual"

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

/* iPhone/iPad/iPod + تمويه iPadOS 13+ (سفاري «ماك» بلمس) — الكشف
   التقليدي؛ سفاري iOS لا يطلق beforeinstallprompt قط. */
function isIOS(): boolean {
  const ua = window.navigator.userAgent
  return /iphone|ipad|ipod/i.test(ua) || (ua.includes("Macintosh") && "ontouchend" in document)
}

function isDismissed(): boolean {
  try {
    return localStorage.getItem(DISMISS_KEY) === "1"
  } catch {
    return false /* وضع خاص/تخزين محجوب — الاحترام يبقى داخل الجلسة */
  }
}

export function InstallPrompt() {
  const [hint, setHint] = useState<Hint | null>(null)
  const [entered, setEntered] = useState(false)
  const deferred = useRef<BeforeInstallPromptEvent | null>(null)
  /* رفض الجلسة الحالية — يمنع إعادة الظهور إذا أعاد المتصفح إطلاق
     الحدث بعد «لا، شكراً» في الزيارة نفسها. */
  const dismissedRef = useRef(false)

  const dismiss = useCallback(() => {
    dismissedRef.current = true
    try {
      localStorage.setItem(DISMISS_KEY, "1")
    } catch {
      /* تخزين محجوب — يكفي احترام الجلسة الحالية */
    }
    setHint(null)
  }, [])

  useEffect(() => {
    /* مثبَّت أصلاً (standalone/WebAPK) أو رفض سابقاً — لا تلميح أبداً */
    if (isStandalone() || isDismissed()) {
      dismissedRef.current = true
      return
    }

    let timer: number | undefined
    let visibleListener: (() => void) | null = null
    let shown = false

    const show = (kind: Hint) => {
      if (shown || dismissedRef.current) return
      if (document.visibilityState === "visible") {
        shown = true
        setHint(kind)
        return
      }
      /* اللسان مخفي الآن — انتظر عودة الزائر بدل حرق التلميح */
      visibleListener = () => {
        if (document.visibilityState !== "visible" || shown || dismissedRef.current) return
        shown = true
        setHint(kind)
      }
      document.addEventListener("visibilitychange", visibleListener)
    }

    const onBeforeInstall = (event: Event) => {
      /* نلغي الشريط المصغّر الأصلي ونملك الواجهة — ولا prompt() إلا
         من زرّنا. المتصفح قد يعيد إطلاق الحدث: نُحدّث المرجع ونحتفظ
         بظهور واحد. */
      event.preventDefault()
      deferred.current = event as BeforeInstallPromptEvent
      window.clearTimeout(timer)
      timer = window.setTimeout(() => show("install"), INSTALL_DELAY_MS)
    }

    const onAppInstalled = () => {
      deferred.current = null
      dismissedRef.current = true
      setHint(null)
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstall)
    window.addEventListener("appinstalled", onAppInstalled)

    /* iOS: لا حدث هناك — التعليمات اليدوية، إلا لو وصل حدث آلي
       (متصفح مستقبلي على iOS) فالآلي أولى. */
    if (isIOS()) {
      timer = window.setTimeout(() => {
        if (!deferred.current) show("ios-manual")
      }, IOS_DELAY_MS)
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall)
      window.removeEventListener("appinstalled", onAppInstalled)
      if (visibleListener) document.removeEventListener("visibilitychange", visibleListener)
      window.clearTimeout(timer)
    }
  }, [])

  /* دخول لطيف: إطار واحد بعد التركيب يقلب الكلاس — والتصفير العالمي
     لـ--t-base تحت reduced-motion يجعل الانقلاب لحظياً هناك. */
  useEffect(() => {
    if (!hint) return
    const raf = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(raf)
  }, [hint])

  /* Escape = «لا، شكراً» — إغلاق بلوحة المفاتيح لا بالفأرة وحدها */
  useEffect(() => {
    if (!hint) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [hint, dismiss])

  const install = async () => {
    const event = deferred.current
    if (!event) return
    deferred.current = null
    try {
      await event.prompt()
      const { outcome } = await event.userChoice
      if (outcome === "accepted") {
        /* appinstalled يصل أيضاً — أحدهما يكفي */
        dismissedRef.current = true
        setHint(null)
      } else {
        /* رفض النافذة الأصلية = رفض التلميح نفسه — لا إلحاح */
        dismiss()
      }
    } catch {
      /* سحب المتصفح الأهلية بين النقر والاستدعاء — نغلق بأدب */
      setHint(null)
    }
  }

  return (
    /* الغلاف دائم الوجود (منطقة live فارغة = صفر بصري، صفر تسريب
       أحداث) — إدراج البطاقة داخله هو ما تعلنه القارئات بلطف. */
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-20 z-40 flex justify-center px-4 sm:bottom-6"
    >
      {hint ? (
        <div
          className={`pointer-events-auto flex w-full max-w-sm flex-col gap-3 rounded-2xl border border-[var(--border-strong)] bg-[var(--card)] p-4 shadow-lg transition-[opacity,transform] duration-[var(--t-base)] ${entered ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
        >
          <div className="flex items-start gap-3">
            <Image
              src="/icon-192.png"
              alt=""
              width={44}
              height={44}
              className="h-11 w-11 flex-none rounded-xl"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[var(--foreground)]">
                {hint === "install" ? "ثبّت SmartLink على جهازك" : "أضف SmartLink إلى شاشتك الرئيسية"}
              </p>
              <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
                {hint === "install" ? (
                  "وصول أسرع للمنظومة كاملة — أيقونة مباشرة على جهازك بلا متصفح."
                ) : (
                  <>
                    {"من زرّ المشاركة "}
                    <Share className="inline h-4 w-4 align-[-3px]" aria-hidden="true" />
                    {" في المتصفح، اختر «إضافة إلى الشاشة الرئيسية»."}
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hint === "install" ? (
              <button
                type="button"
                onClick={install}
                className="min-h-11 rounded-xl bg-[var(--primary)] px-5 text-sm font-semibold text-[var(--primary-fg)] transition-colors duration-[var(--t-fast)] hover:bg-[var(--accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
              >
                تثبيت
              </button>
            ) : null}
            <button
              type="button"
              onClick={dismiss}
              className="min-h-11 rounded-xl border border-[var(--border)] px-5 text-sm font-medium text-[var(--muted-foreground)] transition-colors duration-[var(--t-fast)] hover:text-[var(--foreground)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
            >
              لا، شكراً
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
