"use client"
import { useState, useEffect, useRef } from "react"
import { Send, Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { SITE } from "@/lib/site"
import { EMAIL_RE, NAME_MAX, EMAIL_MAX, MESSAGE_MAX, NAME_LETTER_RE, NAME_LETTER_ERROR } from "@/lib/contact-rules"

/* r9: extracted from the contact page — it was the only fully-client page
   on the site: ~10 KB of static markup (cards, headers) shipped in the
   client bundle for three useState hooks. The page is now a server
   component and this island is its ONLY stateful part.

   r9 (a11y audit A1/A2/A3), folded into the rewrite:
   - Success: a real role="status" region announces the API's own message
     ("تم استلام رسالتك بنجاح…") — the rich payload used to be discarded
     and "تم الإرسال ✓" lived on the button's aria-live (non-standard).
   - Errors: per-field validation with Arabic messages (browser-native
     messages render in the browser's locale — English for many Arabic
     users) wired via aria-invalid + aria-describedby, focusing the first
     invalid field.
   - The error-box fallback links use --primary-text (AA on dark; the old
     --primary links measured ≈4.0:1 at text-xs — the exact failure the
     token was created to prevent) and one WhatsApp display format. */

/* r10: the validation contract (regex + limits) is imported from
   lib/contact-rules — the API route imports the same module, so the form
   can never accept what the server rejects. */

type FieldErrors = { name?: string; email?: string; message?: string }

/* r10 (a11y audit P2): inputs were text-sm (14px) — Safari iOS auto-
   zooms the page on focus for any field under 16px, jolting every mobile
   user mid-conversion. 16px stops the zoom.
   r13 (a11y audit P2 ×2): placeholder/50 measured 1.99:1 in light mode
   (real visible text in the ONLY conversion path — axe can't see
   ::placeholder at all); the RESTING border used --border at 1.10:1
   (WCAG 1.4.11) — now --input-border, which clears 3:1 in both themes. */
const inputBase =
  "w-full px-4 py-2.5 rounded-xl bg-[var(--card)] border text-foreground text-base focus:outline-none focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)] transition-all placeholder:text-muted-foreground"

export function ContactForm() {
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [sentMessage, setSentMessage] = useState("")
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    /* r13 (a11y audit P2): the button stays FOCUSABLE while sending
       (disabled= ejected keyboard users' focus to <body> mid-conversion);
       aria-busy announces the state instead, and this guard blocks the
       double-submit that Enter-presses could previously trigger. */
    if (sending) return
    setError("")
    const form = e.currentTarget as HTMLFormElement
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      subject: (form.elements.namedItem("subject") as HTMLSelectElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
      // Honeypot: hidden from humans, filled only by naive spam bots
      company: (form.elements.namedItem("company") as HTMLInputElement)?.value ?? "",
    }

    // Arabic per-field validation (replaces browser-locale messages)
    const errs: FieldErrors = {}
    if (!data.name.trim()) errs.name = "الاسم مطلوب"
    else if (!NAME_LETTER_RE.test(data.name)) errs.name = NAME_LETTER_ERROR
    else if (data.name.length > NAME_MAX) errs.name = "الاسم أطول من المسموح"
    if (!data.email.trim()) errs.email = "البريد الإلكتروني مطلوب"
    else if (!EMAIL_RE.test(data.email)) errs.email = "البريد الإلكتروني غير صالح"
    if (!data.message.trim()) errs.message = "الرسالة مطلوبة"
    else if (data.message.length > MESSAGE_MAX) errs.message = "الرسالة أطول من المسموح"

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs)
      const first = ["name", "email", "message"].find((f) => errs[f as keyof FieldErrors])
      if (first) (form.elements.namedItem(first) as HTMLElement).focus()
      return
    }
    setFieldErrors({})

    setSending(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      /* r11 (محاكاة عدائية P1 — «النجاح الكاذب»): 200 بجسم غير JSON كان
         يقع في فرع النجاح الافتراضي ويعرض «تم استلام رسالتك بنجاح» ويفرّغ
         النموذج — عكس فلسفة fail-loud التي بُني عليها المسار كله. العقد
         الآن صارم من الجهتين: النجاح يتطلب res.ok + success:true + رسالة
         نصية من الخادم؛ أي شيء آخر = خطأ واضح لل مستخدم. */
      let json: { success?: unknown; message?: unknown; error?: unknown } | null = null
      try {
        json = await res.json()
      } catch {
        json = null
      }
      if (!res.ok || !json || json.success !== true || typeof json.message !== "string") {
        // Map the one server error that is genuinely about the email FIELD
        // (exact match — "خدمة البريد غير مهيأة" is a 503 about the mail
        // service, not the user's input, and must stay a general alert).
        if (json && json.error === "البريد الإلكتروني غير صالح") {
          setFieldErrors({ email: json.error })
          ;(form.elements.namedItem("email") as HTMLElement).focus()
        } else if (json && typeof json.error === "string" && json.error.trim() !== "") {
          setError(json.error)
        } else {
          setError("استجابة غير صالحة من الخادم")
        }
        return
      }
      setSent(true)
      setSentMessage(json.message)
      form.reset()
      setTimeout(() => {
        setSent(false)
        setSentMessage("")
      }, 4000)
    } catch {
      setError("تعذّر الاتصال بالخادم — تحقق من اتصالك وحاول مجدداً")
    } finally {
      setSending(false)
    }
  }

  /* r13 (a11y audit P3): move focus to the general error box when it
     appears — role=alert announces it, but sighted keyboard users had no
     cue that anything appeared below the form. Per-field errors still
     focus the first invalid field instead (higher up in handleSubmit). */
  const errorBoxRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (error) errorBoxRef.current?.focus()
  }, [error])

  const fieldCls = (bad?: string) =>
    bad ? `${inputBase} border-[var(--destructive)]` : `${inputBase} border-[var(--input-border)]`

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* noValidate + required: constraints stay discoverable (checkValidity,
       a11y tools) while submission messages stay ours — Arabic, per-field —
       instead of the browser's locale. */}
      {/* Honeypot — invisible to humans/screen readers; bots that fill it are dropped silently server-side */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute opacity-0 pointer-events-none w-0 h-0 -z-10"
      />
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">الاسم</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={NAME_MAX}
            autoComplete="name"
            aria-invalid={!!fieldErrors.name}
            aria-describedby={fieldErrors.name ? "name-error" : undefined}
            className={fieldCls(fieldErrors.name)}
            placeholder="اسمك"
          />
          {fieldErrors.name && (
            <p id="name-error" role="alert" className="text-xs mt-1.5 text-[var(--destructive)]">{fieldErrors.name}</p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">البريد الإلكتروني</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={EMAIL_MAX}
            autoComplete="email"
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
            className={fieldCls(fieldErrors.email)}
            placeholder="بريدك الإلكتروني"
          />
          {fieldErrors.email && (
            <p id="email-error" role="alert" className="text-xs mt-1.5 text-[var(--destructive)]">{fieldErrors.email}</p>
          )}
        </div>
      </div>
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-1.5">الموضوع</label>
        <select id="subject" name="subject" className={`${inputBase} border-[var(--input-border)]`}>
          <option value="">اختر الموضوع</option>
          <option value="menu">استفسار عن Smart Menu</option>
          <option value="bot">استفسار عن SmartBot</option>
          <option value="support">دعم فني</option>
          <option value="other">أخرى</option>
        </select>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">الرسالة</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          maxLength={MESSAGE_MAX}
          aria-invalid={!!fieldErrors.message}
          aria-describedby={fieldErrors.message ? "message-error" : undefined}
          className={`${fieldCls(fieldErrors.message)} resize-none`}
          placeholder="اكتب رسالتك هنا…"
        />
        {fieldErrors.message && (
          <p id="message-error" role="alert" className="text-xs mt-1.5 text-[var(--destructive)]">{fieldErrors.message}</p>
        )}
      </div>

      {error && (
        <div
          ref={errorBoxRef}
          tabIndex={-1}
          className="text-sm rounded-xl px-4 py-3 text-center border focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          style={{
            color: "var(--destructive)",
            background: "oklch(from var(--destructive) l c h / 0.1)",
            borderColor: "oklch(from var(--destructive) l c h / 0.25)",
          }}
          role="alert"
        >
          <span className="block font-medium">{error}</span>
          {/* r10 (code audit — string coupling): the links used to appear only
              when the error text happened to contain one of four substrings —
              any future rewording of the API messages would silently hide
              them. Any error deserves direct-contact fallbacks. */}
          {(
            /* r13 (a11y audit P2): this helper line sat at 4.03:1 in light
               mode on the tinted error background — foreground/80 clears
               10:1 (the links after it keep their primary-text color). */
            <span className="block mt-2 text-xs text-foreground/80">
              أو تواصل مباشرة:{" "}
              <a href={SITE.whatsapp.url} className="underline underline-offset-2" style={{ color: "var(--primary-text)" }}>
                واتساب <span dir="ltr">{SITE.whatsapp.display}</span>
              </a>{" "}·{" "}
              <a href={`mailto:${SITE.email}`} className="underline underline-offset-2" style={{ color: "var(--primary-text)" }}>
                {SITE.email}
              </a>
            </span>
          )}
        </div>
      )}

      {sent && sentMessage && (
        <div
          className="text-sm rounded-xl px-4 py-3 text-center border flex items-center justify-center gap-2"
          style={{
            color: "var(--success)",
            background: "oklch(from var(--success) l c h / 0.1)",
            borderColor: "oklch(from var(--success) l c h / 0.25)",
          }}
          role="status"
        >
          <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{sentMessage}</span>
        </div>
      )}

      <button
        type="submit"
        aria-busy={sending}
        className={cn(
          "flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:brightness-105 transition-all duration-300 active:scale-[0.98]",
          sending && "cursor-wait"
        )}
      >
        {sending ? (
          <><Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> جارٍ الإرسال…</>
        ) : sent ? (
          <><Check className="w-4 h-4" aria-hidden="true" /> تم الإرسال ✓</>
        ) : (
          <><Send className="w-4 h-4" aria-hidden="true" /> إرسال الرسالة</>
        )}
      </button>
    </form>
  )
}
