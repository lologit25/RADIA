import { About } from "@/components/site/About";
import { Band } from "@/components/site/Band";
import { Disciplines } from "@/components/site/Disciplines";
import { Education } from "@/components/site/Education";
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
        <Work index={1} total={TOTAL} />
        <Student index={2} total={TOTAL} />
        <Band />
        <About index={3} total={TOTAL} />
        <Education index={4} total={TOTAL} />
        <Disciplines index={5} total={TOTAL} />
      </main>
      <Footer />
    </>
  );
}
