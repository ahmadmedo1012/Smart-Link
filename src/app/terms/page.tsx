// Server Component: legal text needs zero client JS (removes ~800ms script
// evaluation that was a top TBT source on this page).
import { pageMetadata } from "@/lib/seo"
import { SITE } from "@/lib/site"
import { breadcrumbJsonLd } from "@/lib/schema"
/* r128 F2b: the shared product chrome moved out of the RootLayout
   (the landing owns its own world now) — this page renders it itself. */
import { SiteChrome } from "@/components/site-chrome"
/* r128 F6 (A4 §6, lowest-touch): the ambient blur blob is retired — the
   flat token ground carries the page; the eyebrow badge becomes the
   ln-label mono label; prose tokens stay exactly as shipped (legal
   pages stay quiet — no new motion).
   r131 (A3 D1/D5): the section H2s now consume the --fs-h2 rung (22px,
   was raw text-xl 20px — the type-scale root cause) and the prose rides
   the canonical 15/1.65 body rule (was leading-relaxed 1.625) inside a
   72ch reading measure (was max-w-3xl 768px ≈ 100+ ch/line). */

export const metadata = pageMetadata({
  /* r10 (SEO audit P2): expanded toward the SERP window.
     r138 (إكمال صدق الأسطول — موجة r137 الفائتة): الخدمات الثلاث
     في الوصف — كان يعدّ خدمتين. */
  title: "شروط الاستخدام وأحكام التعاقد",
  description:
    "شروط استخدام منصة SmartLink وخدماتها Smart Menu وSmartBot وSmart Order: الحقوق والالتزامات، أحكام التعاقد الرقمي، الملكية الفكرية، وحدود المسؤولية — بالتفصيل وبوضوح كامل.",
  canonical: "/terms",
})

const breadcrumbLd = breadcrumbJsonLd([
  { name: "الرئيسية", path: "" },
  { name: "شروط الاستخدام", path: "/terms" },
])

