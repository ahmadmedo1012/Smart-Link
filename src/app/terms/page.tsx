import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "شروط الاستخدام",
  description: "شروط استخدام منصة SmartLink",
}

export default function TermsPage() {
  return (
    <div className="pt-28 pb-16">
      <div className="container-base max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-6">شروط الاستخدام</h1>
        <div className="space-y-5 text-[var(--muted-foreground)] leading-relaxed">
          <p>آخر تحديث: 2026</p>
          <h2 className="text-xl font-bold text-[var(--foreground)] mt-8 mb-3">قبول الشروط</h2>
          <p>باستخدامك لمنصة SmartLink، فإنك توافق على هذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، يرجى عدم استخدام المنصة.</p>
          <h2 className="text-xl font-bold text-[var(--foreground)] mt-8 mb-3">الحسابات</h2>
          <p>أنت مسؤول عن الحفاظ على سرية حسابك وكلمة المرور. يجب عليك إبلاغنا فوراً بأي استخدام غير مصرح به لحسابك.</p>
          <h2 className="text-xl font-bold text-[var(--foreground)] mt-8 mb-3">الخدمات</h2>
          <p>نقدم خدماتنا &quot;كما هي&quot; بدون أي ضمانات. نحن لا نتحمل مسؤولية أي أضرار ناتجة عن استخدام أو عدم القدرة على استخدام خدماتنا.</p>
          <h2 className="text-xl font-bold text-[var(--foreground)] mt-8 mb-3">المحتوى</h2>
          <p>أنت تحتفظ بجميع حقوق المحتوى الذي تنشره على منصتنا. ومع ذلك، بموجب هذه الشروط، تمنحنا ترخيصاً لاستخدام هذا المحتوى لغرض تقديم خدماتنا لك.</p>
          <h2 className="text-xl font-bold text-[var(--foreground)] mt-8 mb-3">التعديلات</h2>
          <p>نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سنقوم بإشعارك بالتغييرات المهمة عبر البريد الإلكتروني أو من خلال المنصة.</p>
          <h2 className="text-xl font-bold text-[var(--foreground)] mt-8 mb-3">القانون المطبق</h2>
          <p>تخضع هذه الشروط وتفسر وفقاً لقوانين ليبيا.</p>
        </div>
      </div>
    </div>
  )
}
