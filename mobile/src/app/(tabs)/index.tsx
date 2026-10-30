/**
 * SmartLink Mobile — الرئيسية: بوابة منظومة Smart.
 *
 * بطاقات المنتجات الثلاثة تفتح مواقعها الحيّة (كل منتج عالمه الكامل)،
 * مع موجز الخطة المجانية لكل منها — نفس صدق صفحة الأسعار في الويب.
 */
import React from 'react'
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { t } from '@/constants/theme'
import { PRODUCTS } from '@/constants/content'
import { BagIcon, BotIcon, CheckIcon, ChevronIcon, LinkIcon, MenuIcon } from '@/components/icons'
import { Card, CardTitle } from '@/components/ui'
import { WEB_BASE_URL } from '@/constants/config'

const PRODUCT_ICONS = {
  menu: MenuIcon,
  bot: BotIcon,
  order: BagIcon,
} as const

export default function HomeTab() {
  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={s.scroll}>
        {/* البطل */}
        <View style={s.hero}>
          <View style={s.markWell}>
            <LinkIcon size={34} color={t.primary} />
          </View>
          <Text style={s.heroTitle}>سمارت لينك</Text>
          <Text style={s.heroSub}>
            المظلة الرقمية لأعمالك في ليبيا — خدمات ومنتجات منظومة Smart تحت رابط واحد
          </Text>
        </View>

        {/* المنتجات */}
        {PRODUCTS.map((p) => {
          const Icon = PRODUCT_ICONS[p.key]
          return (
            <Card key={p.key}>
              <View style={s.productHead}>
                <View style={s.productIconWell}>
                  <Icon size={24} color={t.primary} />
                </View>
                <View style={s.productHeadText}>
                  <Text style={s.productTitle}>{p.title}</Text>
                  <Text style={s.productSubtitle}>{p.subtitle}</Text>
                </View>
              </View>
              <Text style={s.productDesc}>{p.desc}</Text>
              <View style={s.features}>
                {p.freeFeatures.slice(0, 3).map((f) => (
                  <View key={f} style={s.featureRow}>
                    <CheckIcon size={14} color={t.primary} />
                    <Text style={s.featureText}>{f}</Text>
                  </View>
                ))}
              </View>
              <Pressable
                accessibilityRole="link"
                onPress={() => Linking.openURL(p.url).catch(() => undefined)}
                style={({ pressed }) => [s.openRow, pressed && { opacity: 0.7 }]}
              >
                <Text style={s.openText}>افتح {p.title}</Text>
                <ChevronIcon size={16} color={t.primary} />
              </Pressable>
            </Card>
          )
        })}

        {/* لماذا المنظومة */}
        <Card>
          <CardTitle>لماذا منظومة Smart؟</CardTitle>
          <View style={s.featureRow}>
            <CheckIcon size={14} color={t.primary} />
            <Text style={s.featureText}>خطة مجانية حقيقية لكل منتج — بلا بطاقة ائتمان</Text>
          </View>
          <View style={s.featureRow}>
            <CheckIcon size={14} color={t.primary} />
            <Text style={s.featureText}>عربية أولًا: واجهات RTL مصممة للسوق الليبي</Text>
          </View>
          <View style={s.featureRow}>
            <CheckIcon size={14} color={t.primary} />
            <Text style={s.featureText}>مدفوعات محلية بالدينار الليبي</Text>
          </View>
          <View style={s.featureRow}>
            <CheckIcon size={14} color={t.primary} />
            <Text style={s.featureText}>واتساب في قلب كل رحلة</Text>
          </View>
        </Card>

        <Pressable
          accessibilityRole="link"
          onPress={() => Linking.openURL(WEB_BASE_URL).catch(() => undefined)}
          style={({ pressed }) => [s.webRow, pressed && { opacity: 0.7 }]}
        >
          <Text style={s.webText}>افتح الموقع الكامل smart-link.ly</Text>
          <ChevronIcon size={16} color={t.primary} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: t.background },
  scroll: { padding: 16, gap: 14, paddingBottom: 32 },
  hero: { alignItems: 'center', paddingTop: 20, paddingBottom: 8, gap: 10 },
  markWell: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: t.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontFamily: 'NotoKufiArabic_700Bold',
    fontSize: 28,
    color: t.foreground,
  },
  heroSub: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 14,
    color: t.mutedFg,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  productHead: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  productIconWell: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: t.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productHeadText: { flex: 1, gap: 2 },
  productTitle: {
    fontFamily: 'NotoKufiArabic_700Bold',
    fontSize: 17,
    color: t.foreground,
  },
  productSubtitle: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 12.5,
    color: t.mutedFg,
  },
  productDesc: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 13.5,
    color: t.mutedFg,
    lineHeight: 21,
  },
  features: { gap: 8 },
  featureRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  featureText: {
    flex: 1,
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 13,
    color: t.foreground,
    lineHeight: 20,
  },
  openRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: t.border,
    paddingTop: 12,
  },
  openText: {
    fontFamily: 'IBMPlexSansArabic_600SemiBold',
    fontSize: 14,
    color: t.primary,
  },
  webRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  webText: {
    fontFamily: 'IBMPlexSansArabic_500Medium',
    fontSize: 13,
    color: t.mutedFg,
  },
})
