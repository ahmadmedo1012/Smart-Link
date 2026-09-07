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
