import { Html, Head, Main, NextScript } from "next/document";
import clsx from "clsx";

import { fontSans, fontComic, fontComicBody } from "@/config/fonts";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body
        className={clsx(
          "min-h-screen bg-background font-comic-body antialiased",
          fontSans.variable,
          fontComic.variable,
          fontComicBody.variable,
        )}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
