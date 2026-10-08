import { Bot, Smartphone, Globe, Layers, ArrowLeft, User, Quote } from "lucide-react"
import Link from "next/link"
import { GenArtBackground } from "@/components/gen-art-background"
/* r128 F2b: the shared product chrome moved out of the RootLayout
   (the landing owns its own world now) — this page renders it itself. */
import { SiteChrome } from "@/components/site-chrome"
import { CountUp } from "@/components/ui/CountUp"
import { pageMetadata } from "@/lib/seo"
import { breadcrumbJsonLd } from "@/lib/schema"
/* r9 (perf): LCP surgery generalized from the r8 hero — h1 and the
   intro paragraph now paint at FCP (no reveal animation). The eyebrow
   label keeps reveal-d-1 so the entrance cascade stays alive around the
   instantly-painted text, exactly like the home hero.

   r128 F6 (A4 §6): chapter anatomy — the page now reads as chapters
   (label / title / lede heads over flat hairline cards, the landing's
   ln-chapter pattern on product tokens via the styles.css bridge).
   Copy is the shipped copy, re-slotted: every chapter title is an
   existing heading («المؤسس», «قصتنا») or a pure section name; the one
   real figure (500+ عميل نشط) gets the CountUp treatment — nothing
   invented. Cards lost their glass for flat hairline + border-shift;
   the founder avatar lost its gradient wash for the flat accent well. */

export const metadata = pageMetadata({
  /* r10 (SEO audit P2): titles/descriptions expanded toward the 40-55 /
     140-160 char SERP windows — the previous set wasted half the space. */
  title: "عن SmartLink — منصة ليبية متكاملة",
  description:
    "تعرّف على قصة SmartLink — منصة رقمية ليبية متكاملة أسسها أحمد خيري لتقديم حلول ذكية للأعمال: المنيو الرقمي التفاعلي للمطاعم وأتمتة الردود على صفحات فيسبوك بذكاء.",
  canonical: "/about",
  ogDescription: "منصة رقمية ليبية متكاملة — حلول ذكية للأعمال في العالم العربي",
})

const values = [
  { icon: Bot, title: "الذكاء والابتكار", desc: "نستخدم أحدث تقنيات الذكاء الاصطناعي لتقديم حلول ذكية تلقائياً." },
  { icon: Smartphone, title: "سهولة الاستخدام", desc: "واجهات عربية سهلة وبسيطة، صممت خصيصاً للمستخدم العربي." },
  { icon: Globe, title: "دعم عربي كامل", desc: "المنصة بالكامل بالعربية مع دعم اللهجات المحلية وثقافة السوق." },
  { icon: Layers, title: "منصة متكاملة", desc: "كل ما تحتاجه لإدارة أعمالك رقمياً — خدمات تعمل معاً بتناغم." },
]

const breadcrumbLd = breadcrumbJsonLd([
  { name: "الرئيسية", path: "" },
  { name: "عن المنصة", path: "/about" },
])

