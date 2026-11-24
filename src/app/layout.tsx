import type { Metadata } from "next";
import localFont from "next/font/local";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import "./globals.css";

const sohne = localFont({
  variable: "--font-sohne",
  display: "swap",
  src: [
    {
      path: "../../public/fonts/sohne/TestSohne-Buch-BF663d89cd32e6a.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/sohne/TestSohne-Kraftig-BF663d89cd37e26.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/sohne/TestSohne-Halbfett-BF663d89cd2d67b.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/sohne/TestSohne-Dreiviertelfett-BF663d89ccc5f66.otf",
      weight: "700",
      style: "normal",
    },
  ],
});

const sohneMono = localFont({
  variable: "--font-sohne-mono",
  display: "swap",
  src: [
    {
      path: "../../public/fonts/sohne/TestSohneMono-Buch-BF663d89cbcec64.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/sohne/TestSohneMono-Kraftig-BF663d89cd2bd2d.otf",
      weight: "500",
      style: "normal",
    },
  ],
});

const brandPixel = localFont({
  variable: "--font-brand-pixel",
  display: "swap",
  src: "../../public/fonts/pixel/AstheticPixel-Regular-BF6652af697059b.otf",
  weight: "400",
  style: "normal",
});

export const metadata: Metadata = {
  title: "Shivam Diwan Portfolio",
  description:
    "Full-stack engineer focused on interface craft, web applications, and backend systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sohne.variable} ${sohneMono.variable} ${brandPixel.variable}`}
    >
      <body className="bg-bg text-text font-sans antialiased">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
