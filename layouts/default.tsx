import { Head } from "./head";

import VoiceWidget from "@/components/voice/VoiceWidget";
import { ComicThemeToggle } from "@/components/ComicThemeToggle";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col min-h-screen">
      <Head />
      <main className="flex-grow relative z-10">{children}</main>
      <ComicThemeToggle />
      <VoiceWidget />
    </div>
  );
}
