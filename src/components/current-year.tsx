"use client"

import { useSyncExternalStore } from "react"

/* r126 (P4-A3 §3.6): the footer © year lived in a static Server Component —
   new Date().getFullYear() evaluated ONCE at build time and went stale
   between deploys. This island hydrates only the year, with the exact
   contract the repo already uses for hydration-safe values (main-nav's
   `mounted` flag):
   - the SERVER stamps buildYear (passed by the footer — evaluated at
     build; no-JS visitors keep a valid year forever),
   - hydration renders the SAME value via getServerSnapshot (zero
     mismatch, even across New Year),
   - React's post-hydration snapshot check then patches the visitor's
     live year if it differs — the only re-render is the one that
     matters, and there is no setState-in-effect (the r126 lint rule).
   The store never emits (subscribe is a no-op): the year is read, not
   observed. */
const subscribe = () => () => {};

export function CurrentYear({ buildYear }: { buildYear: number }) {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => buildYear
  );
  return <span>{year}</span>;
}
