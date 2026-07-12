import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json()

    // Validate
    if (!name || !email || !message) {
      return NextResponse.json({ error: "جميع الحقول المطلوبة يجب أن تكون مملوءة" }, { status: 400 })
    }

    console.log("Contact form submission:", { name, email, subject, message })

    // TODO: Send email to ahmadmedo1012@gmail.com via Resend/SendGrid

    return NextResponse.json({ success: true, message: "تم استلام رسالتك بنجاح" })
  } catch (error) {
    return NextResponse.json({ error: "حدث خطأ في إرسال الرسالة" }, { status: 500 })
  }
}
