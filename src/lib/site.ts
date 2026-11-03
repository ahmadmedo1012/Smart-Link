/* r9: Single source of truth for business constants.
   Before this file, the WhatsApp number lived in 3 display formats and 11
   files, the owner email in 11 files, and the product URLs in 7 files each —
   any business change required a 40-file hunt (see r9 audit, C6). */

export const SITE = {
  name: "SmartLink",
  url: "https://smart-link.ly",

  /* r126 (P4-A3 §3.7): the PUBLIC contact identity moved onto the owned
     domain (noreply@smart-link.ly — the address the domain already sends
     from, verified in fromEmail) so no personal Gmail is advertised on
     contact surfaces, JSON-LD or API error fallbacks.
     W6-B2 (صدق القنوات — تدقيق W6-A2 P2): هذا العنوان هو هوية
     الإرسال الآلي على النطاق، لا قناة دعم — لا مصدر يثبت صندوقًا
     مراقَبًا (اسمه نفسه يقول «لا رد»)، فلم يعد يُعلَن في أي سطح
     تواصل (البطاقة/التذييل/JSON-LD/رسائل الخطأ/القانونية). القنوات
     الصادقة المعلنة: واتساب + نموذج التواصل. لو تهيّأ يومًا صندوق
     بريد مراقَب فتغيير هذا السطر وحده يعيدها في كل مكان (قانون
     المصدر الواحد r9).
     P42-8d (تدقيق الأمن): صندوق المالك الخاص لم يعد مفتاحًا هنا إطلاقاً.
     SITE تُستهلك من مكوّنات client (main-nav/contact-form/LandingHeader)
     فتُسفِر حرفياً إلى حزم JS العمومية — كان ownerEmail يستقل معها إلى
     view-source كل صفحة رغم أنه «لا يُعرض أبداً» (فُحص في بناء 16.4:
     البريد الخاص في 6 chunks عمومية). وجهه الوحيد الآن ثابت داخل
     مسار الخادم api/contact/route.ts — unit pin: SITE بلا أي مفتاح
     خاص، وe2e pin: grep حزم العميل.) */
  email: "noreply@smart-link.ly",

  /** Transactional from-address on the site's OWN domain (r13 — was the
      last domain literal living outside this file, hardcoded in the API
      route). Resend requires an owned domain. */
  fromEmail: "SmartLink <noreply@smart-link.ly>",

  /* P42-8d: ownerEmail حُذف من هنا — انظر التعليق أعلى email. */

  whatsapp: {
    /** International format without "+", as wa.me expects. */
    number: "218910089975",
    url: "https://wa.me/218910089975",
    /** r9: the ONE display format — rendered inside dir="ltr" so the "+"
        never rides the bidi reversal again (footer used to show
        "218910089975+" and API errors used the bare local form). */
    display: "+218 91 008 9975",
    /** Local form used inside Arabic API error sentences. */
    local: "0910089975",
  },

  products: {
    menu: {
      short: "Smart Menu",
      label: "Smart Menu — المنيو الرقمي",
      /** The product's public root (browsing context: nav menus, footers,
          worlds cards). */
      url: "https://menu.smart-link.ly",
      /* P40-5a (P1-1 صدق التحويل): كل أزرار التحويل في المظلة كانت
         تهبط على جذور المنتجات (صفحات الهبوط) بدل صفحات الاشتراك —
         بينما أزرار المنتجات نفسها تتعمّق مباشرة. signupUrl هو مسار
         الاشتراك الذي يستخدمه كل منتج لأزراره الأساسية (مُتحقَّق حياً
         2026-10-31: منيو /subscribe هي نفسها زر «ابدأ مجاناً» على
         جذره ×6، بوت /subscribe ×4، أوردر /register ×6). القانون:
         أزرار التحويل (هيرو/هيدر/ختام/بطاقات الأسعار) → signupUrl؛
         سياقات التصفح (قوائم الخدمات/التذييل/بطاقات العوالم) → url. */
      signupUrl: "https://menu.smart-link.ly/subscribe",
      desc: "حول منيو مطعمك إلى تجربة رقمية تفاعلية",
    },
    bot: {
      /** r9: "SmartBot" — one word, everywhere. Two API surfaces used
          "Smart Bot" with a space (audit C3). */
      short: "SmartBot",
      label: "SmartBot — البوت الذكي",
      url: "https://bot.smart-link.ly",
      /* P40-5a (P1-1): زر الاشتراك الخاص بالبوت نفسه (تحقّق حي). */
      signupUrl: "https://bot.smart-link.ly/subscribe",
      desc: "أتمتة الردود على صفحات فيسبوك بذكاء",
    },
    /** r137 (صدق الأسطول): Smart-Order حيّ (order.smart-link.ly) — كان
        يُسوَّق في README/SECURITY فقط بينما المنتج الثالث يعمل فعلاً.
        الوصف من واجهته المنشورة (README: منصة الطلبات الرقمية للأعمال
        في ليبيا — متجر + طلبات + توصيل + مدفوعات محلية). */
    order: {
      short: "Smart Order",
      label: "Smart Order — متجر الطلبات الرقمي",
      url: "https://order.smart-link.ly",
      /* P40-5a (P1-1): الأوردر يسمّي طريقه «إنشاء حساب» — /register
        (تحقّق حي؛ منيو/بوت كلاهما /subscribe). */
      signupUrl: "https://order.smart-link.ly/register",
      desc: "أطلق متجر طلباتك الرقمي بتوصيل ومدفوعات ليبية",
    },
  },

  social: {
    facebook: "https://www.facebook.com/profile.php?id=61591502614404",
    instagram: "https://instagram.com/smart_link.0/",
  },

  address: "ليبيا",

  hours: {
    /* r144 (صدق P4-4SL): the old "support: 24/7" claim (and the r9
       comment "genuinely 24/7" that blessed it) had no support rota
       behind it — the coordinator ruling is the business truth: NO
       24/7 support operation exists. The WhatsApp line is answered by
       the same team that keeps the office hours. One honest fact now,
       where r9's C1 fix had split a contradiction into two claims. */
    support: "خلال أوقات العمل",
    office: "9 صباحاً — 9 مساءً",
    /** JSON-LD openingHoursSpecification values (Mo-Su 09:00–21:00). */
    schemaOpens: "09:00",
    schemaCloses: "21:00",
  },
} as const

/** r134 (R134-W2-SL, fix 8): prefilled wa.me deep link, per surface.
 *  SITE.whatsapp.url alone opened a BLANK chat — the visitor typed the
 *  opener and the source signal was lost. Every human WhatsApp CTA now
 *  carries a source-identifying Arabic opener (encodeURIComponent —
 *  wa.me wants percent-encoded UTF-8). Machine-facing consumers
 *  (JSON-LD schema.ts) keep the bare url: crawlers don't type openers.
 *  Surfaces shipped: تذييل الصفحة · رصاصة الهيرو (W6-B2) · هيدر
 *  الرئيسية ودرجها (P40-5a/SL-7) · صفحة التواصل · نموذج التواصل ·
 *  صفحة عدم الاتصال · بريد التأكيد. */
export function whatsappUrl(surface: string): string {
  return `${SITE.whatsapp.url}?text=${encodeURIComponent(
    `مرحباً، أتواصل معكم من موقع الربط الذكي — ${surface}`,
  )}`
}
