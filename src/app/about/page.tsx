"use client";

import { Header, Footer } from "@/components/layout";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--dark-bg)]">
        {/* Hero */}
        <section className="pt-32 pb-8 relative overflow-hidden">
          {/* Subtle gradient */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[var(--primary)]/10 to-transparent rounded-full blur-3xl" />

          <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <motion.p
              className="text-2xl sm:text-3xl lg:text-4xl text-white leading-relaxed font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Do you remember the first time you got stuck at a bridge?
            </motion.p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-12">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-lg text-[var(--dark-text-muted)] leading-relaxed">
                Maybe you were a kid in the backseat, watching in wonder as the massive structure
                lifted into the sky to let a ship pass through. There was something magical about it—this
                giant piece of infrastructure moving just for you to see.
              </p>

              <p className="text-lg text-[var(--dark-text-muted)] leading-relaxed">
                Then you grew up. And bridges became obstacles.
              </p>

              <p className="text-lg text-[var(--dark-text-muted)] leading-relaxed">
                You&apos;re running late for work. The kids need to get to school. You&apos;ve got
                exactly twelve minutes to make it across town—and then you see the barriers come down.
                The red lights start flashing. And you&apos;re stuck there, checking your watch,
                with absolutely no idea how long you&apos;ll be waiting.
              </p>

              <p className="text-xl text-white font-medium">
                We built Bridge Up to bring back a little bit of that wonder—and a lot more certainty.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="py-12">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-lg text-[var(--dark-text-muted)] leading-relaxed">
                Real-time status for every bridge. Predictions based on hundreds of past closures.
                Notifications the moment something changes. All the information scattered across
                unreliable sources, marine traffic reports, and local knowledge—unified into one
                beautiful, glanceable app.
              </p>

              <p className="text-lg text-[var(--dark-text-muted)] leading-relaxed">
                We obsess over the details. The perfectly timed notification that arrives before you
                leave home. The prediction confidence interval that tells you whether to wait or
                take the long way. The CarPlay interface designed for a two-second glance at 60 km/h.
              </p>

              <p className="text-xl text-white font-medium">
                We&apos;ll worry about the bridges. You just have a smooth crossing.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 border-t border-white/10">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {[
                { value: "13", label: "Bridges monitored" },
                { value: "4", label: "Regions covered" },
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
