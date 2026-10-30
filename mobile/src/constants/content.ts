/**
 * SmartLink Mobile — محتوى المظلة (مرآة SITE في الويب — r137).
 *
 * قانون الصدق العائلي: الأسعار هنا مرآة لكتالوجات المنتجات المنشورة؛
 * الرابط الحي تحت كل جدول هو المصدر الوحيد. أي تغيير في الكتالوجات
 * يُعاد صداه هنا (نفس بيانات صفحة /pricing في الويب).
 */

export interface ProductCard {
  key: 'menu' | 'bot' | 'order'
  title: string
  subtitle: string
  desc: string
  url: string
  pricingUrl: string
  freeFeatures: string[]
}

export const PRODUCTS: ProductCard[] = [
  {
    key: 'menu',
    title: 'Smart Menu',
    subtitle: 'المنيو الرقمي للمطاعم',
    desc: 'حول منيو مطعمك إلى تجربة رقمية تفاعلية',
    url: 'https://menu.smart-link.ly',
    pricingUrl: 'https://menu.smart-link.ly/pricing',
    freeFeatures: [
      'منيو رقمي تفاعلي',
      'منيو واحد و10 أصناف',
      '100 طلب شهريًا',
      'طلبات عبر واتساب',
      'إحصائيات أساسية',
    ],
  },
  {
    key: 'bot',
    title: 'SmartBot',
    subtitle: 'البوت الذكي لفيسبوك',
    desc: 'أتمتة الردود على صفحات فيسبوك بذكاء',
    url: 'https://bot.smart-link.ly',
    pricingUrl: 'https://bot.smart-link.ly/pricing',
    freeFeatures: [
      'ردود تلقائية (100/شهر)',
      'صفحة فيسبوك واحدة',
      '5 قواعد رد',
      'إحصاءات أساسية',
    ],
  },
  {
    key: 'order',
    title: 'Smart Order',
    subtitle: 'متجر الطلبات الرقمي للأعمال',
    desc: 'أطلق متجر طلباتك الرقمي بتوصيل ومدفوعات ليبية',
    url: 'https://order.smart-link.ly',
    pricingUrl: 'https://order.smart-link.ly/pricing',
    freeFeatures: [
      'متجر رقمي يعمل فورًا',
      '15 منتجًا و3 أقسام',
      '100 طلب شهريًا',
      'منطقة توصيل واحدة',
      'طرق دفع محلية',
    ],
  },
]

/** سلالم الأسعار الحيّة (د.ل) — نفس بيانات صفحة الأسعار في الويب. */
export const ECOSYSTEM_PRICING: {
  title: string
  subtitle: string
  href: string
  period: string
  plans: { name: string; price: number }[]
}[] = [
  {
    title: 'SmartBot',
    subtitle: 'البوت الذكي لفيسبوك',
    href: 'https://bot.smart-link.ly/pricing',
    period: 'د.ل / شهريًا',
    plans: [
      { name: 'مجاني', price: 0 },
      { name: 'أساسي', price: 19 },
      { name: 'مميز', price: 29 },
      { name: 'احترافي', price: 129 },
      { name: 'مؤسسي', price: 299 },
    ],
  },
  {
    title: 'Smart Menu',
    subtitle: 'المنيو الرقمي للمطاعم',
    href: 'https://menu.smart-link.ly/pricing',
    period: 'د.ل / 30 يومًا',
    plans: [
      { name: 'مجاني', price: 0 },
      { name: 'أساسي', price: 19 },
      { name: 'بريميوم', price: 29 },
      { name: 'احترافي', price: 129 },
      { name: 'شركات', price: 299 },
    ],
  },
  {
    title: 'Smart Order',
    subtitle: 'متجر الطلبات الرقمي للأعمال',
    href: 'https://order.smart-link.ly/pricing',
    period: 'د.ل / شهريًا',
    plans: [
      { name: 'مجاني', price: 0 },
      { name: 'أساسي', price: 19 },
      { name: 'بريميوم', price: 29 },
      { name: 'احترافي', price: 129 },
    ],
  },
]

export const FAQS: { q: string; a: string }[] = [
  {
    q: 'هل الخدمة مجانية حقًا؟',
    a: 'نعم، لكل منتج خطة مجانية حقيقية تُفعَّل فورًا بلا بطاقة ائتمان — مثلًا خطة Smart Menu المجانية تتيح منيوًا واحدًا بعشرة أصناف و100 طلب شهريًا.',
  },
  {
    q: 'ما الفرق بين الخطة المجانية والمدفوعة؟',
    a: 'الباقات المدفوعة متاحة الآن على منصات المنتجات الثلاثة بالدينار الليبي (تبدأ من 19 د.ل): ترفع حدود الاستخدام وتضيف ميزات متقدمة مثل التحليلات الأعمق، أعضاء الفريق، والدعم ذي الأولوية — والاشتراك والإدارة يتمّان من لوحة تحكم كل منتج.',
  },
  {
    q: 'هل هناك حد أقصى لعدد المستخدمين؟',
    a: 'الخطط المجانية لاستخدام فردي. الباقات الأعلى تضيف أعضاء الفريق — مثلًا باقة بريميوم في Smart Order تتيح 3 أعضاء واحترافيًا فريقًا غير محدود.',
  },
  {
    q: 'كيف يمكنني الترقية؟',
    a: 'الترقية تتم مباشرة من لوحة تحكم المنتج الذي تستخدمه (Smart Menu أو SmartBot أو Smart Order) — اختر الباقة وادفع بالدينار الليبي، ولا يلزم المرور عبر موقع المنصة إطلاقًا.',
  },
  {
    q: 'هل يمكن إلغاء الاشتراك في أي وقت؟',
    a: 'نعم، يمكنك إلغاء حسابك أو إيقاف الخدمة في أي وقت بدون أي رسوم.',
  },
]

export const CONTACT = {
  whatsapp: {
    number: '218910089975',
    url: 'https://wa.me/218910089975',
    display: '+218 91 008 9975',
  },
  facebook: 'https://www.facebook.com/profile.php?id=61591502614404',
  instagram: 'https://instagram.com/smart_link.0/',
  address: 'ليبيا',
}
