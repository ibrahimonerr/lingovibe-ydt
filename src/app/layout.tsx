import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import SplashScreenWrapper from "@/components/SplashScreenWrapper";
import NetworkStatusTracker from "@/components/features/NetworkStatusTracker";
import Prefetcher from "@/components/features/Prefetcher";
import ThemeHandler from "@/components/layout/ThemeHandler";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0f172a",
};

export const metadata: Metadata = {
  title: "YDTHub",
  description:
    "AI-Powered YDT Learning Center: Custom texts, daily news, and grammar practice — designed to help you learn faster and stay consistent.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "YDTHub",
  },
  icons: {
    apple: "/apple-touch-icon.png",
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-dvh font-sans">
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-ink-600/20 blur-3xl" />
          <div className="absolute -bottom-40 right-[-10%] h-[520px] w-[520px] rounded-full bg-fuchsia-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(91,124,255,0.08),transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06),transparent_22%,transparent_78%,rgba(255,255,255,0.04))]" />
        </div>
        <SplashScreenWrapper>
          <ThemeHandler />
          <NetworkStatusTracker />
          <Prefetcher />
          {children}
        </SplashScreenWrapper>
      </body>
    </html>
  );
}

