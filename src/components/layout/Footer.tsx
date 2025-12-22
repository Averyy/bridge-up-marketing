import Link from "next/link";

const footerLinks = {
  product: [
    { href: "/", label: "Home" },
    { href: "/bridges", label: "Bridges" },
    { href: "/pricing", label: "Pricing" },
    { href: "/#download", label: "Download" },
  ],
  company: [
    { href: "/about", label: "About" },
    { href: "mailto:support@bridgeup.app", label: "Contact" },
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
];

export function Footer() {
  return (
    <footer className="bg-[var(--dark-bg)] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="font-semibold text-lg">Bridge Up</span>
            </Link>
            <p className="text-sm text-[var(--dark-text-muted)] max-w-xs">
              Real-time bridge status for the St. Lawrence Seaway region. Know
              before you go.
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

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
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
          <p className="text-sm text-[var(--dark-text-muted)]">
            Coming soon to the App Store
          </p>
        </div>
      </div>
    </footer>
  );
}
