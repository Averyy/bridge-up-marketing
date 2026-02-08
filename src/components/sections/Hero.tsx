"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useData } from "@/lib/useData";
import { getTranslatedStatusInfoText } from "@/lib/bridges";
import { BridgeStatusIcon } from "@/components/ui/BridgeStatusIcon";
import { Link } from "@/i18n/navigation";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 30,
    },
  },
};

// Position configs for left cards (St. Catharines - 5 bridges)
// Spread from 0% to 85% for full vertical coverage
const leftPositions = [
  { position: "-left-16 sm:-left-8 lg:left-[22%] top-[0%] lg:top-[0%]", delay: 0.6, floatDuration: 5 },
  { position: "-left-24 sm:-left-12 lg:left-[5%] top-[22%] lg:top-[20%]", delay: 0.7, floatDuration: 5.5 },
  { position: "-left-12 sm:-left-4 lg:left-[28%] top-[44%] lg:top-[42%]", delay: 0.8, floatDuration: 6 },
  { position: "-left-20 sm:-left-10 lg:left-[8%] top-[66%] lg:top-[64%]", delay: 0.9, floatDuration: 5.2 },
  { position: "-left-16 sm:-left-6 lg:left-[22%] top-[88%] lg:top-[86%]", delay: 1.0, floatDuration: 5.4 },
];

// Position configs for right cards (Montreal + 1 Port Colborne - 4 bridges)
// Spread from 5% to 80% and vertically centered
const rightPositions = [
  { position: "-right-16 sm:-right-8 lg:right-[22%] top-[5%] lg:top-[5%]", delay: 0.65, floatDuration: 5.3 },
  { position: "-right-24 sm:-right-12 lg:right-[5%] top-[30%] lg:top-[30%]", delay: 0.75, floatDuration: 5.8 },
  { position: "-right-12 sm:-right-4 lg:right-[28%] top-[55%] lg:top-[55%]", delay: 0.85, floatDuration: 6.2 },
  { position: "-right-20 sm:-right-10 lg:right-[8%] top-[80%] lg:top-[80%]", delay: 0.95, floatDuration: 5.5 },
];

// Dark background for icon container
function getStatusBg(): string {
  return "bg-[#0A0A0A] border border-[#1a1a1a]";
}

