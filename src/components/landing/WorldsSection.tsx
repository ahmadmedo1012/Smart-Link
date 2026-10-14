import { ArrowLeft } from "lucide-react"
import { RevealCssClass } from "@/hooks/useReveal"
import { WORLDS } from "./worlds"

/* P12-2a (r160 KODE) — Chapter 001 «العوالم» re-cast as the BLACK stage:
 * a huge Kufi chapter header and three minimal TYPE-CARDS separated by
 * hairline rules (the spec's S3 discipline: ink/white/orange only — the
 * per-world hue panels + CSS mocks retired with the constellation era).
 * Everything REAL survives: the three live domains, the shipped copy,
 * the three real claims per world, the Western numerals (E1). The
 * worlds.ts registry stays the single data source. */

export function WorldsSection() {
  return (
    <section id="products" className="ln-chapter ln-worlds ln-worlds--kode">
      <header className="ln-chapter-head ln-chapter-head--kode">
        <span className="ln-label ln-mono">{"001 — العوالم"}</span>
        <RevealCssClass as="h2" className="ln-chapter-title ln-chapter-title--kode" delay={1}>
          ثلاثة عوالم تعمل&nbsp;<em>الآن</em>
        </RevealCssClass>
        <RevealCssClass as="p" className="ln-chapter-lede" delay={2}>
          لكل منتجٍ عالمه الخاص: منيوٌ يتفاعل، وبوتٌ يردّ، ومتجرٌ يبيع —
          كل عالم يفتح من نطاقه الحي مباشرة.
        </RevealCssClass>
      </header>

      <div className="ln-worlds-list ln-worlds-list--kode">
        {WORLDS.map((w, i) => (
          <RevealCssClass
            as="article"
            key={w.id}
            data-world={w.id}
            className="ln-world-card"
            delay={(i + 1) as 1 | 2 | 3}
          >
            <span className="ln-world-num ln-mono" aria-hidden="true">{w.numeral}</span>
            <div className="ln-world-card-body">
              <div className="ln-world-card-head">
                <h3 className="ln-world-name">{w.name}</h3>
                <span className="ln-world-host ln-mono">{w.host}</span>
              </div>
              <p className="ln-world-sub">{w.sub}</p>
              <ul className="ln-world-claims">
                {w.claims.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              <a
                className="ln-world-cta"
                href={w.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`ادخل عالم ${w.name} — النطاق الحي، رابط خارجي`}
              >
                ادخل عالم {w.name}
                <ArrowLeft size={16} aria-hidden="true" />
              </a>
            </div>
          </RevealCssClass>
        ))}
      </div>
    </section>
  )
}
