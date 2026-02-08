"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const regions = [
  "St. Catharines",
  "Port Colborne",
  "Montréal South Shore",
  "Salaberry-de-Valleyfield",
  "Kahnawake",
];

export function Footer() {
  const t = useTranslations("footer");

  const footerLinks = {
    product: [
      { href: "/" as const, label: t("home") },
      { href: "/bridges" as const, label: t("bridges") },
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
                      href={link.href as "/" | "/bridges" | "/pricing"}
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

        {/* Regions */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-sm text-[var(--dark-text-muted)] mb-3">
            {t("monitoringBridges")}
          </p>
          <div className="flex flex-wrap gap-2">
            {regions.map((region) => (
              <span
                key={region}
                className="text-xs px-3 py-1 rounded-full bg-white/10 text-[var(--dark-text-muted)]"
              >
                {region}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
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
