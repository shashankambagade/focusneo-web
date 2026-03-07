import "./globals.css";
import { Instrument_Sans, Tinos } from "next/font/google";
import { DEFAULT_LANG } from "@/config";
import { headers } from "next/headers";
import NextTopLoader from "nextjs-toploader";
import LangSyncer from "@/components/LangSyncer";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument-sans",
  style: ["normal", "italic"],
  display: "swap",
});

const tinos = Tinos({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-tinos",
  style: ["normal", "italic"],
  display: "swap",
});

export default async function RootLayout({ children }) {
  // Read lang set by middleware (src/middleware.js) so <html lang> is correct
  // for both EN and DA without nesting a second <html> in [lang]/layout.js.
  const h = await headers();
  const lang = h.get("x-lang") || DEFAULT_LANG;

  return (
    <html lang={lang} className={`${instrumentSans.variable} ${tinos.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <NextTopLoader
          color="#00fec3"
          height={3}
          showSpinner={false}
          shadow="0 0 10px #00fec3,0 0 5px #00fec3"
        />
        <LangSyncer />
        {children}
      </body>
    </html>
  );
}
