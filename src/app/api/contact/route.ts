import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { Resend } from "resend"
import { render } from "@react-email/render"
import {
  ContactNotificationEmail,
  ContactConfirmationEmail,
} from "@/emails/contact-emails"
import { SITE } from "@/lib/site"
import { EMAIL_RE, NAME_MAX, EMAIL_MAX, MESSAGE_MAX } from "@/lib/contact-rules"

const OWNER_EMAIL = SITE.email
const FROM_EMAIL = `SmartLink <noreply@smart-link.ly>`
const SUBJECT_LABELS: Record<string, string> = {
  menu: "استفسار عن Smart Menu",
  bot: "استفسار عن SmartBot",
  support: "دعم فني",
  other: "أخرى",
}

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
const GLOBAL_MAX = 20
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
  // r10 (security audit P2 — defense in depth): bound the body BEFORE
  // parsing. Vercel caps at 4.5MB anyway; this makes the contract explicit
  // and the route safe if it ever moves off the platform.
  const bodyBytes = Number(req.headers.get("content-length") ?? 0)
  if (bodyBytes > BODY_MAX_BYTES) {
    return NextResponse.json({ error: "الطلب أكبر من المسموح" }, { status: 413 })
  }
  // r9 (security): a malformed body used to fall into the generic catch →
  // 500 + a misleading "خطأ في الإرسال" message. A bad request is a 400,
  // and the 500 path stays reserved for genuine send-side failures.
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { error: "طلب غير صالح — تعذّر قراءة البيانات المرسلة" },
      { status: 400 }
    )
  }
  const { name, email, subject, message, company } = body

  try {

    // Honeypot: a field invisible to humans — any content means a spam bot.
    // Return a fake success so the bot thinks it worked and moves on.
    // r10 (security audit P3): the response is now byte-identical to the
    // real success (a shape probe could tell the trap from the real thing).
    if (typeof company === "string" && company.trim() !== "") {
      return NextResponse.json({
        success: true,
        message: "تم استلام رسالتك بنجاح. سنتواصل معك قريباً.",
      })
    }

    // Validate
    if (!name || !email || !message) {
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
      return NextResponse.json({ error: "البريد الإلكتروني غير صالح" }, { status: 400 })
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
    const sanitize = (str: unknown) => String(str ?? "").replace(/[<>]/g, "").trim()
    const cleanName = sanitize(name)
    const cleanEmail = sanitize(email)
    const subjectKey = sanitize(subject)
    if (subjectKey.length > SUBJECT_MAX) {
      return NextResponse.json(
        { error: "أحد الحقول أطول من المسموح" },
        { status: 400 }
      )
    }
    const cleanSubject = Object.hasOwn(SUBJECT_LABELS, subjectKey)
      ? SUBJECT_LABELS[subjectKey]
      : "استفسار عام"
    const cleanMessage = sanitize(message)

    // Rate limiting (r10: clientIp() + the global bucket — see above)
    const headersList = await headers()
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
    })
    if (confirmError) {
      // The owner still got the message — log and continue
      console.warn("[Contact] Sender confirmation failed (non-fatal):", confirmError)
    }

    return NextResponse.json({
      success: true,
      message: "تم استلام رسالتك بنجاح. سنتواصل معك قريباً.",
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
