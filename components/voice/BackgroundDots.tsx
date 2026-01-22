"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

interface BackgroundDotsProps {
  isSpeaking: boolean;
}

export default function BackgroundDots({ isSpeaking }: BackgroundDotsProps) {
  const [mounted, setMounted] = useState(false);
  const dotCount = 200;
  const dotsRef = useRef<
    Array<{ x: number; y: number; delay: number; colorIndex: number }>
  >([]);

  const baseColor = "#00ff41";
  const speakingColors = [
    "#00ff41", // neon green
    "#00c8ff", // cyan
    "#9600ff", // purple
    "#ff6400", // orange
    "#ff0096", // pink
  ];

  useEffect(() => {
    setMounted(true);

    if (dotsRef.current.length === 0) {
      dotsRef.current = Array.from({ length: dotCount }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
        colorIndex: Math.floor(Math.random() * speakingColors.length),
      }));
    }
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        overflow: "hidden",
        zIndex: 0,
        position: "fixed",
      }}
    >
      {dotsRef.current.map((dot, index) => {
        const speakingColor = speakingColors[dot.colorIndex];

        return (
          <motion.div
            key={index}
            animate={
              isSpeaking
                ? {
                    backgroundColor: speakingColor,
                    opacity: 0.7,
                    scale: 1.3,
                    boxShadow: `0 0 14px ${speakingColor}CC`,
                  }
                : {
                    backgroundColor: baseColor,
                    opacity: 0.3,
                    scale: 1,
                    boxShadow: "0 0 8px rgba(0, 255, 65, 0.4)",
                  }
            }
            className="absolute rounded-full"
            initial={{
              backgroundColor: baseColor,
              opacity: 0.3,
              scale: 1,
            }}
            style={{
              left: `${dot.x}%`,
              top: `${dot.y}%`,
              width: "2px",
              height: "2px",
              backgroundColor: baseColor,
              opacity: 0.3,
            }}
            transition={{
              duration: 0.6,
              delay: dot.delay * 0.01,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}
