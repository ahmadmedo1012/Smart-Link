import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { Resend } from "resend"
import { render } from "@react-email/render"
import {
  ContactNotificationEmail,
  ContactConfirmationEmail,
} from "@/emails/contact-emails"

const OWNER_EMAIL = "ahmedmedo1012@gmail.com"
const FROM_EMAIL = "SmartLink <noreply@smart-link.ly>"
const SUBJECT_LABELS: Record<string, string> = {
  menu: "استفسار عن Smart Menu",
  bot: "استفسار عن Smart Bot",
  support: "دعم فني",
  other: "أخرى",
}

/* Simple in-memory rate limit — 5 submissions per IP per minute */
const rateMap = new Map<string, { count: number; reset: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateMap.get(ip)
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + 60_000 })
    return false
  }
  entry.count += 1
  return entry.count > 5
}

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json()

    // Validate
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "جميع الحقول المطلوبة يجب أن تكون مملوءة" },
        { status: 400 }
      )
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "البريد الإلكتروني غير صالح" }, { status: 400 })
    }

    // Length caps (protect the mail service from abuse)
    if (String(name).length > 100 || String(message).length > 5000) {
      return NextResponse.json(
        { error: "أحد الحقول أطول من المسموح" },
        { status: 400 }
      )
    }

    // Sanitize inputs to prevent XSS
    const sanitize = (str: string) => str.replace(/[<>]/g, "").trim()
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
            "خدمة البريد غير مهيأة حالياً. تواصل معنا مباشرة عبر واتساب 0910089975 أو ahmedmedo1012@gmail.com",
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
            "تعذّر إرسال الرسالة مؤقتاً. تواصل معنا مباشرة عبر واتساب 0910089975 أو ahmedmedo1012@gmail.com",
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
      id: notifyData.id,
    })
  } catch (error) {
    console.error("[Contact] Error:", error)
    return NextResponse.json(
      {
        error:
          "حدث خطأ في إرسال الرسالة. تواصل معنا مباشرة عبر واتساب 0910089975 أو ahmedmedo1012@gmail.com",
      },
      { status: 500 }
    )
  }
}
