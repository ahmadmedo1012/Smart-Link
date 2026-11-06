"use client"

import { useState } from "react"
import { Smartphone, Bot, ShoppingBag, ArrowLeft, Check } from "lucide-react"
import { WORLDS, worldById, type WorldId } from "./worlds"
import { formatLyd } from "@/lib/money"

/* P45-W1 (Initiative B+A — the core deliverable) — «أي عالم يناسب عملك؟»
 * The discovery island: a visitor who does NOT self-identify had to read
 * all three world cards and reconcile them alone; «why choose one» was
 * unanswerable on-site. Two honest questions now route them:
 *
 *  Q1 «ما طبيعة عملك؟» — MULTI-select (a business can genuinely be more
 *     than one: the restaurant with a Facebook page). ≥2 selections take
 *     the honest «كلها» ecosystem path — no fake single winner.
 *  Q2 «ما أكبر مشكلة تواجهك في طلباتك اليوم؟» — single choice, phrased
 *     from the registry's own `problem` fields (sourceable sentences only).
 *
 * HONESTY LAWS (this island cannot lie):
 * · Every option, reason and figure folds the WORLDS registry — audience/
 *   problem/channel/freeLimits/paidFrom (pinned to pricing/page.tsx by
 *   tests/unit/worlds.test.ts) and signupUrl (SITE.products.*.signupUrl,
 *   the P40-5a conversion contract). ZERO local copy invention.
 * · A single-selection Q1 that DISAGREES with Q2 gets the honest split
 *   (both doors shown, the described pain wins the primary slot) — the
 *   island never pretends the mismatch away.
 * · The ecosystem path says the true thing the marquee already says:
 *   each service keeps its own account (W2-A1) — start with whichever
 *   is closest to today's pain.
 *
 * A11Y: real <button> toggles with aria-pressed (44px touch floor),
 * the result region is aria-live="polite" so the recommendation is
 * announced without stealing focus; keyboard-only flows work end to end.
 * Tokens only — zero hex (the §18 layer in landing.css carries the look).
 */

/* Q1 options — the registry's own audience fields, shortened to option
 * labels; the FULL audience sentence rides the result reasons. */
const NATURE_OPTIONS: ReadonlyArray<{ id: WorldId; label: string }> = [
  { id: "menu", label: "مطعم أو مقهى بمنيو" },
  { id: "bot", label: "صفحة فيسبوك تجارية" },
  { id: "order", label: "متجر يبيع منتجات ويوصلها" },
]

/* Q2 options — each phrased from its world's `problem` field (registry
 * verbatim; the option picks the pain, the reason shows the full field). */
const PAIN_OPTIONS: ReadonlyArray<{ id: WorldId; label: string }> = [
  { id: "menu", label: "قائمة ورقية ثابتة" },
  { id: "bot", label: "رسائل لا نلحق الرد عليها" },
  { id: "order", label: "طلبات هاتفية مبعثرة" },
]

const PRODUCT_ICONS = { menu: Smartphone, bot: Bot, order: ShoppingBag } as const

type Mode =
  | { kind: "prompt" }
  | { kind: "single"; world: WorldId; mismatch: WorldId | null }
  | { kind: "ecosystem" }

