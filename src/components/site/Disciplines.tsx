import { profile } from "@/lib/projects";
import { GhostButton, SectionHead } from "./Bits";

const disciplines = ["Redacción", "Campañas", "Film", "Gráfica", "Social", "Música", "Innovación"];

export function Disciplines({ index, total }: { index: number; total: number }) {
  return (
    <section className="disciplines" id="oficio">
      <SectionHead index={index} total={total} label="Oficio" />
      <div className="disciplines-grid">
        <div className="disciplines-copy">
          <h2 className="rv">Escribo, pienso y bajo a tierra ideas para marcas grandes.</h2>
          <p className="rv">
            Films que se comentan en la sobremesa. Gráficas que no necesitan explicación. Campañas
            que arrancan en un titular y terminan en la calle.
          </p>
          <div className="rv">
            <GhostButton href={profile.behance}>Escribime</GhostButton>
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
