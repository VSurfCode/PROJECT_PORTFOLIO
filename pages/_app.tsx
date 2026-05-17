import type { AppProps } from "next/app";

import { HeroUIProvider } from "@heroui/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { motion } from "motion/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { fontSans, fontMono } from "@/config/fonts";
import "@/styles/globals.css";

function ComicLoader() {
  const [isExiting, setIsExiting] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const exitTimer = window.setTimeout(() => {
      setIsExiting(true);
    }, 2000);
    const hideTimer = window.setTimeout(() => {
      setShowLoader(false);
    }, 2650);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  return (
    <>
      {showLoader && (
        <motion.div
          animate={{ opacity: isExiting ? 0 : 1 }}
          className="comic-loader-screen"
          initial={{ opacity: 1 }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
        >
          <motion.img
            alt="Alexander Marston comic logo"
            animate={
              isExiting
                ? {
                    opacity: [1, 1, 0],
                    rotate: [0, 360],
                    scale: [1, 1.18, 0.15],
                  }
                : { scale: [1, 1.08, 1] }
            }
            className="comic-loader-logo"
            src="/am_comic_logo.svg"
            transition={
              isExiting
                ? { duration: 0.62, ease: "easeInOut" }
                : { duration: 0.55, ease: "easeInOut", repeat: Infinity }
            }
          />
        </motion.div>
      )}
    </>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const exitTimer = window.setTimeout(() => {
      setIsLoaded(true);
    }, 2650);

    return () => window.clearTimeout(exitTimer);
  }, []);

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider attribute="class" defaultTheme="light">
        {!isLoaded && <ComicLoader />}
        <motion.div
          animate={{ opacity: isLoaded ? 1 : 0 }}
          className="comic-page-reveal"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <Component {...pageProps} />
        </motion.div>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}

export const fonts = {
  sans: fontSans.style.fontFamily,
  mono: fontMono.style.fontFamily,
};
