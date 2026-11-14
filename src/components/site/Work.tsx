import { projects } from "@/lib/projects";
import { SectionHead } from "./Bits";
import { WorkList } from "./WorkList";

export function Work({ index, total }: { index: number; total: number }) {
  return (
    <section className="work" id="trabajos">
      <SectionHead index={index} total={total} label="Trabajos" />
      <div className="work-intro">
        <h2 className="two-tone rv">
          {projects.length === 12 ? "Doce" : projects.length} campañas.
          <br />
          <span>Cero relleno.</span>
        </h2>
        <p className="mono-note rv">(Seleccioná un proyecto para ver el caso completo)</p>
      </div>
      <WorkList />
    </section>
  );
}
