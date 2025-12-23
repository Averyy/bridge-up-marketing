"use client";

import { motion } from "framer-motion";
import Image from "next/image";

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

// Floating notification cards - responsive positions
const notificationCards = [
  {
    id: 1,
    iconBg: "bg-green-500",
    icon: (
      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
    title: "Highway 20 • Now Open",
    subtitle: "Clear for the next 2+ hours",
    position: "-left-16 sm:-left-8 lg:left-[25%] top-[5%] lg:top-[2%]",
    delay: 0.6,
    floatDuration: 5,
    side: "left",
  },
  {
    id: 2,
    iconBg: "bg-red-500",
    icon: (
      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    ),
    title: "Carlton St • Closed",
    subtitle: "Opens in 12-20 min",
    highlight: true,
    position: "-left-24 sm:-left-12 lg:left-[5%] top-[28%] lg:top-[25%]",
    delay: 0.7,
    floatDuration: 5.5,
    side: "left",
  },
  {
    id: 3,
    iconBg: "bg-amber-500",
    icon: (
      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Glendale Ave • Closing",
    subtitle: "Closes in 3-7 minutes",
    position: "-left-12 sm:-left-4 lg:left-[30%] top-[52%] lg:top-[48%]",
    delay: 0.8,
    floatDuration: 6,
    side: "left",
  },
  {
    id: 4,
    iconBg: "bg-green-500",
    icon: (
      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
    title: "Queenston St",
    subtitle: "Open • No scheduled closures",
    position: "-left-20 sm:-left-10 lg:left-[8%] bottom-[25%] lg:bottom-[20%]",
    delay: 0.9,
    floatDuration: 5.2,
    side: "left",
  },
  {
    id: 5,
    iconBg: "bg-blue-500",
    icon: (
      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "3 bridges nearby",
    subtitle: "2 open, 1 closing soon",
    position: "-right-16 sm:-right-8 lg:right-[25%] top-[5%] lg:top-[2%]",
    delay: 0.65,
    floatDuration: 5.3,
    side: "right",
  },
  {
    id: 6,
    iconBg: "bg-orange-500",
    icon: (
      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Main St • Opens Soon",
    subtitle: "2-5 minutes remaining",
    highlight: true,
    position: "-right-24 sm:-right-12 lg:right-[5%] top-[28%] lg:top-[25%]",
    delay: 0.75,
    floatDuration: 5.8,
    side: "right",
  },
  {
    id: 7,
    iconBg: "bg-[var(--primary)]",
    icon: (
      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    title: "Status Changed",
    subtitle: "Lakeshore Rd is now open",
    position: "-right-12 sm:-right-4 lg:right-[30%] top-[52%] lg:top-[48%]",
    delay: 0.85,
    floatDuration: 6.2,
    side: "right",
  },
  {
    id: 8,
    iconBg: "bg-emerald-500",
    icon: (
      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    title: "Route Clear",
    subtitle: "All bridges on route are open",
    position: "-right-20 sm:-right-10 lg:right-[8%] bottom-[25%] lg:bottom-[20%]",
    delay: 0.95,
    floatDuration: 5.6,
    side: "right",
  },
];

export function Hero() {
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
            <span className="text-sm font-medium text-gray-700">Now tracking 15 bridges in real-time</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={item}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-[var(--foreground)]"
          >
            Never wait at a closed
            <br />
            <span className="text-[var(--primary)]">bridge again.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={item}
            className="mt-6 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Real-time bridge status and reopening predictions with CarPlay support. Built for St. Catharines, Welland, Port Colborne, and Montreal.
          </motion.p>

          {/* Badges */}
          <motion.div variants={item} className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/60 px-4 py-2 shadow-sm">
              <span className="text-base">🎉</span>
              <span className="text-sm font-medium text-gray-700">Always Free</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/60 px-4 py-2 shadow-sm">
              <span className="text-base">📱</span>
              <span className="text-sm font-medium text-gray-700">iOS & CarPlay</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/60 px-4 py-2 shadow-sm">
              <span className="text-base">🌉</span>
              <span className="text-sm font-medium text-gray-700">15 Bridges • 5 Regions</span>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div variants={item} className="mt-10">
            <div
              className="inline-flex items-center justify-center rounded-full bg-[var(--foreground)] px-8 py-4 text-base font-medium text-white shadow-xl shadow-gray-900/20"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Coming Soon on iOS
            </div>
          </motion.div>
        </motion.div>

        {/* Phone with Floating Notification Cards */}
        <div className="relative mt-24 lg:mt-28">
          <div className="relative mx-auto max-w-6xl">
            {/* Left Side Floating Cards */}
            <div className="absolute left-1/2 -translate-x-[240px] sm:-translate-x-[300px] lg:translate-x-0 lg:left-0 top-0 bottom-0 w-[200px] lg:w-[280px]">
              {notificationCards.filter(c => c.side === "left").map((card, index) => (
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
                    <motion.div
                      whileHover={{ scale: 1.05, x: 8 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="bg-white rounded-2xl shadow-xl shadow-gray-900/15 p-2.5 lg:p-3.5 max-w-[180px] lg:max-w-[220px] cursor-pointer"
                    >
                      <div className="flex items-center gap-2 lg:gap-3">
                        <div className={`w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center shrink-0 ${card.iconBg}`}>
                          {card.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-xs lg:text-sm text-gray-900 truncate">{card.title}</p>
                          <p className="text-[10px] lg:text-xs text-gray-500 mt-0.5">{card.subtitle}</p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Right Side Floating Cards */}
            <div className="absolute left-1/2 translate-x-[80px] sm:translate-x-[140px] lg:translate-x-0 lg:left-auto lg:right-0 top-0 bottom-0 w-[200px] lg:w-[280px]">
              {notificationCards.filter(c => c.side === "right").map((card, index) => (
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
                    <motion.div
                      whileHover={{ scale: 1.05, x: -8 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="bg-white rounded-2xl shadow-xl shadow-gray-900/15 p-2.5 lg:p-3.5 max-w-[180px] lg:max-w-[220px] cursor-pointer"
                    >
                      <div className="flex items-center gap-2 lg:gap-3">
                        <div className={`w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center shrink-0 ${card.iconBg}`}>
                          {card.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-xs lg:text-sm text-gray-900 truncate">{card.title}</p>
                          <p className="text-[10px] lg:text-xs text-gray-500 mt-0.5">{card.subtitle}</p>
                        </div>
                      </div>
                    </motion.div>
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
                    alt="Bridge Up app showing real-time bridge status"
                    fill
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
