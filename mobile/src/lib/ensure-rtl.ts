/**
 * SmartLink Mobile — إقلاع RTL المضمون من أول فتح بعد تثبيت نظيف.
 *
 * نفس نمط العائلة (SmartBot mobile): I18nManager.forceRTL يكتب إعدادًا
 * أصليًا يُقرأ عند إنشاء الجسر فقط — استدعاؤه داخل الجلسة الحالية لا
 * يغيّر اتجاه أي شاشة مرسومة. البوابة: اكتب الإعداد، أعِد إنشاء الجسر
 * مرة واحدة (حارس تخزين ضد الحلقات)، وأي فشل يُؤجَّل للإقلاع البارد
 * التالي — لا سيناريو بلا مخرج.
 */

import AsyncStorage from '@react-native-async-storage/async-storage'
import { DevSettings, I18nManager } from 'react-native'
import * as Updates from 'expo-updates'
import { STORAGE_KEYS } from '@/constants/config'

export type RtlBootstrapResult = 'already-rtl' | 'reloaded' | 'deferred'

export async function ensureRTL(): Promise<RtlBootstrapResult> {
  // 1) المسار السريع — الاتجاه مفعل (كل الإقلاعات بعد الأول).
  if (I18nManager.isRTL === true) return 'already-rtl'

  // 2) اكتب الإعداد الأصلي فورًا (متزامن) — يبقى للأبد.
  I18nManager.allowRTL(true)
  I18nManager.forceRTL(true)

  // 3) حارس المرة الواحدة — أي خلل تخزين يعني تأجيلًا آمنًا.
  try {
    const flagged = await AsyncStorage.getItem(STORAGE_KEYS.rtlBootstrap)
    if (flagged === '1') return 'deferred'
    await AsyncStorage.setItem(STORAGE_KEYS.rtlBootstrap, '1')
  } catch {
    return 'deferred'
  }

  // 4) أعِد إنشاء الجسر الأصلي ليقرأ forceRTL الآن.
  try {
    if (__DEV__) {
      DevSettings?.reload?.()
      return 'reloaded'
    }
    await Updates.reloadAsync()
    return 'reloaded'
  } catch {
    return 'deferred'
  }
}
