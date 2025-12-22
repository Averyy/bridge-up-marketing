import { Header, Footer } from "@/components/layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Bridge Up",
  description: "Bridge Up privacy policy. Learn how we protect your data.",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Dark Hero */}
        <section className="bg-[var(--dark-bg)] pt-32 pb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--primary)]/10 rounded-full blur-3xl" />
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 relative">
            <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
            <p className="mt-4 text-[var(--dark-text-muted)]">Last updated: December 2025</p>
          </div>
        </section>

        <div className="bg-white py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="prose prose-gray max-w-none">
            <h2>Our Philosophy</h2>
            <p>
              Bridge Up is designed with privacy as a priority. No personal information is required
              to use Bridge Up. We collect minimal data and never sell your information to third parties.
            </p>

            <h2>What We Collect</h2>

            <h3>Location Data</h3>
            <p>
              When you enable location features, we access your location to show nearby bridges
              and calculate distances. Your location is processed on-device and is never uploaded
              to our servers. We only request &quot;When In Use&quot; permission—no background tracking.
            </p>

            <h3>Usage Analytics</h3>
            <p>
              We collect anonymous usage data to improve the app, such as which features are used
              most often. This data cannot be used to identify you personally.
            </p>

            <h3>Bridge Data Cache</h3>
            <p>
              Bridge status information is cached locally on your device to enable offline
              functionality. This data is refreshed when you&apos;re online.
            </p>

            <h2>What We Don&apos;t Collect</h2>
            <ul>
              <li>No account or personal information required</li>
              <li>No background location tracking</li>
              <li>No Facebook or Google tracking code</li>
              <li>No advertising identifiers</li>
              <li>No selling of data to third parties</li>
            </ul>

            <h2>How We Use Information</h2>
            <p>We use collected information to:</p>
            <ul>
              <li>Provide bridge status and predictions</li>
              <li>Show bridges near your location (when permitted)</li>
              <li>Improve the app based on anonymous usage patterns</li>
              <li>Send notifications about bridge status (when enabled)</li>
            </ul>

            <h2>Data Security</h2>
            <p>
              All communication with our servers uses HTTPS encryption. Bridge data is cached
              locally on your device. We do not store personal information on our servers.
            </p>

            <h2>Third-Party Services</h2>
            <p>
              Bridge Up may use privacy-respecting third-party services for crash reporting
              and basic analytics. These services collect only anonymous, aggregated data.
            </p>

            <h2>Children&apos;s Privacy</h2>
            <p>
              Bridge Up does not knowingly collect information from children under 13.
              The app is intended for general audiences.
            </p>

            <h2>Your Rights</h2>
            <p>You can:</p>
            <ul>
              <li>Use the app without granting location access</li>
              <li>Disable notifications at any time</li>
              <li>Request deletion of any data we may have</li>
              <li>Access information about what data we hold</li>
            </ul>

            <h2>Changes to This Policy</h2>
            <p>
              We may update this policy from time to time. We&apos;ll notify you of significant
              changes through the app and update the date at the top of this page.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about privacy? Contact us at{" "}
              <a href="mailto:privacy@bridgeup.app" className="text-[var(--primary)]">privacy@bridgeup.app</a>
            </p>
          </div>
        </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
