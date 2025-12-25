import { defineRouting } from "next-intl/routing";

export const locales = ["en", "fr", "es"] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  es: "Español",
};

export const routing = defineRouting({
  // All locales that are supported
  locales,

  // Default locale when no match
  defaultLocale: "en",

  // Don't add prefix for default locale (English)
  // e.g., /about instead of /en/about
  localePrefix: "as-needed",
});
