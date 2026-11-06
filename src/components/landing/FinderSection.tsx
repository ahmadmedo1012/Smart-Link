import { RevealCssClass } from "@/hooks/useReveal"
import { ProductFinder } from "./ProductFinder"
import { ComparisonMatrix } from "./ComparisonMatrix"

/* P45-W1 (Initiative B+A — vertical #1) — Chapter 002 «المواءمة»: the
 * discovery chapter between the worlds and the journey. The visitor just
 * met the three worlds; the FIRST thing they need next is to know which
 * one is THEIRS — before the journey narrative sells them the path.
 *
 * Two surfaces, one chapter, one data source (the extended WORLDS
 * registry):
 *  · the «أي عالم يناسب عملك؟» interactive island (client — the only
 *    JS this chapter adds; questions + result render server-side too,
 *    so no-JS visitors still read the questions and the honest framing);
 *  · the honest comparison matrix (pure server — zero JS).
 *
 * The chapter rides the KODE stage laws: this is a held-black chapter
 * (§18 in landing.css — the worlds chapter's own grammar extended
 * additively, tokens/literal-blacks per the §16d discipline).
 */
export function FinderSection() {
  return (
    <section id="finder" className="ln-chapter ln-finder-section">
      <header className="ln-chapter-head ln-chapter-head--kode">
        <span className="ln-label ln-mono">{"002 — المواءمة"}</span>
        <RevealCssClass as="h2" className="ln-chapter-title ln-chapter-title--kode" delay={1}>
          أي عالمٍ يناسب <em>عملك</em>؟
        </RevealCssClass>
        <RevealCssClass as="p" className="ln-chapter-lede" delay={2}>
          سؤالان قصيران — أو اقرأ المقارنة كاملة تحت الجواب. كل ما يظهر هنا
          من سجل العوالم نفسه: لا وعد ولا رقم خارج ما تعمله المنظومة فعلاً.
        </RevealCssClass>
      </header>

      <RevealCssClass as="div" className="ln-finder-panel" delay={2}>
        <ProductFinder />
        <ComparisonMatrix />
      </RevealCssClass>
    </section>
  )
}
