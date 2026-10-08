/* r128 Stage A (F2a): the Orbit-Ink landing layer (PORT-KIT §1–§4) —
   scoped under the `.landing` wrapper so the product token pins in
   styles.css stay untouched. The landing paints Orbit-Ink in BOTH
   themes (r128 R4, intentional dark stage). Stage B rebuilds the
   page sections on top of this layer. */
import "./landing.css"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { ProductShowcase } from "@/components/product-showcase"
import { FeaturesSection } from "@/components/features-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { FaqSection } from "@/components/faq-section"
import { CTASection } from "@/components/cta-section"

/* Round 2: services/showcase/features/how-it-works/CTA are now pure server
   components (CSS scroll-driven animations, zero JS) — direct imports beat
   dynamic() wrappers. FAQ keeps client interactivity and loads as its own
   chunk automatically. The old dynamic() + pulse placeholders actually
   forced every "lazy" section into the initial payload AND shipped
   framer-motion in the critical path. */
export default function Home() {
  return (
    <div className="landing">
      <HeroSection />
      <ServicesSection />
      <ProductShowcase />
      <FeaturesSection />
      <HowItWorksSection />
      <FaqSection />
      <CTASection />
    </div>
  )
}
