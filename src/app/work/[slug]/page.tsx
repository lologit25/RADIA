import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow, GhostButton } from "@/components/site/Bits";
import { Blocks } from "@/components/site/Blocks";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { pad, projects } from "@/lib/projects";

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: [project.client, project.title].filter(Boolean).join(" · "),
    description: `${project.kind} — ${project.year}`,
  };
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { slug } = await params;
  const position = projects.findIndex((p) => p.slug === slug);
  if (position === -1) notFound();
  const project = projects[position];
  const next = projects[(position + 1) % projects.length];

  return (
    <>
      <Nav />
      <main className="project">
        <header className="project-head">
          <div className="section-head">
            <span>
              [ {pad(position + 1)} / {pad(projects.length)} ]
            </span>
            <span>{project.client ?? "Proyecto"}</span>
            <Link href="/#trabajos" className="project-back">
              ← Todos los trabajos
            </Link>
          </div>
          <h1 className="project-title">
            <span className="line">
              <span>{project.title}</span>
            </span>
          </h1>
          <dl className="project-meta">
            {project.client && (
              <div>
                <dt>Cliente</dt>
                <dd>{project.client}</dd>
              </div>
            )}
            <div>
              <dt>Formato</dt>
              <dd>{project.kind}</dd>
            </div>
            <div>
              <dt>Año</dt>
              <dd>{project.year}</dd>
            </div>
            {project.awards.length > 0 && (
              <div>
                <dt>Premios</dt>
                <dd className="project-awards">
                  {project.awards.map((award, i) => (
                    <span className="tag" key={i}>
                      {award.medal}
                    </span>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </header>

        <Blocks blocks={project.blocks} title={project.title} />

        <section className="project-info">
          <div>
            <h2>Créditos</h2>
            <dl className="credits">
              {project.credits.map((credit) => (
                <div key={credit.role} className="rv">
                  <dt>{credit.role}</dt>
                  <dd>{credit.names}</dd>
                </div>
              ))}
            </dl>
          </div>
          {project.awards.length > 0 && (
            <div>
              <h2>Reconocimientos</h2>
              <dl className="credits">
                {project.awards.map((award, i) => (
                  <div key={i} className="rv">
                    <dt>{award.medal}</dt>
                    <dd>
                      {award.festival}
                      {award.jury.length > 0 && <small>Jurado: {award.jury.join(", ")}</small>}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
          <div className="rv">
            <GhostButton href={project.behance}>Ver en Behance</GhostButton>
          </div>
        </section>

        <Link href={`/work/${next.slug}`} className="project-next">
          <span className="mono-note">Siguiente proyecto</span>
          <span className="project-next-title">
            {next.title}
            <Arrow />
          </span>
        </Link>
      </main>
      <Footer />
    </>
  );
}
