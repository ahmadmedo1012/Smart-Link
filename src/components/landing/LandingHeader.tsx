"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { Menu, X, ChevronDown, ArrowLeft, Route, Smartphone, BarChart3, Share2, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { SITE } from "@/lib/site"

/* r128 Stage B (F2b) — the landing header, converted from the product's
   glass MainNav to the canonical Madarek chrome (PORT-KIT §4):
   · persistent sticky header — solid ink-2 @ 92% once scrolled, hairline
     edge, NO glass blur anywhere;
   · `.scrolled` + the top progress ribbon's `--p` are written
     imperatively (one passive scroll listener → one rAF → DOM writes);
     React NEVER re-renders for scrolling (zero setState);
   · scroll-spy (r128 R2): IntersectionObserver thresholds [0,.35,.5,.65,1],
     rootMargin -20% 0px -40% 0px, candidates ratio > .35, winner by most
     viewport coverage → header.dataset.activeSection (the landing.css
     rules read it there);
   · megamenu with tone-coded icon wells (Escape + onBlur close, focus
     return to the trigger);
   · burger + mobile drawer ≤1080px (r129 P0-10: the canonical
     breakpoint — was 1024; the 1025–1080px band now folds into the
     drawer like the canonical header).
   The product MainNav keeps serving every non-landing surface. */

/* r142 «الكوكبة الحية»: the spy anchors follow the new chapter map —
   products / journey / progress (القيادة) / platforms. The old #trust
   band merged into the cockpit (#progress) and the roles ledger folded
   into the worlds chapter (#products).
   r144 (P4-4SL): the landing.css selector roster now matches this map
   exactly — the dead #trust/#roles selector lines were excised with the
   sections they pointed at. */
const SPY_SECTIONS = "#products, #journey, #progress, #platforms"

/* P16-4a (KODE S5 chrome) — the section counter's chapter map. The [ 00n ]
   corner instrument ticks to the page's OWN published numbering (the mono
   labels each chapter head physically paints): 001 العوالم / 002 الرحلة /
   003 القيادة / 004 الوصول / 005 الأسئلة. The platforms + sentence-band
   seams are unlabelled breathing holes — the counter HOLDS its last value
   there (never invents a number); above the first chapter it reads 000.
   Mirrors the spy contract: the anchors are the same section ids. */
const COUNTER_CHAPTERS: ReadonlyArray<{ sel: string; n: string }> = [
  { sel: "#products", n: "001" },
  { sel: "#journey", n: "002" },
  { sel: "#progress", n: "003" },
  { sel: ".ln-cta", n: "004" },
  { sel: ".ln-faq", n: "005" },
]

