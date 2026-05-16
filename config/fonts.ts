import {
  Fira_Code as FontMono,
  Inter as FontSans,
  Bangers,
  Comic_Neue,
} from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const fontComic = Bangers({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-comic",
});

export const fontComicBody = Comic_Neue({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-comic-body",
});
