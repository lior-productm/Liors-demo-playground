import React from "react"
import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";

import "./globals.css";
import { I18nProvider } from "@/src/components/i18n/I18nProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-amiio-serif",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

const SITE_TITLE = "Amiio product demo";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description:
    "Amiio product demo — portfolio analytics, insights, reporting, and an AI assistant for real estate teams.",
  openGraph: {
    title: SITE_TITLE,
  },
  twitter: {
    title: SITE_TITLE,
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
