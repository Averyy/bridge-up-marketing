import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, Locale } from "@/i18n/routing";
import { localeAlternates, jsonLdHtml, absUrl } from "@/lib/seo";
import { Header, Footer } from "@/components/layout";
import { BRIDGE_SLUGS, getBridgeIdBySlug } from "@/lib/bridgeSlugs";
import { fetchBridgeStatics } from "@/lib/bridgeStats";
import { regionBridgeCards } from "@/lib/bridgeCards";
import { getBridgeEditorial, editorialSlugs } from "@/content/bridges";
import { getRegionDisplay, REGION_META } from "@/content/regions";
import { ClosureDurationsChart } from "@/components/bridges/ClosureDurationsChart";
import { LiveStatus } from "@/components/bridges/LiveStatus";
import { LiveLastChanged } from "@/components/bridges/LiveLastChanged";
import { LiveClosures } from "@/components/bridges/LiveClosures";
import { BridgeCard } from "@/components/bridges/BridgeCard";
import { ExternalIcon } from "@/components/bridges/ExternalIcon";

// Daily ISR — stats refresh once a day; the live status is a client island on top.
export const revalidate = 86400;

type Props = {
  params: Promise<{ locale: string; region: string; bridge: string }>;
};

// Date/number formatting locale (Canadian variants; matches the site's es_MX OG locale).
function intlLocale(locale: string): string {
  return locale === "fr" ? "fr-CA" : locale === "es" ? "es-MX" : "en-CA";
}

