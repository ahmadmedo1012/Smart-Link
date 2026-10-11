"use client";

import { useEffect, useRef } from 'react';

/**
 * useMagnetic — a subtle magnetic pull for primary CTAs. The ONE
 * magnetic implementation in the repo (r144 P4-4SL consolidated the
 * main-nav's inline MagneticButton onto this hook).
 *
 * Desktop-hover devices only: the element drifts a few pixels toward the
 * cursor and springs back on leave. Disabled entirely for
 * touch devices (`(hover: none)`), reduced-motion users, and while the
 * element is offscreen (IntersectionObserver). Transform only — the
 * pull is written as `--mag-x` / `--mag-y` custom properties consumed
 * by a `translate()` in CSS, so there is no layout cost; pointermove
 * is rAF-throttled to one write per frame.
 * r144 (P4-4SL): the rect is measured ONCE on mouseenter and cached —
 * the r8 main-nav lesson (60Hz getBoundingClientRect forced layout;
 * Lighthouse measured 113.9ms of unattributed reflow during header
 * hover) — invalidated on leave. */
export function useMagnetic<T extends HTMLElement = HTMLElement>(strength = 6) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canHover = window.matchMedia('(hover: hover)').matches;
    if (reduced || !canHover) return;

    let raf = 0;
    let visible = true;
    let rect: DOMRect | null = null;

    const reset = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      rect = null;
      el.style.setProperty('--mag-x', '0px');
      el.style.setProperty('--mag-y', '0px');
    };

    const io = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? true;
      if (!visible) reset();
    });
    io.observe(el);

    const onMove = (e: MouseEvent) => {
      if (!visible) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!rect) rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        // clamped, eased pull — never more than `strength` px
        const mx = Math.max(-1, Math.min(1, dx)) * strength;
        const my = Math.max(-1, Math.min(1, dy)) * strength * 0.7;
        el.style.setProperty('--mag-x', `${mx.toFixed(1)}px`);
        el.style.setProperty('--mag-y', `${my.toFixed(1)}px`);
      });
    };

    const onLeave = () => reset();

    el.addEventListener('mouseenter', onMove, { passive: true });
    el.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseleave', onLeave, { passive: true });
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      el.removeEventListener('mouseenter', onMove);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      reset();
    };
  }, [strength]);

  return ref;
}
