import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, Locale } from "@/i18n/routing";
import { localeAlternates, jsonLdHtml, absUrl } from "@/lib/seo";
import { Header, Footer } from "@/components/layout";
import { REGION_PAGE_ORDER } from "@/lib/bridgeSlugs";
import { fetchBridgeStatics } from "@/lib/bridgeStats";
import { regionBridgeCards } from "@/lib/bridgeCards";
import { getRegionDisplay } from "@/content/regions";
import { BridgeCard } from "@/components/bridges/BridgeCard";

export const revalidate = 86400;

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "bridgeList" });
  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: localeAlternates(locale, "/bridges/list"),
  };
}

export default async function BridgeListPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const statics = await fetchBridgeStatics();
  const t = await getTranslations({ locale, namespace: "bridgeList" });
  const tb = await getTranslations({ locale, namespace: "bridgePages" });

  const regions = REGION_PAGE_ORDER.map((regionId) => ({
    regionId,
    name: getRegionDisplay(regionId, loc)!.name,
    bridges: regionBridgeCards(regionId, statics, loc, (a) => t("cardStat", { avg: a })),
  })).filter((r) => r.bridges.length > 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${absUrl(loc, "/bridges/list")}#page`,
        name: t("title"),
        url: absUrl(loc, "/bridges/list"),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: tb("breadcrumbHome"), item: absUrl(loc, "/") },
          { "@type": "ListItem", position: 2, name: t("h1"), item: absUrl(loc, "/bridges/list") },
        ],
      },
    ],
  };

  return (
    <>
      <Header />
      <main className="relative min-h-screen overflow-hidden bg-[var(--dark-bg)] text-white">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-1/4 h-[500px] w-[500px] rounded-full bg-[var(--primary)]/10 blur-3xl" />
          <div className="absolute right-0 top-1/3 h-[420px] w-[420px] rounded-full bg-cyan-400/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
          <nav aria-label={tb("breadcrumbLabel")} className="mb-6 text-sm text-white/50">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-white/80">
                  {tb("breadcrumbHome")}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-white/80">
                {t("h1")}
              </li>
            </ol>
          </nav>

          <h1 className="text-3xl font-bold sm:text-4xl">{t("h1")}</h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-white/70">{t("intro")}</p>

          <div className="mt-12 space-y-12">
            {regions.map((r) => (
              <section key={r.regionId}>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{r.name}</h2>
                  <Link
                    href={`/bridges/${r.regionId}`}
                    className="inline-block py-1 text-sm text-[var(--primary)] hover:underline"
                  >
                    {t("viewRegion")} →
                  </Link>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {r.bridges.map((b) => (
                    <BridgeCard
                      key={b.apiId}
                      apiId={b.apiId}
                      href={b.href}
                      name={b.name}
                      statText={b.statText}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(jsonLd) }}
      />
    </>
  );
}
