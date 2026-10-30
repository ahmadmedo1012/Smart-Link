/**
 * SmartLink Mobile — توكنات التصميم (KODE — ليل المظلة).
 *
 * القيم منقولة حرفيًا من styles.css للويب: حبر ليلي #050507، بطاقة
 * #0B0B10، برتقالي كهربائي #FF4C00 أساسيًا، والثانوي الرمادي
 * #A9ACB4. الخط: IBM Plex Sans Arabic متنًا + Noto Kufi Arabic
 * للعناوين العربية (نفس زوج العرض في الويب).
 */

export interface ThemeColors {
  background: string
  card: string
  sunken: string
  foreground: string
  mutedFg: string
  primary: string
  primaryFg: string
  primaryHover: string
  accentSoft: string
  border: string
  success: string
  destructive: string
}

/** الهوية الليلية (الافتراضية — مثل الويب). */
export const night: ThemeColors = {
  background: '#050507',
  card: '#0B0B10',
  sunken: '#0B0B10',
  foreground: '#FFFFFF',
  mutedFg: '#A9ACB4',
  primary: '#FF4C00',
  primaryFg: '#050507',
  primaryHover: '#FF6A2E',
  accentSoft: '#221008',
  border: '#232329',
  success: '#6FD99B',
  destructive: '#F0938F',
}

export const t = night

/** سلّم الأنصاف. */
export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  pill: 999,
} as const
