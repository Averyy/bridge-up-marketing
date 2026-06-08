import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, Locale } from "@/i18n/routing";
import { localeAlternates, jsonLdHtml, absUrl } from "@/lib/seo";
import { Header, Footer } from "@/components/layout";
import { REGION_PAGE_ORDER, pageBridgeIdsForRegion } from "@/lib/bridgeSlugs";
import { fetchBridgeStatics } from "@/lib/bridgeStats";
import { regionBridgeCards } from "@/lib/bridgeCards";
import { getRegionDisplay, REGION_META } from "@/content/regions";
import { BridgeCard } from "@/components/bridges/BridgeCard";
import { ExternalIcon } from "@/components/bridges/ExternalIcon";

export const revalidate = 86400;

type Props = { params: Promise<{ locale: string; region: string }> };

export function generateStaticParams() {
  const params: { locale: string; region: string }[] = [];
  for (const region of REGION_PAGE_ORDER) {
    for (const locale of routing.locales) params.push({ locale, region });
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, region } = await params;
  const display = getRegionDisplay(region, locale as Locale);
  if (!display) return {};
  const t = await getTranslations({ locale, namespace: "regionHub" });
  const count = pageBridgeIdsForRegion(region).length;
  return {
    title: t("titleTemplate", { region: display.name }),
    description: t("metaDescription", { region: display.name, waterway: display.waterway, count }),
    alternates: localeAlternates(locale, `/bridges/${region}`),
  };
}

export default async function RegionPage({ params }: Props) {
  const { locale, region } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const display = getRegionDisplay(region, loc);
  if (!display) notFound();

  const statics = await fetchBridgeStatics();
  const t = await getTranslations({ locale, namespace: "regionHub" });
  const tl = await getTranslations({ locale, namespace: "bridgeList" });
  const tb = await getTranslations({ locale, namespace: "bridgePages" });
  const regionMeta = REGION_META[region];

  const bridges = regionBridgeCards(region, statics, loc, (a) => tl("cardStat", { avg: a }));
  if (bridges.length === 0) notFound();

  const h1 = t("h1Template", { region: display.name });
  const intro = display.description;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${absUrl(loc, `/bridges/${region}`)}#page`,
        name: h1,
        url: absUrl(loc, `/bridges/${region}`),
        mainEntity: {
          "@type": "ItemList",
          itemListElement: bridges.map((b, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: b.name,
            url: absUrl(loc, b.href),
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: tb("breadcrumbHome"), item: absUrl(loc, "/") },
          { "@type": "ListItem", position: 2, name: tb("breadcrumbBridges"), item: absUrl(loc, "/bridges/list") },
          { "@type": "ListItem", position: 3, name: display.name, item: absUrl(loc, `/bridges/${region}`) },
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
              <li>
                <Link href="/bridges/list" className="hover:text-white/80">
                  {tb("breadcrumbBridges")}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-white/80">
                {display.name}
              </li>
            </ol>
          </nav>

          <h1 className="text-3xl font-bold sm:text-4xl">{h1}</h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-white/70">{intro}</p>

          <h2 className="sr-only">{tb("breadcrumbBridges")}</h2>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {bridges.map((b) => (
              <BridgeCard
                key={b.apiId}
                apiId={b.apiId}
                href={b.href}
                name={b.name}
                statText={b.statText}
              />
            ))}
          </div>

          <section className="mt-10 flex flex-wrap gap-3">
            <Link
              href={`/bridges?region=${region}`}
              className="rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-[var(--primary)]/25 transition-colors hover:bg-[var(--primary-dark)]"
            >
              {tb("viewOnMap")}
            </Link>
            <Link
              href="/bridges/list"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white/80 transition-colors hover:border-white/30 hover:bg-white/5"
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="h-3.5 w-3.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              {tb("allBridges")}
            </Link>
            {regionMeta && (
              <a
                href={regionMeta.seawayUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full border border-[var(--primary)]/30 px-5 py-2.5 text-sm font-medium text-[var(--primary-light)] transition-colors hover:border-[var(--primary)]/60 hover:bg-[var(--primary)]/10"
              >
                {tb("officialStatus")}
                <ExternalIcon />
              </a>
            )}
          </section>
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
