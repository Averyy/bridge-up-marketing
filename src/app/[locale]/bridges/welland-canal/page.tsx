import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, Locale } from "@/i18n/routing";
import { localeAlternates, jsonLdHtml, absUrl } from "@/lib/seo";
import { Header, Footer } from "@/components/layout";
import { fetchBridgeStatics } from "@/lib/bridgeStats";
import { regionBridgeCards } from "@/lib/bridgeCards";
import { getRegionDisplay } from "@/content/regions";
import { BridgeCard } from "@/components/bridges/BridgeCard";

// Daily ISR; live status rides on top via the BridgeCard client islands.
export const revalidate = 86400;

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "canalHub" });
  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: localeAlternates(locale, "/bridges/welland-canal"),
  };
}

export default async function WellandCanalPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const statics = await fetchBridgeStatics();
  const t = await getTranslations({ locale, namespace: "canalHub" });
  const tl = await getTranslations({ locale, namespace: "bridgeList" });
  const tb = await getTranslations({ locale, namespace: "bridgePages" });

  // The 8 canal road bridges in canal order: St. Catharines (Bridge 1 down to 11) then
  // Port Colborne (19 to 21) — north (Lake Ontario) to south (Lake Erie).
  const cardStat = (a: number) => tl("cardStat", { avg: a });
  const bridges = [
    ...regionBridgeCards("st-catharines", statics, loc, cardStat),
    ...regionBridgeCards("port-colborne", statics, loc, cardStat),
  ];
  if (bridges.length === 0) notFound();

  const h1 = t("h1");
  const intro = t("intro");
  const url = absUrl(loc, "/bridges/welland-canal");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#page`,
        name: h1,
        url,
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
          { "@type": "ListItem", position: 3, name: h1, item: url },
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
                {h1}
              </li>
            </ol>
          </nav>

          <h1 className="text-3xl font-bold sm:text-4xl">{h1}</h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-white/70">{intro}</p>

          <h2 className="sr-only">{tb("breadcrumbBridges")}</h2>
          <p className="mt-8 text-xs uppercase tracking-wide text-white/40">{t("orderNote")}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
              href="/bridges"
              className="rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-[var(--primary)]/25 transition-colors hover:bg-[var(--primary-dark)]"
            >
              {tb("viewOnMap")}
            </Link>
            <Link
              href="/bridges/st-catharines"
              className="inline-flex items-center rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white/80 transition-colors hover:border-white/30 hover:bg-white/5"
            >
              {getRegionDisplay("st-catharines", loc)?.name ?? "St. Catharines"}
            </Link>
            <Link
              href="/bridges/port-colborne"
              className="inline-flex items-center rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white/80 transition-colors hover:border-white/30 hover:bg-white/5"
            >
              {getRegionDisplay("port-colborne", loc)?.name ?? "Port Colborne"}
            </Link>
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
