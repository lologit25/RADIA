import Image from "next/image";
import Link from "next/link";
import { kindLabel, pad, proProjects } from "@/lib/projects";
import { SectionHead, T } from "./Bits";

export function Work({ index, total }: { index: number; total: number }) {
  return (
    <section className="work" id="trabajos">
      <div className="work-head">
        <SectionHead index={index} total={total} label={<T es="Trabajos" en="Work" />} />
        <div className="work-intro">
          <h2 className="two-tone rv">
            <T es="Trabajo profesional." en="Professional work." />
            <br />
            <span>
              {pad(proProjects.length)} <T es="proyectos." en="projects." />
            </span>
          </h2>
        </div>
      </div>
      <ul className="work-grid">
        {proProjects.map((project, i) => (
          <li key={project.slug} className="rv" style={{ transitionDelay: `${(i % 3) * 90}ms` }}>
            <Link href={`/work/${project.slug}`} className="work-card">
              <span className="work-card-media">
                <Image
                  src={project.cover.src}
                  alt=""
                  width={project.cover.w}
                  height={project.cover.h}
                  sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 34vw"
                />
                <span className="work-card-index">{pad(i + 1)}</span>
              </span>
              <span className="work-card-bar">
                <span className="work-card-client">
                  {project.client} · <T es={project.kind} en={kindLabel(project.kind)} />
                </span>
                <span className="work-card-title">{project.title}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
