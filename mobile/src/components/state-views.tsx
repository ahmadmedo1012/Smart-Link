/**
 * SmartLink Mobile — حالات موحدة (تحميل) بنبرة المظلة الليلية.
 */
import React from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { t } from '@/constants/theme'

export function LoadingState({ label = 'جارٍ التحميل…' }: { label?: string }) {
  return (
    <View style={s.center}>
      <ActivityIndicator size="large" color={t.primary} />
      <Text style={s.label}>{label}</Text>
    </View>
  )
}

const s = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 32,
    backgroundColor: t.background,
  },
  label: {
    color: t.mutedFg,
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
})
