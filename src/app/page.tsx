import { HeroSection } from "@/components/hero-section"
import dynamic from "next/dynamic"

const loadingPlaceholder = <div className="h-96 rounded-2xl bg-[var(--card)] animate-pulse" />

const ServicesSection = dynamic(() => import("@/components/services-section").then(m => m.ServicesSection), { loading: () => loadingPlaceholder })
const FeaturesSection = dynamic(() => import("@/components/features-section").then(m => m.FeaturesSection), { loading: () => loadingPlaceholder })
const HowItWorksSection = dynamic(() => import("@/components/how-it-works-section").then(m => m.HowItWorksSection), { loading: () => loadingPlaceholder })
const FaqSection = dynamic(() => import("@/components/faq-section").then(m => m.FaqSection), { loading: () => loadingPlaceholder })
const CTASection = dynamic(() => import("@/components/cta-section").then(m => m.CTASection), { loading: () => loadingPlaceholder })

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <FeaturesSection />
      <HowItWorksSection />
      <FaqSection />
      <CTASection />
    </>
  )
}
