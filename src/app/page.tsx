import { Header, Footer } from "@/components/layout";
import { Hero, Features, Download } from "@/components/sections";

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
