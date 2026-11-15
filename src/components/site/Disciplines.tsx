import { profile } from "@/lib/projects";
import { GhostButton, SectionHead, T } from "./Bits";

const disciplines: Array<[string, string]> = [
  ["Redacción", "Copywriting"],
  ["Campañas", "Campaigns"],
  ["Film", "Film"],
  ["Gráfica", "Print"],
  ["Social", "Social"],
  ["Música", "Music"],
  ["Innovación", "Innovation"],
];

export function Disciplines({ index, total }: { index: number; total: number }) {
  return (
    <section className="disciplines" id="oficio">
      <SectionHead index={index} total={total} label={<T es="Disciplinas" en="Disciplines" />} />
      <div className="disciplines-grid">
        <div className="disciplines-copy">
          <h2 className="rv">
            <T
              es="Redacción creativa para campañas de film, gráfica, social y música."
              en="Creative copywriting for film, print, social and music campaigns."
            />
          </h2>
          <div className="rv">
            <GhostButton href={profile.linkedin}>
              <T es="Contacto" en="Contact" />
            </GhostButton>
          </div>
        </div>
        <ul className="disciplines-list" data-focus>
          {disciplines.map(([es, en]) => (
            <li key={es}>
              <T es={es} en={en} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