export default function AboutPage() {
  return (
    <SiteChrome>
    <div className="pt-28 pb-16 relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <GenArtBackground seed={2024} />
      <div className="container-base relative">
        {/* Chapter head — the page head (ln-chapter anatomy, r128 F6).
            LCP doctrine holds: h1 + lede render inline, only the label
            rides the reveal ladder. r130 (W1-D P1-2): the H1 moves to the
            ln-page-title display rung (clamp 34→56px, 700) so all five
            inner pages share ONE head grammar; chapter H2s keep the
            ln-chapter-title rung. */}
        <div className="ln-chapter-head max-w-3xl">
          <span className="ln-label reveal-up reveal-d-1">عن المنصة</span>
          <h1 className="ln-page-title">عن <em>SmartLink</em></h1>
          <p className="ln-chapter-lede">
            SmartLink منصة رقمية ليبية متكاملة تهدف إلى توفير حلول ذكية للأعمال في العالم العربي.
            نؤمن بأن التكنولوجيا يجب أن تكون سهلة، متاحة، وفعالة للجميع.
          </p>
        </div>

        {/* Chapter 01 — القيم */}
        <section className="mb-14" aria-labelledby="about-values">
          <div className="ln-chapter-head max-w-3xl">
            <span className="ln-label reveal-up reveal-d-1">01 — القيم</span>
            <h2 id="about-values" className="ln-chapter-title reveal-up reveal-d-1">قيمنا</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5 max-w-3xl">
            {values.map((item, i) => (
              <div
                key={item.title}
                className={`reveal-up reveal-d-${Math.min(i + 1, 4)} ln-card rounded-2xl p-6 group`}
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--accent)] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-240">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground text-lg mb-1 group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Chapter 02 — المؤسس */}
        <section className="mb-14" aria-labelledby="about-founder">
          <div className="ln-chapter-head max-w-3xl">
            <span className="ln-label reveal-up reveal-d-1">02 — المؤسس</span>
            <h2 id="about-founder" className="ln-chapter-title reveal-up reveal-d-1">المؤسس</h2>
          </div>
          <div className="reveal-up reveal-d-2 max-w-3xl">
            <div className="ln-card rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-5 group">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 bg-[var(--accent)] group-hover:scale-110 transition-transform duration-240">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="text-base text-foreground font-medium">أحمد خيري</p>
                <p className="text-sm text-muted-foreground">مؤسس ورئيس SmartLink — منصة رقمية ليبية رائدة في المنيو الرقمي وخدمات الأتمتة.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Chapter 03 — قصتنا */}
        <section className="max-w-3xl" aria-labelledby="about-story">
          <div className="ln-chapter-head">
            <span className="ln-label reveal-up reveal-d-1">03 — قصتنا</span>
            <h2 id="about-story" className="ln-chapter-title reveal-up reveal-d-1">قصتنا</h2>
          </div>
          <div className="reveal-scroll">
            <p className="text-muted-foreground mb-4">
              انطلقت SmartLink في <strong>20 نوفمبر 2025</strong> من رؤية واضحة: تقديم حلول رقمية متكاملة تلبي احتياجات السوق الليبي والعربي،
              بدءاً من المطاعم والمقاهي التي تحتاج لمنيو رقمي احترافي، إلى أصحاب الصفحات على فيسبوك
              الذين يبحثون عن أتمتة ذكية لردودهم.
            </p>
            <p className="text-muted-foreground mb-4">
              بصفتنا <strong>أول منصة ليبية</strong> متخصصة في إنشاء المنيو الرقمي التفاعلي، نسعى لأن تكون SmartLink
              المنصة الرقمية الأولى للأعمال في ليبيا والعالم العربي.
            </p>

            {/* Pull quote — kept verbatim (A4 §6: matches the role-quote
                pattern); its wrapper was already flat (card + hairline). */}
            <div className="relative my-8 p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              <Quote className="w-6 h-6 text-primary/30 absolute top-4 right-4" aria-hidden="true" />
              {/* m15: Arabic typography law (madarek-reference §2 — no
                  synthetic italics on Arabic; emphasis = weight + accent
                  ink): the quote keeps its weight, drops the slant, and
                  carries the copper-deep accent ink instead. */}
              <p className="text-base md:text-lg text-[var(--primary-text)] font-medium leading-relaxed ms-8">
                &ldquo;التكنولوجيا الحقيقية هي التي تخدم الناس، لا التي تبهرهم. في SmartLink، نبني حلولاً تعيش مع الناس وتفهم احتياجاتهم.&rdquo;
              </p>
            </div>

            <p className="text-muted-foreground mb-4">
              اليوم، نحن منصة متنامية، ونعمل باستمرار على تطوير خدماتنا
              وإضافة المزيد من الحلول المبتكرة — من البوت الذكي لفيسبوك إلى خدمات قادمة تطمح لتغيير
              مشهد الأعمال الرقمية في المنطقة.
            </p>

            {/* r128 F6 — the chapter's one real figure, as a flat stat
                cell with CountUp (the shipped copy's own claim: أكثر من
                500 عميل نشط — no invented figures). */}
            <div className="ln-stat max-w-[240px] mb-8">
              <div className="ln-stat-value"><CountUp value="500+" /></div>
              <div className="ln-stat-label">عميل نشط على المنصة</div>
            </div>

            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-primary text-[var(--primary-fg)] font-semibold text-sm hover:bg-[var(--accent-hover)] transition-all duration-160 active:scale-[0.97]"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> تواصل معنا
            </Link>
          </div>
        </section>
      </div>
    </div>
    </SiteChrome>
  )
}
