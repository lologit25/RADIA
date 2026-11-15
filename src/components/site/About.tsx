import { profile } from "@/lib/projects";
import { GhostButton, T, Words } from "./Bits";

export function About() {
  return (
    <section className="about" id="sobre-mi">
      <div className="about-panel">
        <div className="about-inner">
          <span className="tag rv">
            <T es="Sobre mí" en="About me" />
          </span>
          <Words
            className="about-text"
            es={`${profile.name} es redactor creativo en ${profile.company}, en ${profile.location}. Trabajó en campañas para Pepsi, Pilsen, FIAT, Tigo Paraguay, INAVI y Bagno & Company.`}
            en={`${profile.name} is a creative copywriter at ${profile.company}, in ${profile.location}. He has worked on campaigns for Pepsi, Pilsen, FIAT, Tigo Paraguay, INAVI and Bagno & Company.`}
          />
          <div className="rv">
            <GhostButton href="/#trabajos">
              <T es="Ver trabajos" en="See work" />
            </GhostButton>
          </div>
        </div>
      </div>
    </section>
  );
}
