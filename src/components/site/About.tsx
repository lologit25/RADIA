import career from "@/data/career.json";
import { profile } from "@/lib/projects";
import { GhostButton, SectionHead, T, Words } from "./Bits";

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
              es={`${profile.name} es redactor creativo en ${profile.company}, en ${profile.location}. Trabajó en campañas para Pepsi, Pilsen, FIAT, Tigo Paraguay, INAVI y Bagno & Company.`}
              en={`${profile.name} is a creative copywriter at ${profile.company}, in ${profile.location}. He has worked on campaigns for Pepsi, Pilsen, FIAT, Tigo Paraguay, INAVI and Bagno & Company.`}
            />
            <div className="rv">
              <GhostButton href={profile.linkedin}>LinkedIn</GhostButton>
            </div>
          </div>

          <div className="career">
            <p className="career-label rv">
              <i />
              <T es="Trayectoria" en="Experience" />
            </p>
            <ol className="career-list">
              {career.map((item, i) => (
                <li key={item.place} className="rv" style={{ transitionDelay: `${i * 120}ms` }}>
                  <span className="career-period">
                    <T es={item.period.es} en={item.period.en} />
                  </span>
                  <span className="career-place">{item.place}</span>
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
        </div>
      </div>
    </section>
  );
}
