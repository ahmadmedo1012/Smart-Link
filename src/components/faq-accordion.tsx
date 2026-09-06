"use client"
import { useState } from "react"
import { ChevronLeft } from "lucide-react"

/* Client island: FAQ accordion (grid-rows 0fr→1fr CSS height animation).
   Extracted so /pricing can be a server component with zero framer-motion
   in its initial JS — matches the .acc pattern used by the mobile nav.
   r6: also the home FAQ island (replaced a homegrown fixed-maxHeight
   variant that clipped long answers); optional className lets the host
   section attach reveal/stagger utilities. */

export function FaqAccordion({
  faqs,
  className = "space-y-3",
}: {
  faqs: { q: string; a: string }[]
  className?: string
}) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className={className}>
      {faqs.map((faq, i) => {
        const isOpen = open === i
        return (
          <div
            key={i}
            className="glass rounded-xl overflow-hidden transition-all duration-300 hover:border-[var(--ring)]/20"
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full px-5 py-4 flex items-center justify-between text-right text-sm font-medium text-foreground hover:bg-[var(--accent)]/30 transition-colors"
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${i}`}
              id={`faq-button-${i}`}
            >
              {faq.q}
              <ChevronLeft
                className={`w-4 h-4 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : ""}`}
                aria-hidden="true"
              />
            </button>
            <div className={`acc ${isOpen ? "open" : ""}`} id={`faq-panel-${i}`} role="region" aria-labelledby={`faq-button-${i}`}>
              <div>
                <p className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
