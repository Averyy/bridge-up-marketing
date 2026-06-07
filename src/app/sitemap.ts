import { MetadataRoute } from "next";
import { locales, routing } from "@/i18n/routing";
import { localePath } from "@/lib/seo";
import { SITE_URL } from "@/lib/config";

// Absolute URL for a route in a locale, matching the on-page canonical exactly
// (home resolves to SITE_URL with no trailing slash, like Next's canonical tag).
function abs(locale: (typeof locales)[number], path: string): string {
  const p = localePath(locale, path);
  return p === "/" ? SITE_URL : `${SITE_URL}${p}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "", changeFrequency: "weekly" as const, priority: 1 },
    { path: "/bridges", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/about", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/pricing", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/support", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    // hreflang cluster (same for every locale variant of this route), kept in
    // sync with the on-page alternates via the shared localePath helper.
    const languages = {
      ...Object.fromEntries(locales.map((l) => [l, abs(l, route.path)])),
      "x-default": abs(routing.defaultLocale, route.path),
    };

    for (const locale of locales) {
      sitemapEntries.push({
        url: abs(locale, route.path),
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: { languages },
      });
    }
  }

  return sitemapEntries;
}
