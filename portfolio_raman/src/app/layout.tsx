import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { personal } from "@/lib/data";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import Loader from "@/components/Loader";
import NeuralBackground from "@/components/NeuralBackground";
import CommandPalette from "@/components/CommandPalette";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://ramanjotsingh.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${personal.name} — ${personal.role}`,
  description: personal.tagline,
  keywords: [
    "Ramanjot Singh",
    "Software Engineer",
    "Gen AI Engineer",
    "RAG",
    "LLM Engineer",
    "Machine Learning",
    "Portfolio",
  ],
  authors: [{ name: personal.name }],
  openGraph: {
    title: `${personal.name} — ${personal.role}`,
    description: personal.tagline,
    siteName: personal.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${personal.name} — ${personal.role}`,
    description: personal.tagline,
  },
  icons: {
    icon: "/raman.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-accent">
        <NeuralBackground />
        <Loader />
        <CustomCursor />
        <SmoothScroll>
          <CommandPalette />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