export function generateStaticParams() {
  const withContent = new Set(editorialSlugs());
  const params: { locale: string; region: string; bridge: string }[] = [];
  for (const entry of Object.values(BRIDGE_SLUGS)) {
    if (entry.page && withContent.has(entry.slug)) {
      for (const locale of routing.locales) {
        params.push({ locale, region: entry.regionId, bridge: entry.slug });
      }
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, region, bridge } = await params;
  const apiId = getBridgeIdBySlug(region, bridge);
  const display = getRegionDisplay(region, locale as Locale);
  if (!apiId || !display) return {};

  const tb = await getTranslations({ locale, namespace: "bridgePages" });
  const ed = getBridgeEditorial(bridge, locale as Locale);
  const bridgeName = ed?.name ?? bridge;

  return {
    title: tb("titleTemplate", { bridge: bridgeName, region: display.name }),
    description: tb("metaDescription", {
      bridge: bridgeName,
      waterway: display.waterway,
      city: ed?.city ?? display.city,
    }),
    alternates: localeAlternates(locale, `/bridges/${region}/${bridge}`),
  };
}

export default async function BridgePage({ params }: Props) {
  const { locale, region, bridge } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const apiId = getBridgeIdBySlug(region, bridge);
  const display = getRegionDisplay(region, loc);
  if (!apiId || !display) notFound();

  const statics = await fetchBridgeStatics();
  const stat = statics[apiId];
  const avgRaw = stat?.statistics?.average_closure_duration;
  if (!stat || avgRaw == null) notFound();
  const stats = stat.statistics!;

  const tb = await getTranslations({ locale, namespace: "bridgePages" });
  const tl = await getTranslations({ locale, namespace: "bridgeList" });
  const editorial = getBridgeEditorial(bridge, loc);
  const regionMeta = REGION_META[region];

  const bridgeName = editorial?.name ?? stat.name;
  const regionName = display.name;
  const city = editorial?.city ?? display.city;

  const avg = Math.round(avgRaw);
  const hasCI = stats.closure_ci != null;
  const ciLow = Math.round(stats.closure_ci?.lower ?? avgRaw);
  const ciHigh = Math.round(stats.closure_ci?.upper ?? avgRaw);
  const n = stats.total_entries ?? 0;
  const raisingAvg =
    stats.average_raising_soon != null ? Math.round(stats.average_raising_soon) : null;
  const raisingLow = stats.raising_soon_ci ? Math.round(stats.raising_soon_ci.lower) : null;
  const raisingHigh = stats.raising_soon_ci ? Math.round(stats.raising_soon_ci.upper) : null;
  const durations = stats.closure_durations;

  const dateStr = new Date().toLocaleDateString(intlLocale(loc), {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const lat = stat.coordinates?.lat;
  const lng = stat.coordinates?.lng;
  const hasGeo =
    typeof lat === "number" && Number.isFinite(lat) && typeof lng === "number" && Number.isFinite(lng);
  const url = absUrl(loc, `/bridges/${region}/${bridge}`);
  const mapsUrl = hasGeo
    ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
    : null;

  const h1 = tb("h1", { bridge: bridgeName });
  const answer = tb("answer", { date: dateStr, bridge: bridgeName, city, avg, ciLow, ciHigh, n });
  const durLabels: [string, string, string, string, string] = [
    tb("durUnder9"),
    tb("dur10_15"),
    tb("dur16_30"),
    tb("dur31_60"),
    tb("durOver60"),
  ];

  // Closest 2 other bridges in the region (by straight-line distance).
  const nearby = regionBridgeCards(region, statics, loc, (a) => tl("cardStat", { avg: a }))
    .filter((c) => c.apiId !== apiId)
    .map((c) => {
      const co = statics[c.apiId]?.coordinates;
      const d2 =
        co && typeof lat === "number" && typeof lng === "number"
          ? (co.lat - lat) ** 2 + (co.lng - lng) ** 2
          : Number.POSITIVE_INFINITY;
      return { card: c, d2 };
    })
    .sort((a, b) => a.d2 - b.d2)
    .slice(0, 2)
    .map((x) => x.card);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Bridge",
        "@id": `${url}#bridge`,
        name: h1,
        alternateName: stat.name,
        url,
        ...(editorial?.intro ? { description: editorial.intro } : {}),
        ...(hasGeo
          ? { geo: { "@type": "GeoCoordinates", latitude: lat, longitude: lng }, hasMap: mapsUrl }
          : {}),
        containedInPlace: {
          "@type": "City",
          name: city,
          ...(regionMeta
            ? { containedInPlace: { "@type": "AdministrativeArea", name: regionMeta.province } }
            : {}),
        },
        mainEntityOfPage: url,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: tb("breadcrumbHome"), item: absUrl(loc, "/") },
          { "@type": "ListItem", position: 2, name: tb("breadcrumbBridges"), item: absUrl(loc, "/bridges/list") },
          { "@type": "ListItem", position: 3, name: regionName, item: absUrl(loc, `/bridges/${region}`) },
          { "@type": "ListItem", position: 4, name: h1, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <Header />
      <main className="relative min-h-screen overflow-hidden bg-[var(--dark-bg)] text-white">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 right-1/4 h-[460px] w-[460px] rounded-full bg-[var(--primary)]/10 blur-3xl" />
        </div>
        <article className="relative mx-auto max-w-3xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
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
              <li>
                <Link href={`/bridges/${region}`} className="hover:text-white/80">
                  {regionName}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-white/80">
                {bridgeName}
              </li>
            </ol>
          </nav>

          <h1 className="text-3xl font-bold sm:text-4xl">{h1}</h1>

          <p className="mt-6 text-lg leading-relaxed text-white/90">{answer}</p>
          {editorial?.intro && (
            <p className="mt-4 leading-relaxed text-white/70">{editorial.intro}</p>
          )}

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
            {editorial?.spans ? (
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-10">
                {editorial.spans.map((s) => (
                  <div key={s.apiId}>
                    <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-white/40">
                      {s.label}
                    </div>
                    <LiveStatus apiId={s.apiId} iconSize={32} />
                  </div>
                ))}
              </div>
            ) : (
              <LiveStatus apiId={apiId} iconSize={36} />
            )}
          </div>

          <section className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/bridges?region=${region}`}
              className="rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-[var(--primary)]/25 transition-colors hover:bg-[var(--primary-dark)]"
            >
              {tb("viewOnMap")}
            </Link>
            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full border border-[var(--primary)]/30 px-5 py-2.5 text-sm font-medium text-[var(--primary-light)] transition-colors hover:border-[var(--primary)]/60 hover:bg-[var(--primary)]/10"
              >
                {tb("directions")}
                <ExternalIcon />
              </a>
            )}
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

          <section className="mt-10">
            <h2 className="text-xl font-semibold">{tb("closuresHeading")}</h2>
            <p className="mt-1 text-sm text-white/55">{tb("closuresNote")}</p>
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5">
              <LiveClosures apiId={apiId} />
            </div>
          </section>

          <section className="mt-10">
            <h2 className="text-xl font-semibold">{tb("statsHeading")}</h2>
            <div
              className={`mt-4 grid gap-3 ${raisingAvg != null ? "grid-cols-3" : "grid-cols-2"}`}
            >
              <Stat
                label={tb("statClosure")}
                value={tb("minutesValue", { value: avg })}
                sub={hasCI ? tb("minutesRange", { low: ciLow, high: ciHigh }) : undefined}
              />
              {raisingAvg != null && (
                <Stat
                  label={tb("statClosingSoon")}
                  value={tb("minutesValue", { value: raisingAvg })}
                  sub={
                    raisingLow != null && raisingHigh != null
                      ? tb("minutesRange", { low: raisingLow, high: raisingHigh })
                      : undefined
                  }
                />
              )}
              <Stat label={tb("statChanged")} value={<LiveLastChanged apiId={apiId} />} />
            </div>

            {durations && (
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="mb-3 text-sm font-semibold text-white/80">
                  {tb("durationsHeading")}
                </div>
                <ClosureDurationsChart durations={durations} labels={durLabels} />
              </div>
            )}

            <p className="mt-3 text-xs text-white/55">{tb("method", { n })}</p>
          </section>

          {nearby.length > 0 && (
            <section className="mt-10">
              <h2 className="text-xl font-semibold">{tb("nearbyHeading")}</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {nearby.map((b) => (
                  <BridgeCard
                    key={b.apiId}
                    apiId={b.apiId}
                    href={b.href}
                    name={b.name}
                    statText={b.statText}
                  />
                ))}
              </div>
              <Link
                href={`/bridges/${region}`}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white/80 transition-colors hover:border-white/30 hover:bg-white/5"
              >
                {tb("viewAllRegion", { region: regionName })}
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="h-3.5 w-3.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            </section>
          )}
        </article>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(jsonLd) }}
      />
    </>
  );
}

function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
}): React.ReactElement {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="text-xs text-white/60">{label}</div>
      <div className="mt-1 text-lg font-semibold text-white">{value}</div>
      {sub && <div className="text-xs text-white/55">{sub}</div>}
    </div>
  );
}
