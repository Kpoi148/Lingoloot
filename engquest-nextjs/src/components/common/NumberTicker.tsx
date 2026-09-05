"use client";
// High-performance Spring/Expo Count-Up Ticker with Framer Motion and zero layout clipping.

import { useEffect, useRef, useState } from "react";
import { useInView, animate } from "framer-motion";

type NumberTickerProps = {
  value: number;
  padZero?: number;
  delay?: number;
  className?: string;
  duration?: number;
};

export default function NumberTicker({
  value,
  padZero = 0,
  delay = 0,
  className = "",
  duration = 1.1,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -30px 0px" });
  // Initial state is the target value for perfect SSR, SEO, and zero glitching
  const [displayValue, setDisplayValue] = useState(value);
  const hasAnimated = useRef(false);

  useEffect(() => {
    // Respect reduced motion
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mediaQuery.matches) {
        setDisplayValue(value);
        return;
      }
    }

    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true;
      setDisplayValue(0);

      const controls = animate(0, value, {
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // easeOutExpo mechanical deceleration
        onUpdate: (latest) => {
          setDisplayValue(Math.round(latest));
        },
      });

      return () => controls.stop();
    }
  }, [isInView, value, delay, duration]);

  const formatted =
    padZero > 0
      ? String(displayValue).padStart(padZero, "0")
      : String(displayValue);

  return (
    <span
      ref={ref}
      className={`inline-block tabular-nums ${className}`}
      aria-label={String(value)}
    >
      {formatted}
    </span>
  );
}
