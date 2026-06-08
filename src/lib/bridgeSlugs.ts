// src/lib/bridgeSlugs.ts
//
// Hand-curated map of API bridge IDs → URL slugs for the SEO landing pages.
// Slugs are PERMANENT and human-readable; never derive them from API names at
// runtime (display names can change, slugs must not). Region slugs match the
// values returned by getRegionId() in bridges.ts (also used by `?region=` links).
//
// `page: false` = monitored in the app/on the map, but NOT given a standalone
// marketing/SEO page:
//   - Kahnawake CP railway bridges → trains, not cars; no "which bridge should I
//     take / is it open" search intent.
//   - Victoria upstream (cycling path) → folded into the main Victoria page to
//     avoid a thin near-duplicate; the cycling span is described there.

export interface BridgeSlugEntry {
  /** URL slug under /bridges/[region]/ */
  slug: string;
  /** Region slug — matches getRegionId() in bridges.ts */
  regionId: string;
  /** Generate a standalone SEO page for this bridge? */
  page: boolean;
}

export const BRIDGE_SLUGS: Record<string, BridgeSlugEntry> = {
  // St. Catharines — Welland Canal lift bridges
  SCT_LakeshoreRd: { slug: "lakeshore-rd", regionId: "st-catharines", page: true },
  SCT_CarltonSt:   { slug: "carlton-st",   regionId: "st-catharines", page: true },
  SCT_QueenstonSt: { slug: "queenston-st", regionId: "st-catharines", page: true },
  SCT_GlendaleAve: { slug: "glendale-ave", regionId: "st-catharines", page: true },
  SCT_Highway:     { slug: "highway-20",   regionId: "st-catharines", page: true },

  // Port Colborne — Welland Canal lift bridges
  PC_MainSt:      { slug: "main-st",      regionId: "port-colborne", page: true },
  PC_MellanbyAve: { slug: "mellanby-ave", regionId: "port-colborne", page: true },
  PC_ClarenceSt:  { slug: "clarence-st",  regionId: "port-colborne", page: true },

  // Montréal South Shore — St. Lawrence Seaway
  MSS_VictoriaBridgeDownstream:  { slug: "victoria",          regionId: "montreal", page: true },
  MSS_VictoriaBridgeUpstreamCyc: { slug: "victoria-cycling",  regionId: "montreal", page: false }, // cycling span, described on the victoria page
  MSS_SainteCatherineRecreoParc: { slug: "sainte-catherine-recreoparc", regionId: "montreal", page: true },

  // Kahnawake — CP railway bridges (no marketing page: rail, not road)
  K_CPRailwayBridgeA: { slug: "cp-railway-7a", regionId: "kahnawake", page: false },
  K_CPRailwayBridgeB: { slug: "cp-railway-7b", regionId: "kahnawake", page: false },

  // Salaberry / Beauharnois / Suroît — St. Lawrence Seaway
  SBS_StLouisdeGonzagueBridge:   { slug: "st-louis-de-gonzague", regionId: "beauharnois", page: true },
  SBS_LarocqueBridgeSalaberryde: { slug: "larocque",             regionId: "beauharnois", page: true },
};

// Regions that get a hub page (/bridges/[region]), in display order.
// Kahnawake is intentionally excluded — it has only railway bridges.
export const REGION_PAGE_ORDER = [
  "st-catharines",
  "port-colborne",
  "montreal",
  "beauharnois",
] as const;

export type RegionSlug = (typeof REGION_PAGE_ORDER)[number];

/** API bridge ID → slug entry (undefined if unknown). */
export function getBridgeSlugEntry(apiId: string): BridgeSlugEntry | undefined {
  return BRIDGE_SLUGS[apiId];
}

/** Resolve a (regionId, slug) pair back to a page-bearing API bridge ID. */
export function getBridgeIdBySlug(regionId: string, slug: string): string | undefined {
  const match = Object.entries(BRIDGE_SLUGS).find(
    ([, e]) => e.page && e.regionId === regionId && e.slug === slug
  );
  return match?.[0];
}

/** API IDs of the page-bearing bridges in one region, in declaration order. */
export function pageBridgeIdsForRegion(regionId: string): string[] {
  return Object.entries(BRIDGE_SLUGS)
    .filter(([, e]) => e.page && e.regionId === regionId)
    .map(([id]) => id);
}

/**
 * Best link for a region: the indexable hub page if the region has one, else the
 * live map focused on it (e.g. Kahnawake, which has no hub). Home-page region/Hero
 * cards use this so region navigation lands on the hub. The pages' own "View on
 * map" deep-links keep using `?region=` on purpose.
 */
export function regionHref(regionId: string): string {
  return (REGION_PAGE_ORDER as readonly string[]).includes(regionId)
    ? `/bridges/${regionId}`
    : `/bridges?region=${regionId}`;
}
