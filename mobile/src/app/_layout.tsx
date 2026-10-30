/**
 * SmartLink Mobile — التخطيط الجذري: خطوط + RTL + تبويبات المظلة.
 */
import { I18nManager } from 'react-native'
import { useEffect, useState } from 'react'
import { Tabs } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useFonts } from 'expo-font'
import {
  IBMPlexSansArabic_400Regular,
  IBMPlexSansArabic_500Medium,
  IBMPlexSansArabic_600SemiBold,
  IBMPlexSansArabic_700Bold,
} from '@expo-google-fonts/ibm-plex-sans-arabic'
import { NotoKufiArabic_700Bold } from '@expo-google-fonts/noto-kufi-arabic'
import * as SplashScreen from 'expo-splash-screen'
import { t } from '@/constants/theme'
import { ensureRTL } from '@/lib/ensure-rtl'
import { LoadingState } from '@/components/state-views'
import { ChatIcon, HomeIcon, PriceIcon } from '@/components/icons'

// عربي أولًا — قبل أي رسم.
I18nManager.allowRTL(true)
I18nManager.forceRTL(true)

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [rtlReady, setRtlReady] = useState(false)
  const [fontsLoaded] = useFonts({
    IBMPlexSansArabic_400Regular,
    IBMPlexSansArabic_500Medium,
    IBMPlexSansArabic_600SemiBold,
    IBMPlexSansArabic_700Bold,
    NotoKufiArabic_700Bold,
  })

  // بوابة RTL: لا نرسم أي شاشة قبل حسم الاتجاه.
  useEffect(() => {
    let alive = true
    ensureRTL().then(() => {
      if (alive) setRtlReady(true)
    })
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    if (fontsLoaded && rtlReady) {
      SplashScreen.hideAsync().catch(() => undefined)
    }
  }, [fontsLoaded, rtlReady])

  if (!fontsLoaded || !rtlReady) {
    return <LoadingState label="جارٍ تجهيز SmartLink…" />
  }

  return (
    <>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: t.primary,
          tabBarInactiveTintColor: t.mutedFg,
          tabBarStyle: {
            backgroundColor: t.card,
            borderTopColor: t.border,
          },
          sceneStyle: { backgroundColor: t.background },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'الرئيسية',
            tabBarIcon: ({ color }) => <HomeIcon size={22} color={color} />,
          }}
        />
        <Tabs.Screen
          name="pricing"
          options={{
            title: 'الأسعار',
            tabBarIcon: ({ color }) => <PriceIcon size={22} color={color} />,
          }}
        />
        <Tabs.Screen
          name="contact"
          options={{
            title: 'تواصل',
            tabBarIcon: ({ color }) => <ChatIcon size={22} color={color} />,
          }}
        />
      </Tabs>
    </>
  )
}
