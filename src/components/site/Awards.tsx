import Link from "next/link";
import { pad, projects } from "@/lib/projects";
import { Arrow, SectionHead } from "./Bits";

const awards = projects.flatMap((project) =>
  project.awards.map((award) => ({ ...award, project })),
);

export function Awards({ index, total }: { index: number; total: number }) {
  return (
    <section className="awards" id="premios">
      <SectionHead index={index} total={total} label="Premios" />
      <div className="awards-grid">
        <h2 className="rv">Premios.</h2>
        <ol className="awards-list">
          {awards.map((award, i) => (
            <li key={i} className="rv">
              <Link href={`/work/${award.project.slug}`}>
                <span className="awards-num">{pad(i + 1)}</span>
                <span className="awards-medal">{award.medal}</span>
                <span className="awards-meta">
                  <b>{award.festival}</b>
                  <span>
                    {award.project.client ? `${award.project.client} — ` : ""}
                    {award.project.title}
                    {award.project.group === "student" ? " · Estudiante" : ""}
                  </span>
                </span>
                <Arrow className="awards-arrow" />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
