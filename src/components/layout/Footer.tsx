import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  product: [
    { href: "/", label: "Home" },
    { href: "/bridges", label: "Bridges" },
    { href: "/pricing", label: "Pricing" },
    { href: "/#download", label: "Download" },
  ],
  more: [
    { href: "/about", label: "About" },
    { href: "mailto:support@bridgeup.app", label: "Contact" },
    { href: "https://buymeacoffee.com/averyy", label: "Buy me a coffee", external: true },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
};

const regions = [
  "St. Catharines",
  "Port Colborne",
  "Montreal South Shore",
  "Salaberry-de-Valleyfield",
  "Kahnawake",
];

export function Footer() {
  return (
    <footer className="bg-[var(--dark-bg)] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/BridgeUp-Icon.png"
                alt="Bridge Up"
                width={32}
                height={32}
                className="w-8 h-8"
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
              Real-time bridge status for the St. Lawrence Seaway region.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
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

          {/* More Links */}
          <div>
            <h3 className="font-semibold text-sm mb-4">More</h3>
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
                      href={link.href}
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
            <h3 className="font-semibold text-sm mb-4">Legal</h3>
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
            Monitoring bridges in:
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
            &copy; {new Date().getFullYear()} Bridge Up. All rights reserved.
          </p>
          <a
            href="https://www.linkedin.com/in/avery-levitt/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--dark-text-muted)] hover:text-white transition-colors"
          >
            Made with 💙 in St. Catharines
          </a>
        </div>
      </div>
    </footer>
  );
}
