"use client";

import { Header, Footer } from "@/components/layout";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function AboutContent() {
  const t = useTranslations("about");

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--dark-bg)]">
        {/* Hero */}
        <section className="pt-40 pb-16 relative overflow-hidden">
          {/* Subtle gradient */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[var(--primary)]/10 to-transparent rounded-full blur-3xl" />

          <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl text-white font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {t("heading")}
            </motion.h1>
          </div>
        </section>

        {/* Story Section */}
        <section className="pt-12 pb-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-lg text-[var(--dark-text-muted)] leading-relaxed">
                {t("story.paragraph1")}
              </p>

              <p className="text-lg text-[var(--dark-text-muted)] leading-relaxed">
                {t("story.paragraph2")}
              </p>

              <p className="text-lg text-[var(--dark-text-muted)] leading-relaxed">
                {t("story.paragraph3")}
              </p>

              <p className="text-lg text-[var(--dark-text-muted)] leading-relaxed">
                {t("story.paragraph4")}{" "}
                <a
                  href="mailto:support@bridgeup.app"
                  className="text-[var(--primary)] hover:underline"
                >
                  {t("story.email")}
                </a>
                {" "}{t("story.or")}{" "}
                <a
                  href="https://www.linkedin.com/in/avery-levitt/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--primary)] hover:underline"
                >
                  {t("story.linkedin")}
                </a>
                {t("story.paragraph4End")}{" "}
                <a
                  href="https://buymeacoffee.com/averyy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--primary)] hover:underline"
                >
                  {t("story.buyMeCoffee")}
                </a>
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 border-t border-b border-white/10 bg-[var(--dark-bg-deeper)]">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {[
                { value: "15", label: t("stats.bridgesMonitored") },
                { value: "5", label: t("stats.regionsCovered") },
                { value: "300+", label: t("stats.closuresAnalyzed") },
                { value: "95%", label: t("stats.predictionConfidence") },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <p className="text-4xl lg:text-5xl font-bold text-white">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm text-[var(--dark-text-muted)]">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
