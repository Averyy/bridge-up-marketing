"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/bridges", label: "Bridges" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

interface HeaderProps {
  forceScrolled?: boolean;
}

export function Header({ forceScrolled = false }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(forceScrolled);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    if (forceScrolled) return; // Skip scroll handling if forced

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [forceScrolled]);

  // Same condensing behavior on all pages
  const showPillNav = scrolled;
  // Sub-pages have dark hero backgrounds, so use light text when not scrolled
  const useLightText = !scrolled && !isHomePage;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8">
      <nav
        className={`mx-auto transition-all duration-500 ${
          showPillNav
            ? "max-w-3xl mt-3 py-2 rounded-full border border-white/10"
            : "max-w-7xl py-4 bg-transparent"
        }`}
        style={showPillNav ? {
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          backgroundColor: "rgba(10, 10, 10, 0.7)",
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 1px 0.5px, rgba(0, 0, 0, 0.08) 0px 3px 3px 1.5px, rgba(0, 0, 0, 0.06) 0px 6px 6px -3px, rgba(0, 0, 0, 0.04) 0px 12px 12px -6px, rgba(0, 0, 0, 0.02) 0px 24px 24px -12px",
        } : {}}
      >
        <div className={`flex items-center justify-between ${showPillNav ? "px-4" : "px-0"}`}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/BridgeUp-Icon.png"
              alt="Bridge Up"
              width={40}
              height={40}
              className={`transition-all duration-300 ${
                showPillNav ? "w-9 h-9" : "w-10 h-10"
              }`}
              priority
            />
            <span
              className={`font-semibold text-lg overflow-hidden whitespace-nowrap transition-all duration-300 ${
                showPillNav ? "w-0 opacity-0" : "w-auto opacity-100"
              }`}
              style={{
                background: useLightText
                  ? "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(220,220,220,1) 100%)"
                  : "linear-gradient(180deg, rgba(28,28,30,1) 0%, rgba(60,60,67,1) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Bridge Up
            </span>
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-medium transition-colors rounded-full ${
                  showPillNav || useLightText ? "hover:bg-white/10" : "hover:bg-black/5"
                } ${
                  pathname === link.href
                    ? "text-[var(--primary)]"
                    : showPillNav || useLightText ? "text-white/80" : "text-gray-700"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button + Coffee */}
          <div className="hidden md:flex items-center gap-4">
            {/* Buy Me a Coffee */}
            <a
              href="https://buymeacoffee.com/averyy"
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative inline-flex items-center justify-center rounded-full transition-all duration-300 ${
                showPillNav ? "w-9 h-9" : "w-10 h-10"
              } ${
                showPillNav || useLightText
                  ? "bg-white/10 hover:bg-white/20"
                  : "bg-amber-100 hover:bg-amber-200"
              }`}
              aria-label="Buy me a coffee"
            >
              <span className="text-base">☕</span>
              {/* Tooltip */}
              <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[var(--foreground)] text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                Like Bridge Up? Buy me a coffee!
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[var(--foreground)] rotate-45" />
              </span>
            </a>

            <a
              href="#download"
              className={`inline-flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300 ${
                showPillNav ? "px-4 py-2" : "px-5 py-2.5"
              } ${
                showPillNav
                  ? "bg-white text-[var(--foreground)] hover:bg-white/90"
                  : useLightText
                    ? "bg-white text-[var(--foreground)] hover:bg-white/90"
                    : "bg-[var(--foreground)] text-white hover:bg-gray-800"
              }`}
            >
              Get the app
              <svg
                className="w-4 h-4 ml-1.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="5" y="2" width="14" height="20" rx="3" />
                <line x1="12" y1="18" x2="12" y2="18" strokeLinecap="round" />
              </svg>
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className={`md:hidden p-2 rounded-full ${
              showPillNav || useLightText ? "text-white hover:bg-white/10" : "text-gray-700 hover:bg-black/5"
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2 px-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-4 py-2 text-base font-medium rounded-xl transition-colors ${
                      pathname === link.href
                        ? "text-[var(--primary)] bg-[var(--primary)]/5"
                        : "text-gray-700 hover:bg-black/5"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <a
                  href="#download"
                  className="block w-full text-center rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-medium text-white hover:bg-gray-800 transition-colors mt-4"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get the app
                </a>
                <a
                  href="https://buymeacoffee.com/averyy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full text-center rounded-full border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors mt-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>☕</span>
                  Buy me a coffee
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
