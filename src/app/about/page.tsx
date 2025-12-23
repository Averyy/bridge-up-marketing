import { Metadata } from "next";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story behind Bridge Up. Built by a developer who was tired of getting stuck at bridges with no idea how long the wait would be.",
};

export default function AboutPage() {
  return <AboutContent />;
}
