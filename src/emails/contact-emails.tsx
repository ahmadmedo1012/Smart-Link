import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components"
import { SITE } from "@/lib/site"

/* Brand tokens (Smart-Menu parity) rendered as hex for email clients.
   r9: BRAND_TEXT raised to #d97a2e (5.9:1 on CARD) — the old #bc4700
   text sat at 3.5:1, failing WCAG AA inside both emails. Buttons keep
   the deep BRAND with white text (5.2:1, compliant). */
const BRAND = "#bc4700" // oklch(0.55 0.19 45) gamut-clipped — same visual as smart-link.ly
const BRAND_TEXT = "#d97a2e" // accessible-on-dark variant of the same hue
const BG = "#0e0d0c"
const CARD = "#171512"
const MUTED = "#a6a09a"

const buttonStyle = {
  backgroundColor: BRAND,
  color: "#ffffff",
  padding: "12px 24px",
  borderRadius: "10px",
  fontSize: "14px",
  fontWeight: 700,
  textDecoration: "none",
} as const

interface ContactFields {
  name: string
  email: string
  subject: string
  message: string
}

function fieldRow(label: string, value: string) {
  return (
    <Section style={{ marginBottom: "18px" }}>
      <Text style={{ margin: 0, color: MUTED, fontSize: "12px", fontWeight: 700, letterSpacing: "0.5px" }}>
        {label}
      </Text>
      <Text style={{ margin: "4px 0 0", color: "#f4f1ee", fontSize: "15px", lineHeight: "1.7" }}>
        {value}
      </Text>
    </Section>
  )
}

/** Notification email — sent to the SmartLink owner inbox */
export function ContactNotificationEmail({ name, email, subject, message }: ContactFields) {
  return (
    <Html lang="ar" dir="rtl">
      <Head />
      <Preview>رسالة تواصل جديدة من {name} — {subject}</Preview>
      <Body style={{ backgroundColor: BG, margin: 0, padding: "24px 12px", fontFamily: "Tahoma, Arial, sans-serif" }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto" }}>
          <Section style={{ backgroundColor: CARD, borderRadius: "16px", padding: "32px", border: `1px solid ${BRAND}22` }}>
            <Heading as="h1" style={{ color: "#f4f1ee", fontSize: "20px", margin: "0 0 6px" }}>
              رسالة جديدة من نموذج التواصل
            </Heading>
            <Text style={{ color: BRAND_TEXT, fontSize: "13px", margin: "0 0 24px", fontWeight: 700 }}>
              SmartLink — smart-link.ly
            </Text>
            {fieldRow("الاسم", name)}
            {fieldRow("البريد الإلكتروني", email)}
            {fieldRow("الموضوع", subject)}
            {fieldRow("الرسالة", message)}
            <Hr style={{ borderColor: "#2c2925", margin: "28px 0" }} />
            <Button
              href={`mailto:${email}?subject=${encodeURIComponent(`رد: ${subject} — SmartLink`)}`}
              style={buttonStyle}
            >
              الرد على المرسل
            </Button>
            <Text style={{ color: "#8a847e", fontSize: "11px", margin: "24px 0 0" }}>
              أُرسلت تلقائياً من نموذج التواصل في smart-link.ly
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

/** Auto-confirmation email — sent to the visitor who submitted the form */
export function ContactConfirmationEmail({ name, subject }: { name: string; subject: string }) {
  return (
    <Html lang="ar" dir="rtl">
      <Head />
      <Preview>استلمنا رسالتك — SmartLink</Preview>
      <Body style={{ backgroundColor: BG, margin: 0, padding: "24px 12px", fontFamily: "Tahoma, Arial, sans-serif" }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto" }}>
          <Section style={{ backgroundColor: CARD, borderRadius: "16px", padding: "32px", border: `1px solid ${BRAND}22` }}>
            <Heading as="h1" style={{ color: "#f4f1ee", fontSize: "20px", margin: "0 0 6px" }}>
              شكراً {name}، استلمنا رسالتك
            </Heading>
            <Text style={{ color: BRAND_TEXT, fontSize: "13px", margin: "0 0 24px", fontWeight: 700 }}>
              SmartLink — smart-link.ly
            </Text>
            <Text style={{ color: "#c9c4be", fontSize: "15px", lineHeight: "1.8", margin: "0 0 12px" }}>
              وصلتنا رسالتك بخصوص «{subject}» بنجاح، وسيتواصل معك فريقنا في أقرب وقت — عادة خلال 24 ساعة عمل.
            </Text>
            <Text style={{ color: "#c9c4be", fontSize: "15px", lineHeight: "1.8", margin: "0 0 24px" }}>
              إن كان الأمر مستعجلاً، يمكنك التواصل معنا مباشرة عبر واتساب:
            </Text>
            <Button
              href={SITE.whatsapp.url}
              style={buttonStyle}
            >
              واتساب مباشر
            </Button>
            <Hr style={{ borderColor: "#2c2925", margin: "28px 0" }} />
            <Text style={{ color: "#8a847e", fontSize: "12px", margin: 0, lineHeight: "1.8" }}>
              هذه رسالة تأكيد تلقائية — لا داعي للرد عليها.
              <br />
              SmartLink · ليبيا · <Link href="https://smart-link.ly" style={{ color: BRAND_TEXT }}>smart-link.ly</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
