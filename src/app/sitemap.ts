import { MetadataRoute } from "next";
import { locales } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://bridgeup.app";

  const routes = [
    { path: "", changeFrequency: "weekly" as const, priority: 1 },
    { path: "/bridges", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/about", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/pricing", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    for (const locale of locales) {
      // English (default locale) has no prefix, others have /fr or /es
      const localePath = locale === "en" ? route.path : `/${locale}${route.path}`;

      sitemapEntries.push({
        url: `${baseUrl}${localePath}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [
              l,
              `${baseUrl}${l === "en" ? route.path : `/${l}${route.path}`}`,
            ])
          ),
        },
      });
    }
  }

  return sitemapEntries;
}
