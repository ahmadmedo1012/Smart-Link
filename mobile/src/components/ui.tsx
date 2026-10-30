/**
 * SmartLink Mobile — عناصر UI أولية (زر/بطاقة/فاصل).
 * لغة الويب: برتقالي كهربائي على حبر ليلي، خط شعر #232329.
 */
import React from 'react'
import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native'
import { t } from '@/constants/theme'

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  style,
}: {
  label: string
  onPress: () => void
  variant?: 'primary' | 'ghost' | 'outline'
  disabled?: boolean
  style?: StyleProp<ViewStyle>
}) {
  const bg = variant === 'primary' ? t.primary : variant === 'outline' ? t.card : 'transparent'
  const fg = variant === 'primary' ? t.primaryFg : t.primary
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        { backgroundColor: bg, opacity: disabled ? 0.45 : pressed ? 0.82 : 1 },
        variant === 'outline' && { borderWidth: 1, borderColor: t.primary },
        style,
      ]}
    >
      <Text style={[s.buttonText, { color: fg }]}>{label}</Text>
    </Pressable>
  )
}

export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <Pressable disabled style={[s.card, style]}>{children}</Pressable>
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return <Text style={s.cardTitle}>{children}</Text>
}

export function Hairline() {
  return <Text style={s.hairline} />
}

const s = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonText: {
    fontFamily: 'IBMPlexSansArabic_600SemiBold',
    fontSize: 15,
  },
  card: {
    backgroundColor: t.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: t.border,
    padding: 16,
    gap: 12,
  },
  cardTitle: {
    fontFamily: 'NotoKufiArabic_700Bold',
    fontSize: 16,
    color: t.foreground,
  },
  hairline: { height: 1, backgroundColor: t.border },
})
