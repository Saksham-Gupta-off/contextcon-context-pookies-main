"use client";

import { useMemo } from "react";

type OceanBubblesProps = {
  count?: number;
  className?: string;
  /**
   * Optional deterministic seed so the SSR / client renders match. Use the same
   * seed across renders that need to look identical.
   */
  seed?: number;
};

// Tiny seeded RNG so the layout is stable between server & client renders
// (random bubble positions otherwise mismatch and emit hydration warnings).
function mulberry32(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function OceanBubbles({ count = 18, className = "", seed = 7 }: OceanBubblesProps) {
  const bubbles = useMemo(() => {
    const rand = mulberry32(seed * (count + 1));
    return Array.from({ length: count }).map((_, i) => {
      const size = 10 + rand() * 38;
      return {
        id: i,
        size,
        left: rand() * 100,
        delay: rand() * 12,
        duration: 10 + rand() * 14,
      };
    });
  }, [count, seed]);

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      data-testid="ocean-bubbles"
      aria-hidden
    >
      {bubbles.map((b) => (
        <span
          key={b.id}
          className="bubble"
          style={{
            width: b.size,
            height: b.size,
            left: `${b.left}%`,
            bottom: `-${b.size + 10}px`,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
