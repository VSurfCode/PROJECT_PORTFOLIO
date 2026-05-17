import type { PersonalInfo } from "@/types/portfolio";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";

import { supabase } from "@/lib/supabase/client";

/* ------------------------------------------------------------------ */
/*  Hero Panel — individual comic panel with image + optional overlay */
/* ------------------------------------------------------------------ */
interface HeroPanelProps {
  imageSrc: string;
  alt: string;
  index: number;
  children?: React.ReactNode;
  className?: string;
  imageContainerClassName?: string;
  imageClassName?: string;
  imageAnimate?: any;
  overlayClassName?: string;
  imageContainerBounds?: { left?: string; right?: string; top?: string; bottom?: string };
  clipPath?: string;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
}

function HeroPanel({
  imageSrc,
  alt,
  index,
  children,
  className = "",
  imageContainerClassName = "",
  imageClassName = "object-cover object-top md:object-center",
  overlayClassName = "bg-black/40",
  imageAnimate,
  imageContainerBounds,
  clipPath,
  onHoverStart,
  onHoverEnd,
}: HeroPanelProps) {
  return (
    <motion.div
      className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={clipPath ? { clipPath, opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
    >
      <motion.div 
        className={`absolute inset-0 ${imageContainerClassName}`}
        animate={imageContainerBounds || {}}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.img
          alt={alt}
          className={`absolute inset-0 w-full h-full ${imageClassName}`}
          src={imageSrc}
          animate={imageAnimate || {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </motion.div>
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0.15)_1px,transparent_1px)] bg-[length:4px_4px] z-[1]" />
      <div className={`absolute inset-0 ${overlayClassName} z-[2] transition-colors duration-300 hover:bg-transparent`} />
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Hero Section                                                  */
/* ------------------------------------------------------------------ */
export default function HeroSection() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  const [hoveredPanel, setHoveredPanel] = useState<number | null>(null);

  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchPersonalInfo();
  }, []);

  const fetchPersonalInfo = async () => {
    try {
      const { data, error } = await supabase
        .from("personal_info")
        .select("*")
        .limit(1)
        .single();

      if (!error && data) {
        setPersonalInfo(data);
      }
    } catch (error) {
      console.error("Error fetching personal info:", error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);

    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading || !mounted) {
    return (
      <section className="flex flex-col items-center justify-center min-h-screen">
        <div
          className="font-comic text-2xl tracking-wider animate-pulse"
          style={{ color: "var(--color-comic-yellow)" }}
        >
          LOADING...
        </div>
      </section>
    );
  }

  if (!personalInfo) {
    return null;
  }

  const isDark = theme === "dark";
  const lineColor = isDark ? "#7a0000" : "var(--color-comic-ink)";

  // Image sequence. Center image changes to me3.png in dark mode.
  const panelImages = [
    isDark ? "/vilianshelby.png" : "/shelbyville tn.jpg",
    isDark ? "/vilianprison.png" : "/prison.png",
    isDark ? (hoveredPanel === 2 ? "/vilianpowerup.png" : "/me3.png") : (hoveredPanel === 2 ? "/powerup.png" : "/me.png"),
    isDark ? "/vilianpersevere.png" : "/persevere.png",
    isDark ? "/viliandev.png" : "/dev.png",
  ];

  /* 
    Calculate the 5 X-anchors for the desktop M-shape.
    X0 = Bottom-left of Panel 1 / Panel 2
    X1 = Top-left peak
    X2 = Bottom-center valley
    X3 = Top-right peak
    X4 = Bottom-right of Panel 4 / Panel 5
  */
  const getAnchors = (h: number | null) => {
    if (h === 0) return [30, 45, 60, 80, 90]; // Expand Panel 1
    if (h === 1) return [5, 10, 65, 80, 90];  // Expand Panel 2
    if (h === 2) return [5, 10, 50, 90, 95];  // Expand Panel 3
    if (h === 3) return [10, 20, 35, 90, 95]; // Expand Panel 4
    if (h === 4) return [10, 20, 40, 55, 70]; // Expand Panel 5
    return [15, 25, 50, 75, 85];              // Default
  };

  const anchors = getAnchors(hoveredPanel);

  // Derive clipPaths for desktop based on anchors
  const desktopClipPaths = [
    `polygon(0% 0%, ${anchors[1]}% 0%, ${anchors[0]}% 100%, 0% 100%)`,
    `polygon(${anchors[0]}% 100%, ${anchors[1]}% 0%, ${anchors[2]}% 100%)`,
    `polygon(${anchors[1]}% 0%, ${anchors[3]}% 0%, ${anchors[2]}% 100%)`,
    `polygon(${anchors[2]}% 100%, ${anchors[3]}% 0%, ${anchors[4]}% 100%)`,
    `polygon(${anchors[3]}% 0%, 100% 0%, 100% 100%, ${anchors[4]}% 100%)`,
  ];

  const getDesktopBounds = (anchors: number[]) => [
    { left: "0%", right: `${100 - Math.max(anchors[1], anchors[0])}%`, top: "0%", bottom: "0%" },
    { left: `${Math.min(anchors[0], anchors[1])}%`, right: `${100 - Math.max(anchors[1], anchors[2])}%`, top: "0%", bottom: "0%" },
    { left: `${Math.min(anchors[1], anchors[2])}%`, right: `${100 - Math.max(anchors[3], anchors[2])}%`, top: "0%", bottom: "0%" },
    { left: `${Math.min(anchors[2], anchors[3])}%`, right: `${100 - Math.max(anchors[3], anchors[4])}%`, top: "0%", bottom: "0%" },
    { left: `${Math.min(anchors[3], anchors[4])}%`, right: "0%", top: "0%", bottom: "0%" },
  ];

  const desktopBounds = getDesktopBounds(anchors);
  const mobileBounds = { bottom: "0%", left: "0%", right: "0%", top: "0%" };

  // Derive text positioning based on current hovered panel width to keep things centered
  const getCenterObj = (panelIndex: number) => {
    if (!isDesktop) return {};
    
    // Default positioning if we just want it perfectly centered in the panel's bounding box
    // But since the bounding box changes size dynamically, 
    // left-50% -translate-x-1/2 on the bounding box will work beautifully.
    return {};
  };

  return (
    <section className="relative w-full h-[150vh] md:h-[90vh] lg:h-screen overflow-hidden border-b-8 transition-colors duration-500" style={{ backgroundColor: "var(--color-comic-bg)", borderColor: "var(--color-comic-bg)" }} id="hero">
      
      {/* Mobile-only static CSS polygons (zigzag) */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 767px) {
          .hero-panel-1 { clip-path: polygon(0 0, 100% 0, 100% 15%, 0 20%); }
          .hero-panel-2 { clip-path: polygon(0 20%, 100% 15%, 100% 45%, 0 40%); }
          .hero-panel-3 { clip-path: polygon(0 40%, 100% 45%, 100% 55%, 0 60%); }
          .hero-panel-4 { clip-path: polygon(0 60%, 100% 55%, 100% 85%, 0 80%); }
          .hero-panel-5 { clip-path: polygon(0 80%, 100% 85%, 100% 100%, 0 100%); }
        }
      `}} />

      {/* === PANEL 1 === */}
      <HeroPanel 
        alt="Shelbyville, Tennessee origin story panel" 
        className="hero-panel-1 bg-black" 
        imageContainerClassName="md:bottom-auto md:right-auto md:left-auto md:top-auto" 
        imageClassName="object-cover object-center"
        overlayClassName={isDark ? "bg-black/60" : "bg-[var(--color-comic-purple)]/40"}
        imageContainerBounds={isDesktop ? desktopBounds[0] : mobileBounds}
        imageSrc={panelImages[0]} 
        index={0}
        clipPath={isDesktop ? desktopClipPaths[0] : undefined}
        onHoverStart={() => isDesktop && setHoveredPanel(0)}
        onHoverEnd={() => isDesktop && setHoveredPanel(null)}
      >
        <motion.div 
          className="absolute z-30 md:z-10 flex flex-col items-center justify-center text-center w-[78%] md:w-auto md:min-w-[200px] left-[50%] md:left-[12.5%] top-[10%] md:top-[50%] -translate-x-1/2 -translate-y-1/2"
          animate={{ opacity: isDesktop ? (hoveredPanel === 0 ? 1 : 0) : 1, y: isDesktop ? (hoveredPanel === 0 ? 0 : 20) : 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="comic-card max-w-[13rem] md:max-w-xs border-4 shadow-[6px_6px_0px_var(--color-comic-ink)] transform -rotate-2" style={{ background: "white", borderColor: "var(--color-comic-ink)" }}>
            <h3 className="comic-heading text-2xl" style={{ color: "var(--color-comic-purple)", textShadow: "2px 2px 0px var(--color-comic-ink)" }}>
              {isDark ? "BORN IN SHADOWS" : "SHELBYVILLE"}
            </h3>
            <p className="font-comic-body font-bold text-sm md:text-base mt-2 text-black">
              {isDark 
                ? "A small town tried to define me. Shelbyville gave me a beginning, but it could never contain what was growing inside me." 
                : "Every story starts somewhere. Mine started in Shelbyville, Tennessee. Small town, big pressure, bigger dreams."}
            </p>
          </div>
        </motion.div>
      </HeroPanel>

      {/* === PANEL 2 === */}
      <HeroPanel 
        alt="Locked away hard times story panel" 
        className="hero-panel-2 bg-white" 
        imageContainerClassName="md:bottom-auto md:right-auto md:left-auto md:top-auto" 
        imageClassName="object-cover object-center"
        overlayClassName={isDark ? "bg-black/60" : "bg-[var(--color-comic-green)]/40"}
        imageAnimate={{ objectPosition: isDesktop && hoveredPanel === 1 ? "10% center" : "50% center" }}
        imageContainerBounds={isDesktop ? desktopBounds[1] : mobileBounds}
        imageSrc={panelImages[1]} 
        index={1}
        clipPath={isDesktop ? desktopClipPaths[1] : undefined}
        onHoverStart={() => isDesktop && setHoveredPanel(1)}
        onHoverEnd={() => isDesktop && setHoveredPanel(null)}
      >
        <motion.div 
          className="absolute z-30 md:z-10 flex flex-col items-center justify-center text-center w-[78%] md:w-auto left-[50%] md:left-[30%] top-[31%] md:top-[66%] -translate-x-1/2 -translate-y-1/2"
          animate={{ opacity: isDesktop ? (hoveredPanel === 1 ? 1 : 0) : 1, y: isDesktop ? (hoveredPanel === 1 ? 0 : 20) : 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="thought-bubble transform rotate-2 max-w-[13rem] md:max-w-[250px] !p-3 md:!p-4">
            <h3 className="comic-heading text-2xl" style={{ color: "var(--color-comic-red)", textShadow: "2px 2px 0px var(--color-comic-ink)" }}>
              {isDark ? "THE CAGE" : "HARD TIMES"}
            </h3>
            <p className="font-comic-body text-sm md:text-base font-bold mt-1 text-black">
              {isDark 
                ? "The world thought iron bars could break me. Instead, the silence forged me into something colder, sharper, and far more dangerous." 
                : "Life hit hard. The walls closed in. But even when everything looked over, something in me refused to stay buried."}
            </p>
          </div>
        </motion.div>
      </HeroPanel>

      {/* === PANEL 3 === */}
      <HeroPanel 
        alt="Hero Panel 3" 
        className="hero-panel-3" 
        imageContainerClassName="md:bottom-auto md:right-auto md:left-auto md:top-auto" 
        imageClassName={
          isDark
            ? "object-cover object-top md:object-center contrast-[1.28] saturate-[0.72] brightness-[0.78]"
            : "object-cover object-top md:object-center"
        }
        overlayClassName={isDark ? "bg-black/35" : "bg-[var(--color-comic-red)]/40"}
        imageContainerBounds={isDesktop ? desktopBounds[2] : mobileBounds}
        imageSrc={panelImages[2]} 
        index={2}
        clipPath={isDesktop ? desktopClipPaths[2] : undefined}
        onHoverStart={() => isDesktop && setHoveredPanel(2)}
        onHoverEnd={() => isDesktop && setHoveredPanel(null)}
      >
        {isDark && (
          <>
            <div className="pointer-events-none absolute inset-0 z-[3] bg-[radial-gradient(circle_at_50%_54%,transparent_0%,rgba(0,0,0,0.2)_30%,rgba(0,0,0,0.82)_78%),linear-gradient(180deg,rgba(0,0,0,0.95)_0%,transparent_32%,rgba(70,0,0,0.42)_67%,rgba(0,0,0,0.95)_100%)]" />
            <div className="pointer-events-none absolute inset-x-[18%] bottom-[5%] z-[4] h-[42%] bg-[radial-gradient(ellipse_at_center,rgba(122,0,0,0.58)_0%,rgba(122,0,0,0.22)_34%,transparent_72%)] mix-blend-screen opacity-75" />
            <div className="pointer-events-none absolute inset-0 z-[5] bg-[repeating-linear-gradient(115deg,transparent_0_13px,rgba(122,0,0,0.13)_14px,transparent_16px)] opacity-80" />
          </>
        )}
        <motion.div 
          className="absolute z-30 md:z-10 flex flex-col items-center justify-center text-center w-[78%] md:w-auto left-[50%] md:left-[50%] top-[50%] md:top-[35%] -translate-x-1/2 -translate-y-1/2"
          animate={{ opacity: isDesktop ? (hoveredPanel === 2 ? 1 : 0) : 1, y: isDesktop ? (hoveredPanel === 2 ? 0 : 20) : 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="comic-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
            {personalInfo.name}
          </h1>
          <div className="mt-4">
            <span
              className="speech-bubble inline-block text-sm md:text-base lg:text-lg font-bold transition-colors duration-500"
              style={{ color: "var(--color-comic-ink)" }}
            >
              {personalInfo.title}
            </span>
          </div>
        </motion.div>
      </HeroPanel>

      {/* === PANEL 4 === */}
      <HeroPanel 
        alt="Persevere transformation story panel" 
        className="hero-panel-4 bg-black" 
        imageContainerClassName="md:bottom-auto md:right-auto md:left-auto md:top-auto" 
        imageClassName="object-cover object-center"
        overlayClassName={isDark ? "bg-black/60" : "bg-white/40"}
        imageAnimate={{ objectPosition: isDesktop && hoveredPanel === 3 ? "90% center" : "50% center" }}
        imageContainerBounds={isDesktop ? desktopBounds[3] : mobileBounds}
        imageSrc={panelImages[3]} 
        index={3}
        clipPath={isDesktop ? desktopClipPaths[3] : undefined}
        onHoverStart={() => isDesktop && setHoveredPanel(3)}
        onHoverEnd={() => isDesktop && setHoveredPanel(null)}
      >
        <motion.div 
          className="absolute z-30 md:z-10 flex flex-col items-center justify-center text-center w-[78%] md:w-auto left-[50%] md:left-[70%] top-[71%] md:top-[66%] -translate-x-1/2 -translate-y-1/2"
          animate={{ opacity: isDesktop ? (hoveredPanel === 3 ? 1 : 0) : 1, y: isDesktop ? (hoveredPanel === 3 ? 0 : 20) : 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="speech-bubble max-w-[13rem] md:max-w-[250px] transform -rotate-1 !p-3 md:!p-4">
            <h3 className="comic-heading text-2xl" style={{ color: "var(--color-comic-blue)", textShadow: "2px 2px 0px var(--color-comic-ink)" }}>
              {isDark ? "EVOLUTION" : "PERSEVERE"}
            </h3>
            <p className="font-comic-body text-sm md:text-base font-bold mt-1 text-black">
              {isDark 
                ? "Pain became discipline. Discipline became obsession. Persevere was no longer just a word. It became the law I live by." 
                : "That word became the mission. Learn. Rebuild. Push forward. Turn the lowest chapter into the launch point."}
            </p>
          </div>
        </motion.div>
      </HeroPanel>

      {/* === PANEL 5 === */}
      <HeroPanel 
        alt="Full-stack developer story panel" 
        className="hero-panel-5 bg-white" 
        imageContainerClassName="md:bottom-auto md:right-auto md:left-auto md:top-auto" 
        imageClassName="object-cover object-center"
        overlayClassName={isDark ? "bg-black/60" : "bg-[var(--color-comic-yellow)]/40"}
        imageContainerBounds={isDesktop ? desktopBounds[4] : mobileBounds}
        imageSrc={panelImages[4]} 
        index={4}
        clipPath={isDesktop ? desktopClipPaths[4] : undefined}
        onHoverStart={() => isDesktop && setHoveredPanel(4)}
        onHoverEnd={() => isDesktop && setHoveredPanel(null)}
      >
        <motion.div 
          className="absolute z-30 md:z-10 flex flex-col items-center justify-center text-center w-[78%] md:w-auto left-[50%] md:left-[85%] top-[91%] md:top-[50%] -translate-x-1/2 -translate-y-1/2"
          animate={{ opacity: isDesktop ? (hoveredPanel === 4 ? 1 : 0) : 1, y: isDesktop ? (hoveredPanel === 4 ? 0 : 20) : 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="comic-card max-w-[13rem] md:max-w-[250px] border-4 shadow-[-6px_6px_0px_var(--color-comic-ink)] transform rotate-3" style={{ background: "var(--color-comic-yellow)", borderColor: "var(--color-comic-ink)" }}>
            <h3 className="comic-heading text-2xl" style={{ color: "var(--color-comic-ink)", textShadow: "none" }}>
              {isDark ? "ASCENSION" : "FULL STACK DEV"}
            </h3>
            <p className="font-comic-body text-sm md:text-base font-bold mt-2 text-black">
              {isDark 
                ? "Now I build more than software. I build control, power, and a future shaped entirely by my own will." 
                : "Now I build. Code, create, teach, and level up daily. The villain mode is focus. The comeback is the superpower."}
            </p>
          </div>
        </motion.div>
      </HeroPanel>

      {/* === SOLID BLACK LINES (MOBILE) === */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none block md:hidden z-20 transition-colors duration-500" preserveAspectRatio="none">
        <line stroke={lineColor} strokeWidth="8" x1="0%" x2="100%" y1="20%" y2="15%" />
        <line stroke={lineColor} strokeWidth="8" x1="0%" x2="100%" y1="40%" y2="45%" />
        <line stroke={lineColor} strokeWidth="8" x1="0%" x2="100%" y1="60%" y2="55%" />
        <line stroke={lineColor} strokeWidth="8" x1="0%" x2="100%" y1="80%" y2="85%" />
      </svg>

      {/* === SOLID BLACK LINES (DESKTOP - 'M' SHAPE WITH DYNAMIC HOVER) === */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block z-20" preserveAspectRatio="none">
        <motion.line 
          animate={{ x1: `${anchors[0]}%`, x2: `${anchors[1]}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          stroke={lineColor} strokeLinecap="square" strokeWidth="12" y1="100%" y2="0%" 
          className="transition-colors duration-500"
        />
        <motion.line 
          animate={{ x1: `${anchors[1]}%`, x2: `${anchors[2]}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          stroke={lineColor} strokeLinecap="square" strokeWidth="12" y1="0%" y2="100%" 
          className="transition-colors duration-500"
        />
        <motion.line 
          animate={{ x1: `${anchors[2]}%`, x2: `${anchors[3]}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          stroke={lineColor} strokeLinecap="square" strokeWidth="12" y1="100%" y2="0%" 
          className="transition-colors duration-500"
        />
        <motion.line 
          animate={{ x1: `${anchors[3]}%`, x2: `${anchors[4]}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          stroke={lineColor} strokeLinecap="square" strokeWidth="12" y1="0%" y2="100%" 
          className="transition-colors duration-500"
        />
      </svg>
    </section>
  );
}
