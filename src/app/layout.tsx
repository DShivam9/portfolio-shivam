import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import React from "react";
import LenisProvider from "@/providers/LenisProvider";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Shivam Diwan | Cinematic",
  description: "Digital Experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`relative antialiased bg-bg-base text-text-primary ${outfit.variable}`}>
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
