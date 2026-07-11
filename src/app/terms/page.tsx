"use client"
import { motion } from "framer-motion"

export default function TermsPage() {
  return (
    <div className="pt-28 pb-16">
      <div className="container-base max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-8"
        >
          شروط <span className="gradient-text">الاستخدام</span>
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="space-y-6 text-muted-foreground leading-relaxed"
        >
          <p className="text-sm">آخر تحديث: 2026</p>
          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">قبول الشروط</h2>
            <p>باستخدامك لمنصة SmartLink، فإنك توافق على هذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، يرجى عدم استخدام المنصة.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">الحسابات</h2>
            <p>أنت مسؤول عن الحفاظ على سرية حسابك وكلمة المرور. يجب عليك إبلاغنا فوراً بأي استخدام غير مصرح به لحسابك.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">الخدمات</h2>
            <p>نقدم خدماتنا &quot;كما هي&quot; بدون أي ضمانات. نحن لا نتحمل مسؤولية أي أضرار ناتجة عن استخدام أو عدم القدرة على استخدام خدماتنا.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">المحتوى</h2>
            <p>أنت تحتفظ بجميع حقوق المحتوى الذي تنشره على منصتنا. ومع ذلك، بموجب هذه الشروط، تمنحنا ترخيصاً لاستخدام هذا المحتوى لغرض تقديم خدماتنا لك.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">التعديلات</h2>
            <p>نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سنقوم بإشعارك بالتغييرات المهمة عبر البريد الإلكتروني أو من خلال المنصة.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">القانون المطبق</h2>
            <p>تخضع هذه الشروط وتفسر وفقاً لقوانين ليبيا.</p>
          </section>
        </motion.div>
      </div>
    </div>
  )
}
