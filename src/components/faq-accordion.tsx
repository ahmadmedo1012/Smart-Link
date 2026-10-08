"use client"
import { useState } from "react"
import { ChevronLeft } from "lucide-react"

/* Client island: FAQ accordion (grid-rows 0fr→1fr CSS height animation).
   Extracted so /pricing can be a server component with zero framer-motion
   in its initial JS — matches the .acc pattern used by the mobile nav.
   r6: also the home FAQ island (replaced a homegrown fixed-maxHeight
   variant that clipped long answers); optional className lets the host
   section attach reveal/stagger utilities.

   r131 (A3 D1/D2): the last glass content surface goes flat — the item
   rides .ln-card (hairline + border-shift hover, rounded-2xl sibling
   parity with the plan/info cards), and the question rides the --fs-body
   rung at 600 (15px/semibold, was the button's raw text-sm 14px/500
   overriding the h3 wrapper — the audit's "FAQ q" rung). */

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
            className="ln-card rounded-2xl overflow-hidden"
          >
        {/* r10 (a11y audit P2): the question is wrapped in an h3 so screen
            readers can jump between FAQ questions with the headings key —
            a bare button is invisible to heading navigation. Button keeps
            aria-expanded/aria-controls exactly as before. */}
            <h3 className="text-base font-semibold">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full px-5 py-4 flex items-center justify-between text-start text-[length:var(--fs-body)] font-semibold text-foreground hover:bg-[var(--accent)]/30 transition-colors"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                id={`faq-button-${i}`}
              >
                {faq.q}
                <ChevronLeft
                  className={`w-4 h-4 shrink-0 transition-transform duration-240 ${isOpen ? "rotate-180 text-primary" : ""}`}
                  aria-hidden="true"
                />
              </button>
            </h3>
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
