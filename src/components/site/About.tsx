import { profile } from "@/lib/projects";
import { GhostButton, Words } from "./Bits";

export function About() {
  return (
    <section className="about" id="sobre-mi">
      <div className="about-panel">
        <div className="about-inner">
          <span className="tag rv">Sobre mí</span>
          <Words
            className="about-text"
            text={`${profile.name} es redactor creativo en ${profile.company}, en ${profile.location}. Escribe campañas, films y gráficas para marcas como Pepsi, Pilsen, FIAT, Santander y Coca-Cola.`}
          />
          <div className="rv">
            <GhostButton href="/#trabajos">Ver trabajos</GhostButton>
          </div>
        </div>
      </div>
    </section>
  );
}
