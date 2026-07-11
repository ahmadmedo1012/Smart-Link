"use client"
import { motion } from "framer-motion"

export default function PrivacyPage() {
  return (
    <div className="pt-28 pb-16">
      <div className="container-base max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-8"
        >
          سياسة <span className="gradient-text">الخصوصية</span>
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="space-y-6 text-muted-foreground leading-relaxed"
        >
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
        </motion.div>
      </div>
    </div>
  )
}
