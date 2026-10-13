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
   stat cell gets the CountUp treatment. r143 (الصدق): الخلية صارت
   «3 منتجات حيّة» — «500+ عميل نشط» كان رقمًا بلا مصدر، والحقيقة
   القابلة للتحقق أقوى من الادعاء. Cards lost their glass for flat
   hairline + border-shift; the founder avatar lost its gradient wash
   for the flat accent well. */

export const metadata = pageMetadata({
  /* r10 (SEO audit P2): titles/descriptions expanded toward the 40-55 /
     140-160 char SERP windows — the previous set wasted half the space.
     r138 (إكمال صدق الأسطول — موجة r137 الفائتة): المنتجات الثلاثة
     في الوصف — كان يعدّ منتجين. */
  title: "عن SmartLink — منصة ليبية متكاملة",
  description:
    "تعرّف على قصة SmartLink — منصة رقمية ليبية متكاملة أسسها أحمد خيري لتقديم حلول ذكية للأعمال: المنيو الرقمي التفاعلي للمطاعم، وبوت فيسبوك الذكي، ومتجر الطلبات الرقمي.",
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
    {/* phase6 (P6-2-a2): chapter rhythm + full-width composition — the
        page composes for the 1200px container: the head and the card
        chapters span it deliberately (the title/lede self-measure 22/62ch),
        the value grid goes 4-up, only the story prose keeps its reading
        measure. Every chapter rides the .ln-chapter fluid rhythm + the
        gold hairline; the wrapper keeps only the fixed-header clearance
        (pt-28) — the chapters own the vertical cadence now. */}
    <div className="pt-28 relative overflow-hidden">
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
            ln-chapter-title rung. phase6: the head is the --head chapter
            (full container width — the lede self-measures 62ch). */}
        <header className="ln-chapter ln-chapter--head">
          <div className="ln-chapter-head">
            <span className="ln-label reveal-up reveal-d-1">عن المنصة</span>
            <h1 className="ln-page-title">عن <em>SmartLink</em></h1>
            <p className="ln-chapter-lede">
              SmartLink منصة رقمية ليبية متكاملة تهدف إلى توفير حلول ذكية للأعمال في العالم العربي.
              نؤمن بأن التكنولوجيا يجب أن تكون سهلة، متاحة، وفعالة للجميع.
            </p>
          </div>
        </header>

        {/* Chapter 01 — القيم (phase6: 4-up at the container width; was a
            max-w-3xl 2-up grid leaving half the container dead). */}
        <section className="ln-chapter" aria-labelledby="about-values">
          <div className="ln-chapter-head">
            <span className="ln-label reveal-up reveal-d-1">01 — القيم</span>
            <h2 id="about-values" className="ln-chapter-title reveal-up reveal-d-1">قيمنا</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((item, i) => (
              <div
                key={item.title}
                className={`reveal-up reveal-d-${Math.min(i + 1, 4)} ln-card rounded-2xl p-6 group`}
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--accent)] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-[var(--t-base)]">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                {/* r132 (A6 §3/§6): card titles consume --fs-body-lg —
                    was raw text-lg 18px (Tailwind's default step, off
                    the ladder); snapped onto the 17px body-lg rung
                    (−1px, on-ladder). */}
                <h3 className="font-bold text-foreground text-[length:var(--fs-body-lg)] mb-1 group-hover:text-primary transition-colors">{item.title}</h3>
                {/* r133 (A7 §2.2 / R16): prose body-copy rides --fs-body 15px
                    (was raw text-sm 14px — the UI-chrome rung). */}
                <p className="text-[length:var(--fs-body)] text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Chapter 02 — المؤسس (phase6: the card spans the container; the
            text keeps a 60ch measure inside — full-width surface,
            measured reading). */}
        <section className="ln-chapter" aria-labelledby="about-founder">
          <div className="ln-chapter-head">
            <span className="ln-label reveal-up reveal-d-1">02 — المؤسس</span>
            <h2 id="about-founder" className="ln-chapter-title reveal-up reveal-d-1">المؤسس</h2>
          </div>
          <div className="reveal-up reveal-d-2">
            <div className="ln-card rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-5 group">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 bg-[var(--accent)] group-hover:scale-110 transition-transform duration-[var(--t-base)]">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div className="max-w-[60ch]">
                {/* r133 (A7 §2.2 / R16): founder name — was text-base 16px
                    (no rung); the 15px body rung is the on-ladder step. */}
                <p className="text-[length:var(--fs-body)] text-foreground font-medium">أحمد خيري</p>
                <p className="text-[length:var(--fs-body)] text-muted-foreground">مؤسس ورئيس SmartLink — منصة رقمية ليبية متخصصة في المنيو الرقمي وخدمات الأتمتة.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Chapter 03 — قصتنا (phase6: prose keeps the 72ch reading measure
            inside the wide container — measure is the composition here,
            not dead space). */}
        <section className="ln-chapter" aria-labelledby="about-story">
          <div className="ln-chapter-head">
            <span className="ln-label reveal-up reveal-d-1">03 — قصتنا</span>
            <h2 id="about-story" className="ln-chapter-title reveal-up reveal-d-1">قصتنا</h2>
          </div>
          <div className="reveal-scroll max-w-[72ch]">
            <p className="text-muted-foreground mb-4">
              انطلقت SmartLink في <strong>20 نوفمبر 2025</strong> من رؤية واضحة: تقديم حلول رقمية متكاملة تلبي احتياجات السوق الليبي والعربي،
              بدءاً من المطاعم والمقاهي التي تحتاج لمنيو رقمي احترافي، إلى أصحاب الصفحات على فيسبوك
              الذين يبحثون عن أتمتة ذكية لردودهم.
            </p>
            <p className="text-muted-foreground mb-4">
              {/* r144 (P4-4SL، موجة الصدق): «أول منصة ليبية» كان تفضيلًا
                  لا مصدر له (نفس فئة «+500 عميل» المحذوفة في r143) —
                  إعادة الصياغة إلى قابل للتحقق: تاريخ الانطلاق المذكور
                  في الفقرة نفسها، وتطلّع بلا ادعاء سبق. */}
              بصفتنا منصةً ليبية متخصصة في المنيو الرقمي التفاعلي منذ
              نوفمبر 2025، نعمل كل يوم لتكون SmartLink خيار الأعمال
              الموثوق في ليبيا والعالم العربي.
            </p>

            {/* Pull quote — kept verbatim (A4 §6: matches the role-quote
                pattern); its wrapper was already flat (card + hairline).
                r134 (R134-W1-SL RTL P2 / punctuation P3): the decorative
                Quote glyph anchors at the logical end-4 corner (was
                physical right-4 — r131 A12 fleet rule), and the Latin
                curly &ldquo;&rdquo; pair rides the fleet «» canon. */}
            <div className="relative my-8 p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              <Quote className="w-6 h-6 text-primary/30 absolute top-4 end-4" aria-hidden="true" />
              {/* m15: Arabic typography law (madarek-reference §2 — no
                  synthetic italics on Arabic; emphasis = weight + accent
                  ink): the quote keeps its weight, drops the slant, and
                  carries the copper-deep accent ink instead. */}
              {/* r132 (A6 §3/§6): the quote's md step consumes
                  --fs-body-lg (was text-lg 18px, Tailwind's off-ladder
                  default — now the 17px rung, −1px); the mobile
                  text-base 16px has no rung and stays pending the
                  coordinator's no-rung ruling. r133 (A7 §2.2 / R16): the
                  ruling landed — the mobile step rides --fs-body 15px. */}
              <p className="text-[length:var(--fs-body)] md:text-[length:var(--fs-body-lg)] text-[var(--primary-text)] font-medium leading-relaxed ms-8">
                «التكنولوجيا الحقيقية هي التي تخدم الناس، لا التي تبهرهم. في SmartLink، نبني حلولاً تعيش مع الناس وتفهم احتياجاتهم.»
              </p>
            </div>

            <p className="text-muted-foreground mb-4">
              اليوم، نحن منصة متنامية، ونعمل باستمرار على تطوير خدماتنا
              وإضافة المزيد من الحلول المبتكرة — من البوت الذكي لفيسبوك إلى خدمات قادمة تطمح لتغيير
              مشهد الأعمال الرقمية في المنطقة.
            </p>

            {/* r128 F6 — the chapter's one flat stat cell with CountUp.
                r143 (الصدق): «500+ عميل نشط» كان رقمًا بلا مصدر (منصة
                انطلقت نوفمبر 2025) — استُبدل بالقيمة القابلة للتحقق
                نفسها المستخدمة في كوكبة الرئيسية: ثلاثة منتجات حيّة. */}
            <div className="ln-stat max-w-[240px] mb-8">
              <div className="ln-stat-value"><CountUp value="3" /></div>
              <div className="ln-stat-label">منتجات حيّة على المنصة</div>
            </div>

            <Link
              href="/contact"
              /* r150 (20-IDEAL-CTA completion): the FULL fleet button canon
                 44/13/600/r10 (h-11 = 44px, --fs-sm 13px, rounded-md =
                 10px — the SO Button twin); was the r131 h-10 40px rung
                 retired by the family 44/48/52 canon. */
              className="group inline-flex items-center gap-2 h-11 px-5 rounded-md bg-primary text-[var(--primary-fg)] font-semibold text-[length:var(--fs-sm)] hover:bg-[var(--accent-hover)] transition-all duration-[var(--t-fast)] active:scale-[0.97]"
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
