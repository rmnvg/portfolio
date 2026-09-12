import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { personal } from "@/lib/data";
import { siteUrl } from "@/lib/site";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import Loader from "@/components/Loader";
import NeuralBackground from "@/components/NeuralBackground";
import CommandPalette from "@/components/CommandPalette";
import ScrollProgress from "@/components/ScrollProgress";
import StructuredData from "@/components/StructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const displaySerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

// Runs before paint so the correct palette is applied without a flash.
const themeBootScript = `(function(){try{var s=localStorage.getItem("theme");var h=new Date().getHours();var t=s||((h>=9&&h<18)?"light":"dark");document.documentElement.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme","dark");}})();`;

const title = `${personal.name} — ${personal.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s — ${personal.name}`,
  },
  description: personal.tagline,
  applicationName: personal.name,
  keywords: [
    "Ramanjot Singh",
    "Software Engineer",
    "Gen AI Engineer",
    "RAG",
    "LLM Engineer",
    "Vector Search",
    "Qdrant",
    "Machine Learning",
    "Portfolio",
  ],
  authors: [{ name: personal.name, url: siteUrl }],
  creator: personal.name,
  publisher: personal.name,
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description: personal.tagline,
    url: siteUrl,
    siteName: personal.name,
    locale: "en_US",
    type: "profile",
  },
  // The image itself comes from twitter-image.tsx via the file convention.
  twitter: {
    card: "summary_large_image",
    title,
    description: personal.tagline,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2ede3" },
    { media: "(prefers-color-scheme: dark)", color: "#14110d" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${displaySerif.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <StructuredData />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-accent">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <NeuralBackground />
        <Loader />
        <CustomCursor />
        <ScrollProgress />
        <SmoothScroll>
          <CommandPalette />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