export function Hero() {
  const { bridges } = useData();
  const t = useTranslations("hero");
  const tStatus = useTranslations("bridgeStatus");

  // Memoize card computations to avoid unnecessary re-renders
  const { leftCards, rightCards } = useMemo(() => {
    // Fallback static cards for loading state
    const fallbackCards = {
      left: [
        { id: "f1", name: "Highway 20", status: "open", subtitle: tStatus("open"), regionId: "st-catharines" },
        { id: "f2", name: "Carlton St", status: "closed", subtitle: tStatus("closedOpensRange", { min: 8, max: 12 }), regionId: "st-catharines" },
        { id: "f3", name: "Glendale Ave", status: "closingSoon", subtitle: tStatus("closingSoonIn", { min: 3, max: 7 }), regionId: "st-catharines" },
        { id: "f4", name: "Queenston St", status: "open", subtitle: tStatus("open"), regionId: "st-catharines" },
        { id: "f5", name: "Lakeshore Rd", status: "open", subtitle: tStatus("open"), regionId: "st-catharines" },
      ],
      right: [
        { id: "f6", name: "Victoria Upstream", status: "open", subtitle: tStatus("open"), regionId: "montreal" },
        { id: "f7", name: "Victoria Downstream", status: "closed", subtitle: tStatus("closedOpensRange", { min: 5, max: 9 }), regionId: "montreal" },
        { id: "f8", name: "Ste-Catherine", status: "open", subtitle: tStatus("open"), regionId: "montreal" },
        { id: "f9", name: "Clarence St", status: "open", subtitle: tStatus("open"), regionId: "port-colborne" },
      ],
    };

    // Filter bridges by region
    const stCatharinesBridges = bridges.filter(b => b.regionId === "st-catharines");
    const montrealBridges = bridges.filter(b => b.regionId === "montreal");
    const portColborneBridges = bridges.filter(b => b.regionId === "port-colborne");

    // Right side: Montreal (3) + first Port Colborne bridge (1) = 4
    const rightSideBridges = [...montrealBridges, ...portColborneBridges.slice(0, 1)];

    // Use live data or fallback
    const left = stCatharinesBridges.length > 0
      ? stCatharinesBridges.map((bridge, i) => ({
          id: bridge.id,
          name: bridge.name,
          status: bridge.status,
          regionId: bridge.regionId,
          subtitle: getTranslatedStatusInfoText(tStatus, bridge.status, bridge.prediction, bridge.lastUpdated, bridge.upcomingClosure),
          ...leftPositions[i % leftPositions.length],
        }))
      : fallbackCards.left.map((card, i) => ({
          ...card,
          ...leftPositions[i % leftPositions.length],
        }));

    const right = rightSideBridges.length > 0
      ? rightSideBridges.map((bridge, i) => ({
          id: bridge.id,
          name: bridge.name,
          status: bridge.status,
          regionId: bridge.regionId,
          subtitle: getTranslatedStatusInfoText(tStatus, bridge.status, bridge.prediction, bridge.lastUpdated, bridge.upcomingClosure),
          ...rightPositions[i % rightPositions.length],
        }))
      : fallbackCards.right.map((card, i) => ({
          ...card,
          ...rightPositions[i % rightPositions.length],
        }));

    return { leftCards: left, rightCards: right };
  }, [bridges, tStatus]);

  return (
    <section className="relative min-h-screen pt-20 overflow-hidden bg-gradient-to-b from-[#f0f7ff] via-white to-white">
      {/* Radial gradient glow effects */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[var(--primary)]/8 rounded-full blur-3xl" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-400/8 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-t from-[var(--primary)]/15 to-transparent rounded-full blur-3xl" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-24 lg:pt-16 lg:pb-32">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="text-center"
        >
          {/* Eyebrow Tag */}
          <motion.div variants={item} className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/60 px-4 py-2 mb-6 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--status-open)] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--status-open)]"></span>
            </span>
            <span className="text-sm font-medium text-gray-700">{t("eyebrow")}</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={item}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-[var(--foreground)]"
          >
            {t("headline")}
            <br />
            <span className="text-[var(--primary)]">{t("headlineHighlight")}</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={item}
            className="mt-6 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            {t("subheadline")}
          </motion.p>

          {/* Badges */}
          <motion.div variants={item} className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/60 px-4 py-2 shadow-sm">
              <span className="text-base">🎉</span>
              <span className="text-sm font-medium text-gray-700">{t("badgeFree")}</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/60 px-4 py-2 shadow-sm">
              <span className="text-base">🚙</span>
              <span className="text-sm font-medium text-gray-700">{t("badgePlatform")}</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/60 px-4 py-2 shadow-sm">
              <span className="text-base">⛴️</span>
              <span className="text-sm font-medium text-gray-700">{t("badgeBoatTracking")}</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/60 px-4 py-2 shadow-sm">
              <span className="text-base">🌎</span>
              <span className="text-sm font-medium text-gray-700">{t("badgeLanguages")}</span>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div variants={item} className="mt-10">
            <a
              href="https://apps.apple.com/ca/app/bridge-up/id6557082394"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-[var(--foreground)] px-8 py-4 text-base font-medium text-white shadow-xl shadow-gray-900/20 hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              {t("ctaButton")}
            </a>
          </motion.div>
        </motion.div>

        {/* Phone with Floating Notification Cards */}
        <div className="relative mt-24 lg:mt-28">
          <div className="relative mx-auto max-w-6xl">
            {/* Left Side Floating Cards - St. Catharines */}
            <div className="absolute left-1/2 -translate-x-[240px] sm:-translate-x-[300px] lg:translate-x-0 lg:left-0 top-0 bottom-0 w-[200px] lg:w-[280px]">
              {leftCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: card.delay,
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                  }}
                  className={`absolute ${card.position}`}
                >
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: card.floatDuration,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.3,
                    }}
                  >
                    <Link href={`/bridges?region=${card.regionId}`}>
                      <motion.div
                        whileHover={{ scale: 1.05, x: 8 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="bg-white rounded-2xl shadow-xl shadow-gray-900/15 p-2.5 lg:p-3.5 max-w-[180px] lg:max-w-[220px] cursor-pointer"
                      >
                        <div className="flex items-center gap-2 lg:gap-3">
                          <div className={`w-8 h-8 lg:w-9 lg:h-9 rounded-full flex items-center justify-center shrink-0 ${getStatusBg()}`}>
                            <div style={card.status === "closingSoon" ? { transform: "translateY(3px)" } : undefined}>
                              <BridgeStatusIcon status={card.status} size={32} />
                            </div>
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-xs lg:text-sm text-gray-900 truncate">
                              {card.name}
                            </p>
                            <p className="text-[10px] lg:text-xs text-gray-500 mt-0.5">{card.subtitle}</p>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Right Side Floating Cards - Montreal */}
            <div className="absolute left-1/2 translate-x-[80px] sm:translate-x-[140px] lg:translate-x-0 lg:left-auto lg:right-0 top-0 bottom-0 w-[200px] lg:w-[280px]">
              {rightCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: card.delay,
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                  }}
                  className={`absolute ${card.position}`}
                >
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: card.floatDuration,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.4,
                    }}
                  >
                    <Link href={`/bridges?region=${card.regionId}`}>
                      <motion.div
                        whileHover={{ scale: 1.05, x: -8 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="bg-white rounded-2xl shadow-xl shadow-gray-900/15 p-2.5 lg:p-3.5 max-w-[180px] lg:max-w-[220px] cursor-pointer"
                      >
                        <div className="flex items-center gap-2 lg:gap-3">
                          <div className={`w-8 h-8 lg:w-9 lg:h-9 rounded-full flex items-center justify-center shrink-0 ${getStatusBg()}`}>
                            <div style={card.status === "closingSoon" ? { transform: "translateY(3px)" } : undefined}>
                              <BridgeStatusIcon status={card.status} size={32} />
                            </div>
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-xs lg:text-sm text-gray-900 truncate">
                              {card.name}
                            </p>
                            <p className="text-[10px] lg:text-xs text-gray-500 mt-0.5">{card.subtitle}</p>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Center Phone - 10% smaller */}
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8, type: "spring", stiffness: 200, damping: 25 }}
              className="relative mx-auto w-[252px] sm:w-[288px] lg:w-[324px]"
            >
              {/* Glow behind phone */}
              <div className="absolute -inset-8 bg-gradient-to-b from-[var(--primary)]/25 via-[var(--primary)]/15 to-transparent rounded-[4rem] blur-2xl" />

              {/* Phone Frame */}
              <div className="relative aspect-[9/19.5] rounded-[3rem] bg-gray-900 p-[6px] shadow-2xl shadow-gray-900/40">
                <div className="h-full w-full rounded-[2.6rem] overflow-hidden relative">
                  <Image
                    src="/screenshots/home.png"
                    alt={t("appScreenshotAlt")}
                    fill
                    sizes="(max-width: 640px) 252px, (max-width: 1024px) 288px, 324px"
                    className="object-cover object-top"
                    priority
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
