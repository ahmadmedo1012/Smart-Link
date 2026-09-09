import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { Resend } from "resend"
import { render } from "@react-email/render"
import {
  ContactNotificationEmail,
  ContactConfirmationEmail,
} from "@/emails/contact-emails"
import { SITE } from "@/lib/site"
import {
  EMAIL_RE,
  NAME_MAX,
  EMAIL_MAX,
  MESSAGE_MAX,
  NAME_LETTER_RE,
  NAME_LETTER_ERROR,
  SUBJECT_LABELS,
  CONTACT_SUCCESS_MESSAGE,
} from "@/lib/contact-rules"

const OWNER_EMAIL = SITE.email
/* r13: نطاق المرسل بات في مصدر الحقيقة الواحد مع باقي الثوابت
   التجارية — كان آخر حرف نطاق خارج SITE (route.ts:13). */
const FROM_EMAIL = SITE.fromEmail

/* In-memory rate limiting (r5, hardened r10):
   - 5 submissions per IP per minute (RATE_MAX), entries pruned at
     RATE_MAP_CAP so forged-IP floods can't grow the map unboundedly.
   - r10 (security audit P1): clientIp() now takes the LAST value of
     x-vercel-forwarded-for / x-forwarded-for. Under Vercel's append
     semantics the FIRST value is client-controlled — the old code[0]
     let an attacker bypass the limit with a rotating fake IP or ban
     a victim by spoofing theirs (the e2e suite itself forged the
     header and the server accepted it). The LAST value is the one the
     platform appended (and the only one under replace semantics);
     shape-validated, anything else falls back to the shared "unknown"
     bucket — the safe default.
   - r10: a GLOBAL cap independent of IP (GLOBAL_MAX) breaks the
     spoof-bypass chain entirely; 429 now carries Retry-After.
   - Soft limit by design (per-instance, cold-start reset) — documented
     trade-off for a marketing site; @upstash/ratelimit if abuse ever
     becomes real. */
const RATE_WINDOW_MS = 60_000
const RATE_MAX = 5
const RATE_MAP_CAP = 1000
/* r13 (testing audit F): الصمام العالمي (20/دقيقة لكل نسخة) هو درع
   إنتاج ضد دوران الـIP — لكن مواصفات API في الجناح ترسل ~25 طلباً
   صالحاً في الدورة، فتشغيلها المجمّع (أو آلة أبطأ) كان يعبر الصمام
   ويقلب اختبارات غير ذات صلة إلى 429 (قنبلة توقيت موثقة منذ r10).
   الصمام قابل للضبط بيئياً لمنصة الاختبار (webServer يضبط
   RATE_GLOBAL_MAX)؛ الإنتاج بلا متغير = 20 كما هو. دلو الـIP —
   الصمام الفعلي الذي تختبره اختبارات 429 — ليس قابلاً للضبط. */
const GLOBAL_MAX = Number(process.env.RATE_GLOBAL_MAX ?? 20) || 20
const BODY_MAX_BYTES = 65_536
const SUBJECT_MAX = 64

const rateMap = new Map<string, { count: number; reset: number }>()
const globalBucket = { count: 0, reset: 0 }

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  if (rateMap.size > RATE_MAP_CAP) {
    for (const [k, v] of rateMap) {
      if (now > v.reset) rateMap.delete(k)
    }
  }
  const entry = rateMap.get(ip)
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + RATE_WINDOW_MS })
    return false
  }
  entry.count += 1
  return entry.count > RATE_MAX
}

function isGloballyLimited(): boolean {
  const now = Date.now()
  if (now > globalBucket.reset) {
    globalBucket.count = 0
    globalBucket.reset = now + RATE_WINDOW_MS
  }
  globalBucket.count += 1
  return globalBucket.count > GLOBAL_MAX
}

function clientIp(h: Headers): string {
  const raw = h.get("x-vercel-forwarded-for") ?? h.get("x-forwarded-for") ?? ""
  const candidate = raw.split(",").pop()?.trim() || h.get("x-real-ip") || ""
  const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(candidate) || /^[0-9a-f:.]+$/i.test(candidate)
  return isIp ? candidate : "unknown"
}

