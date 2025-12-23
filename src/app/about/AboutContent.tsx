"use client";

import { Header, Footer } from "@/components/layout";
import { motion } from "framer-motion";

export default function AboutContent() {
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
              The bridge was up.
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
                If you live near the Welland Canal, you know the frustration. You&apos;re running late,
                you hit the bridge, and the bridge is up. No idea how long you&apos;ll be waiting.
              </p>

              <p className="text-lg text-[var(--dark-text-muted)] leading-relaxed">
                The official Seaway website exists, but it&apos;s clunky and not something you can
                safely check while driving. They&apos;ve been promising a redesign for years. They
                eventually added Google and Waze integration, but in practice it&apos;s slow and
                unreliable. I wanted something I could actually glance at on CarPlay.
              </p>

              <p className="text-lg text-[var(--dark-text-muted)] leading-relaxed">
                So I built Bridge Up. A simple app that does one thing well: tells you if the bridge
                is open before you get there.
              </p>

              <p className="text-lg text-[var(--dark-text-muted)] leading-relaxed">
                Bridge Up is a work in progress. Got ideas or feedback? Reach out via{" "}
                <a
                  href="mailto:support@bridgeup.app"
                  className="text-[var(--primary)] hover:underline"
                >
                  email
                </a>
                {" "}or{" "}
                <a
                  href="https://www.linkedin.com/in/avery-levitt/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--primary)] hover:underline"
                >
                  LinkedIn
                </a>
                . And if you find it useful, you can{" "}
                <a
                  href="https://buymeacoffee.com/averyy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--primary)] hover:underline"
                >
                  buy me a coffee ☕
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
                { value: "15", label: "Bridges monitored" },
                { value: "5", label: "Regions covered" },
                { value: "300+", label: "Closures analyzed per bridge" },
                { value: "95%", label: "Prediction confidence" },
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
