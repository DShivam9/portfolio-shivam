import type { Metadata } from "next";
import "./globals.css";
import React from "react";

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
      <body className="relative antialiased bg-bg-base text-text-primary">
        {children}
      </body>
    </html>
  );
}