export async function POST(req: Request) {
  /* r10 (security audit P2 — defense in depth): bound the body BEFORE
     parsing. r13 (security audit P2): content-length is CLIENT-CONTROLLED
     and absent entirely under Transfer-Encoding: chunked — the gate could
     be skipped in exactly the off-platform scenario it was built for
     (a lying small value, or no value at all). The raw text is now read
     and measured instead: the REAL size decides, headers be damned.
     (Char-based cap — UTF-8 byte size can be 3× this for Arabic; the
     absolute memory bound remains Vercel's 4.5MB request cap.) */
  let raw: string
  try {
    raw = await req.text()
  } catch {
    return NextResponse.json(
      { error: "طلب غير صالح — تعذّر قراءة البيانات المرسلة" },
      { status: 400 }
    )
  }
  if (raw.length > BODY_MAX_BYTES) {
    return NextResponse.json({ error: "الطلب أكبر من المسموح" }, { status: 413 })
  }
  // r9 (security): a malformed body used to fall into the generic catch →
  // 500 + a misleading "خطأ في الإرسال" message. A bad request is a 400,
  // and the 500 path stays reserved for genuine send-side failures.
  let body: Record<string, unknown>
  try {
    body = JSON.parse(raw) as Record<string, unknown>
  } catch {
    return NextResponse.json(
      { error: "طلب غير صالح — تعذّر قراءة البيانات المرسلة" },
      { status: 400 }
    )
  }
  const { name, email, subject, message, company } = body

  try {
    const headersList = await headers()

    // Honeypot: a field invisible to humans — any content means a spam bot.
    // Return a fake success so the bot thinks it worked and moves on.
    // r10 (security audit P3): the response is now byte-identical to the
    // real success (a shape probe could tell the trap from the real thing).
    /* r13 (security audit P3): honeypot hits now CONSUME the rate budget
       (both buckets) before the trap answers — previously a bot could
       loop parse-and-fake-200 unboundedly without ever meeting a limit
       (the limiter sat AFTER the early return). Under the limit the trap
       answers the same fake 200 (deception preserved); past it the bot
       gets the standard 429 — indistinguishable from the general
       limiter, so no extra information leaks. */
    if (typeof company === "string" && company.trim() !== "") {
      if (isRateLimited(clientIp(headersList)) || isGloballyLimited()) {
        return NextResponse.json(
          { error: "أرسلت عدة رسائل متتالية — انتظر دقيقة ثم حاول مجدداً" },
          { status: 429, headers: { "Retry-After": "60" } }
        )
      }
      return NextResponse.json({
        success: true,
        message: CONTACT_SUCCESS_MESSAGE,
      })
    }

    // Validate — r11 (محاكاة عدائية + تدقيق كود P1): الفحص القديم كان
    // truthiness (!name) — يقبل "   " (مسافات فقط) و[] (مصفوفة فارغة
    // truthy!) ثم يقصّها sanitize فترسل الرسالة باسم فارغ. الأنواع
    // تُفحص أولاً، ثم الفراغ بعد القصّ، ثم قاعدة الأحرف المشتركة مع
    // النموذج (إيموجي فقط = رفض) — نفس وحدة العقد lib/contact-rules.
    if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string") {
      return NextResponse.json(
        { error: "جميع الحقول المطلوبة يجب أن تكون مملوءة" },
        { status: 400 }
      )
    }

    /* Basic email validation + r9 cap (254 = RFC 5321 max forward path;
       before this a multi-megabyte "email" sailed through to Resend and
       failed late with 502). r10: the regex and limits are the SAME module
       the form validates with (lib/contact-rules). */
    if (typeof email !== "string" || !EMAIL_RE.test(email) || email.length > EMAIL_MAX) {
      /* r13 (عقد القنوات): field يختم أخطاء الحقل الواحد — النموذج
         يعيّن الخطأ للمفتاح لا لمطابقة النص العربي. */
      return NextResponse.json(
        { error: "البريد الإلكتروني غير صالح", field: "email" },
        { status: 400 }
      )
    }

    // Length caps (protect the mail service from abuse)
    if (String(name).length > NAME_MAX || String(message).length > MESSAGE_MAX) {
      return NextResponse.json(
        { error: "أحد الحقول أطول من المسموح" },
        { status: 400 }
      )
    }

    // Sanitize inputs to prevent XSS. r5 (gstack /review — Type Coercion at
    // Boundaries): callers may omit fields or send non-strings (the UI always
    // sends strings, but a direct API call with a missing `subject` used to
    // crash with undefined.replace → 500 instead of a clean 4xx).
    // r10 (security audit P3): Object.hasOwn guards the label map against
    // prototype keys (__proto__/toString returned truthy values from the
    // prototype chain → garbage in the owner's subject line).
    const sanitize = (str: string) => str.replace(/[<>]/g, "").trim()
    const cleanName = sanitize(name)
    const cleanEmail = sanitize(email)
    const subjectKey = sanitize(typeof subject === "string" ? subject : "")
    const cleanMessage = sanitize(message)

    /* r11: الفراغ يُفحص بعد القصّ (لا قبله) — هذا هو المكان الذي
       تسلّل منه name:"   " وname:[] طوال عمر الموقع. */
    if (!cleanName || !cleanEmail || !cleanMessage) {
      return NextResponse.json(
        { error: "جميع الحقول المطلوبة يجب أن تكون مملوءة" },
        { status: 400 }
      )
    }
    if (!NAME_LETTER_RE.test(cleanName)) {
      return NextResponse.json(
        { error: NAME_LETTER_ERROR, field: "name" },
        { status: 400 }
      )
    }
    const cleanSubject = Object.hasOwn(SUBJECT_LABELS, subjectKey)
      ? SUBJECT_LABELS[subjectKey]
      : "استفسار عام"
    if (subjectKey.length > SUBJECT_MAX) {
      return NextResponse.json(
        { error: "أحد الحقول أطول من المسموح" },
        { status: 400 }
      )
    }

    // Rate limiting (r10: clientIp() + the global bucket — see above)
    if (isRateLimited(clientIp(headersList)) || isGloballyLimited()) {
      return NextResponse.json(
        { error: "أرسلت عدة رسائل متتالية — انتظر دقيقة ثم حاول مجدداً" },
        { status: 429, headers: { "Retry-After": "60" } }
      )
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      // Fail loud, never lie with a fake success
      console.error("[Contact] RESEND_API_KEY is not configured")
      return NextResponse.json(
        {
          error:
            `خدمة البريد غير مهيأة حالياً. تواصل معنا مباشرة عبر واتساب ${SITE.whatsapp.local} أو ${SITE.email}`,
        },
        { status: 503 }
      )
    }

    const resend = new Resend(apiKey)

    // 1) Notification to the owner
    /* r11 (تدقيق كود P2): البريدان كانا html فقط — إشارة HTML_ONLY
       كلاسيكية ترفع نتيجة السبام؛ نص خام يُولّد من نفس القالب.
       (يُفعّل تلقائياً لحظة إضافة RESEND_API_KEY — لا كود إضافي.) */
    const { data: notifyData, error: notifyError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: OWNER_EMAIL,
      replyTo: cleanEmail,
      subject: `[تواصل SmartLink] ${cleanSubject}`,
      html: await render(
        ContactNotificationEmail({
          name: cleanName,
          email: cleanEmail,
          subject: cleanSubject,
          message: cleanMessage,
        })
      ),
      text: await render(
        ContactNotificationEmail({
          name: cleanName,
          email: cleanEmail,
          subject: cleanSubject,
          message: cleanMessage,
        }),
        { plainText: true }
      ),
    })

    if (notifyError || !notifyData?.id) {
      console.error("[Contact] Owner notification failed:", notifyError)
      return NextResponse.json(
        {
          error:
            `تعذّر إرسال الرسالة مؤقتاً. تواصل معنا مباشرة عبر واتساب ${SITE.whatsapp.local} أو ${SITE.email}`,
        },
        { status: 502 }
      )
    }

    // 2) Auto-confirmation to the sender (failure here is non-fatal)
    const { error: confirmError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: cleanEmail,
      subject: "استلمنا رسالتك — SmartLink",
      html: await render(ContactConfirmationEmail({ name: cleanName, subject: cleanSubject })),
      text: await render(
        ContactConfirmationEmail({ name: cleanName, subject: cleanSubject }),
        { plainText: true }
      ),
    })
    if (confirmError) {
      // The owner still got the message — log and continue
      console.warn("[Contact] Sender confirmation failed (non-fatal):", confirmError)
    }

    return NextResponse.json({
      success: true,
      message: CONTACT_SUCCESS_MESSAGE,
    })
  } catch (error) {
    console.error("[Contact] Error:", error)
    return NextResponse.json(
      {
        error:
          `حدث خطأ في إرسال الرسالة. تواصل معنا مباشرة عبر واتساب ${SITE.whatsapp.local} أو ${SITE.email}`,
      },
      { status: 500 }
    )
  }
}
