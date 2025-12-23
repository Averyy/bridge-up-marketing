import { Metadata } from "next";
import BridgesContent from "./BridgesContent";

export const metadata: Metadata = {
  title: "Bridge Map",
  description:
    "Interactive map of all 15 monitored bridges across St. Catharines, Port Colborne, Montreal, Beauharnois, and Kahnawake. View real-time bridge status at a glance.",
};

export default function BridgesPage() {
  return <BridgesContent />;
}
