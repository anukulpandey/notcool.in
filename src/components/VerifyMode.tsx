"use client";

import { MotionGlobalConfig } from "framer-motion";

// test/verification hook: ?noanim=1 makes every animation jump to its
// final state instantly (used by headless screenshot checks)
if (typeof window !== "undefined" && new URLSearchParams(window.location.search).has("noanim")) {
  MotionGlobalConfig.skipAnimations = true;
}

export default function VerifyMode() {
  return null;
}
