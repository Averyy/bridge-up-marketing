import { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { Hero, Features, Download } from "@/components/sections";
import { localeAlternates } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return {
    alternates: localeAlternates(locale),
  };
}

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <Download />
      </main>
      <Footer />
    </>
  );
}
