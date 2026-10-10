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

/* r137 (ليبي أولاً): الهاتف — حقل اختياري «واتساب أولاً». العقد من
   lib/phone.ts (منفذ Smart-Menu r136 المطوي هنا): التطبيع يقبل
   الأرقام الشرقية ٠٩١٢… والفواصل وصيغ +218/00218 ويخرج الشكل المحلي
   الموحد (محمول 09XXXXXXXX/09XXXXXXX 9-10 أرقام + أرضي 0[1-9] بعشر
   — r138: عقد الأسطولة الموحّد نفسه الذي اعتمده Smart-Order r138-SO)؛
   غير الصالح يُرفض برسالة عربية واحدة للنموذج وAPI معاً — نفس مذهب
   r10/r13 (عقد مشترك، تعيين الخطأ بالمفتاح field:"phone"). القيمة
   المخزنة/المُرسلة هي الشكل المُطبَّع دائماً. */
export {
  normalizeLibyanPhone,
  toWaMeHref,
  PHONE_ERROR,
} from "@/lib/phone"

/** Input-box cap only — the regex itself rejects any over-long number;
    the cap keeps pasted garbage from flooding the box (server-side the
    normalization is the enforcement: a valid Libyan phone is ≤ 13 digits). */
export const PHONE_MAX = 24

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

/* r132 (A6 §6): the exported SubjectKey type is deleted — it was
   imported/used nowhere (the route and the form key by string). */

export const SUBJECT_LABELS: Record<string, string> = Object.fromEntries(
  SUBJECTS.map((s) => [s.key, s.label])
)

export const CONTACT_SUCCESS_MESSAGE = "تم استلام رسالتك بنجاح. سنتواصل معك قريباً."
