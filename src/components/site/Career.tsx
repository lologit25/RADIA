import career from "@/data/career.json";
import { profile } from "@/lib/projects";
import { GhostButton, SectionHead } from "./Bits";

export function Career({ index, total }: { index: number; total: number }) {
  return (
    <section className="career" id="trayectoria">
      <SectionHead index={index} total={total} label="Trayectoria" />
      <div className="career-grid">
        <div className="career-copy">
          <h2 className="rv">Trayectoria.</h2>
          <div className="rv">
            <GhostButton href={profile.linkedin}>LinkedIn</GhostButton>
          </div>
        </div>
        <ol className="career-list">
          {career.map((item) => (
            <li key={item.place} className="rv">
              <span className="career-period">{item.period}</span>
              <span className="career-place">{item.place}</span>
              <span className="career-role">
                <b>{item.role}</b>
                <span>{item.location}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