export default function TermsPage() {
  return (
    <SiteChrome>
    <div className="pt-28 pb-16 relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div className="container-base max-w-[72ch] mx-auto relative">
        {/* r130 (W1-D P1-2): the page head unifies on the canonical
            ln-chapter-head anatomy (label / title, like /about) — was a
            centered text-5xl/6xl 800-weight header. Legal pages stay
            quiet: no lede copy is invented, the head is label + title. */}
        <div className="ln-chapter-head">
          <span className="ln-label reveal-up reveal-d-1">الشروط</span>
          <h1 className="ln-page-title">شروط <em>الاستخدام</em></h1>
        </div>
        <div
          className="space-y-6 text-muted-foreground"
        >
          {/* r138: حُدِّث التاريخ — تعداد الخدمات أعلاه تغيّر نصاً (أُضيف
              Smart Order)، وتاريخ آخر تحديث يجب أن يتبع النص لا يتقدمه. */}
          <p className="text-sm">آخر تحديث: أكتوبر 2026</p>

          <section>
            <h2 className="text-[length:var(--fs-h2)] font-bold text-foreground mt-6 mb-2">القبول بالشروط</h2>
            <p>باستخدامك لمنصة SmartLink، فإنك توافق على شروط الاستخدام هذه. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام المنصة.</p>
          </section>

          <section>
            <h2 className="text-[length:var(--fs-h2)] font-bold text-foreground mt-6 mb-2">الخدمات</h2>
            <p>تقدم SmartLink مجموعة من الخدمات الرقمية تشمل:</p>
            <ul className="list-disc ms-5 mt-2 space-y-1">
              <li><strong>Smart Menu:</strong> خدمة المنيو الرقمي للمطاعم والمقاهي تتيح إنشاء قائمة طعام رقمية تفاعلية مع إمكانية استقبال الطلبات عبر واتساب.</li>
              <li><strong>SmartBot:</strong> خدمة البوت الذكي لصفحات فيسبوك تتيح الردود التلقائية الذكية وإدارة المحادثات.</li>
              {/* r138 (إكمال صدق الأسطول — موجة r137 الفائتة): قائمة
                  الخدمات القانونية كانت تعدّ خدمتين بينما المنصة
                  تسوّق ثلاثاً — Smart Order حيّ على order.smart-link.ly. */}
              <li><strong>Smart Order:</strong> خدمة متجر الطلبات الرقمي للأعمال تتيح إنشاء متجر إلكتروني مع إدارة الطلبات والتوصيل وطرق دفع محلية.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[length:var(--fs-h2)] font-bold text-foreground mt-6 mb-2">الحسابات</h2>
            <p>للاستفادة من خدماتنا، يجب إنشاء حساب. أنت مسؤول عن الحفاظ على سرية معلومات حسابك وكلمة المرور. يجب أن تكون المعلومات التي تقدمها دقيقة وكاملة ومحدثة.</p>
          </section>

          <section>
            <h2 className="text-[length:var(--fs-h2)] font-bold text-foreground mt-6 mb-2">الاستخدام المسموح</h2>
            <p>نمنحك ترخيصاً محدوداً لاستخدام المنصة لأغراضك التجارية المشروعة. يجب ألا تستخدم المنصة في أي نشاط غير قانوني أو مخالف للقوانين المحلية والدولية.</p>
            <ul className="list-disc ms-5 mt-2 space-y-1">
              <li>لا يجوز استخدام الخدمات لإرسال رسائل غير مرغوب فيها</li>
              <li>لا يجوز انتهاك حقوق الملكية الفكرية</li>
              <li>لا يجوز محاولة اختراق أو تعطيل المنصة</li>
              <li>لا يجوز استخدام الخدمات في أنشطة احتيالية</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[length:var(--fs-h2)] font-bold text-foreground mt-6 mb-2">الملكية الفكرية</h2>
            <p>جميع حقوق الملكية الفكرية المتعلقة بمنصة SmartLink — بما في ذلك التصميم، الشيفرة المصدرية، العلامات التجارية، والمحتوى — هي مملوكة حصرياً لشركة SmartLink. لا يجوز نسخ أو توزيع أو تعديل أي جزء من المنصة دون إذن كتابي مسبق.</p>
          </section>

          <section>
            <h2 className="text-[length:var(--fs-h2)] font-bold text-foreground mt-6 mb-2">حدود المسؤولية</h2>
            <p>تُقدم المنصة &quot;كما هي&quot; بدون أي ضمانات. SmartLink غير مسؤولة عن أي أضرار مباشرة أو غير مباشرة ناتجة عن استخدام المنصة، بما في ذلك على سبيل المثال لا الحصر: انقطاع الخدمة، فقدان البيانات، أو الأضرار التجارية.</p>
          </section>

          <section>
            <h2 className="text-[length:var(--fs-h2)] font-bold text-foreground mt-6 mb-2">إنهاء الحساب</h2>
            <p>يحق لنا تعليق أو إنهاء حسابك في حال انتهاك شروط الاستخدام أو القوانين المعمول بها. يمكنك إنهاء حسابك في أي وقت من خلال التواصل مع فريق الدعم.</p>
          </section>

          <section>
            <h2 className="text-[length:var(--fs-h2)] font-bold text-foreground mt-6 mb-2">التعديلات على الخدمة</h2>
            <p>نحن نعمل باستمرار على تطوير وتحسين منصتنا. قد نقوم بتعديل أو إيقاف أي خدمة أو ميزة في أي وقت دون إشعار مسبق. لن نتحمل المسؤولية عن أي تعديل أو تعليق أو إيقاف للخدمات.</p>
          </section>

          <section>
            <h2 className="text-[length:var(--fs-h2)] font-bold text-foreground mt-6 mb-2">القانون المطبق</h2>
            {/* r10 (content audit P2): privacy has had a governing-law clause
                since r9; terms was missing its twin. */}
            <p>تخضع شروط الاستخدام هذه وتُفسَّر وفقاً لقوانين دولة ليبيا، وتختص محاكمها بالنزاعات الناشئة عنها أو المتعلقة بها.</p>
          </section>

          <section>
            {/* r134 (R134-W1-SL copy P2): unified on r9's «تواصل معنا»
                (the audit's sweep missed this third leftover). */}
            <h2 className="text-[length:var(--fs-h2)] font-bold text-foreground mt-6 mb-2">تواصل معنا</h2>
            <p>لأي استفسارات بخصوص شروط الاستخدام، يرجى التواصل عبر البريد الإلكتروني على:</p>
            <p className="mt-1 font-medium text-foreground">{SITE.email}</p>
          </section>
        </div>
      </div>
    </div>
    </SiteChrome>
  )
}
