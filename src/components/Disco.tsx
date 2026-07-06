"use client";

import { useEffect } from "react";

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

/** Konami listener + console easter egg. Purely vital infrastructure. */
export default function Disco() {
  useEffect(() => {
    // rolling buffer: matches whenever the last 10 keys are the code,
    // regardless of repeated-prefix noise (Up Up Up Down … still works)
    let keys: string[] = [];
    const onKey = (e: KeyboardEvent) => {
      keys = [...keys, e.key].slice(-KONAMI.length);
      if (keys.length === KONAMI.length && keys.every((k, i) => k === KONAMI[i])) {
        keys = [];
        document.documentElement.classList.toggle("disco");
      }
    };
    addEventListener("keydown", onKey);

    console.log(
      "%c👀 the eyes saw you open devtools.",
      "font-size:16px; color:#c8ff2e; font-family:monospace;"
    );
    console.log(
      "%csource: https://github.com/anukulpandey/notcool.in — PRs of uncool ideas welcome.",
      "color:#9698a6; font-family:monospace;"
    );

    return () => removeEventListener("keydown", onKey);
  }, []);

  return null;
}