export function ProductFinder() {
  const [natures, setNatures] = useState<ReadonlySet<WorldId>>(new Set())
  const [pain, setPain] = useState<WorldId | null>(null)

  const toggleNature = (id: WorldId) => {
    setNatures((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  /* The honest routing (see the module header): Q2's described pain wins
   * the primary slot; a lone Q1 that disagrees rides as the honest
   * second door; ≥2 natures = the ecosystem path, never a fake winner. */
  let mode: Mode = { kind: "prompt" }
  if (natures.size >= 2) {
    mode = { kind: "ecosystem" }
  } else if (pain !== null) {
    mode = { kind: "single", world: pain, mismatch: natures.size === 1 && !natures.has(pain) ? [...natures][0]! : null }
  } else if (natures.size === 1) {
    mode = { kind: "single", world: [...natures][0]!, mismatch: null }
  }

  return (
    <div className="ln-finder" data-finder-mode={mode.kind}>
      {/* ── Q1 — nature (multi-select toggle buttons) ── */}
      <fieldset className="ln-finder-q">
        <legend className="ln-finder-q-title">ما طبيعة عملك؟ <span className="ln-mono ln-finder-q-hint">اختر كل ما ينطبق</span></legend>
        <div className="ln-finder-options" role="group" aria-label="طبيعة عملك — اختيار متعدد">
          {NATURE_OPTIONS.map((opt) => {
            const pressed = natures.has(opt.id)
            const Icon = PRODUCT_ICONS[opt.id]
            return (
              <button
                key={opt.id}
                type="button"
                aria-pressed={pressed}
                onClick={() => toggleNature(opt.id)}
                className="ln-finder-opt"
              >
                <Icon className="ln-finder-opt-icon" size={16} aria-hidden="true" />
                {opt.label}
              </button>
            )
          })}
        </div>
      </fieldset>

      {/* ── Q2 — today's biggest pain (single choice) ── */}
      <fieldset className="ln-finder-q">
        <legend className="ln-finder-q-title">ما أكبر مشكلة تواجهك في طلباتك اليوم؟</legend>
        <div className="ln-finder-options" role="group" aria-label="أكبر مشكلة في طلباتك — اختيار واحد">
          {PAIN_OPTIONS.map((opt) => {
            const pressed = pain === opt.id
            return (
              <button
                key={opt.id}
                type="button"
                aria-pressed={pressed}
                onClick={() => setPain(pressed ? null : opt.id)}
                className="ln-finder-opt"
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </fieldset>

      {/* ── the result — announced politely, never steals focus ── */}
      <div className="ln-finder-result" role="region" aria-live="polite" aria-label="العالم الموصى به">
        {mode.kind === "prompt" && (
          <p className="ln-finder-wait">أجب عن سؤالٍ واحدٍ على الأقل — أو اثنين لتوصية أدق.</p>
        )}

        {mode.kind === "single" && (() => {
          const w = worldById(mode.world)!
          const other = mode.mismatch ? worldById(mode.mismatch)! : null
          return (
            <div className="ln-finder-rec" data-world={w.id}>
              <span className="ln-finder-rec-kicker ln-mono">RECOMMENDED · التوصية</span>
              <h3 className="ln-finder-rec-name">{w.name}</h3>
              {/* the honest reasons — registry fields verbatim, no invention */}
              <ul className="ln-finder-rec-reasons">
                <li><Check size={13} aria-hidden="true" /> يناسب: {w.audience}</li>
                <li><Check size={13} aria-hidden="true" /> يحلّ: {w.problem}</li>
                <li><Check size={13} aria-hidden="true" /> القناة: {w.channel}</li>
              </ul>
              <p className="ln-finder-rec-econ ln-mono">
                [ مجاني: {w.freeLimits.join(" · ")} — المدفوع من {formatLyd(w.paidFrom)} ]
              </p>
              {/* P40-5a: a conversion CTA deep-links the product's OWN signup
                  page — external conventions + Label-in-Name carry the
                  visible sentence, the product, and the external notice. */}
              <a
                className="ln-finder-cta"
                href={w.signupUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`ابدأ مجاناً — ${w.name}، رابط خارجي`}
              >
                ابدأ مجاناً — {w.name}
                <ArrowLeft size={14} aria-hidden="true" />
              </a>
              {/* the honest mismatch note — both doors stay open */}
              {other && (
                <p className="ln-finder-rec-split">
                  وصفتَ عملك بأنه «{other.audience}» وذكرتَ مشكلةً يحلّها {w.name} —
                  إن كان {other.name} أقرب لبدايتك اليوم فبابه مفتوح أيضًا:
                  {" "}
                  <a
                    href={other.signupUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`اشترك في ${other.name}، رابط خارجي`}
                  >
                    اشترك في {other.name}
                  </a>
                </p>
              )}
            </div>
          )
        })()}

        {mode.kind === "ecosystem" && (
          <div className="ln-finder-rec ln-finder-rec--eco">
            <span className="ln-finder-rec-kicker ln-mono">ALL · العوالم الثلاثة</span>
            <h3 className="ln-finder-rec-name">عملك يمتد على أكثر من عالم — والصدق: لا مضطرّ للاختيار</h3>
            {/* W2-A1 truth: every service keeps its OWN account — the
                marquee line «حساب مستقل لكل خدمة»; start with whichever
                is closest to today's pain. */}
            <p className="ln-finder-rec-note">
              كل خدمة في المنظومة بحسابها المستقل وخطتها المجانية — ابدأ بالأقرب
              لعملك اليوم وأضف الباقي متى ما اتسع العمل.
            </p>
            <div className="ln-finder-eco-grid">
              {WORLDS.map((w) => {
                const Icon = PRODUCT_ICONS[w.id]
                return (
                  <div key={w.id} className="ln-finder-eco-card" data-world={w.id}>
                    <span className="ln-finder-eco-name"><Icon size={14} aria-hidden="true" /> {w.name}</span>
                    <p className="ln-finder-eco-problem">{w.problem}</p>
                    <a
                      className="ln-finder-eco-cta"
                      href={w.signupUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`ابدأ مجاناً — ${w.name}، رابط خارجي`}
                    >
                      ابدأ مجاناً <ArrowLeft size={12} aria-hidden="true" />
                    </a>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
