import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Archivo_Black, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/Cursor";
import Disco from "@/components/Disco";
import Preloader from "@/components/Preloader";
import SmoothScroll from "@/components/SmoothScroll";
import VerifyMode from "@/components/VerifyMode";

const archivo = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});
const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "notcool.in — a wall of uncool experiments",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://notcool.in"),
  title: "notcool.in — a wall of uncool experiments",
  description:
    "A wall of internet experiments by Anukul Pandey. Every subdomain is a separate fever dream. Certified not cool since forever.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "notcool.in",
    url: "https://notcool.in",
    title: "notcool.in — a wall of uncool experiments",
    description:
      "Every subdomain is a separate fever dream. Droppie, GateKeep, and more uncool things loading.",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "notcool.in — a wall of uncool experiments",
    description:
      "Every subdomain is a separate fever dream. Droppie, GateKeep, and more uncool things loading.",
    images: [OG_IMAGE],
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      name: "Anukul Pandey",
      url: "https://notcool.in",
      sameAs: ["https://github.com/anukulpandey"],
    },
    {
      "@type": "WebSite",
      name: "notcool.in",
      url: "https://notcool.in",
    },
  ],
};

export const viewport: Viewport = {
  themeColor: "#050508",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${grotesk.variable} ${jetbrains.variable}`}>
      <body className="grain antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        {/* JS disabled: hide the preloader and reveal SSR'd content that
            framer would otherwise leave at its initial hidden state */}
        <noscript>
          <style>{`
            .preloader { display: none !important; }
            main [style], footer [style] { opacity: 1 !important; transform: none !important; }
          `}</style>
        </noscript>
        <SmoothScroll>
          <VerifyMode />
          <Preloader />
          <Cursor />
          <Disco />
          {children}
        </SmoothScroll>
        <Analytics />
      </body>
    </html>
  );
}
