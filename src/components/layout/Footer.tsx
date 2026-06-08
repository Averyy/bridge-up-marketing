"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Locale } from "@/i18n/routing";
import { REGION_PAGE_ORDER, pageBridgeIdsForRegion, getBridgeSlugEntry } from "@/lib/bridgeSlugs";
import { getBridgeEditorial } from "@/content/bridges";
import { getRegionDisplay } from "@/content/regions";

export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale() as Locale;

  const bridgeRegions = REGION_PAGE_ORDER.map((regionId) => ({
    regionId,
    name: getRegionDisplay(regionId, locale)?.name ?? regionId,
    bridges: pageBridgeIdsForRegion(regionId)
      .map((id) => {
        const entry = getBridgeSlugEntry(id);
        const name = entry ? getBridgeEditorial(entry.slug, locale)?.name : undefined;
        return entry && name ? { slug: entry.slug, name } : null;
      })
      .filter((b): b is { slug: string; name: string } => b !== null),
  })).filter((r) => r.bridges.length > 0);

  const footerLinks = {
    product: [
      { href: "/" as const, label: t("home") },
      { href: "/bridges" as const, label: t("map") },
      { href: "/bridges/list" as const, label: t("bridges") },
      { href: "/pricing" as const, label: t("pricing") },
      { href: "https://apps.apple.com/ca/app/bridge-up/id6557082394", label: t("download"), external: true },
    ],
    more: [
      { href: "/about" as const, label: t("about") },
      { href: "mailto:support@bridgeup.app", label: t("contact"), external: true },
      { href: "/support" as const, label: t("support") },
      { href: "https://buymeacoffee.com/averyy", label: t("buyMeCoffee"), external: true },
    ],
    legal: [
      { href: "/privacy" as const, label: t("privacyPolicy") },
      { href: "/terms" as const, label: t("termsOfService") },
    ],
  };

  return (
    <footer className="bg-[var(--dark-bg)] text-white">
      <div className="mx-auto max-w-7xl pl-6 pr-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/BridgeUp-Logo.png"
                alt="Bridge Up"
                width={32}
                height={32}
                className="w-8 h-8 rounded-[25%]"
              />
              <span
                className="font-semibold text-lg"
                style={{
                  backgroundImage: "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(200,200,200,1) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Bridge Up
              </span>
            </Link>
            <p className="text-sm text-[var(--dark-text-muted)] max-w-xs">
              {t("brandDescription")}
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-sm mb-4">{t("product")}</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[var(--dark-text-muted)] hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href as "/" | "/bridges" | "/bridges/list" | "/pricing"}
                      className="text-sm text-[var(--dark-text-muted)] hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h3 className="font-semibold text-sm mb-4">{t("more")}</h3>
            <ul className="space-y-3">
              {footerLinks.more.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[var(--dark-text-muted)] hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href as "/about" | "/support"}
                      className="text-sm text-[var(--dark-text-muted)] hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-sm mb-4">{t("legal")}</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--dark-text-muted)] hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Monitored bridges, grouped by region */}
        <div className="mt-10 pt-10 border-t border-white/10">
          <div className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
            {bridgeRegions.map((r) => (
              <div key={r.regionId}>
                <Link
                  href={`/bridges/${r.regionId}`}
                  className="mb-2 block text-xs font-semibold text-white/70 transition-colors hover:text-white"
                >
                  {r.name}
                </Link>
                <div className="flex flex-wrap gap-1.5">
                  {r.bridges.map((b) => (
                    <Link
                      key={b.slug}
                      href={`/bridges/${r.regionId}/${b.slug}`}
                      className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-[var(--dark-text-muted)] transition-colors hover:bg-white/15 hover:text-white"
                    >
                      {b.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-10 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[var(--dark-text-muted)]">
            &copy; {new Date().getFullYear()} {t("copyright")}
          </p>
          <a
            href="https://www.linkedin.com/in/avery-levitt/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--dark-text-muted)] hover:text-white transition-colors"
          >
            {t("madeWith")}
          </a>
        </div>
      </div>
    </footer>
  );
}
