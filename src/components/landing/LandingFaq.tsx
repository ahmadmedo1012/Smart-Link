import { ChevronDown } from "lucide-react"
import { RevealCssClass } from "@/hooks/useReveal"
import { faqJsonLd } from "@/lib/schema"

/* r128 Stage B (F2b) — the compact FAQ that follows the finale, ln-styled
 * per the task mandate. The home's six real Q&As move here verbatim
 * (folded from faq-section.tsx — r9/r10 content audits preserved), the
 * FAQPage JSON-LD rides along (rich-results parity with /pricing), and
 * the interaction drops from a client accordion island to native
 * <details>/<summary>: zero JS, keyboard-native, reduced-motion-safe.
 * r142 «الكوكبة الحية»: الفصل يندمج بصرياً في أرض نقطة البداية (نفس
 * المسرح، بلا فاصل حاد) والترقيم الكنسي صار 05 بعد اندماج الأدوار. */

const FAQS = [
  /* r138 (إكمال صدق الأسطول — موجة r137 الفائتة): الجواب الأول كان
     يقول «حالياً نقدم خدمة Smart Menu وSmartBot… مع خطط لإطلاق
     المزيد قريباً» بينما المنتج الثالث حيّ منذ r137 — والنص يتدفق
     إلى FAQPage JSON-LD أدناه فيصل الزواحف كذبًا منظّمًا.
     r138 أصلح الثنائية لكن ذيل «مع خطط لإطلاق المزيد من الخدمات
     قريباً» نجا من الموجة (4-a/3-a P2): الجملة الافقية المستقبلية
     نفسها التي طُهّرت من عائلة P14 — تُحذف هنا أيضًا؛ القائمة
     الحيّة الثلاثية تكمل الجواب بلا وعد. */
  { q: "ما هي منصة SmartLink؟", a: "SmartLink هي منصة رقمية متكاملة تجمع عدة خدمات ذكية تحت مظلة واحدة. حالياً نقدم Smart Menu (المنيو الرقمي للمطاعم) وSmartBot (البوت الذكي لفيسبوك) وSmart Order (متجر الطلبات الرقمي)." },
  /* P14-P0B (صدق الأسطول المكتمل على الرئيسية): هذا الجواب كان يَعِد
     بالباقات المدفوعة كأفق مستقبلي بينما صفحة الأسعار نفسها (منذ
     P13-2a) تعلنها حيّة اليوم على منصات المنتجات الثلاثة — موثّق
     حياً وقت الإصلاح: bot /api/plans (أساسي 19 د.ل) و menu /pricing
     بالدينار. ولأن النص يتدفق إلى FAQPage JSON-LD أدناه، كانت الصياغة
     القديمة تصل الزواحف كوعد لا تطبّقه. الحقيقة نفسها التي استقرت
     على /pricing تصل الآن إلى سؤال الرئيسية. */
  { q: "هل الخدمة مجانية؟", a: "نعم، يمكنك البدء مجاناً تماماً بدون بطاقة ائتمان — كل خدمة توفر خطة مجانية للانطلاق. الباقات المدفوعة بميزات متقدمة وتحليلات أكثر متاحة اليوم بالدينار الليبي وتنطلق من 19 د.ل شهرياً — التفاصيل الكاملة في صفحة الأسعار." },
  /* r144 (P4-4SL، موجة الصدق): «دعم اللهجة الليبية» حُكم عليها بالبقاء
     بعد تحقق فعلي في مستودع SmartBot — مصنّف النوايا
     (fb_dashboard/enhanced_intent.py) يحمل مجموعة _LIBYAN_DIALECT
     صريحة (شنو/واش/قداش/نبغي/دحين…) بتوثيق «Libyan dialect coverage»
     وتُرجح أوزان التصنيف بها. الادعاء قابل للعودة إلى مصدره، وهو ينزل
     إلى FAQPage JSON-LD أدناه كذبًا منظّمًا لو كان كذبًا — فهو صادق. */
  { q: "هل تدعمون اللغة العربية؟", a: "بالتأكيد، المنصة بالكامل باللغة العربية مع دعم اللهجة الليبية في البوت الذكي. واجهات المستخدم، لوحات التحكم، والدعم الفني — كلها بالعربية." },
  /* r138 (إكمال صدق الأسطول): الخيارات الثلاثة — كان «أو» الثنائي
     يحجب متجر الطلبات عن زبون المتاجر. */
  { q: "كيف يمكنني البدء؟", a: "أنشئ حساباً مجانياً في الخدمة التي تناسبك (Smart Menu لمطعمك، أو SmartBot لصفحتك على فيسبوك، أو Smart Order لمتجرك)، واتبع خطوات الإعداد السريعة. فريق الدعم لدينا جاهز لمساعدتك في أي وقت." },
  /* W2-A1 (صدق الحساب — تدقيق W2-R1): الجواب وعد بـ«حساب واحد على
     SmartLink» والمظلة نفسها بلا تسجيل دخول أصلاً — كل منتج من
     الثلاثة له حسابه المستقل ولوحته الخاصة. الحقيقة نفسها التي
     تستقر على /pricing («الاشتراك والإدارة يتمّان من لوحة تحكم كل
     منتج») تصل الآن هنا، وتتدفق إلى FAQPage JSON-LD أدناه صادقة. */
  { q: "هل يمكنني استخدام أكثر من خدمة؟", a: "نعم، الخدمات الثلاث متاحة لك معاً. لكل خدمة حساب مستقل ولوحة تحكم خاصة بها — سجّل في كل خدمة تشاء على حدة، وابدأ بأيٍّ منها مجاناً." },
  { q: "ما هي طرق الدعم المتاحة؟", a: "نقدم دعماً فنياً عبر واتساب، البريد الإلكتروني، وفريق متخصص لمساعدتك في أي استفسار أو مشكلة تقنية." },
]

const faqLd = faqJsonLd(FAQS)

export function LandingFaq() {
  return (
    <section className="ln-faq" aria-label="الأسئلة الشائعة">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <div className="ln-faq-head">
        <span className="ln-label">{"005 — الأسئلة الشائعة"}</span>
        <RevealCssClass as="h2" className="ln-chapter-title" delay={1}>
          الأسئلة <em>الشائعة</em>
        </RevealCssClass>
        <RevealCssClass as="p" className="ln-chapter-lede" delay={2}>
          إجابات لأكثر الأسئلة شيوعاً عن منصتنا.
        </RevealCssClass>
      </div>
      <div className="ln-faq-list">
        {FAQS.map((f, i) => (
          <RevealCssClass as="details" className="ln-faq-item" key={f.q} delay={((i % 5) + 1) as 1 | 2 | 3 | 4 | 5}>
            <summary className="ln-faq-q">
              {f.q}
              <ChevronDown size={16} aria-hidden="true" />
            </summary>
            <p className="ln-faq-a">{f.a}</p>
          </RevealCssClass>
        ))}
      </div>
    </section>
  )
}
