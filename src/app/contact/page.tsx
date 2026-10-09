import { Mail, MessageCircle, MapPin, Clock } from "lucide-react"
import { GenArtBackground } from "@/components/gen-art-background"
/* r128 F2b: the shared product chrome moved out of the RootLayout
   (the landing owns its own world now) — this page renders it itself. */
import { SiteChrome } from "@/components/site-chrome"
import { ContactForm } from "@/components/contact-form"
/* r128 F6 (A4 §6): flat-diet on the shells — the info cards and the
   form island lost their glass for flat hairline + border-shift
   (.ln-card, styles.css bridge). The ContactForm island itself is
   byte-untouched: the r13-hardened focus/error/success contract (and
   the 16px iOS zoom floor) must not regress. */
import { SITE } from "@/lib/site"
import { pageMetadata } from "@/lib/seo"
import { breadcrumbJsonLd } from "@/lib/schema"

/* r10 (code audit): the segment layout existed only because the page was
   a "use client" component (metadata can't be exported from those) — the
   page has been a server component since r9, so the layout (34 lines and
   a stale comment describing a client page that no longer exists) folds
   back here. */

export const metadata = pageMetadata({
  /* r10 (SEO audit P2): expanded toward the SERP window with the
     strongest contact keywords (واتساب، دعم فني). */
  title: "تواصل معنا — فريق SmartLink جاهز للمساعدة",
  description:
    "تواصل مع فريق SmartLink لأي استفسار أو دعم فني أو طلب خدمة: نموذج تواصل سريع، أو واتساب مباشر على مدار الساعة — وردود المكتب من 9 صباحاً حتى 9 مساءً.",
  canonical: "/contact",
  ogDescription: "استفسارات ودعم فني وطلبات خدمات — واتساب مباشر أو نموذج البريد",
})

const breadcrumbLd = breadcrumbJsonLd([
  { name: "الرئيسية", path: "" },
  { name: "تواصل معنا", path: "/contact" },
])

/* r9: a full server component. This was the only fully-client page on the
   site (the whole page shipped as JS for three useState hooks). Now only
   the form itself is a client island (contact-form.tsx) — the header,
   contact cards and layout are static HTML, consistent with every other
   page.

   r9 (perf): the LCP surgery from the r8 hero is applied here too — h1
   and the intro paragraph paint at FCP; the mono label keeps
   reveal-d-1 so the entrance cascade stays alive around them.

   r9 (content audit C1/C7): the support-hours contradiction ("24/7 - الدوام
   الرسمي: 9ص - 9م" in one line) is now two honest facts, and the page name
   is unified to "تواصل معنا" (matching metadata, breadcrumbs, and every
   other link to this page — the h1 used to say "اتصل بنا"). */

const contacts = [
  { icon: Mail, title: "البريد الإلكتروني", desc: SITE.email, href: `mailto:${SITE.email}` },
  { icon: MessageCircle, title: "واتساب", desc: "تواصل مباشر مع المؤسس", href: SITE.whatsapp.url },
  { icon: MapPin, title: "الموقع", desc: SITE.address },
  { icon: Clock, title: "أوقات الدعم", desc: "واتساب 24/7 · المكتب 9 صباحاً — 9 مساءً" },
]

export default function ContactPage() {
  return (
    <SiteChrome>
    <div className="pt-28 pb-16 relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <GenArtBackground seed={303} variant="rings" />
      <div className="container-base relative">
        {/* r130 (W1-D P1-2): the page head unifies on the canonical
            ln-chapter-head anatomy (label / title / lede, like /about) —
            was a centered text-5xl/6xl 800-weight header behind a
            GLASS eyebrow-badge pill; the label device is now the mono
            ln-label (with the canonical lime halo), one device site-wide. */}
        <div className="ln-chapter-head max-w-3xl">
          <span className="ln-label reveal-up reveal-d-1">تواصل</span>
          <h1 className="ln-page-title"><em>تواصل</em> معنا</h1>
          <p className="ln-chapter-lede">
            فريقنا جاهز لمساعدتك — تواصل معنا بأي طريقة من الطرق التالية
          </p>
        </div>

        {/* Contact info cards — CSS reveal (paints pre-JS, above fold).
            r128 F6: flat hairline cards, border-shift only. */}
        <div className="grid md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-10">
          {contacts.map((item, i) => (
            <div
              key={item.title}
              className={`reveal-up reveal-d-${Math.min(i + 1, 4)} ln-card rounded-2xl p-5 text-center group`}
            >
              <div className="w-9 h-9 rounded-xl bg-[var(--accent)] flex items-center justify-center mx-auto mb-2.5 group-hover:scale-110 transition-transform duration-240">
                <item.icon className="w-4.5 h-4.5 text-primary" />
              </div>
              {/* r131 (A3 D1): card H2s consume the --fs-body rung (15px,
                  was raw text-sm 14px — off the body scale). */}
              <h2 className="font-bold text-foreground text-[length:var(--fs-body)] mb-1">{item.title}</h2>
              {item.href ? (
                /* r132 (A6 §3/§6): micro-copy consumes --fs-xs — text-xs is
                   the identical 12px (exact-match swap). */
                <a href={item.href} className="text-[length:var(--fs-xs)] text-primary-text hover:underline underline-offset-2 rounded inline-flex items-center py-2">{item.desc}</a>
              ) : (
                <p className="text-[length:var(--fs-xs)] text-muted-foreground">{item.desc}</p>
              )}
            </div>
          ))}
        </div>

        {/* Form — the page's only client island (r9). Flat shell (F6);
           the island's internals are untouched. */}
        <div className="max-w-xl mx-auto reveal-up reveal-d-3">
          <div className="ln-card rounded-2xl p-6 md:p-8">
            <h2 className="font-bold text-foreground text-[length:var(--fs-h3)] mb-5">أرسل رسالة</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
    </SiteChrome>
  )
}
