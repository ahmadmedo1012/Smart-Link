import { Mail, MessageCircle, MapPin, Clock } from "lucide-react"
import { GenArtBackground } from "@/components/gen-art-background"
import { ContactForm } from "@/components/contact-form"
import { SITE } from "@/lib/site"

/* r9: a full server component. This was the only fully-client page on the
   site (the whole page shipped as JS for three useState hooks). Now only
   the form itself is a client island (contact-form.tsx) — the header,
   contact cards and layout are static HTML, consistent with every other
   page.

   r9 (perf): the LCP surgery from the r8 hero is applied here too — h1
   and the intro paragraph paint at FCP; the eyebrow badge keeps
   reveal-d1 so the entrance cascade stays alive around them.

   r9 (content audit C1/C7): the support-hours contradiction ("24/7 - الدوام
   الرسمي: 9ص - 9م" in one line) is now two honest facts, and the page name
   is unified to "تواصل معنا" (matching metadata, breadcrumbs, and every
   other link to this page — the h1 used to say "اتصل بنا"). */

const contacts = [
  { icon: Mail, title: "البريد الإلكتروني", desc: SITE.email, href: `mailto:${SITE.email}` },
  { icon: MessageCircle, title: "واتساب", desc: "تواصل مباشر مع المؤسس", href: SITE.whatsapp.url },
  { icon: MapPin, title: "الموقع", desc: SITE.address },
  { icon: Clock, title: "أوقات الدعم", desc: "واتساب 24/7 · المكتب 9 صباحاً - 9 مساءً" },
]

export default function ContactPage() {
  return (
    <div className="pt-28 pb-16 relative overflow-hidden">
      <GenArtBackground seed={303} variant="rings" />
      <div className="container-base relative">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm text-xs text-primary-text font-medium mb-6 reveal-up reveal-d1">
            <span>تواصل</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-4">
            تواصل معنا
          </h1>
          <p className="text-lg text-muted-foreground">
            فريقنا جاهز لمساعدتك - تواصل معنا بأي من الطرق التالية
          </p>
        </div>

        {/* Contact info cards — CSS reveal (paints pre-JS, above fold) */}
        <div className="grid md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-10">
          {contacts.map((item, i) => (
            <div
              key={item.title}
              className={`reveal-up reveal-d${Math.min(i + 1, 4)} glass rounded-2xl p-5 text-center hover:border-[var(--ring)]/30 transition-all duration-300 group`}
            >
              <div className="w-9 h-9 rounded-xl bg-[var(--accent)] flex items-center justify-center mx-auto mb-2.5 group-hover:scale-110 transition-transform duration-300">
                <item.icon className="w-4.5 h-4.5 text-primary" />
              </div>
              <h2 className="font-bold text-foreground text-sm mb-1">{item.title}</h2>
              {item.href ? (
                <a href={item.href} className="text-xs text-primary-text hover:underline underline-offset-2 rounded">{item.desc}</a>
              ) : (
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              )}
            </div>
          ))}
        </div>

        {/* Form — the page's only client island (r9) */}
        <div className="max-w-xl mx-auto reveal-up reveal-d3">
          <div className="glass rounded-2xl p-6 md:p-8">
            <h2 className="font-bold text-foreground text-lg mb-5">أرسل رسالة</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}
