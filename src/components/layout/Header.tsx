"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useBridges } from "@/lib/useBridges";
import { LanguageSelector } from "@/components/ui/LanguageSelector";

interface HeaderProps {
  forceScrolled?: boolean;
}

export function Header({ forceScrolled = false }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(forceScrolled);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const { connectionStatus } = useBridges();
  const isLive = connectionStatus === "connected";
  const t = useTranslations("nav");

  const navLinks = [
    {
      href: "/" as const,
      label: t("home"),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      )
    },
    {
      href: "/bridges" as const,
      label: t("bridges"),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
        </svg>
      )
    },
    {
      href: "/pricing" as const,
      label: t("pricing"),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
        </svg>
      )
    },
    {
      href: "/about" as const,
      label: t("about"),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      )
    },
  ];

  useEffect(() => {
    if (forceScrolled) return;

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [forceScrolled]);

  // Close menu when route changes - intentional: menu should close on navigation
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileMenuOpen(false);
  }, [pathname]);

  const showPillNav = scrolled;
  const useLightText = !scrolled && !isHomePage;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pointer-events-none">
        <nav
          className={`mx-auto transition-all duration-500 border rounded-full pointer-events-auto ${
            showPillNav
              ? "max-w-3xl mt-3 py-2 border-white/10"
              : "max-w-7xl py-4 border-transparent"
          }`}
          style={{
            backdropFilter: showPillNav ? "blur(24px)" : "none",
            WebkitBackdropFilter: showPillNav ? "blur(24px)" : "none",
            backgroundColor: showPillNav ? "rgba(10, 10, 10, 0.5)" : "transparent",
            boxShadow: showPillNav ? "rgba(0, 0, 0, 0.1) 0px 1px 1px 0.5px, rgba(0, 0, 0, 0.08) 0px 3px 3px 1.5px, rgba(0, 0, 0, 0.06) 0px 6px 6px -3px, rgba(0, 0, 0, 0.04) 0px 12px 12px -6px, rgba(0, 0, 0, 0.02) 0px 24px 24px -12px" : "none",
          }}
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
                  backgroundImage: useLightText
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

            {/* Desktop Navigation - Center (includes Language Selector after About) */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 text-sm font-medium transition-colors rounded-full flex items-center gap-2 ${
                    pathname === link.href
                      ? showPillNav || useLightText
                        ? "bg-white/15 text-white"
                        : "bg-[var(--primary)]/10 text-[var(--primary)]"
                      : showPillNav || useLightText
                        ? "text-white/80 hover:bg-white/10"
                        : "text-gray-700 hover:bg-black/5"
                  }`}
                >
                  {link.label}
                  {link.href === "/bridges" && isLive && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                  )}
                </Link>
              ))}
              {/* Language Selector - After nav items */}
              <LanguageSelector
                variant={showPillNav || useLightText ? "dark" : "light"}
                showPillNav={showPillNav}
              />
            </div>

            {/* CTA Button + Coffee */}
            <div className="hidden md:flex items-center gap-4">
              <a
                href="https://buymeacoffee.com/averyy"
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative inline-flex items-center justify-center rounded-full transition-all duration-300 ${
                  showPillNav ? "w-9 h-9" : "w-10 h-10"
                } ${
                  showPillNav || useLightText
                    ? "hover:bg-amber-500/20"
                    : "hover:bg-amber-100"
                }`}
                aria-label={t("buyMeCoffee")}
              >
                <span className="text-base">☕</span>
                <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[var(--foreground)] text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  {t("coffeeTooltip")}
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
                <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                {t("comingSoon")}
              </a>
            </div>

            {/* Mobile Controls */}
            <div className="flex md:hidden items-center gap-2">
              {/* Language Selector - Mobile */}
              <LanguageSelector
                variant={showPillNav || useLightText ? "dark" : "light"}
                showPillNav={showPillNav}
              />

              {/* Coffee */}
              <a
                href="https://buymeacoffee.com/averyy"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center rounded-full w-8 h-8 transition-colors ${
                  showPillNav || useLightText
                    ? "hover:bg-amber-500/20"
                    : "hover:bg-amber-100"
                }`}
                aria-label={t("buyMeCoffee")}
              >
                <span className="text-sm">☕</span>
              </a>

              {/* Get the app */}
              <a
                href="#download"
                className={`inline-flex items-center justify-center rounded-full h-8 px-3 text-xs font-medium ${
                  showPillNav || useLightText
                    ? "bg-white text-[var(--foreground)]"
                    : "bg-[var(--foreground)] text-white"
                }`}
              >
                <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                {t("getApp")}
              </a>

              {/* Hamburger */}
              <button
                type="button"
                className={`p-2 rounded-full ${
                  showPillNav || useLightText ? "text-white hover:bg-white/10" : "text-gray-700 hover:bg-black/5"
                }`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={t("toggleMenu")}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu Card */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed top-4 left-4 right-4 bg-white rounded-2xl shadow-2xl z-50 md:hidden overflow-hidden"
            >
              {/* Header Row */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <Image
                    src="/BridgeUp-Icon.png"
                    alt="Bridge Up"
                    width={36}
                    height={36}
                    className="w-9 h-9"
                  />
                  <div className="w-px h-6 bg-gray-200" />
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href="#download"
                    className="inline-flex items-center justify-center rounded-full bg-[var(--foreground)] px-4 py-2 text-sm font-medium text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("getTheApp")}
                  </a>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label={t("closeMenu")}
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Nav Links Grid */}
              <div className="p-4">
                <div className="grid grid-cols-2 gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                        pathname === link.href
                          ? "text-[var(--primary)] bg-[var(--primary)]/5"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className={pathname === link.href ? "text-[var(--primary)]" : "text-gray-400"}>
                        {link.icon}
                      </span>
                      <span className="font-medium">{link.label}</span>
                      {link.href === "/bridges" && isLive && (
                        <span className="relative flex h-2 w-2 ml-auto">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                      )}
                    </Link>
                  ))}
                </div>

                {/* Coffee Link */}
                <a
                  href="https://buymeacoffee.com/averyy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 mt-2 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-lg">☕</span>
                  <span className="font-medium">{t("buyMeCoffee")}</span>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
