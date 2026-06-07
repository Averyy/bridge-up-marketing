import { getTranslations, setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import AboutContent from "./AboutContent";
import { localeAlternates } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: localeAlternates(locale, "/about"),
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AboutContent />;
}
