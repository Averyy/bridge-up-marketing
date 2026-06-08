import { routing, Locale } from "@/i18n/routing";
import { SITE_URL } from "./config";

// Build the locale-prefixed path for a route ("" = home).
// localePrefix is "as-needed": the default locale (en) has no prefix.
// Normalizes input so callers may pass "pricing", "/pricing", or "/pricing/".
export function localePath(locale: Locale, path: string): string {
  let p = path.trim();
  if (p && !p.startsWith("/")) p = `/${p}`; // ensure leading slash
  if (p.length > 1) p = p.replace(/\/+$/, ""); // strip trailing slash(es)
  const prefixed = locale === routing.defaultLocale ? p : `/${locale}${p}`;
  return prefixed === "" ? "/" : prefixed;
}

// Absolute canonical URL for a route in a locale (home → SITE_URL, no trailing slash).
export function absUrl(locale: Locale, path: string = ""): string {
  const p = localePath(locale, path);
  return p === "/" ? SITE_URL : `${SITE_URL}${p}`;
}

// Per-page canonical + hreflang alternates, resolved against metadataBase.
// Usage in a page's generateMetadata: `alternates: localeAlternates(locale, "/pricing")`
export function localeAlternates(locale: string, path: string = "") {
  const current = (routing.locales as readonly string[]).includes(locale)
    ? (locale as Locale)
    : routing.defaultLocale;

  return {
    canonical: localePath(current, path),
    languages: {
      ...Object.fromEntries(
        routing.locales.map((l) => [l, localePath(l, path)])
      ),
      "x-default": localePath(routing.defaultLocale, path),
    },
  };
}

// Serialize a JSON-LD object for injection via dangerouslySetInnerHTML.
// Escapes the characters that could break out of the <script> element so that
// any string value (e.g. a translated FAQ answer containing "</script>" or a
// U+2028/U+2029 line terminator) stays inside the script context.
export function jsonLdHtml(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
