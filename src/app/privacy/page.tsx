// Server Component: legal text needs zero client JS (removes ~800ms script
// evaluation that was the #1 TBT source on this page).
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
  /* r10 (SEO audit P2): expanded toward the SERP window + names the
     products explicitly for entity matching. */
  title: "سياسة الخصوصية وحماية بياناتك",
  description:
    "سياسة خصوصية SmartLink: كيف نجمع بياناتك ونستخدمها ونحميها عند استخدام المنيو الرقمي Smart Menu والبوت الذكي SmartBot — شفافية كاملة مع حقوقك وطرق التواصل معنا.",
  canonical: "/privacy",
})

const breadcrumbLd = breadcrumbJsonLd([
  { name: "الرئيسية", path: "" },
  { name: "سياسة الخصوصية", path: "/privacy" },
])

export default function PrivacyPage() {
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
          <span className="ln-label reveal-up reveal-d-1">الخصوصية</span>
          <h1 className="ln-page-title">سياسة <em>الخصوصية</em></h1>
        </div>
        <div
          className="space-y-6 text-muted-foreground"
        >
          <p className="text-sm">آخر تحديث: سبتمبر 2026</p>

          <section>
            <h2 className="text-[length:var(--fs-h2)] font-bold text-foreground mt-6 mb-2">المقدمة</h2>
            <p>SmartLink هي منصة رقمية ليبية تقدم حلولاً مبتكرة للأعمال، بما في ذلك المنيو الرقمي للمطاعم (Smart Menu) والبوت الذكي لفيسبوك (SmartBot). نحن ملتزمون بحماية خصوصية مستخدمينا. توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية معلوماتك الشخصية عند استخدامك لمنصتنا.</p>
          </section>

          <section>
            <h2 className="text-[length:var(--fs-h2)] font-bold text-foreground mt-6 mb-2">البيانات التي نجمعها</h2>
            <p>قد نجمع الأنواع التالية من البيانات:</p>
            <ul className="list-disc ms-5 mt-2 space-y-1">
              <li>الاسم الكامل</li>
              <li>البريد الإلكتروني</li>
              <li>رقم الهاتف</li>
              <li>بيانات الاستخدام (الصفحات التي تزورها، الميزات التي تستخدمها)</li>
              <li>بيانات التواصل عبر واتساب (الرسائل والاستفسارات)</li>
              <li>معلومات الحساب (اسم المستخدم، كلمة المرور المشفرة)</li>
              {/* r10 (content audit P1): the form + analytics were collecting
                  data the policy never mentioned — a legal gap on a page
                  linked from every footer. */}
              <li>بيانات نموذج التواصل (الاسم، البريد الإلكتروني، الموضوع، نص الرسالة)</li>
              <li>بيانات تحليلية مجمّعة عن الزيارات (عدادات مشاهدات الصفحات عبر خدمة تحليلات خارجية، دون ملفات تعريف ارتباط شخصية)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[length:var(--fs-h2)] font-bold text-foreground mt-6 mb-2">كيف نستخدم بياناتك</h2>
            <p>نستخدم البيانات التي نجمعها للأغراض التالية:</p>
            <ul className="list-disc ms-5 mt-2 space-y-1">
              <li>تقديم الخدمات وتحسينها (المنيو الرقمي، البوت الذكي)</li>
              <li>التواصل معك بخصوص حسابك وطلباتك</li>
              <li>الدعم الفني وخدمة العملاء</li>
              <li>تحسين أداء المنصة وتجربة المستخدم</li>
              <li>الامتثال للالتزامات القانونية</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[length:var(--fs-h2)] font-bold text-foreground mt-6 mb-2">مشاركة البيانات</h2>
            <p>نحن لا نشارك معلوماتك الشخصية مع أطراف ثالثة لأغراض تسويقية أو تجارية. قد نشارك بياناتك فقط عند الاقتضاء القانوني، مثل الامتثال لأمر قضائي أو طلب قانوني من السلطات المختصة في ليبيا.</p>
            {/* r11 (E-EC1b — تناقض قانوني): البنود أعلاه كانت تقول «لا
                مشاركة مع أطراف ثالثة» بينما نموذج التواصل يمرّ فعلياً عبر
                معالجين فرعيين (Resend لإرسال البريد وVercel للاستضافة)
                في بند «مقدمو الخدمة» أعلاه — الفقرة التالية تسد الفجوة. */}
            <p className="mt-2">لأغراض تشغيلية بحتة، نعتمد على مزودي خدمات يعملون نيابة عنا وفق تعليماتنا: Resend لتوصيل رسائل البريد الإلكتروني، وVercel لاستضافة الموقع ومعالجة بيانات النموذج. لا يستخدم هذان المزودان بياناتك لأي غرض خاص بهما، ويُعالجانها فقط لتنفيذ الخدمة المطلوبة. وعند تواصلك معنا عبر واتساب، تُعالَج رسائلك على منصة WhatsApp التابعة لشركة Meta وفق سياسة خصوصيتها المعلنة.</p>
          </section>

          <section>
            <h2 className="text-[length:var(--fs-h2)] font-bold text-foreground mt-6 mb-2">الاحتفاظ بالبيانات</h2>
            <p>نحتفظ ببيانات حسابك واستخدامك طوال مدة استخدامك للخدمة ولمدة 12 شهراً إضافية بعد إلغاء حسابك أو توقفك عن استخدام المنصة، وذلك لأغراض قانونية وتشغيلية. بعد هذه المدة، يتم حذف بياناتك بشكل آمن أو إخفاء هويتها. أما رسائل نموذج التواصل فتصل مباشرة إلى بريدنا الإلكتروني، ونحتفظ بها ما دامت لازمة للرد والمتابعة، ويحق لك طلب حذفها في أي وقت بمراسلتنا.</p>
          </section>

          <section>
            <h2 className="text-[length:var(--fs-h2)] font-bold text-foreground mt-6 mb-2">حقوق المستخدم</h2>
            <p>نحن نسعى لتوفير مستوى حماية يتوافق مع المعايير العالمية مثل اللائحة العامة لحماية البيانات (GDPR). تشمل حقوقك:</p>
            <ul className="list-disc ms-5 mt-2 space-y-1">
              <li>حق الوصول إلى بياناتك الشخصية</li>
              <li>حق تصحيح البيانات غير الدقيقة</li>
              <li>حق حذف بياناتك (في الحالات التي يسمح بها القانون)</li>
              <li>حق تقييد معالجة بياناتك</li>
            </ul>
            <p className="mt-2">نشير إلى أن هذه الحقوق تطبق بشكل طوعي في إطار التزامنا بأفضل الممارسات، وذلك في ظل عدم وجود تشريع ليبي محدد لحماية البيانات الشخصية حتى تاريخه.</p>
          </section>

          <section>
            <h2 className="text-[length:var(--fs-h2)] font-bold text-foreground mt-6 mb-2">الإجراءات الأمنية</h2>
            <p>نطبق إجراءات أمنية شاملة لحماية بياناتك، بما في ذلك:</p>
            <ul className="list-disc ms-5 mt-2 space-y-1">
              <li>التشفير في نقل البيانات باستخدام بروتوكول TLS</li>
              <li>ضوابط الوصول الصارمة (صلاحيات محدودة حسب المهام)</li>
              <li>تدقيق أمني دوري للبنية التحتية</li>
              <li>تخزين كلمات المرور بشكل مشفر باستخدام خوارزميات آمنة</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[length:var(--fs-h2)] font-bold text-foreground mt-6 mb-2">النقل الدولي للبيانات</h2>
            <p>بياناتك تُخزن على خوادم آمنة قد تكون موجودة داخل ليبيا أو خارجها. عند نقل بياناتك دولياً، نحرص على تطبيق مستويات حماية مناسبة تضمن سرية وأمان معلوماتك.</p>
          </section>

          <section>
            <h2 className="text-[length:var(--fs-h2)] font-bold text-foreground mt-6 mb-2">التغييرات على السياسة</h2>
            <p>قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنقوم بإشعارك بالتغييرات الجوهرية عبر البريد الإلكتروني أو من خلال المنصة. يُرجى مراجعة هذه الصفحة دورياً للاطلاع على أحدث التحديثات.</p>
          </section>

          <section>
            {/* r134 (R134-W1-SL copy P2): unified on r9's «تواصل معنا». */}
            <h2 className="text-[length:var(--fs-h2)] font-bold text-foreground mt-6 mb-2">تواصل معنا</h2>
            <p>لأي استفسارات أو مخاوف بخصوص سياسة الخصوصية هذه، يرجى التواصل معنا على:</p>
            <p className="mt-1 font-medium text-foreground">{SITE.email}</p>
          </section>

          <section>
            <h2 className="text-[length:var(--fs-h2)] font-bold text-foreground mt-6 mb-2">القانون المطبق</h2>
            <p>تخضع سياسة الخصوصية هذه وتُفسر وفقاً لقوانين دولة ليبيا.</p>
          </section>
        </div>
      </div>
    </div>
    </SiteChrome>
  )
}
