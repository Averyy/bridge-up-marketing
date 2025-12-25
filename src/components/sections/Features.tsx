"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { RegionCards } from "@/components/RegionCards";

export function Features() {
  const t = useTranslations("features");

  return (
    <>
      {/* Two Feature Boxes Section */}
      <section className="relative bg-[var(--dark-bg)] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            className="text-center max-w-3xl mx-auto mb-12 lg:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[var(--primary)] font-medium text-sm uppercase tracking-wider">
              {t("smartTracking.tag")}
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {t("smartTracking.heading")}{" "}
              <span className="bg-gradient-to-r from-[var(--primary)] to-cyan-400 bg-clip-text text-transparent">
                {t("smartTracking.headingHighlight")}
              </span>
            </h2>
          </motion.div>

          {/* Two Feature Boxes */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Box - Real-time Notifications */}
            <motion.div
              className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] border border-white/10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              {/* Red Glow - subtle */}
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-red-500/20 via-rose-500/10 to-transparent rounded-full blur-3xl -translate-y-1/4 translate-x-1/4" />

              {/* Content */}
              <div className="relative p-8 lg:p-10 pb-0">
                <p className="text-lg lg:text-xl text-white leading-relaxed max-w-md">
                  <span className="font-semibold">{t("smartTracking.leftBox.title")}</span>{" "}
                  <span className="text-white/70">
                    {t("smartTracking.leftBox.description")}
                  </span>
                </p>
              </div>

              {/* Phone Mockup */}
              <div className="relative mt-8 flex justify-center">
                <div className="w-[260px] lg:w-[300px]">
                  {/* Phone Frame */}
                  <div className="aspect-[9/16] rounded-t-[2.5rem] bg-gray-900 p-[5px] shadow-2xl">
                    <div className="h-full w-full rounded-t-[2.2rem] overflow-hidden relative">
                      <Image
                        src="/screenshots/list.png"
                        alt={t("smartTracking.listViewAlt")}
                        fill
                        sizes="(max-width: 1024px) 260px, 300px"
                        className="object-cover object-top"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Box - Predictive Intelligence */}
            <motion.div
              className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] border border-white/10 min-h-[600px] lg:min-h-[700px]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {/* Blue/Cyan Glow */}
              <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-cyan-500/20 via-blue-500/15 to-transparent rounded-full blur-3xl -translate-y-1/4 -translate-x-1/4" />

              {/* Content */}
              <div className="relative p-8 lg:p-10 pb-4">
                <p className="text-lg lg:text-xl text-white leading-relaxed">
                  <span className="font-semibold">{t("smartTracking.rightBox.title")}</span>{" "}
                  <span className="text-white/70">
                    {t("smartTracking.rightBox.description")}
                  </span>
                </p>
              </div>

              {/* UI Screenshots - Centered and overlapping */}
              <div className="relative mt-4 flex justify-center items-end h-[450px] lg:h-[520px]">
                {/* Background Screenshot - Right, tilted */}
                <motion.div
                  className="absolute w-[200px] sm:w-[220px] lg:w-[260px] rotate-6 translate-x-[60px] sm:translate-x-[80px] lg:translate-x-[100px]"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  style={{ transform: 'translateX(80px) rotate(6deg)' }}
                >
                  <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                    <Image
                      src="/screenshots/detail-open.png"
                      alt={t("smartTracking.detailOpenAlt")}
                      width={260}
                      height={560}
                      className="w-full h-auto"
                    />
                  </div>
                </motion.div>

                {/* Foreground Screenshot - Left, tilted opposite */}
                <motion.div
                  className="absolute w-[200px] sm:w-[220px] lg:w-[260px] -rotate-3 -translate-x-[60px] sm:-translate-x-[80px] lg:-translate-x-[100px] z-10"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  style={{ transform: 'translateX(-80px) rotate(-3deg)' }}
                >
                  <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                    <Image
                      src="/screenshots/detail-closed.png"
                      alt={t("smartTracking.detailClosedAlt")}
                      width={260}
                      height={560}
                      className="w-full h-auto"
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CarPlay & Map Section */}
      <section className="relative bg-white py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[var(--primary)] font-medium text-sm uppercase tracking-wider">
              {t("builtForDrivers.tag")}
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--foreground)] leading-tight">
              {t("builtForDrivers.heading")}
            </h2>
            <p className="mt-6 text-lg text-gray-600">
              {t("builtForDrivers.description")}
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6 lg:gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            {[
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                  </svg>
                ),
                title: t("builtForDrivers.interactiveMap.title"),
                desc: t("builtForDrivers.interactiveMap.description"),
                gradient: "from-emerald-500 to-teal-600",
                glowColor: "emerald",
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                ),
                title: t("builtForDrivers.carPlayReady.title"),
                desc: t("builtForDrivers.carPlayReady.description"),
                gradient: "from-blue-500 to-indigo-600",
                glowColor: "blue",
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                ),
                title: t("builtForDrivers.locationAware.title"),
                desc: t("builtForDrivers.locationAware.description"),
                gradient: "from-violet-500 to-purple-600",
                glowColor: "violet",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
              >
                {/* Gradient glow on hover - using inline style for dynamic color */}
                <div
                  className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
                  style={{
                    backgroundColor: feature.glowColor === 'emerald' ? '#10b981' :
                                     feature.glowColor === 'blue' ? '#3b82f6' : '#8b5cf6',
                    transform: 'translateZ(0)'
                  }}
                />

                {/* Icon with gradient background */}
                <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>

                <h3 className="relative text-xl font-bold text-[var(--foreground)]">{feature.title}</h3>
                <p className="relative mt-3 text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Regions Section */}
      <section className="relative bg-gray-50 py-24 lg:py-32 overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[var(--primary)] font-medium text-sm uppercase tracking-wider">
              {t("coverageArea.tag")}
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--foreground)] leading-tight">
              {t("coverageArea.heading")}
            </h2>
            <p className="mt-6 text-lg text-gray-600">
              {t("coverageArea.description")}
            </p>
            <Link
              href="/bridges"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--foreground)] px-6 py-3 text-white font-medium hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
              </svg>
              {t("coverageArea.viewAllBridges")}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>

          <RegionCards variant="light" layout="masonry" />
        </div>
      </section>
    </>
  );
}
