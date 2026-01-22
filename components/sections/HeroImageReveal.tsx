import { useMemo } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import type { RefObject } from "react";

type HeroImageRevealProps = {
  targetRef: RefObject<HTMLElement>;
  fromSrc: string;
  toSrc: string;
};

export default function HeroImageReveal({
  targetRef,
  fromSrc,
  toSrc,
}: HeroImageRevealProps) {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    // 0 when section top hits bottom of viewport, 1 when section bottom hits top
    offset: ["start end", "end start"],
  });

  // Keep the reveal mostly within the hero visibility window.
  const reveal = useTransform(scrollYProgress, [0.15, 0.85], [0, 1], {
    clamp: true,
  });

  // Clip path: starts at 0% (fully hidden on right), reveals to 100% (fully visible)
  // This means: inset(0 100% 0 0) = all hidden, inset(0 0% 0 0) = all visible
  const clipPath = useTransform(reveal, (v) => {
    const pct = Math.max(0, Math.min(100, v * 100));
    return `inset(0 ${100 - pct}% 0 0 round 18px)`;
  });

  const lineLeft = useTransform(reveal, (v) => `${v * 100}%`);

  const scanGlow = useMemo(
    () => ({
      background:
        "linear-gradient(to bottom, rgba(0,255,65,0.0), rgba(0,255,65,0.95), rgba(0,255,65,0.0))",
      boxShadow:
        "0 0 18px rgba(0,255,65,0.65), 0 0 40px rgba(0,255,65,0.35)",
    }),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
      <div
        className="relative"
        style={{
          width: "min(560px, 78vw)",
          aspectRatio: "3 / 4",
          filter: "drop-shadow(0 0 18px rgba(0,255,65,0.18))",
          opacity: 0.55,
        }}
      >
        {/* Glass frame */}
        <div
          className="absolute inset-0 rounded-[18px]"
          style={{
            border: "1px solid rgba(0,255,65,0.25)",
            background: "rgba(0,0,0,0.10)",
            backdropFilter: "blur(2px)",
          }}
        />

        {/* Base image (non-neon) - always visible */}
        <div className="absolute inset-0 overflow-hidden rounded-[18px]">
          <Image
            src={fromSrc}
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 78vw, 560px"
            style={{ 
              objectFit: "cover",
              objectPosition: "center center"
            }}
          />
        </div>

        {/* Reveal image (neon) - revealed as you scroll */}
        <motion.div
          className="absolute inset-0 overflow-hidden rounded-[18px]"
          style={{ clipPath }}
        >
          <Image
            src={toSrc}
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 78vw, 560px"
            style={{ 
              objectFit: "cover",
              objectPosition: "center center"
            }}
          />
        </motion.div>

        {/* Scan line */}
        <motion.div
          className="absolute top-0 bottom-0"
          style={{
            left: lineLeft,
            width: "3px",
            transform: "translateX(-1.5px)",
            borderRadius: "999px",
            ...scanGlow,
          }}
        />

        {/* Subtle vignette to blend into hero */}
        <div
          className="absolute inset-0 rounded-[18px]"
          style={{
            background:
              "radial-gradient(circle at center, rgba(0,0,0,0.0) 40%, rgba(0,0,0,0.55) 100%)",
          }}
        />
      </div>
    </div>
  );
}

