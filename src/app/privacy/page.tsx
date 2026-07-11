import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "سياسة الخصوصية",
  description: "سياسة الخصوصية لمنصة SmartLink",
}

export default function PrivacyPage() {
  return (
    <div className="pt-28 pb-16">
      <div className="container-base max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-8">سياسة الخصوصية</h1>
        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <p className="text-sm">آخر تحديث: 2026</p>
          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">المقدمة</h2>
            <p>نحن في SmartLink نلتزم بحماية خصوصية مستخدمينا. توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية معلوماتك الشخصية.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">المعلومات التي نجمعها</h2>
            <p>نجمع المعلومات التالية عند استخدامك لمنصتنا: الاسم، البريد الإلكتروني، رقم الهاتف، معلومات الحساب، وبيانات الاستخدام الأساسية.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">كيف نستخدم معلوماتك</h2>
            <p>نستخدم معلوماتك لتقديم وتحسين خدماتنا، التواصل معك بخصوص حسابك، وإرسال تحديثات مهمة. لا نشارك معلوماتك مع أطراف ثالثة لأغراض تسويقية.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">حماية البيانات</h2>
            <p>نطبق إجراءات أمنية مشددة لحماية معلوماتك من الوصول غير المصرح به أو التعديل أو الإفشاء.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">اتصل بنا</h2>
            <p>لأي استفسارات بخصوص سياسة الخصوصية، يرجى التواصل معنا على support@smart-link.ly</p>
          </section>
        </div>
      </div>
    </div>
  )
}
