"use client";

/** Infinite outline-text marquee. Fills with acid on hover, pauses politely. */
export default function Marquee({ items }: { items: string[] }) {
  // each half must be wider than any realistic viewport or the -50% loop
  // shows a blank gap on 4K screens
  const chunk = (items.join("  ✦  ") + "  ✦  ").repeat(3);
  return (
    <div
      className="group relative z-10 overflow-hidden border-y border-line bg-ink/40 py-4"
      aria-hidden="true"
    >
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {[0, 1].map((i) => (
          <span
            key={i}
            className="text-stroke-thin whitespace-nowrap pr-2 font-display text-xl tracking-wider transition-colors duration-300 group-hover:text-acid sm:text-2xl"
          >
            {chunk}
          </span>
        ))}
      </div>
    </div>
  );
}
