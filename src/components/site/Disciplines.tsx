import { profile } from "@/lib/projects";
import { GhostButton, SectionHead } from "./Bits";

const disciplines = ["Redacción", "Campañas", "Film", "Gráfica", "Social", "Música", "Innovación"];

export function Disciplines({ index, total }: { index: number; total: number }) {
  return (
    <section className="disciplines" id="oficio">
      <SectionHead index={index} total={total} label="Disciplinas" />
      <div className="disciplines-grid">
        <div className="disciplines-copy">
          <h2 className="rv">Redacción creativa para campañas de film, gráfica, social y música.</h2>
          <div className="rv">
            <GhostButton href={profile.behance}>Contacto</GhostButton>
          </div>
        </div>
        <ul className="disciplines-list" data-focus>
          {disciplines.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
