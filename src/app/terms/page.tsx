import { Header, Footer } from "@/components/layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Bridge Up terms of service. By using the app, you agree to these terms for the free bridge status service.",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Dark Hero */}
        <section className="bg-[var(--dark-bg)] pt-32 pb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--primary)]/10 rounded-full blur-3xl" />
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 relative">
            <h1 className="text-4xl font-bold text-white">Terms of Service</h1>
            <p className="mt-4 text-[var(--dark-text-muted)]">Last updated: December 2025</p>
          </div>
        </section>

        <div className="bg-white py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="prose prose-gray max-w-none">
            <p>
              By using Bridge Up, you agree to these terms. If you don&apos;t agree, please don&apos;t use the app.
            </p>

            <h2>Free Trial & Service Access</h2>
            <p>
              During our beta period, all features are available free of charge. We may introduce
              paid subscription tiers in the future, which will be clearly communicated before any charges apply.
            </p>

            <h2>Service Refusal</h2>
            <p>
              Bridge Up reserves the right to refuse service to anyone, anywhere, anytime, for any reason.
            </p>

            <h2>Payment Terms</h2>
            <p>
              Any paid services operate through Apple&apos;s App Store subscription model. Apple handles
              all billing, refunds, and payment processing. Subscriptions auto-renew unless cancelled
              in your App Store settings.
            </p>

            <h2>Feature Modifications</h2>
            <p>
              We reserve the right to introduce, modify, or remove features at any time. We&apos;ll
              provide notice of significant changes through the app when possible.
            </p>

            <h2>Cancellation</h2>
            <p>
              You may discontinue using Bridge Up at any time. Manage or cancel subscriptions
              through your App Store settings. No refunds are provided for unused subscription periods.
            </p>

            <h2>Limited License</h2>
            <p>
              We grant you a non-exclusive, revocable license to use Bridge Up for its intended purpose.
              You may not:
            </p>
            <ul>
              <li>Scrape, copy, or redistribute our data</li>
              <li>Create derivative works based on the app</li>
              <li>Reverse engineer or decompile the app</li>
              <li>Use the app for any commercial purpose without permission</li>
            </ul>

            <h2>Intellectual Property</h2>
            <p>
              All content, design, and code in Bridge Up is protected by copyright. Report
              copyright concerns to <a href="mailto:legal@bridgeup.app" className="text-[var(--primary)]">legal@bridgeup.app</a>.
            </p>

            <h2>Disclaimer of Warranties</h2>
            <p>
              THE SERVICE IS PROVIDED &quot;AS IS&quot; WITH NO WARRANTIES WHATSOEVER. Bridge status
              information is provided for informational purposes only. We do not guarantee accuracy,
              timeliness, or completeness of any data. Bridge conditions can change rapidly without notice.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              Bridge Up assumes no liability for indirect, consequential, or special damages arising
              from your use of the service. This includes damages from:
            </p>
            <ul>
              <li>Reliance on bridge status information</li>
              <li>Missed appointments or delays</li>
              <li>Inaccurate predictions</li>
              <li>Service interruptions or errors</li>
            </ul>

            <h2>Indemnification</h2>
            <p>
              You agree to defend and hold harmless Bridge Up against any third-party claims
              arising from your use of the service or violation of these terms.
            </p>

            <h2>Termination</h2>
            <p>
              Bridge Up may suspend or terminate your access if you violate these terms or
              engage in conduct harmful to other users or the service.
            </p>

            <h2>Driving Safety</h2>
            <p>
              While Bridge Up supports CarPlay for safer in-vehicle use, you are responsible
              for safe driving practices. Never interact with the app in ways that distract
              from driving.
            </p>

            <h2>Governing Law</h2>
            <p>
              These terms are governed by the laws of Ontario, Canada. Any disputes shall be
              resolved in the courts of Ontario.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about these terms? Contact us at{" "}
              <a href="mailto:legal@bridgeup.app" className="text-[var(--primary)]">legal@bridgeup.app</a>
            </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
