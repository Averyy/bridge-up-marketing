import { Metadata } from "next";
import PricingContent from "./PricingContent";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Bridge Up is completely free. All features, all 15 bridges, no subscriptions, no paywalls. Real-time bridge status for the Welland Canal and St. Lawrence Seaway.",
};

export default function PricingPage() {
  return <PricingContent />;
}
