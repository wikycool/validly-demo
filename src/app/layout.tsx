import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "validly | Which country should your Shopify brand enter next?",
  description:
    "Validly connects to your Shopify store, reads 24 months of demand by country, and returns GO / NOT YET / NO-GO for each market, calibrated against brands that already made that exact move.",
  keywords: [
    "Shopify expansion",
    "international expansion",
    "market validation",
    "pre-order validation",
    "DTC expansion",
    "validly",
  ],
  authors: [{ name: "validly" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "validly | Which country should your Shopify brand enter next?",
    description:
      "Reads 24 months of demand by country. Returns GO / NOT YET / NO-GO per market, against an anonymous peer set.",
    url: "https://chat.z.ai",
    siteName: "validly",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "validly | Which country should your Shopify brand enter next?",
    description:
      "A demand audit for Shopify brands. GO / NOT YET / NO-GO.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <SonnerToaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  );
}
