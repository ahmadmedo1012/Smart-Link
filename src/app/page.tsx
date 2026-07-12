import { HeroSection } from "@/components/hero-section"
import dynamic from "next/dynamic"

const ServicesSection = dynamic(() => import("@/components/services-section").then(m => m.ServicesSection), { loading: () => <div className="h-96" /> })
const FeaturesSection = dynamic(() => import("@/components/features-section").then(m => m.FeaturesSection), { loading: () => <div className="h-96" /> })
const HowItWorksSection = dynamic(() => import("@/components/how-it-works-section").then(m => m.HowItWorksSection), { loading: () => <div className="h-96" /> })
const FaqSection = dynamic(() => import("@/components/faq-section").then(m => m.FaqSection), { loading: () => <div className="h-96" /> })
const CTASection = dynamic(() => import("@/components/cta-section").then(m => m.CTASection), { loading: () => <div className="h-96" /> })

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