export function LandingHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [megamenuOpen, setMegamenuOpen] = useState(false)
  /* phase9 (P9-3-a E3): the landing earns its own theme toggle — the
     family twin of main-nav.tsx (mounted guard + resolvedTheme, the
     r131 A10 SL-2 ruling: resolvedTheme is always the class actually
     painted, never a raw stored "system" string). Server snapshot
     false → the button renders post-hydration only, so SSR HTML and
     first client paint agree (no hydration mismatch); the pre-paint
     boot script in layout.tsx already painted html.dark/light before
     this parses, so there is no flash either. */
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
  const { resolvedTheme, setTheme } = useTheme()
  const megamenuTriggerRef = useRef<HTMLButtonElement>(null)
  /* r134 (R134-W1-SL P2): the burger trigger — Escape on the mobile
     drawer closes it and returns focus here (mirrors the MainNav twin
     main-nav.tsx:392-398; the drawer used to strand keyboard users). */
  const burgerRef = useRef<HTMLButtonElement>(null)
  /* Scroll chrome lives on refs and is written imperatively below — a React
     re-render per scroll event was the canonical round-3 regression. */
  const headerRef = useRef<HTMLElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  /* P16-4a: the corner counter — same doctrine (zero setState: the IO
     writes textContent + a re-trigger class directly on the DOM). */
  const counterNumRef = useRef<HTMLSpanElement>(null)
  const counterRootRef = useRef<HTMLDivElement>(null)

  /* Scroll-driven chrome with ZERO setState: coalesced to one rAF per frame
     (pending-flag pattern, mirrors useSectionProgress) and written straight
     to the DOM — the .scrolled class on the header and the --p var on the
     top ribbon. */
  useEffect(() => {
    const header = headerRef.current
    const bar = progressBarRef.current

    let raf = 0
    const apply = () => {
      raf = 0
      const y = window.scrollY
      if (header) header.classList.toggle("scrolled", y > 6)
      if (bar) {
        const max = document.documentElement.scrollHeight - window.innerHeight
        const p = max > 0 ? Math.min(1, y / max) : 0
        bar.style.setProperty("--p", p.toFixed(4))
      }
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply)
    }

    apply()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  /* Scroll-spy — active section highlight in the nav. Zero setState: written
     to a data attribute on the header via imperative DOM. */
  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    const sections = Array.from(document.querySelectorAll<HTMLElement>(SPY_SECTIONS))
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        /* Collect all entries first, then pick the one with most overlap. */
        const visible: Array<{ id: string; ratio: number }> = []
        for (const entry of entries) {
          if (entry.intersectionRatio > 0.35) {
            visible.push({ id: entry.target.id, ratio: entry.intersectionRatio })
          }
        }
        /* Pick the section with the most viewport coverage; tie-break by order. */
        visible.sort((a, b) => b.ratio - a.ratio)
        if (visible.length > 0) {
          header.dataset.activeSection = visible[0]!.id
        } else {
          delete header.dataset.activeSection
        }
      },
      { threshold: [0, 0.35, 0.5, 0.65, 1], rootMargin: "-20% 0px -40% 0px" },
    )

    for (const s of sections) observer.observe(s)

    return () => observer.disconnect()
  }, [])

  /* P16-4a (KODE S5) — the [ 00n ] section counter. IntersectionObserver
     over the five labelled chapters; the winner is the LAST chapter in
     DOM order intersecting the upper-viewport band (rootMargin mirrors
     the nav spy's geometry). No intersection = either the prologue
     (above #products → 000) or an unlabelled breathing seam (hold the
     last number). The tick itself is a transform/opacity keyframe on a
     class — killed by the universal RM belt, the number still updates. */
  useEffect(() => {
    const num = counterNumRef.current
    const root = counterRootRef.current
    if (!num || !root) return

    const chapters = COUNTER_CHAPTERS
      .map((c) => ({ ...c, el: document.querySelector<HTMLElement>(c.sel) }))
      .filter((c): c is { sel: string; n: string; el: HTMLElement } => c.el !== null)
    if (chapters.length === 0) return

    let current = "000"
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = new Set(
          entries.filter((e) => e.isIntersecting).map((e) => e.target)
        )
        let next = ""
        for (const c of chapters) if (visible.has(c.el)) next = c.n
        if (!next) {
          /* nothing labelled in the band: the prologue (first chapter still
             below the viewport top) resets to 000; a mid-page seam holds. */
          const firstTop = chapters[0].el.getBoundingClientRect().top
          next = firstTop > 0 ? "000" : current
        }
        if (next !== current) {
          current = next
          num.textContent = next
          /* the tick: a transform/opacity-only Web Animations blip (the
             number itself still updates under reduced motion — only the
             blip is skipped; no CSS class juggling, no forced reflow). */
          if (!reducedMotion.matches) {
            num.animate(
              [
                { transform: "translateY(5px)", opacity: 0.25 },
                { transform: "none", opacity: 1 },
              ],
              { duration: 160, easing: "ease-out" }
            )
          }
        }
      },
      { threshold: [0], rootMargin: "-20% 0px -55% 0px" }
    )

    for (const c of chapters) observer.observe(c.el)

    /* the ground floor: chrome ends where the footer's last row begins —
       the counter would otherwise sit over the © line at full scroll. */
    let floorObs: IntersectionObserver | null = null
    const footerBottom = document.querySelector(".landing-footer-bottom")
    if (footerBottom) {
      floorObs = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) root.setAttribute("data-at-ground", "")
            else root.removeAttribute("data-at-ground")
          }
        },
        { threshold: [0] }
      )
      floorObs.observe(footerBottom)
    }

    return () => {
      observer.disconnect()
      floorObs?.disconnect()
    }
  }, [])

  /* Megamenu: Escape closes with focus return; blur outside the group closes. */
  const closeMegamenu = () => setMegamenuOpen(false)

  return (
    <>
      {/* Top scroll-progress bar — driven imperatively via --p */}
      <div className="landing-progress" aria-hidden="true">
        <div className="landing-progress-bar" ref={progressBarRef} style={{ ["--p" as string]: 0 }} />
      </div>

      {/* Header — the .scrolled state class is toggled imperatively */}
      <header className="landing-header" ref={headerRef}>
        {/* P16-4a (KODE S5) — the ticking section counter, first child so
            the nav + drawer (in-flow, later DOM) always paint above it:
            fixed at the bottom inline-start corner, z -1 inside this
            header's stacking context (above the page sections, below the
            open drawer — the drawer never gets covered by chrome).
            aria-hidden: pure furniture; the chapter heads carry the real
            numbers in the a11y tree. The LTR-isolated mono run keeps the
            [ 001 ] bracket grammar intact inside the RTL page. */}
        <div
          className="ln-counter"
          aria-hidden="true"
          ref={counterRootRef}
          /* menuOpen rides the header's own state — the counter also dims
             with the drawer (the z:-1 rung already keeps the open drawer
             above it; this removes the peeking sliver at the capped
             landscape drawer edge too). */
          data-drawer-open={menuOpen || undefined}
        >
          <span className="ln-mono">[ <span className="ln-counter-n" ref={counterNumRef}>000</span> ]</span>
        </div>
        <div className="landing-nav">
          {/* P21-W7-A (axe 4.14 — label-content-name-mismatch، WCAG 2.5.3
              Label in Name): الـaria-label «SmartLink — الرئيسية» كان اسمًا
              مقصودًا لا يحتوي النص الظاهر (الماركة + الشعار الفرعي) —
              القاعدة الجديدة (ACT 2ee8b8) تُطالب بأن يحمل العنصر التفاعلي
              نصه المرئي ضمن اسمه المُتاح ليطابق مُستخدمو الإدخال الصوتي
              ما يقرؤونه على الشاشة. حذف السمة هو الإصلاح القانوني الوحيد:
              الاسم يصبح من المحتوى المرئي نفسه (نفس عقيدة أخيه في
              main-nav.tsx:184 — اسم العلامة من محتواها)، والوجهة «/»
              يفهمها السياق. صفر تغيير في البكسلات — أسماء a11y فقط. */}
          <Link href="/" className="landing-brand">
            <span className="landing-brand-mark" aria-hidden="true">S</span>
            <span className="landing-brand-text">
              <span className="landing-brand-name">SmartLink</span>
              <span className="landing-brand-sub">منصّة رقمية متكاملة</span>
            </span>
          </Link>

          {/* P12-2a (r160 S5): the bracketed mono status chrome — KODE's
              near-zero interface furniture. LTR mono on purpose (status
              labels are machine voice in an RTL page). */}
          <span className="ln-status ln-mono" aria-hidden="true">[ SMART LINK — 001 ]</span>

          <nav className="landing-nav-links" aria-label="أقسام الرحلة">
            <div
              className={`landing-nav-group${megamenuOpen ? " open" : ""}`}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                  setMegamenuOpen(false)
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape" && megamenuOpen) {
                  setMegamenuOpen(false)
                  megamenuTriggerRef.current?.focus()
                }
              }}
            >
              <button
                type="button"
                className="landing-nav-link"
                /* r134 (R134-W1-SL P3): aria-haspopup="true" == "menu",
                   promising arrow-key navigation we do not implement
                   (disclosure pattern: free Tab flow) — dropped to match
                   the product twin main-nav.tsx:259-262; aria-expanded/
                   aria-controls carry the real disclosure contract. */
                aria-expanded={megamenuOpen}
                aria-controls="landing-megamenu"
                ref={megamenuTriggerRef}
                onClick={() => setMegamenuOpen((v) => !v)}
              >
                المنصّة
                <ChevronDown size={16} aria-hidden="true" />
              </button>
              <div id="landing-megamenu" className="landing-megamenu" onClick={closeMegamenu}>
                <a href="#products" className="landing-megamenu-item">
                  <span className="ln-menu-ico signal" aria-hidden="true"><Smartphone size={20} /></span>
                  <span className="landing-megamenu-item-body">
                    <span className="landing-megamenu-item-title">المنتجات</span>
                    {/* r140 (صدق الثلاثية — تدقيق A140-SL #4): كانت تعدّ
                        منتجين في أول تفاعل بالهيدر — المتجر غائب. */}
                    <span className="landing-megamenu-item-desc">منيو وبوت ومتجر طلبات</span>
                  </span>
                </a>
                <a href="#journey" className="landing-megamenu-item">
                  <span className="ln-menu-ico gold" aria-hidden="true"><Route size={20} /></span>
                  <span className="landing-megamenu-item-body">
                    <span className="landing-megamenu-item-title">رحلة الربط</span>
                    <span className="landing-megamenu-item-desc">من الرابط إلى الأتمتة</span>
                  </span>
                </a>
                <a href="#progress" className="landing-megamenu-item">
                  <span className="ln-menu-ico mist" aria-hidden="true"><BarChart3 size={20} /></span>
                  <span className="landing-megamenu-item-body">
                    <span className="landing-megamenu-item-title">قراءة القيادة</span>
                    <span className="landing-megamenu-item-desc">أرقام المنصّة الحقيقية</span>
                  </span>
                </a>
                <a href="#platforms" className="landing-megamenu-item">
                  <span className="ln-menu-ico gold" aria-hidden="true"><Share2 size={20} /></span>
                  <span className="landing-megamenu-item-body">
                    <span className="landing-megamenu-item-title">المنصّات</span>
                    <span className="landing-megamenu-item-desc">واتساب وفيسبوك وQR</span>
                  </span>
                </a>
              </div>
            </div>
            <a href="#products" className="landing-nav-link">العوالم</a>
            <a href="#journey" className="landing-nav-link">الرحلة</a>
            <a href="#progress" className="landing-nav-link">القيادة</a>
            {/* P13-2a (T4): /pricing joins the desktop nav — the landing
                advertised anchor sections only while the pricing page (and
                the LIVE ecosystem ladders it mirrors) was reachable only
                from the footer. Same landing-nav-link family styling;
                the journey anchors stay intact. */}
            <Link href="/pricing" className="landing-nav-link">الأسعار</Link>
          </nav>

          <div className="landing-header-cta">
            <span className="ln-status ln-status--libya ln-mono" aria-hidden="true">[ LIBYA ]</span>
            <Link href="/contact" className="ln-btn-ghost">تواصل معنا</Link>
            <a
              href={SITE.products.menu.url}
              target="_blank"
              rel="noopener noreferrer"
              /* r134 (R134-W1-SL P3): the external-link announcement
                 convention (footer.tsx:106, main-nav.tsx:303) — matches
                 the hero twin page.tsx:111 verbatim. */
              aria-label="ابدأ مجاناً — Smart Menu، رابط خارجي"
              className="ln-btn-gold"
            >
              ابدأ مجاناً
              <ArrowLeft size={16} aria-hidden="true" />
            </a>
          </div>

          <button
            type="button"
            className="landing-burger"
            aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={menuOpen}
            /* r148 (19-AUDIT-SL D7): عقود الإفصاح اكتملت — البرغر كان
               يحمل aria-expanded وحده بينما ميجامنيو الهيدر يملك العقد
               الكاملة (:157-158). r150: aria-controls يُعلَن فقط وهو
               موجود فعلاً — الدرج يُصيَّر عند الفتح، فالإشارة المعلّقة
               عندما يكون مغلقاً كانت مرجعاً ميتاً (twin r13: main-nav
               يُبقي درجه mounting دائماً؛ هنا نُصدِق المرجع بدل تغيير
               نمط التصيير المعتمد). */
            aria-controls={menuOpen ? "landing-mobile-menu" : undefined}
            ref={burgerRef}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>

          {/* phase9 (P9-3-a E3): the theme toggle — the family twin of
              main-nav.tsx (same aria-labels, same Sun/Moon flip, same
              44px touch floor). Sits AFTER the burger in the flex row so
              it survives the ≤1080px drawer breakpoint (the CTA cluster
              hides there; this stays the one always-visible control).
              Keyboard: a plain <button> — Tab + Enter/Space by default;
              the universal .landing :focus-visible ring carries the
              visible focus contract. */}
          {/* P18-W2-b (CLS gate closure): same law as main-nav.tsx — the
              toggle was {mounted && …} with zero SSR box; its post-hydration
              appearance shifted the header rail 68px (the `/` residual CLS
              0.0022). Always render the fixed 44×44 slot (the class itself
              is the box); only label+icon are mounted-gated. */}
          {mounted ? (
            <button
              type="button"
              className="landing-theme-toggle"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              aria-label={resolvedTheme === "dark" ? "تفعيل المظهر الفاتح" : "تفعيل المظهر الداكن"}
            >
              <span
                className="landing-theme-toggle-icon"
                aria-hidden="true"
                style={{ transform: resolvedTheme === "dark" ? undefined : "rotate(180deg)" }}
              >
                {resolvedTheme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </span>
            </button>
          ) : (
            <div className="landing-theme-toggle" aria-hidden="true" />
          )}
        </div>

        {menuOpen && (
          <nav
            id="landing-mobile-menu"
            className="landing-mobile-menu"
            aria-label="قائمة الجوال"
            onClick={() => setMenuOpen(false)}
            /* r134 (R134-W1-SL P2): Escape closes the drawer and returns
               focus to the burger — the MainNav pattern (main-nav.tsx:
               392-398), which the megamenu already had (:131-136). */
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setMenuOpen(false)
                burgerRef.current?.focus()
              }
            }}
          >
            <a href="#products" className="ln-btn-ghost">العوالم</a>
            <a href="#journey" className="ln-btn-ghost">رحلة الربط</a>
            <a href="#progress" className="ln-btn-ghost">القيادة</a>
            <a href="#platforms" className="ln-btn-ghost">المنصّات</a>
            {/* P13-2a (T4): /pricing in the drawer — the twin of the
                desktop nav link above. */}
            <Link href="/pricing" className="ln-btn-ghost">الأسعار</Link>
            <Link href="/contact" className="ln-btn-ghost">تواصل معنا</Link>
            <a
              href={SITE.products.menu.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ابدأ مجاناً — Smart Menu، رابط خارجي"
              className="ln-btn-gold"
            >
              ابدأ مجاناً
              <ArrowLeft size={16} aria-hidden="true" />
            </a>
          </nav>
        )}
      </header>
    </>
  )
}
