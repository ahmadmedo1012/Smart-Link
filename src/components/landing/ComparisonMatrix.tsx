import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { WORLDS } from "./worlds"
import { formatLyd } from "@/lib/money"

/* P45-W1 (Initiative B+A) — the honest comparison matrix: the ONLY
 * on-site answer to «why choose one» (before this, the sole comparison
 * was a stale internal two-product doc). One table fed ENTIRELY from the
 * extended WORLDS registry — every cell verifiable:
 *   الجمهور / المشكلة / القناة  — the registry's sourceable discovery
 *      fields (module header documents each source);
 *   حدود الباقة المجانية — the pricing cards' own catalog strings
 *      (cap doctrine included: Menu «100 طلب» lifetime, no month-word;
 *      Bot «(100/شهر)» and Order «100 طلب شهرياً» real monthly windows);
 *   يبدأ المدفوع من — formatLyd(paidFrom), the live ladders' first paid
 *      rung (unit-pinned to pricing/page.tsx — it cannot drift);
 *   ابدأ — signupUrl (P40-5a: conversion CTAs deep-link the sibling's
 *      own signup page; the hub never prices a plan of its own).
 *
 * Mobile (<768px): the table degrades to a horizontal scroller with a
 * VISIBLE affordance (the mono «اسحب للمقارنة» cue + icon) and a sticky
 * product column — §18 in landing.css. Server component: zero client JS.
 */

export function ComparisonMatrix() {
  return (
    <div className="ln-matrix">
      <h3 className="ln-matrix-title">قارن العوالم الثلاثة وجهاً لوجه</h3>
      <p className="ln-matrix-lede">
        كل خلية من هذا الجدول مصدرها سجل العوالم نفسه الذي يغذّي صفحة الأسعار —
        لا رقم ولا وعد خارج كتالوج المنظومة المنشور.
      </p>
      {/* the mobile affordance — visible below 768px only (§18) */}
      <p className="ln-matrix-cue ln-mono" aria-hidden="true">
        <ArrowLeft size={12} /> اسحب للمقارنة
      </p>
      {/* W3C scrollable-region advice: tabindex 0 + role=region + label —
          keyboard users can scroll the comparison; the aria-label is what
          the focus landfall announces. */}
      <div className="ln-matrix-scroller" tabIndex={0} role="region" aria-label="جدول مقارنة العوالم الثلاثة">
        <table className="ln-matrix-table">
          <thead>
            <tr>
              <th scope="col">المنتج</th>
              <th scope="col">الجمهور</th>
              <th scope="col">المشكلة</th>
              <th scope="col">القناة</th>
              <th scope="col">حدود الباقة المجانية</th>
              <th scope="col">يبدأ المدفوع من</th>
              <th scope="col">ابدأ</th>
            </tr>
          </thead>
          <tbody>
            {WORLDS.map((w) => (
              <tr key={w.id} data-world={w.id}>
                <th scope="row">
                  <span className="ln-matrix-name">{w.name}</span>
                  <span className="ln-matrix-host ln-mono">{w.host}</span>
                </th>
                <td>{w.audience}</td>
                <td>{w.problem}</td>
                <td>{w.channel}</td>
                <td>
                  <ul className="ln-matrix-limits">
                    {w.freeLimits.map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ul>
                </td>
                <td className="ln-matrix-price ln-mono">{formatLyd(w.paidFrom)}</td>
                <td>
                  {/* P40-5a: conversion CTA → the product's own signup page
                      (external conventions + Label-in-Name). */}
                  <a
                    className="ln-matrix-cta"
                    href={w.signupUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`ابدأ مجاناً — ${w.name}، رابط خارجي`}
                  >
                    ابدأ مجاناً
                    <ArrowLeft size={12} aria-hidden="true" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* the honest footer: ladders are managed on each product's own
          platform — the hub sells the free tier only (PRODUCT.md:85-89). */}
      <p className="ln-matrix-foot">
        الباقات المدفوعة تعمل وتُدار على منصّة كل منتج بالدينار الليبي —{" "}
        <Link href="/pricing" prefetch={false} className="ln-matrix-foot-link">
          سلّم باقات كل منتج على صفحة الأسعار
        </Link>
      </p>
    </div>
  )
}
