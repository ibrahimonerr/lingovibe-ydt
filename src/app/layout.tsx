import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "YDTHub",
  description:
    "AI-Powered YDT Learning Center: Custom texts, daily news, and grammar practice — designed to help you learn faster and stay consistent."
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
        {children}
      </body>
    </html>
  );
}

