import { getTranslations, setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import BridgesContent from "./BridgesContent";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "bridges" });

  return {
    title: t("title"),
    description: t("metaDescription"),
  };
}

export default async function BridgesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <BridgesContent />;
}
