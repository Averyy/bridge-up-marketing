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
            <p className="mt-4 text-[var(--dark-text-muted)]">Last updated December 2025</p>
          </div>
        </section>

        <div className="bg-white py-16 md:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            {/* Intro section */}
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p>
                This document (the &quot;Agreement&quot;) sets forth the terms and conditions that
                govern your use of the app or services offered by Bridge Up. Your use of any of
                our services will constitute acceptance of this Agreement.
              </p>

              <p className="font-semibold text-gray-900 bg-gray-50 p-4 rounded-lg border-l-4 border-[var(--primary)]">
                PLEASE READ CAREFULLY BEFORE USING BRIDGE UP. YOUR USE OF THE SERVICE IS SUBJECT
                TO THESE TERMS. YOU AGREE TO BE BOUND BY THE TERMS PRESENTED BELOW. IF YOU DO NOT
                AGREE TO THESE TERMS, DO NOT USE BRIDGE UP IN ANY WAY OR FOR ANY PURPOSE WHATSOEVER.
              </p>

              <p>
                These Terms are accepted by you when you actually use Bridge Up. You may print a
                copy of these Terms for your records. These Terms remain effective from the date
                of acceptance until terminated by you or Bridge Up in accordance with this Agreement.
              </p>

              <p>
                You cannot accept these Terms if: (a) you are not lawfully entitled to use the
                Service under any applicable laws in the country in which you are located or
                resident; or (b) if you are not of legal age to form a binding agreement. By
                accepting these terms you acknowledge and agree that you have reached the age to
                enter into such binding agreement or that you have your parent or legal guardian&apos;s
                permission if required by applicable law.
              </p>
            </div>

            {/* Sections */}
            <div className="mt-16 space-y-12">
              {/* Free Service */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Free Service</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Bridge Up is provided completely free of charge. All features are available to all
                    users at no cost. There are no subscriptions, premium tiers, or paywalls.
                  </p>
                  <p>
                    Because Bridge Up is a free service, we reserve the right to modify, suspend, or
                    discontinue the service at any time, for any reason, without notice or liability.
                    You acknowledge that Bridge Up has no obligation to maintain, support, or update
                    the service.
                  </p>
                </div>
              </section>

              {/* Voluntary Contributions */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Voluntary Contributions</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Users may choose to support Bridge Up&apos;s development through voluntary contributions
                    via Buy Me a Coffee or similar platforms. These contributions are entirely optional
                    and are considered donations to support ongoing development costs.
                  </p>
                  <p className="font-semibold text-gray-900 bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
                    Important: Voluntary contributions do not constitute payment for services. Contributors
                    do not receive any additional features, priority support, or guaranteed service
                    availability. Contributions are non-refundable, including in the event that Bridge Up
                    is modified, suspended, or discontinued.
                  </p>
                </div>
              </section>

              {/* Right to Refuse Service */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Right to Refuse Service</h2>
                <p className="text-gray-600 leading-relaxed">
                  Bridge Up reserves the right to refuse service to anyone, anywhere, anytime, for any
                  reason. Such as, but not limited to: using the app for unintended purposes, using an
                  unreasonable amount of resources, or abuse of the terms, as defined solely by Bridge Up
                  at our discretion.
                </p>
              </section>

              {/* New Features */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">New Features and Modifications</h2>
                <p className="text-gray-600 leading-relaxed">
                  We may from time to time introduce new features to the service or modify or delete
                  existing features. We will post any new or modified features when they become available,
                  as well as any new or modified terms of this Agreement. Any new or modified terms will
                  become effective upon posting.
                </p>
              </section>

              {/* Limited License */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Limited License</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    We grant to you a limited, non-sublicensable, non-exclusive and revocable license to
                    access and make use of Bridge Up solely in accordance with, and subject to, these Terms.
                  </p>
                  <p>Except as otherwise expressly permitted by these Terms, you may not:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Collect, use, copy or distribute any portion of Bridge Up or its data</li>
                    <li>Resell, publicly perform or publicly display any portion of the service</li>
                    <li>Modify or otherwise make any derivative uses of Bridge Up</li>
                    <li>
                      Use any &quot;deep-link,&quot; &quot;page-scrape,&quot; &quot;robot,&quot; &quot;spider&quot; or other automatic
                      device to access, acquire, copy, or monitor any portion of Bridge Up
                    </li>
                    <li>Use Bridge Up in a manner which depletes service resources</li>
                    <li>Use Bridge Up other than for its intended purposes</li>
                  </ul>
                </div>
              </section>

              {/* Notices and Claims */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Notices and Claims</h2>
                <p className="text-gray-600 leading-relaxed">
                  If you believe that anything in Bridge Up infringes upon any copyright which you own
                  or control, you may send a notification to:{" "}
                  <a href="mailto:legal@bridgeup.app" className="text-[var(--primary)] hover:underline">
                    legal@bridgeup.app
                  </a>.
                </p>
              </section>

              {/* Termination */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination of Terms</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Without limiting other remedies, Bridge Up may suspend or terminate this Agreement
                    with you, or may terminate or suspend your use of the Services at any time if:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>You are in default of these Terms</li>
                    <li>You are engaged in illegal actions or infringe rights of any third parties</li>
                    <li>Required by applicable laws/regulations</li>
                    <li>You are using Bridge Up as not originally intended</li>
                    <li>You are causing extreme usage of resources, determined at our sole discretion</li>
                    <li>We decide to cease offering the Services generally</li>
                  </ul>
                  <p>
                    Upon termination of this Agreement: (a) all licenses and rights to use the Services
                    shall immediately terminate; (b) you will immediately cease any and all use of the
                    Services.
                  </p>
                </div>
              </section>

              {/* Exclusion of Warranties */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Exclusion of Warranties</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p className="font-semibold text-gray-900 bg-gray-50 p-4 rounded-lg border-l-4 border-gray-400">
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW: THE SERVICES ARE PROVIDED &quot;AS IS&quot; AND USED
                    AT YOUR SOLE RISK WITH NO WARRANTIES WHATSOEVER. BRIDGE UP DOES NOT MAKE ANY
                    WARRANTIES, CLAIMS OR REPRESENTATIONS AND EXPRESSLY DISCLAIMS ALL SUCH WARRANTIES
                    OF ANY KIND, WHETHER EXPRESS, IMPLIED OR STATUTORY, WITH RESPECT TO THE SERVICES
                    INCLUDING, WITHOUT LIMITATION, WARRANTIES OR CONDITIONS OF QUALITY, PERFORMANCE,
                    NON-INFRINGEMENT, MERCHANTABILITY, OR FITNESS FOR USE FOR A PARTICULAR PURPOSE.
                  </p>
                  <p>
                    Bridge Up further does not represent or warrant that the Services will always be
                    available, accessible, uninterrupted, timely, secure, accurate, complete and
                    error-free.
                  </p>
                  <p>
                    Bridge status information is provided for informational purposes only. We do not
                    guarantee accuracy, timeliness, or completeness of any data. Bridge conditions can
                    change rapidly without notice. You should always verify bridge status through
                    official sources before making travel decisions.
                  </p>
                </div>
              </section>

              {/* Limitation of Liability */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p className="font-semibold text-gray-900 bg-gray-50 p-4 rounded-lg border-l-4 border-gray-400">
                    YOU ACKNOWLEDGE AND AGREE THAT BRIDGE UP SHALL HAVE NO LIABILITY WHATSOEVER, WHETHER
                    IN CONTRACT, TORT (INCLUDING NEGLIGENCE) OR ANY OTHER THEORY OF LIABILITY, IN
                    CONNECTION WITH OR ARISING FROM YOUR USE OF THE SERVICES.
                  </p>
                  <p>
                    Your only right or remedy with respect to any problems or dissatisfaction with the
                    Services is to immediately cease use of the Services.
                  </p>
                  <p>
                    Bridge Up shall not be liable for: (a) any indirect, special, incidental or
                    consequential damages; (b) any loss of income, business, actual or anticipated
                    profits, opportunity, goodwill or reputation; (c) any damage to or corruption of
                    data; (d) any damages arising from reliance on bridge status information, missed
                    appointments, delays, or inaccurate predictions.
                  </p>
                </div>
              </section>

              {/* Indemnification */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Indemnification</h2>
                <p className="text-gray-600 leading-relaxed">
                  If any third party brings a claim against Bridge Up in connection with, or arising
                  out of: breach of these Terms; breach of any applicable law or regulation; your
                  infringement or violation of the rights of any third parties, you will indemnify
                  and hold Bridge Up harmless from and against all damages, liability, loss, costs
                  and expenses (including reasonable legal fees and costs) related to such claim.
                </p>
              </section>

              {/* Driving Safety */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Driving Safety</h2>
                <p className="text-gray-600 leading-relaxed">
                  While Bridge Up supports CarPlay for safer in-vehicle use, you are solely responsible
                  for safe driving practices. Never interact with the app in ways that distract from
                  driving. Bridge Up assumes no liability for accidents or incidents that occur while
                  using the app.
                </p>
              </section>

              {/* Confidentiality */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Confidentiality and Security</h2>
                <p className="text-gray-600 leading-relaxed">
                  We are committed to respecting your privacy and the confidentiality of your personal
                  information. We will process your personal information in accordance with our{" "}
                  <a href="/privacy" className="text-[var(--primary)] hover:underline">Privacy Policy</a>.
                  Please read it carefully before using the Services.
                </p>
              </section>

              {/* COPPA */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Children&apos;s Online Privacy Protection Act Compliance</h2>
                <p className="text-gray-600 leading-relaxed">
                  We never collect or maintain information from those we actually know are under 13,
                  and no part of our service is structured to attract anyone under 13.
                </p>
              </section>

              {/* Miscellaneous */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Miscellaneous</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    These Terms constitute the entire agreement between you and Bridge Up with respect
                    to your use of the Services. If any provision of these Terms is found by any court
                    or administrative body of competent jurisdiction to be illegal, invalid or
                    unenforceable, then such provision shall be removed from the Terms without affecting
                    the legality, validity or enforceability of the remainder of the Terms.
                  </p>
                  <p>
                    We may make changes to these Terms from time to time and we will publish the changes
                    on this page. Your continued use of the Services following the posting of such changes
                    constitutes your acceptance of the updated Terms.
                  </p>
                  <p>
                    If we are unable to provide the Services as a result of force majeure, we will not
                    be in breach of any of our obligations towards you under these Terms.
                  </p>
                  <p>
                    These Terms shall be governed by and interpreted in accordance with the laws of
                    Ontario, Canada without regard to conflict of laws provisions. The exclusive
                    jurisdiction and venue of any action with respect to the subject matter of these
                    Terms will be the courts located in Ontario, Canada.
                  </p>
                </div>
              </section>

              {/* Contact */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact</h2>
                <p className="text-gray-600 leading-relaxed">
                  Questions about these terms? Contact us at{" "}
                  <a href="mailto:legal@bridgeup.app" className="text-[var(--primary)] hover:underline">
                    legal@bridgeup.app
                  </a>
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
