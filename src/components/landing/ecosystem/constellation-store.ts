import type { WorldId } from '../worlds';

/* ── the module store — one organism, two islands ─────────────────────
 * The canvas engine (island 1) and the chips/glass-card dock (island 2)
 * must behave as ONE interactive constellation, but the hero keeps its
 * server-rendered LCP column between them. A tiny module-level store
 * (useSyncExternalStore on the dock, read-per-frame in the engine loop)
 * is the honest seam: no context provider wrapping server children, no
 * re-render of the engine per interaction.
 *
 * r147 (17-DEBT-SL): extracted verbatim from EcosystemConstellation.tsx
 * — same state, same notification order, same singleton semantics (one
 * module instance per graph). The composition root re-exports the store
 * so the module's public surface stays byte-for-byte the same contract. */

type Listener = () => void;
const hoverListeners = new Set<Listener>();
const selectedListeners = new Set<Listener>();
let hoverId: WorldId | null = null;
let selectedId: WorldId | null = null;

export const constellationStore = {
  getHover: () => hoverId,
  getSelected: () => selectedId,
  setHover(next: WorldId | null) {
    if (next === hoverId) return;
    hoverId = next;
    for (const l of hoverListeners) l();
  },
  setSelected(next: WorldId | null) {
    if (next === selectedId) return;
    selectedId = next;
    for (const l of selectedListeners) l();
  },
  subscribeHover(l: Listener) {
    hoverListeners.add(l);
    return () => {
      hoverListeners.delete(l);
    };
  },
  subscribeSelected(l: Listener) {
    selectedListeners.add(l);
    return () => {
      selectedListeners.delete(l);
    };
  },
};
