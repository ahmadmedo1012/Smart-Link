"use client"
import { motion } from "framer-motion"

const _ease = [0.16, 1, 0.3, 1] as [number, number, number, number]

export default function TermsPage() {
  return (
    <div className="pt-28 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[var(--primary)]/5 blur-[150px]" />
      </div>
      <div className="container-base max-w-3xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: _ease }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm text-xs text-primary font-medium mb-5">
            <span>الشروط</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground">
            شروط الاستخدام
          </h1>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: _ease }}
          className="space-y-6 text-muted-foreground leading-relaxed"
        >
          <p className="text-sm">آخر تحديث: يوليو 2026</p>

          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">القبول بالشروط</h2>
            <p>باستخدامك لمنصة SmartLink، فإنك توافق على شروط الاستخدام هذه. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام المنصة.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">الخدمات</h2>
            <p>تقدم SmartLink مجموعة من الخدمات الرقمية تشمل:</p>
            <ul className="list-disc mr-5 mt-2 space-y-1">
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
            <ul className="list-disc mr-5 mt-2 space-y-1">
              <li>لا يجوز استخدام الخدمات لإرسال رسائل غير مرغوب فيها</li>
              <li>لا يجوز انتهاك حقوق الملكية الفكرية</li>
              <li>لا يجوز محاولة اختراق أو تعطيل المنصة</li>
              <li>لا يجوز استخدام الخدمات في أنشطة احتيالية</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">الملكية الفكرية</h2>
            <p>جميع حقوق الملكية الفكرية المتعلقة بمنصة SmartLink — بما في ذلك التصميم، الشيفرة المصدرية، العلامات التجارية، والمحتوى — هي مملوكة حصرياً لـ SmartLink. لا يجوز نسخ أو توزيع أو تعديل أي جزء من المنصة دون إذن كتابي مسبق.</p>
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
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">اتصل بنا</h2>
            <p>لأي استفسارات بخصوص شروط الاستخدام، يرجى التواصل عبر البريد الإلكتروني على:</p>
            <p className="mt-1 font-medium text-foreground">ahmedmedo1012@gmail.com</p>
          </section>
        </motion.div>
      </div>
    </div>
  )
}
