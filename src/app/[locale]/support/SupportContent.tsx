"use client";

import { Header, Footer } from "@/components/layout";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function SupportContent() {
  const t = useTranslations("support");

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--dark-bg)]">
        {/* Hero */}
        <section className="pt-40 pb-16 relative overflow-hidden">
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

        {/* Contact Section */}
        <section className="pb-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="bg-white/5 border border-white/10 rounded-2xl p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-semibold text-white mb-3">
                {t("contact.heading")}
              </h2>
              <p className="text-[var(--dark-text-muted)] mb-6">
                {t("contact.description")}
              </p>
              <a
                href="mailto:support@bridgeup.app"
                className="inline-flex items-center gap-3 bg-[var(--primary)] text-white px-6 py-3 rounded-full font-medium hover:bg-[var(--primary-dark)] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                support@bridgeup.app
              </a>
            </motion.div>
          </div>
        </section>

        {/* App Info */}
        <section className="py-16 border-t border-b border-white/10 bg-[var(--dark-bg-deeper)]">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-lg font-semibold text-white mb-6">
                {t("appInfo.heading")}
              </h2>
              <dl className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
                <div>
                  <dt className="text-[var(--dark-text-muted)] mb-1">{t("appInfo.appName")}</dt>
                  <dd className="font-medium text-white">Bridge Up</dd>
                </div>
                <div>
                  <dt className="text-[var(--dark-text-muted)] mb-1">{t("appInfo.platform")}</dt>
                  <dd className="font-medium text-white">iOS 26+</dd>
                </div>
                <div>
                  <dt className="text-[var(--dark-text-muted)] mb-1">{t("appInfo.developer")}</dt>
                  <dd className="font-medium text-white">Avery Levitt</dd>
                </div>
                <div>
                  <dt className="text-[var(--dark-text-muted)] mb-1">{t("appInfo.contact")}</dt>
                  <dd className="font-medium text-white">support@bridgeup.app</dd>
                </div>
              </dl>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
