/* r10 (code audit — P1): the contact validation contract was hand-copied
   between the form (client) and the API route (server): the same EMAIL_RE
   and the same 100/254/5000 limits lived in two files. A silent drift
   between the copies means the form accepts what the API rejects (or
   vice versa) — the exact bug class a shared module prevents. */

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const NAME_MAX = 100
export const EMAIL_MAX = 254
export const MESSAGE_MAX = 5000

/* r11 (محاكاة عدائية): الاسم المكوّن من رموز/إيموجي فقط يمرّ الفحصين
   (النموذج والـAPI) ويصل إلى البريد فعلياً — الرسالة واحدة للجهتين
   ليبقى العقد موحّداً كما فعل r10 مع حدود الأطوال. */
export const NAME_LETTER_RE = /[\p{L}\p{N}]/u
export const NAME_LETTER_ERROR = "الاسم يجب أن يحتوي على أحرف"

/* r13 (code audit P1 — إكمال العقد): r10 وحّدت التحقق (النصف الأول)
   وبقيت ثلاث حقائق منسوخة بين الخادم والنموذج:
   1) عناوين المواضيع — route.ts والنموذج كانا يحملان الخريطة نفسها
      حرفياً (أي إضافة موضوع = تعديل ملفين).
   2) رسالة النجاح — النص الواحد كان مكرراً في مواضع الإرسال.
   3) قناة الخطأ — النموذج كان يطابق نص الرسالة العربي حرفياً ليعرف
      أن الخطأ «عن حقل البريد»؛ أي إعادة صياغة تكسر التعيين بصمت
      والاختبارات تبقى خضراء. الخادم الآن يختم `field` على أخطاء
      الحقل الواحد والنموذج يعيّن بالمفتاح لا بالنص. */
export const SUBJECTS = [
  { key: "menu", label: "استفسار عن Smart Menu" },
  { key: "bot", label: "استفسار عن SmartBot" },
  { key: "support", label: "دعم فني" },
  { key: "other", label: "أخرى" },
] as const

export type SubjectKey = (typeof SUBJECTS)[number]["key"]

export const SUBJECT_LABELS: Record<string, string> = Object.fromEntries(
  SUBJECTS.map((s) => [s.key, s.label])
)

export const CONTACT_SUCCESS_MESSAGE = "تم استلام رسالتك بنجاح. سنتواصل معك قريباً."
