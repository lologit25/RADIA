import career from "@/data/career.json";
import { profile } from "@/lib/projects";
import { GhostButton, SectionHead, T } from "./Bits";

export function Career({ index, total }: { index: number; total: number }) {
  return (
    <section className="career" id="trayectoria">
      <SectionHead index={index} total={total} label={<T es="Trayectoria" en="Background" />} />
      <div className="career-grid">
        <div className="career-copy">
          <h2 className="rv">
            <T es="Trayectoria." en="Background." />
          </h2>
          <div className="rv">
            <GhostButton href={profile.linkedin}>LinkedIn</GhostButton>
          </div>
        </div>
        <ol className="career-list">
          {career.map((item) => (
            <li key={item.place} className="rv">
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
    </section>
  );
}
