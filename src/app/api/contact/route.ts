import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { Resend } from "resend"
import { render } from "@react-email/render"
import {
  ContactNotificationEmail,
  ContactConfirmationEmail,
} from "@/emails/contact-emails"
import { SITE } from "@/lib/site"

const OWNER_EMAIL = SITE.email
const FROM_EMAIL = `SmartLink <noreply@smart-link.ly>`
const SUBJECT_LABELS: Record<string, string> = {
  menu: "استفسار عن Smart Menu",
  bot: "استفسار عن SmartBot",
  support: "دعم فني",
  other: "أخرى",
}

/* Simple in-memory rate limit — 5 submissions per IP per minute.
   r5 (gstack /cso STRIDE-DoS): expired entries are pruned so the map can't
   grow unboundedly from many forged x-forwarded-for values. */
const rateMap = new Map<string, { count: number; reset: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  if (rateMap.size > 1000) {
    for (const [k, v] of rateMap) {
      if (now > v.reset) rateMap.delete(k)
    }
  }
  const entry = rateMap.get(ip)
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + 60_000 })
    return false
  }
  entry.count += 1
  return entry.count > 5
}

export async function POST(req: Request) {
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
    if (typeof company === "string" && company.trim() !== "") {
      return NextResponse.json({ ok: true })
    }

    // Validate
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "جميع الحقول المطلوبة يجب أن تكون مملوءة" },
        { status: 400 }
      )
    }

    // Basic email validation + r9 cap (254 = RFC 5321 max forward path;
    // before this a multi-megabyte "email" sailed through to Resend and
    // failed late with 502)
    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      return NextResponse.json({ error: "البريد الإلكتروني غير صالح" }, { status: 400 })
    }

    // Length caps (protect the mail service from abuse)
    if (String(name).length > 100 || String(message).length > 5000) {
      return NextResponse.json(
        { error: "أحد الحقول أطول من المسموح" },
        { status: 400 }
      )
    }

    // Sanitize inputs to prevent XSS. r5 (gstack /review — Type Coercion at
    // Boundaries): callers may omit fields or send non-strings (the UI always
    // sends strings, but a direct API call with a missing `subject` used to
    // crash with undefined.replace → 500 instead of a clean 4xx).
    const sanitize = (str: unknown) => String(str ?? "").replace(/[<>]/g, "").trim()
    const cleanName = sanitize(name)
    const cleanEmail = sanitize(email)
    const cleanSubject = SUBJECT_LABELS[sanitize(subject)] || "استفسار عام"
    const cleanMessage = sanitize(message)

    // Rate limiting
    const headersList = await headers()
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headersList.get("x-real-ip") ||
      "unknown"
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "أرسلت عدة رسائل متتالية — انتظر دقيقة ثم حاول مجدداً" },
        { status: 429 }
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
      subject: `[SmartLink Contact] ${cleanSubject}`,
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
