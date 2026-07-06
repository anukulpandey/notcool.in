"use client";

import { useEffect, useState } from "react";

export type PingState = {
  status: "pinging" | "live" | "down";
  ms: number | null;
};

// module-level cache so multiple widgets (showcase chip + bento status row)
// share ONE request per host instead of double-pinging
const inflight = new Map<string, Promise<PingState>>();

function pingOnce(url: string): Promise<PingState> {
  let p = inflight.get(url);
  if (!p) {
    const t0 = performance.now();
    const timeout = new Promise<never>((_, rej) =>
      setTimeout(() => rej(new Error("timeout")), 7000)
    );
    // opaque no-cors fetch: resolves if the host is reachable (any response),
    // rejects on network failure. Good enough for a truthful status dot.
    p = Promise.race([fetch(url, { mode: "no-cors", cache: "no-store" }), timeout])
      .then(
        (): PingState => ({
          status: "live",
          ms: Math.max(1, Math.round(performance.now() - t0)),
        })
      )
      .catch((): PingState => ({ status: "down", ms: null }));
    inflight.set(url, p);
  }
  return p;
}

export function useLivePing(url: string): PingState {
  const [state, setState] = useState<PingState>({ status: "pinging", ms: null });

  useEffect(() => {
    let alive = true;
    pingOnce(url).then((s) => {
      if (alive) setState(s);
    });
    return () => {
      alive = false;
    };
  }, [url]);

  return state;
}
