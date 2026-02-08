import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "@/components/Providers";
import { routing, Locale } from "@/i18n/routing";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const messages = (await import(`../../../messages/${locale}.json`)).default;
  const t = messages.metadata;

  return {
    metadataBase: new URL("https://bridgeup.app"),
    title: {
      default: t.title.default,
      template: "%s | Bridge Up",
    },
    description: t.description,
    keywords: [
      "bridge status",
      "St. Catharines bridge",
      "Welland Canal bridge",
      "Port Colborne bridge",
      "Montréal bridge",
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
    itunes: {
      appId: "6557082394",
    },
    openGraph: {
      title: t.openGraph.title,
      description: t.openGraph.description,
      type: "website",
      locale: locale === "fr" ? "fr_CA" : locale === "es" ? "es_MX" : "en_CA",
      siteName: "Bridge Up",
      images: [
        {
          url: "/og-image.png",
          width: 2942,
          height: 1754,
          alt: "Bridge Up app showing real-time bridge status on a map",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t.openGraph.title,
      description: t.openGraph.description,
      images: ["/og-image.png"],
    },
    alternates: {
      languages: {
        en: "/",
        fr: "/fr",
        es: "/es",
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client
  const messages = await getMessages();

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
    url: "https://apps.apple.com/ca/app/bridge-up/id6557082394",
    downloadUrl: "https://apps.apple.com/ca/app/bridge-up/id6557082394",
    featureList: [
      "Real-time bridge status",
      "Reopening predictions",
      "CarPlay support",
      "15 bridges monitored",
      "Interactive map",
    ],
  };

  return (
    <html lang={locale} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
