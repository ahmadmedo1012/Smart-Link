/**
 * Smart Order Mobile — تنسيق الدينار الليبي.
 *
 * نفس سياسة الأسطول (lib/money.ts في الويب): أرقام غربية + تجميع
 * نقاط ar-LY (1.234.567) + لاحقة « د.ل». getNumberFormat('ar-LY')
 * في React Native يفتقد تجميع النقاط على بعض الأندرويدات القديمة،
 * لذا التجميع يدوي (نفس عقد الاختبار في الويب).
 */

export function formatLyd(value: number): string {
  const safe = Number.isFinite(value) ? value : 0
  const fixed = Math.round(safe * 100) / 100
  const [intPart, decPart] = Math.abs(fixed).toFixed(2).split('.')
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  const sign = fixed < 0 ? '-' : ''
  const dec = decPart === '00' ? '' : `,${decPart}`
  return `${sign}${grouped}${dec} د.ل`
}

/** صيغة رقمية مجردة بلا لاحقة (للجداول والطوابع). */
export function formatNumber(value: number): string {
  const safe = Number.isFinite(value) ? Math.round(value) : 0
  return String(safe).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}
