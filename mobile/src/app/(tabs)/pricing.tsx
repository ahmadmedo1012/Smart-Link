/**
 * SmartLink Mobile — الأسعار: الباقات المجانية + سلالم المنظومة + الأسئلة.
 *
 * نفس قانون الصدق: كل جدول يحمل رابطه الحي (المصدر الوحيد)؛ الأسعار
 * مرآة لكتالوجات المنتجات المنشورة بالدينار الليبي.
 */
import React, { useState } from 'react'
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { t } from '@/constants/theme'
import { ECOSYSTEM_PRICING, FAQS, PRODUCTS } from '@/constants/content'
import { formatLyd } from '@/lib/money'
import { CheckIcon, ChevronIcon } from '@/components/icons'
import { Card, CardTitle, Hairline } from '@/components/ui'

export default function PricingTab() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={s.head}>
          <Text style={s.headTitle}>خطط وأسعار المنظومة</Text>
          <Text style={s.headSub}>
            خطة مجانية لكل منتج بلا بطاقة ائتمان، والباقات المدفوعة بالدينار الليبي تبدأ من {formatLyd(19)} شهريًا.
          </Text>
        </View>

        {/* الباقات المجانية لكل منتج */}
        {PRODUCTS.map((p) => (
          <Card key={p.key}>
            <CardTitle>
              {p.title} — الخطة الأساسية
            </CardTitle>
            <View style={s.priceRow}>
              <Text style={s.priceValue}>مجاني</Text>
              <Text style={s.pricePeriod}>للأبد</Text>
            </View>
            <View style={s.features}>
              {p.freeFeatures.map((f) => (
                <View key={f} style={s.featureRow}>
                  <CheckIcon size={14} color={t.primary} />
                  <Text style={s.featureText}>{f}</Text>
                </View>
              ))}
            </View>
            <Pressable
              accessibilityRole="link"
              onPress={() => Linking.openURL(p.url).catch(() => undefined)}
              style={({ pressed }) => [s.liveRow, pressed && { opacity: 0.7 }]}
            >
              <Text style={s.liveText}>ابدأ مجانًا على {p.title}</Text>
              <ChevronIcon size={16} color={t.primary} />
            </Pressable>
          </Card>
        ))}

        {/* سلالم المنظومة الحيّة */}
        <Text style={s.sectionTitle}>سلالم الباقات المدفوعة</Text>
        {ECOSYSTEM_PRICING.map((e) => (
          <Card key={e.title}>
            <View style={s.ecoHead}>
              <View style={{ flex: 1 }}>
                <CardTitle>{e.title}</CardTitle>
                <Text style={s.ecoSub}>{e.subtitle}</Text>
              </View>
              <Text style={s.ecoPeriod}>{e.period}</Text>
            </View>
            <View style={s.planTable}>
              {e.plans.map((plan, i) => (
                <View key={plan.name}>
                  {i > 0 ? <Hairline /> : null}
                  <View style={s.planRow}>
                    <Text style={s.planName}>{plan.name}</Text>
                    <Text style={s.planPrice}>
                      {plan.price === 0 ? 'مجاني' : formatLyd(plan.price)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
            <Pressable
              accessibilityRole="link"
              onPress={() => Linking.openURL(e.href).catch(() => undefined)}
              style={({ pressed }) => [s.liveRow, pressed && { opacity: 0.7 }]}
            >
              <Text style={s.liveText}>صفحة أسعار {e.title} الحيّة (المصدر)</Text>
              <ChevronIcon size={16} color={t.primary} />
            </Pressable>
          </Card>
        ))}

        {/* الأسئلة الشائعة */}
        <Text style={s.sectionTitle}>أسئلة شائعة</Text>
        <Card style={s.faqCard}>
          {FAQS.map((f, i) => (
            <View key={f.q}>
              {i > 0 ? <Hairline /> : null}
              <Pressable
                accessibilityRole="button"
                onPress={() => setOpenFaq(openFaq === i ? null : i)}
                style={s.faqRow}
              >
                <Text style={s.faqQ}>{f.q}</Text>
                <Text style={s.faqChevron}>{openFaq === i ? '−' : '+'}</Text>
              </Pressable>
              {openFaq === i ? <Text style={s.faqA}>{f.a}</Text> : null}
            </View>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: t.background },
  scroll: { padding: 16, gap: 14, paddingBottom: 32 },
  head: { gap: 8, paddingTop: 8, paddingBottom: 4 },
  headTitle: {
    fontFamily: 'NotoKufiArabic_700Bold',
    fontSize: 22,
    color: t.foreground,
  },
  headSub: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 13.5,
    color: t.mutedFg,
    lineHeight: 21,
  },
  sectionTitle: {
    fontFamily: 'NotoKufiArabic_700Bold',
    fontSize: 17,
    color: t.foreground,
    paddingTop: 8,
  },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  priceValue: {
    fontFamily: 'NotoKufiArabic_700Bold',
    fontSize: 24,
    color: t.primary,
  },
  pricePeriod: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 13,
    color: t.mutedFg,
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
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: t.border,
    paddingTop: 12,
  },
  liveText: {
    fontFamily: 'IBMPlexSansArabic_600SemiBold',
    fontSize: 13.5,
    color: t.primary,
  },
  ecoHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ecoSub: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 12,
    color: t.mutedFg,
    marginTop: 2,
  },
  ecoPeriod: {
    fontFamily: 'IBMPlexSansArabic_500Medium',
    fontSize: 11.5,
    color: t.mutedFg,
  },
  planTable: { gap: 2 },
  planRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  planName: {
    fontFamily: 'IBMPlexSansArabic_500Medium',
    fontSize: 14,
    color: t.foreground,
  },
  planPrice: {
    fontFamily: 'IBMPlexSansArabic_600SemiBold',
    fontSize: 14,
    color: t.primary,
  },
  faqCard: { gap: 4 },
  faqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
  },
  faqQ: {
    flex: 1,
    fontFamily: 'IBMPlexSansArabic_600SemiBold',
    fontSize: 14,
    color: t.foreground,
    lineHeight: 21,
  },
  faqChevron: { color: t.primary, fontSize: 20, lineHeight: 24 },
  faqA: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 13,
    color: t.mutedFg,
    lineHeight: 20,
    paddingBottom: 10,
  },
})
