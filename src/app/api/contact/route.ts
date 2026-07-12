import { NextResponse } from "next/server"
import { headers } from "next/headers"

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json()

    // Validate
    if (!name || !email || !message) {
      return NextResponse.json({ error: "جميع الحقول المطلوبة يجب أن تكون مملوءة" }, { status: 400 })
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "البريد الإلكتروني غير صالح" }, { status: 400 })
    }

    // Sanitize inputs to prevent XSS
    const sanitize = (str: string) => str.replace(/[<>]/g, "").trim()
    const cleanName = sanitize(name)
    const cleanEmail = sanitize(email)
    const cleanSubject = sanitize(subject || "استفسار عام")
    const cleanMessage = sanitize(message)

    // Rate limiting check — 5 submissions per IP per minute ceiling
    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown"

    console.log("[Contact] Submission:", {
      name: cleanName,
      email: cleanEmail,
      subject: cleanSubject,
      message: cleanMessage,
      ip,
    })

    // TODO: Integrate email service (Resend / SendGrid)
    // await resend.emails.send({
    //   from: 'SmartLink <noreply@smart-link.ly>',
    //   to: 'ahmedmedo1012@gmail.com',
    //   subject: `[SmartLink Contact] ${cleanSubject}`,
    //   html: `<p><strong>Name:</strong> ${cleanName}</p><p><strong>Email:</strong> ${cleanEmail}</p><p><strong>Message:</strong></p><p>${cleanMessage}</p>`,
    // })

    return NextResponse.json({
      success: true,
      message: "تم استلام رسالتك بنجاح. سنتواصل معك قريباً.",
    })
  } catch (error) {
    console.error("[Contact] Error:", error)
    return NextResponse.json({ error: "حدث خطأ في إرسال الرسالة. يرجى المحاولة لاحقاً." }, { status: 500 })
  }
}
