/**
 * SmartLink Mobile — تواصل: القنوات الصادقة (واتساب + الشبكات).
 *
 * نفس قانون الويب (r126/W6-B2): القنوات المعلنة هي المُراقَبة فعلاً —
 * واتساب أولاً، والبريد هوية إرسال آلي لا قناة دعم فلا يُعلن.
 */
import React from 'react'
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { t } from '@/constants/theme'
import { CONTACT } from '@/constants/content'
import { ChevronIcon, WhatsappIcon } from '@/components/icons'
import { Card, CardTitle } from '@/components/ui'

export default function ContactTab() {
  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={s.head}>
          <Text style={s.headTitle}>تواصل معنا</Text>
          <Text style={s.headSub}>
            فريق SmartLink جاهز لإجابة أسئلتك حول أي منتج من منظومة Smart — أسرع طريق هو واتساب.
          </Text>
        </View>

        {/* واتساب — القناة الأولى */}
        <Pressable
          accessibilityRole="link"
          onPress={() => Linking.openURL(CONTACT.whatsapp.url).catch(() => undefined)}
          style={({ pressed }) => [s.waCard, pressed && { opacity: 0.85 }]}
        >
          <WhatsappIcon size={30} />
          <View style={s.waText}>
            <Text style={s.waTitle}>واتساب SmartLink</Text>
            <Text style={s.waNumber}>{CONTACT.whatsapp.display}</Text>
          </View>
          <ChevronIcon size={18} color={t.primary} />
        </Pressable>

        {/* الشبكات */}
        <Card>
          <CardTitle>تابعنا</CardTitle>
          <Pressable
            accessibilityRole="link"
            onPress={() => Linking.openURL(CONTACT.facebook).catch(() => undefined)}
            style={({ pressed }) => [s.channelRow, pressed && { opacity: 0.7 }]}
          >
            <Text style={s.channelIcon}>f</Text>
            <Text style={s.channelName}>صفحة فيسبوك</Text>
            <ChevronIcon size={16} color={t.primary} />
          </Pressable>
          <Pressable
            accessibilityRole="link"
            onPress={() => Linking.openURL(CONTACT.instagram).catch(() => undefined)}
            style={({ pressed }) => [s.channelRow, pressed && { opacity: 0.7 }]}
          >
            <Text style={s.channelIcon}>◎</Text>
            <Text style={s.channelName}>إنستغرام smart_link.0</Text>
            <ChevronIcon size={16} color={t.primary} />
          </Pressable>
        </Card>

        {/* عن المنظومة */}
        <Card>
          <CardTitle>عن SmartLink</CardTitle>
          <Text style={s.aboutText}>
            SmartLink هي المظلة الرقمية للأعمال في ليبيا — البوابة الأمامية لمنظومة Smart:
            Smart Menu للمنيو الرقمي، وSmartBot لأتمتة فيسبوك، وSmart Order لمتاجر الطلبات.
            كل منتج يعمل مستقلًا بخطة مجانية حقيقية، ويُدار من لوحة تحكمه الخاصة.
          </Text>
          <Text style={s.aboutMeta}>{CONTACT.address} · منذ 2026</Text>
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
  waCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: t.card,
    borderWidth: 1,
    borderColor: t.border,
    borderRadius: 14,
    padding: 18,
  },
  waText: { flex: 1, gap: 2 },
  waTitle: {
    fontFamily: 'IBMPlexSansArabic_600SemiBold',
    fontSize: 15,
    color: t.foreground,
  },
  waNumber: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 13,
    color: t.mutedFg,
  },
  channelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  channelIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: t.accentSoft,
    color: t.primary,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 16,
    fontFamily: 'IBMPlexSansArabic_600SemiBold',
    overflow: 'hidden',
  },
  channelName: {
    flex: 1,
    fontFamily: 'IBMPlexSansArabic_500Medium',
    fontSize: 14,
    color: t.foreground,
  },
  aboutText: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 13.5,
    color: t.mutedFg,
    lineHeight: 22,
  },
  aboutMeta: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 12,
    color: t.mutedFg,
  },
})
