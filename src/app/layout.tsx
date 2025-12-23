import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bridgeup.app"),
  title: {
    default: "Bridge Up - Real-Time Bridge Status | St. Catharines, Welland, Montreal",
    template: "%s | Bridge Up",
  },
  description:
    "Know before you go. Real-time bridge status and predictions for St. Catharines, Welland Canal, Port Colborne, and Montreal. Never get stuck waiting at a closed bridge again.",
  keywords: [
    "bridge status",
    "St. Catharines bridge",
    "Welland Canal bridge",
    "Port Colborne bridge",
    "Montreal bridge",
    "Kahnawake bridge",
    "Highway 20 bridge",
    "Glendale Avenue bridge",
    "Queenston Street bridge",
    "St. Lawrence Seaway",
    "bridge tracker app",
    "real-time bridge updates",
    "bridge closure alerts",
    "Beauharnois bridge",
    "Victoria Bridge",
    "CP Railway Bridge",
    "iOS bridge app",
    "CarPlay bridge status",
  ],
  authors: [{ name: "Bridge Up" }],
  creator: "Bridge Up",
  publisher: "Bridge Up",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    title: "Bridge Up",
    capable: true,
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "Bridge Up - Real-Time Bridge Status",
    description:
      "Real-time bridge status for St. Catharines, Welland, Port Colborne & Montreal. Predictions tell you when bridges reopen.",
    type: "website",
    locale: "en_CA",
    siteName: "Bridge Up",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bridge Up - Real-Time Bridge Status",
    description:
      "Real-time bridge status for St. Catharines, Welland, Port Colborne & Montreal. Predictions tell you when bridges reopen.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Bridge Up",
    operatingSystem: "iOS",
    applicationCategory: "NavigationApplication",
    description:
      "Real-time bridge status and predictions for the St. Lawrence Seaway region. Know before you go.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "CAD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      ratingCount: "1",
    },
    featureList: [
      "Real-time bridge status",
      "Reopening predictions",
      "CarPlay support",
      "15 bridges monitored",
      "Interactive map",
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
