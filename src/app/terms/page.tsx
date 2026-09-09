// Server Component: legal text needs zero client JS (removes ~800ms script
// evaluation that was a top TBT source on this page).
import { pageMetadata } from "@/lib/seo"
import { SITE } from "@/lib/site"
import { breadcrumbJsonLd } from "@/lib/schema"

export const metadata = pageMetadata({
  /* r10 (SEO audit P2): expanded toward the SERP window. */
  title: "شروط الاستخدام وأحكام التعاقد",
  description:
    "شروط استخدام منصة SmartLink وخدماتها Smart Menu وSmartBot: الحقوق والالتزامات، أحكام التعاقد الرقمي، الملكية الفكرية، وحدود المسؤولية — بالتفصيل وبوضوح كامل.",
  canonical: "/terms",
})

const breadcrumbLd = breadcrumbJsonLd([
  { name: "الرئيسية", path: "" },
  { name: "شروط الاستخدام", path: "/terms" },
])

export default function TermsPage() {
  return (
    <div className="pt-28 pb-16 relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[var(--primary)]/5 blur-[75px]" />
      </div>
      <div className="container-base max-w-3xl mx-auto relative">
        <div className="text-center mb-10">
          <div className="eyebrow-badge mb-5 reveal-up reveal-d1">
            <span>الشروط</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground">
            شروط الاستخدام
          </h1>
        </div>
        <div
          className="space-y-6 text-muted-foreground leading-relaxed"
        >
          <p className="text-sm">آخر تحديث: سبتمبر 2026</p>

          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">القبول بالشروط</h2>
            <p>باستخدامك لمنصة SmartLink، فإنك توافق على شروط الاستخدام هذه. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام المنصة.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">الخدمات</h2>
            <p>تقدم SmartLink مجموعة من الخدمات الرقمية تشمل:</p>
            <ul className="list-disc ms-5 mt-2 space-y-1">
              <li><strong>Smart Menu:</strong> خدمة المنيو الرقمي للمطاعم والمقاهي تتيح إنشاء قائمة طعام رقمية تفاعلية مع إمكانية استقبال الطلبات عبر واتساب.</li>
              <li><strong>SmartBot:</strong> خدمة البوت الذكي لصفحات فيسبوك تتيح الردود التلقائية الذكية وإدارة المحادثات.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">الحسابات</h2>
            <p>للاستفادة من خدماتنا، يجب إنشاء حساب. أنت مسؤول عن الحفاظ على سرية معلومات حسابك وكلمة المرور. يجب أن تكون المعلومات التي تقدمها دقيقة وكاملة ومحدثة.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">الاستخدام المسموح</h2>
            <p>نمنحك ترخيصاً محدوداً لاستخدام المنصة لأغراضك التجارية المشروعة. يجب ألا تستخدم المنصة في أي نشاط غير قانوني أو مخالف للقوانين المحلية والدولية.</p>
            <ul className="list-disc ms-5 mt-2 space-y-1">
              <li>لا يجوز استخدام الخدمات لإرسال رسائل غير مرغوب فيها</li>
              <li>لا يجوز انتهاك حقوق الملكية الفكرية</li>
              <li>لا يجوز محاولة اختراق أو تعطيل المنصة</li>
              <li>لا يجوز استخدام الخدمات في أنشطة احتيالية</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">الملكية الفكرية</h2>
            <p>جميع حقوق الملكية الفكرية المتعلقة بمنصة SmartLink — بما في ذلك التصميم، الشيفرة المصدرية، العلامات التجارية، والمحتوى — هي مملوكة حصرياً لشركة SmartLink. لا يجوز نسخ أو توزيع أو تعديل أي جزء من المنصة دون إذن كتابي مسبق.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">حدود المسؤولية</h2>
            <p>تُقدم المنصة &quot;كما هي&quot; بدون أي ضمانات. SmartLink غير مسؤولة عن أي أضرار مباشرة أو غير مباشرة ناتجة عن استخدام المنصة، بما في ذلك على سبيل المثال لا الحصر: انقطاع الخدمة، فقدان البيانات، أو الأضرار التجارية.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">إنهاء الحساب</h2>
            <p>يحق لنا تعليق أو إنهاء حسابك في حال انتهاك شروط الاستخدام أو القوانين المعمول بها. يمكنك إنهاء حسابك في أي وقت من خلال التواصل مع فريق الدعم.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">التعديلات على الخدمة</h2>
            <p>نحن نعمل باستمرار على تطوير وتحسين منصتنا. قد نقوم بتعديل أو إيقاف أي خدمة أو ميزة في أي وقت دون إشعار مسبق. لن نتحمل المسؤولية عن أي تعديل أو تعليق أو إيقاف للخدمات.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">القانون المطبق</h2>
            {/* r10 (content audit P2): privacy has had a governing-law clause
                since r9; terms was missing its twin. */}
            <p>تخضع شروط الاستخدام هذه وتُفسَّر وفقاً لقوانين دولة ليبيا، وتختص محاكمها بالنزاعات الناشئة عنها أو المتعلقة بها.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">اتصل بنا</h2>
            <p>لأي استفسارات بخصوص شروط الاستخدام، يرجى التواصل عبر البريد الإلكتروني على:</p>
            <p className="mt-1 font-medium text-foreground">{SITE.email}</p>
          </section>
        </div>
      </div>
    </div>
  )
}
