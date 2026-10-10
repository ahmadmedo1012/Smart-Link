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
import { SITE, whatsappUrl } from "@/lib/site"
import { toWaMeHref } from "@/lib/phone"

/* Brand tokens rendered as hex for email clients (email CSS vars don't
   exist — hardcoded is intentional). m15 (Madarek parity): the email
   chrome follows the Madarek NIGHT world — gold accent #E9B44C on
   night ground #070B16, gold buttons carry the dark --accent-fg ink
   (#05070F, 10.6:1 — the .btn.accent dark recipe). Gold as TEXT on
   the card measures 9.6:1. */
const BRAND = "#E9B44C" // Madarek dark accent (gold)
const BRAND_TEXT = "#E9B44C" // gold as text — 9.6:1 on CARD
const BRAND_INK = "#05070F" // text on gold fills — 10.6:1
const BG = "#070B16" // Madarek night ground
const CARD = "#0D1428" // Madarek night surface
const MUTED = "#8E97B8" // Madarek dark muted

const buttonStyle = {
  backgroundColor: BRAND,
  color: BRAND_INK,
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
  /** r137: هاتف واتساب اختياري مُطبَّع 09XXXXXXXX — يظهر فقط عندما أرسله الزائر. */
  phone?: string
}

function fieldRow(label: string, value: string) {
  return (
    <Section style={{ marginBottom: "18px" }}>
      {/* m16 (wave-A QA): letterSpacing 0.5px removed — the labels are
          Arabic and email clients ignore styles.css's unlayered RTL guard,
          so the tracking actually reached the glyphs (Madarek ruling #2:
          tracking breaks Arabic cursive joins). Hierarchy keeps the 700
          weight + muted color. */}
      <Text style={{ margin: 0, color: MUTED, fontSize: "12px", fontWeight: 700 }}>
        {label}
      </Text>
      <Text style={{ margin: "4px 0 0", color: "#F2EFE6", fontSize: "15px", lineHeight: "1.7" }}>
        {value}
      </Text>
    </Section>
  )
}

/** Notification email — sent to the SmartLink owner inbox */
export function ContactNotificationEmail({ name, email, subject, message, phone }: ContactFields) {
  return (
    <Html lang="ar" dir="rtl">
      <Head />
      <Preview>رسالة تواصل جديدة من {name} — {subject}</Preview>
      <Body style={{ backgroundColor: BG, margin: 0, padding: "24px 12px", fontFamily: "Tahoma, Arial, sans-serif" }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto" }}>
          <Section style={{ backgroundColor: CARD, borderRadius: "16px", padding: "32px", border: `1px solid ${BRAND}22` }}>
            <Heading as="h1" style={{ color: "#F2EFE6", fontSize: "20px", margin: "0 0 6px" }}>
              رسالة جديدة من نموذج التواصل
            </Heading>
            <Text style={{ color: BRAND_TEXT, fontSize: "13px", margin: "0 0 24px", fontWeight: 700 }}>
              SmartLink — {SITE.url.replace("https://", "")}
            </Text>
            {fieldRow("الاسم", name)}
            {fieldRow("البريد الإلكتروني", email)}
            {fieldRow("الموضوع", subject)}
            {fieldRow("الرسالة", message)}
            {/* r137 (ليبي أولاً): الهاتف في جسم البريد عندما يُرسل — رابط
                wa.me مباشر (المفهوم «واتساب أولاً»: نفس درس Smart-Menu r136
                الذي جعل إيصالات المالك قابلة للاتصال).
                r138 (عقد الأسطولة الموحّد): العقد يقبل الأرضي 0[1-9] الآن،
                وwa.me محمول فقط — فالرابط يُبنى للمحمول (09) حصرًا والأرضي
                يُعرض نصًا خامًا قابلًا للاتصال، لا رابطًا ميتًا (درس
                Smart-Menu r103-F8). */}
            {phone && (
              <Section style={{ marginBottom: "18px" }}>
                <Text style={{ margin: 0, color: MUTED, fontSize: "12px", fontWeight: 700 }}>
                  رقم الهاتف (واتساب)
                </Text>
                <Text style={{ margin: "4px 0 0", fontSize: "15px", lineHeight: "1.7" }}>
                  {phone.startsWith("09") ? (
                    <Link href={toWaMeHref(phone)} style={{ color: BRAND_TEXT }}>
                      {phone}
                    </Link>
                  ) : (
                    phone
                  )}
                </Text>
              </Section>
            )}
            <Hr style={{ borderColor: "#1B2444", margin: "28px 0" }} />
            <Button
              href={`mailto:${email}?subject=${encodeURIComponent(`رد: ${subject} — SmartLink`)}`}
              style={buttonStyle}
            >
              الرد على المرسل
            </Button>
            <Text style={{ color: MUTED, fontSize: "11px", margin: "24px 0 0" }}>
              أُرسلت تلقائياً من نموذج التواصل في {SITE.url.replace("https://", "")}
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
            <Heading as="h1" style={{ color: "#F2EFE6", fontSize: "20px", margin: "0 0 6px" }}>
              شكراً {name}، استلمنا رسالتك
            </Heading>
            <Text style={{ color: BRAND_TEXT, fontSize: "13px", margin: "0 0 24px", fontWeight: 700 }}>
              SmartLink — {SITE.url.replace("https://", "")}
            </Text>
            <Text style={{ color: "#C3C8DC", fontSize: "15px", lineHeight: "1.8", margin: "0 0 12px" }}>
              وصلتنا رسالتك بخصوص «{subject}» بنجاح، وسيتواصل معك فريقنا في أقرب وقت — عادة خلال 24 ساعة عمل.
            </Text>
            <Text style={{ color: "#C3C8DC", fontSize: "15px", lineHeight: "1.8", margin: "0 0 24px" }}>
              إن كان الأمر مستعجلاً، يمكنك التواصل معنا مباشرة عبر واتساب:
            </Text>
            <Button
              /* r134 (R134-W2-SL fix 8): prefilled wa.me opener (surface:
                  بريد التأكيد) — the urgent-lead shortcut opens a chat
                  with the opener typed, not blank. */
              href={whatsappUrl("بريد التأكيد")}
              style={buttonStyle}
            >
              واتساب مباشر
            </Button>
            <Hr style={{ borderColor: "#1B2444", margin: "28px 0" }} />
            <Text style={{ color: MUTED, fontSize: "12px", margin: 0, lineHeight: "1.8" }}>
              هذه رسالة تأكيد تلقائية — لا داعي للرد عليها.
              <br />
              SmartLink · ليبيا · <Link href={SITE.url} style={{ color: BRAND_TEXT }}>{SITE.url.replace("https://", "")}</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
