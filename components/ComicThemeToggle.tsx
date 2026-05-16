import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "motion/react";

export function ComicThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <motion.button
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-6 right-6 z-[100] px-4 py-2 rounded-xl flex items-center justify-center font-comic tracking-wide transition-transform hover:scale-110 active:scale-95"
      initial={{ opacity: 0, y: -20 }}
      style={{
        background: isDark
          ? "var(--color-comic-red)"
          : "var(--color-comic-yellow)",
        border: "3px solid var(--color-comic-ink)",
        boxShadow: "4px 4px 0px var(--color-comic-ink)",
        color: isDark ? "#ffffff" : "var(--color-comic-ink)",
        fontSize: "1.1rem",
      }}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? "HERO MODE" : "VILLAIN MODE"}
    </motion.button>
  );
}
