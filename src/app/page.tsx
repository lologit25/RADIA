import { About } from "@/components/site/About";
import { Awards } from "@/components/site/Awards";
import { Disciplines } from "@/components/site/Disciplines";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/site/Hero";
import { Nav } from "@/components/site/Nav";
import { Work } from "@/components/site/Work";

const TOTAL = 4;

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Disciplines index={2} total={TOTAL} />
        <Work index={3} total={TOTAL} />
        <Awards index={4} total={TOTAL} />
      </main>
      <Footer />
    </>
  );
}
