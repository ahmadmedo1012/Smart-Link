import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { FeaturesSection } from "@/components/features-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { FaqSection } from "@/components/faq-section"
import { CTASection } from "@/components/cta-section"

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
