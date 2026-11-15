import { About } from "@/components/site/About";
import { Career } from "@/components/site/Career";
import { Disciplines } from "@/components/site/Disciplines";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/site/Hero";
import { Nav } from "@/components/site/Nav";
import { Student } from "@/components/site/Student";
import { Work } from "@/components/site/Work";

const TOTAL = 5;

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Disciplines index={2} total={TOTAL} />
        <Work index={3} total={TOTAL} />
        <Student index={4} total={TOTAL} />
        <Career index={5} total={TOTAL} />
      </main>
      <Footer />
    </>
  );
}
