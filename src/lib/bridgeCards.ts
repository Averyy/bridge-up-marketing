// Shared builder for bridge-card data, used by the Bridge Info list, the region
// hubs, and the "nearby bridges" section. Keeps the slug → name → stat mapping
// (and its null-filtering) in one place instead of duplicated per page.
import { Locale } from "@/i18n/routing";
import { pageBridgeIdsForRegion, getBridgeSlugEntry } from "./bridgeSlugs";
import { getBridgeEditorial } from "@/content/bridges";
import { RawBridgeStatic } from "./bridgeStats";

export interface BridgeCardData {
  apiId: string;
  href: string;
  name: string;
  statText: string;
}

// Cards for every page-bearing bridge in a region that has editorial content + a
// closure average. `cardStat` renders the localized evergreen stat line.
export function regionBridgeCards(
  regionId: string,
  statics: Record<string, RawBridgeStatic>,
  locale: Locale,
  cardStat: (avg: number) => string
): BridgeCardData[] {
  return pageBridgeIdsForRegion(regionId)
    .map((id): BridgeCardData | null => {
      const entry = getBridgeSlugEntry(id);
      const name = entry ? getBridgeEditorial(entry.slug, locale)?.name : undefined;
      const avg = statics[id]?.statistics?.average_closure_duration;
      if (!entry || !name || avg == null) return null;
      return {
        apiId: id,
        href: `/bridges/${regionId}/${entry.slug}`,
        name,
        statText: cardStat(Math.round(avg)),
      };
    })
    .filter((x): x is BridgeCardData => x !== null);
}
