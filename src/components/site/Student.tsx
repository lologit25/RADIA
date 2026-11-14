import Image from "next/image";
import Link from "next/link";
import { studentProjects } from "@/lib/projects";
import { SectionHead } from "./Bits";

export function Student({ index, total }: { index: number; total: number }) {
  return (
    <section className="student" id="estudiante">
      <SectionHead index={index} total={total} label="Estudiante" />
      <div className="student-grid">
        <div className="student-copy rv">
          <h2>Trabajos de estudiante.</h2>
          <p className="mono-note">Proyectos de la etapa de formación, aparte del trabajo en agencia.</p>
        </div>
        <ul className="student-list">
          {studentProjects.map((project) => (
            <li key={project.slug} className="rv">
              <Link href={`/work/${project.slug}`}>
                <span className="student-thumb">
                  <Image
                    src={project.cover.src}
                    alt=""
                    width={project.cover.w}
                    height={project.cover.h}
                    sizes="(max-width: 900px) 50vw, 18vw"
                  />
                </span>
                <span className="student-title">{project.title}</span>
                <span className="student-meta">
                  {project.client ? `${project.client} · ` : ""}
                  {project.year}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
