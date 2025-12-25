import { Header, Footer } from "@/components/layout";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { Link } from "@/i18n/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });

  return {
    title: t("privacy.title"),
    description: t("privacy.metaDescription"),
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "legal" });

  const showLanguageNotice = locale !== "en";

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Dark Hero */}
        <section className="bg-[var(--dark-bg)] pt-32 pb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--primary)]/10 rounded-full blur-3xl" />
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 relative">
            <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
            <p className="mt-4 text-[var(--dark-text-muted)]">Last updated December 2025</p>
          </div>
        </section>

        <div className="bg-white py-16 md:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            {/* Language Notice for non-English users */}
            {showLanguageNotice && (
              <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm">
                  {t("englishOnlyNotice")}{" "}
                  <Link href="/privacy" locale="en" className="text-blue-600 hover:underline font-medium">
                    {t("viewInEnglish")}
                  </Link>
                </p>
              </div>
            )}

            {/* Sections */}
            <div className="space-y-12">
              {/* Summary */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Summary in Plain Words</h2>
                <p className="text-gray-600 leading-relaxed">
                  There is no code or tracking from Facebook in the app. There is no code or tracking
                  from Google in the app. We do not require any PII (personally identifiable information)
                  to use Bridge Up. We use anonymous analytics only to improve the app.
                </p>
              </section>

              {/* Intro */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Intro</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    We want to make it clear how we use your data because that&apos;s what we want from
                    services we use. We appreciate your trust and handle your data carefully and sensibly.
                    By using our services you accept this privacy policy.
                  </p>
                  <p>
                    No private information is required in order to use Bridge Up. In the vast majority
                    of cases, we know nothing private about you.
                  </p>
                </div>
              </section>

              {/* What We Collect */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Collect</h2>
                <ul className="space-y-6 text-gray-600 leading-relaxed">
                  <li className="pl-4 border-l-2 border-[var(--primary)]">
                    <strong className="text-gray-900">Location Access:</strong> If you enable location access, we use it to show
                    bridges near you and calculate distances. Your location is processed on-device and
                    is never uploaded to our servers. We only request &quot;When In Use&quot; permission—there
                    is no background location tracking. When you close the app, location access stops
                    immediately.
                  </li>
                  <li className="pl-4 border-l-2 border-[var(--primary)]">
                    <strong className="text-gray-900">Bridge Data Cache:</strong> We cache bridge status information locally on
                    your device to enable offline functionality. This data is refreshed automatically
                    when you&apos;re online.
                  </li>
                  <li className="pl-4 border-l-2 border-[var(--primary)]">
                    <strong className="text-gray-900">Push Notifications:</strong> If you enable push notifications, we use random
                    alphanumeric tokens to send you bridge status alerts. Our server software stores
                    basic technical information, such as your IP address.
                  </li>
                  <li className="pl-4 border-l-2 border-[var(--primary)]">
                    <strong className="text-gray-900">CarPlay:</strong> If you use Bridge Up with CarPlay, the same privacy
                    principles apply—no additional data is collected.
                  </li>
                </ul>
              </section>

              {/* Analytics */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics</h2>
                <p className="text-gray-600 leading-relaxed">
                  Bridge Up collects anonymous statistics, such as the percentage of users who use
                  particular features, to improve the app. This data cannot be used to identify you
                  personally.
                </p>
              </section>

              {/* Ads */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Ads</h2>
                <p className="text-gray-600 leading-relaxed">
                  Bridge Up&apos;s app collects nothing for, or related to, ads.
                </p>
              </section>

              {/* How Information is Used */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How Information is Used</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    We use the information we collect to operate and improve our website, apps, and
                    customer support.
                  </p>
                  <p>
                    We do not share personal information with outside parties except to the extent
                    necessary to accomplish Bridge Up&apos;s functionality.
                  </p>
                  <p>
                    We may disclose your information in response to subpoenas, court orders, or other
                    legal requirements; to exercise our legal rights or defend against legal claims;
                    to investigate, prevent, or take action regarding illegal activities, suspected
                    fraud or abuse, violations of our policies; or to protect our rights and property.
                  </p>
                  <p>
                    In the future, we may sell to, buy, merge with, or partner with other businesses.
                    In such transactions, user information may be among the transferred assets.
                  </p>
                </div>
              </section>

              {/* How We Protect Information */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Protect Information</h2>
                <p className="text-gray-600 leading-relaxed">
                  We implement numerous security measures to help keep your information secure. For
                  instance, all communication with the app and website requires HTTPS encryption.
                </p>
              </section>

              {/* Your Rights */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    You can access or delete your personal information anytime by emailing us at{" "}
                    <a href="mailto:privacy@bridgeup.app" className="text-[var(--primary)] hover:underline">
                      privacy@bridgeup.app
                    </a>.
                  </p>
                  <p>You can also:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Use the app without granting location access</li>
                    <li>Disable notifications at any time in your device settings</li>
                    <li>Clear cached bridge data by reinstalling the app</li>
                  </ul>
                </div>
              </section>

              {/* California Compliance */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">California Online Privacy Protection Act Compliance</h2>
                <p className="text-gray-600 leading-relaxed">
                  We comply with the California Online Privacy Protection Act. We therefore will not
                  distribute your personal information to outside parties without your consent.
                </p>
              </section>

              {/* COPPA */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Children&apos;s Online Privacy Protection Act Compliance</h2>
                <p className="text-gray-600 leading-relaxed">
                  We never collect or maintain information at our website from those we actually know
                  are under 13, and no part of our website is structured to attract anyone under 13.
                </p>
              </section>

              {/* EU */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Information for European Union Customers</h2>
                <p className="text-gray-600 leading-relaxed">
                  By using our services and providing your information, you authorize us to collect,
                  use, and store your information outside of the European Union.
                </p>
              </section>

              {/* International */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">International Transfers of Information</h2>
                <p className="text-gray-600 leading-relaxed">
                  Information may be processed, stored, and used outside of the country in which you
                  are located. Data privacy laws vary across jurisdictions, and different laws may be
                  applicable to your data depending on where it is processed, stored, or used.
                </p>
              </section>

              {/* Future Changes */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Future Changes</h2>
                <p className="text-gray-600 leading-relaxed">
                  We can and likely will update our privacy policy in the future. Visit this page to
                  be aware of the policy you are agreeing to by using our services.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
