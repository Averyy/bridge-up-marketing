import { getTranslations, setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { localeAlternates, jsonLdHtml } from "@/lib/seo";
import PricingContent from "./PricingContent";
import { PRICING_FAQ_IDS } from "./faq";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pricing" });

  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: localeAlternates(locale, "/pricing"),
  };
}

export default async function PricingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "pricing" });

  // FAQPage structured data, generated from the same translations and the same
  // entry list (PRICING_FAQ_IDS) the rendered FAQ uses, so the two can't drift.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PRICING_FAQ_IDS.map((i) => ({
      "@type": "Question",
      name: t(`faq.q${i}`),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(`faq.a${i}`),
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(faqJsonLd) }}
      />
      <PricingContent />
    </>
  );
}
