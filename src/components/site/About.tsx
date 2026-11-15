import career from "@/data/career.json";
import { profile } from "@/lib/projects";
import { GhostButton, SectionHead, T, Words } from "./Bits";

interface CareerItem {
  period: { es: string; en: string };
  place: string;
  role: { es: string; en: string };
  location: string;
  badge?: { es: string; en: string };
}

function CareerList({ label, items }: { label: React.ReactNode; items: CareerItem[] }) {
  return (
    <div className="career-block">
      <p className="career-label rv">
        <i />
        {label}
      </p>
      <ol className="career-list">
        {items.map((item, i) => (
          <li key={item.place} className="rv" style={{ transitionDelay: `${i * 120}ms` }}>
            <span className="career-period">
              <T es={item.period.es} en={item.period.en} />
            </span>
            <span className="career-place">
              {item.place}
              {item.badge && (
                <span className="career-now">
                  <i />
                  <T es={item.badge.es} en={item.badge.en} />
                </span>
              )}
            </span>
            <span className="career-role">
              <b>
                <T es={item.role.es} en={item.role.en} />
              </b>
              <span>{item.location}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function About({ index, total }: { index: number; total: number }) {
  return (
    <section className="about" id="sobre-mi">
      <div className="about-panel">
        <SectionHead index={index} total={total} label={<T es="Sobre mí" en="About me" />} />
        <div className="about-grid">
          <div className="about-intro">
            <h2 className="about-title">
              <span className="mask rv">
                <span>
                  <T es="Sobre mí." en="About me." />
                </span>
              </span>
            </h2>
            <Words
              className="about-text"
              es={`Soy ${profile.name}, redactor creativo. Desde 2024 soy parte del equipo creativo de ${profile.company}. Nos encargamos de la comunicación 360 de Tigo Paraguay y de muchas marcas locales como Pilsen, Pepsi, FIAT e INAVI.`}
              en={`I'm ${profile.name}, a creative copywriter. Since 2024 I've been part of the creative team at ${profile.company}. We handle 360 communication for Tigo Paraguay and for many local brands like Pilsen, Pepsi, FIAT and INAVI.`}
            />
            <div className="rv">
              <GhostButton href={profile.linkedin}>LinkedIn</GhostButton>
            </div>
          </div>

          <div className="career">
            <CareerList label={<T es="Trayectoria" en="Experience" />} items={career.experience} />
            <CareerList label={<T es="Educación" en="Education" />} items={career.education} />
          </div>
        </div>
      </div>
    </section>
  );
}
