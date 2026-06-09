import { MetadataRoute } from "next";
import { locales, routing } from "@/i18n/routing";
import { absUrl } from "@/lib/seo";
import {
  REGION_PAGE_ORDER,
  pageBridgeIdsForRegion,
  getBridgeSlugEntry,
} from "@/lib/bridgeSlugs";
import { editorialSlugs } from "@/content/bridges";

type ChangeFreq = "daily" | "weekly" | "monthly" | "yearly";
type RouteDef = { path: string; changeFrequency: ChangeFreq; priority: number };

// Static marketing routes.
const STATIC_ROUTES: RouteDef[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/bridges", changeFrequency: "weekly", priority: 0.9 },
  { path: "/bridges/list", changeFrequency: "weekly", priority: 0.7 },
  { path: "/bridges/welland-canal", changeFrequency: "daily", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.8 },
  { path: "/support", changeFrequency: "monthly", priority: 0.7 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
];

// Region hubs + per-bridge pages, derived from the same slug/content tables the
// pages use, so the sitemap can never drift from what's actually generated.
function bridgeRoutes(): RouteDef[] {
  const withContent = new Set(editorialSlugs());
  const routes: RouteDef[] = [];
  for (const region of REGION_PAGE_ORDER) {
    routes.push({ path: `/bridges/${region}`, changeFrequency: "daily", priority: 0.8 });
    for (const id of pageBridgeIdsForRegion(region)) {
      const entry = getBridgeSlugEntry(id);
      if (entry && withContent.has(entry.slug)) {
        routes.push({
          path: `/bridges/${region}/${entry.slug}`,
          changeFrequency: "daily",
          priority: 0.8,
        });
      }
    }
  }
  return routes;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [...STATIC_ROUTES, ...bridgeRoutes()];
  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    // hreflang cluster (same for every locale variant of this route), kept in
    // sync with the on-page alternates via the shared absUrl/localePath helpers.
    const languages = {
      ...Object.fromEntries(locales.map((l) => [l, absUrl(l, route.path)])),
      "x-default": absUrl(routing.defaultLocale, route.path),
    };

    for (const locale of locales) {
      sitemapEntries.push({
        url: absUrl(locale, route.path),
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: { languages },
      });
    }
  }

  return sitemapEntries;
}
