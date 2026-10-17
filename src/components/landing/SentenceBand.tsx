import type { ReactNode } from "react"
import { RevealCssClass } from "@/hooks/useReveal"

/* P16-4a (r160 KODE · narrative pass) — the display-sentence band.
 * The KODE grammar «value props as poster-scale sentences, not a
 * features grid» (ref: kodeimmersive S2/S3 — «THE EMOTIONAL IMPACT IS
 * OFF THE SCALE.»): the landing's three core value props, each one
 * SENTENCE at poster scale, riding the void-reset seam between the
 * journey flood and the cockpit proof — the orange shout, then this
 * quiet stage, then the numbers. Deliberately UNLABELLED (like the
 * platforms chapter): it is a breathing hole, not a numbered chapter,
 * so the S5 corner counter holds its last number across it.
 * Every sentence traces to shipped copy — nothing invented:
 * · «رابط واحد» — the hero sub-headline's strong line (كل ما تحتاجه
 *   لتنمية أعمالك خلف رابط واحد) + journey station 004 (رابط واحد
 *   لكل أعمالك).
 * · «حساب مستقل» — journey station 002 (كل خدمة تُجهَّز من لوحة تحكم
 *   عربية خاصة بها) + the marquee vocabulary (حساب مستقل لكل خدمة).
 *   W2-A1 (صدق الحساب — تدقيق W2-R1): the old «حساب واحد» claim was
 *   false — the SmartLink hub has no auth; each product keeps its own
 *   account, so the sentence carries the per-product truth now.
 * · «واجهة عربية بالكامل» — the cockpit's verifiable 100% stat + the
 *   marquee vocabulary. No numerals, no new claims.
 * Type law: the repo's actual Arabic display face — Noto Kufi Arabic
 * 800 (the .ln-hero-title/.ln-chapter-title--kode lockup voice; IBM
 * Plex Sans Arabic self-hosts only 400–700, so Kufi 800 IS the
 * ExtraBold rung here) at clamp(40–72px), the repo's own KODE em
 * accent (one orange word per sentence, large-text grade). */

const SENTENCES: Array<{ key: string; node: ReactNode }> = [
  { key: "link", node: <>رابطٌ <em>واحد</em> يحمل كلَّ أعمالك.</> },
  { key: "account", node: <>منيوٌ وبوتٌ ومتجر — لكلٍّ منها <em>حسابٌ مستقلٌّ</em>.</> },
  { key: "arabic", node: <>واجهةٌ عربيةٌ <em>بالكامل</em> — من أول نقرةٍ إلى آخر طلب.</> },
]

export function SentenceBand() {
  return (
    <section className="ln-sentences" aria-label="جوهر المنصّة">
      {SENTENCES.map((s, i) => (
        <RevealCssClass
          as="p"
          key={s.key}
          className="ln-sentence"
          delay={(i + 1) as 1 | 2 | 3}
        >
          {s.node}
        </RevealCssClass>
      ))}
    </section>
  )
}
