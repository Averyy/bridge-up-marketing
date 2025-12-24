"use client";

import { Header, Footer } from "@/components/layout";
import { motion } from "framer-motion";

const features = [
  "Real-time status",
  "15 bridges tracked",
  "Interactive map",
  "Predictions",
  "CarPlay support",
  "Sort by distance",
  "Historical stats",
  "Multilingual",
];

export default function PricingContent() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero + Pricing Card - Unified Dark Background */}
        <section className="bg-[var(--dark-bg)] pt-32 pb-24 relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--primary)]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl" />

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center mb-12">
            <motion.p
              className="text-[var(--primary)] font-medium text-sm uppercase tracking-wider mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Pricing
            </motion.p>
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Completely{" "}
              <span className="bg-gradient-to-r from-[var(--primary)] to-cyan-400 bg-clip-text text-transparent">
                free
              </span>
            </motion.h1>
            <motion.p
              className="mt-6 text-xl text-[var(--dark-text-muted)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              All features. No subscriptions. No paywalls.
            </motion.p>
          </div>

          {/* Pricing Card */}
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="relative rounded-3xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 p-8 lg:p-12 backdrop-blur-sm overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* Glow effect */}
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[var(--primary)]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

              <div className="relative">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                  {/* Left side - Price */}
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-green-500/20 px-4 py-2 border border-green-500/30 mb-6">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                      </span>
                      <span className="text-green-400 text-sm font-medium">
                        Everything included
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-6xl lg:text-7xl font-bold text-white">$0</span>
                      <span className="text-xl text-white/60">forever</span>
                    </div>

                    <p className="mt-4 text-white/70 max-w-sm">
                      Bridge Up is free for everyone. All features, all bridges, no limits.
                    </p>
                  </div>

                  {/* Right side - Features */}
                  <div className="lg:w-1/2">
                    <p className="text-white/60 text-sm uppercase tracking-wider mb-4">
                      What&apos;s included
                    </p>
                    <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
                      {features.map((feature, i) => (
                        <motion.li
                          key={i}
                          className="flex items-center gap-3 text-white"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
                        >
                          <div className="w-5 h-5 rounded-full bg-[var(--primary)]/20 flex items-center justify-center flex-shrink-0">
                            <svg className="w-3 h-3 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-sm whitespace-nowrap">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Support Section - Buy me a coffee style */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px", amount: 0.1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl mx-auto mb-6">
                ☕
              </div>

              <h2 className="text-3xl font-bold text-[var(--foreground)]">
                Want to support Bridge Up?
              </h2>

              <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto">
                This is a side project, not a startup. If you find Bridge Up useful and want to
                help cover the costs of keeping it running (Apple developer fees, server hosting, etc.),
                you can buy me a coffee ☕
              </p>

              <a
                href="https://buymeacoffee.com/averyy"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center justify-center gap-3 rounded-full bg-amber-400 px-8 py-4 text-[var(--foreground)] font-semibold hover:bg-amber-300 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.216 6.415l-.132-.666c-.119-.598-.388-1.163-1.001-1.379-.197-.069-.42-.098-.57-.241-.152-.143-.196-.366-.231-.572-.065-.378-.125-.756-.192-1.133-.057-.325-.102-.69-.25-.987-.195-.4-.597-.634-.996-.788a5.723 5.723 0 00-.626-.194c-1-.263-2.05-.36-3.077-.416a25.834 25.834 0 00-3.7.062c-.915.083-1.88.184-2.75.5-.318.116-.646.256-.888.501-.297.302-.393.77-.177 1.146.154.267.415.456.692.58.36.162.737.284 1.123.366 1.075.238 2.189.331 3.287.37 1.218.05 2.437.01 3.65-.118.299-.033.598-.073.896-.119.352-.054.578-.513.474-.834-.124-.383-.457-.531-.834-.473-.466.074-.96.108-1.382.146-1.177.08-2.358.082-3.536.006a22.228 22.228 0 01-1.157-.107c-.086-.01-.18-.025-.258-.036-.243-.036-.484-.08-.724-.13-.111-.027-.111-.185 0-.212h.005c.277-.06.557-.108.838-.147h.002c.131-.009.263-.032.394-.048a25.076 25.076 0 013.426-.12c.674.019 1.347.067 2.017.144l.228.031c.267.04.533.088.798.145.392.085.895.113 1.07.542.055.137.08.288.111.431l.319 1.484a.237.237 0 01-.199.284h-.003c-.037.006-.075.01-.112.015a36.704 36.704 0 01-4.743.295 37.059 37.059 0 01-4.699-.304c-.14-.017-.293-.042-.417-.06-.326-.048-.649-.108-.973-.161-.393-.065-.768-.032-1.123.161-.29.16-.527.404-.675.701-.154.316-.199.66-.267 1-.069.34-.176.707-.135 1.056.087.753.613 1.365 1.37 1.502a39.69 39.69 0 0011.343.376.483.483 0 01.535.53l-.071.697-1.018 9.907c-.041.41-.047.832-.125 1.237-.122.637-.553 1.028-1.182 1.171-.577.131-1.165.2-1.756.205-.656.004-1.31-.025-1.966-.022-.699.004-1.556-.06-2.095-.58-.475-.458-.54-1.174-.605-1.793l-.731-7.013-.322-3.094c-.037-.351-.286-.695-.678-.678-.336.015-.718.3-.678.679l.228 2.185.949 9.112c.147 1.344 1.174 2.068 2.446 2.272.742.12 1.503.144 2.257.156.966.016 1.942.053 2.892-.122 1.408-.258 2.465-1.198 2.616-2.657.34-3.332.683-6.663 1.024-9.995l.215-2.087a.484.484 0 01.39-.426c.402-.078.787-.212 1.074-.518.455-.488.546-1.124.385-1.766zm-1.478.772c-.145.137-.363.201-.578.233-2.416.359-4.866.54-7.308.46-1.748-.06-3.477-.254-5.207-.498-.17-.024-.353-.055-.47-.18-.22-.236-.111-.71-.054-.995.052-.26.152-.609.463-.646.484-.057 1.046.148 1.526.22.577.088 1.156.159 1.737.212 2.48.226 5.002.19 7.472-.14.45-.06.899-.13 1.345-.21.399-.072.84-.206 1.08.206.166.281.188.657.162.974a.544.544 0 01-.169.364z"/>
                </svg>
                Buy me a coffee
              </a>

            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-gray-50 py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <motion.h2
              className="text-2xl font-bold text-[var(--foreground)] text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Frequently Asked Questions
            </motion.h2>

            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {[
                {
                  q: "Is Bridge Up really free?",
                  a: "Yes! Bridge Up is completely free with all features unlocked. No subscriptions, no in-app purchases, no paywalls.",
                },
                {
                  q: "Why is it free?",
                  a: "Bridge Up is a passion project. I built it because I was tired of getting stuck at bridges myself. My costs are minimal, so I'd rather make it free and useful for everyone.",
                },
                {
                  q: "How accurate are the predictions?",
                  a: "Our predictions use 95% confidence intervals based on the 300 most recent closures for each bridge. Most predictions are accurate within a few minutes. Keep in mind it's only an estimate using past closure data as a guide, meaning it can be wildly wrong at times.",
                },
                {
                  q: "Do you support Android?",
                  a: "Currently Bridge Up is iOS only, with full CarPlay support. Android support is on the roadmap for future development.",
                },
              ].map((faq, i) => (
                <div key={i} className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="font-semibold text-[var(--foreground)]">{faq.q}</h3>
                  <p className="mt-2 text-gray-600">{faq.a}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
