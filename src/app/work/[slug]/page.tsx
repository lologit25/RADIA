import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow, GhostButton, T } from "@/components/site/Bits";
import { Blocks } from "@/components/site/Blocks";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { kindLabel, medalLabel, pad, projects } from "@/lib/projects";

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
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  const group = projects.filter((p) => p.group === project.group);
  const position = group.indexOf(project);
  const next = group[(position + 1) % group.length];
  const groupLabel =
    project.group === "student" ? <T es="Estudiante" en="Student" /> : <T es="Profesional" en="Professional" />;
  const backHref = project.group === "student" ? "/#estudiante" : "/#trabajos";

  return (
    <>
      <Nav />
      <main className="project">
        <header className="project-head">
          <div className="section-head">
            <span>
              [ {pad(position + 1)} / {pad(group.length)} ]
            </span>
            <span>{groupLabel}</span>
            <Link href={backHref} className="project-back">
              ← <T es="Volver" en="Back" />
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
                <dt>
                  <T es="Cliente" en="Client" />
                </dt>
                <dd>{project.client}</dd>
              </div>
            )}
            <div>
              <dt>
                <T es="Formato" en="Format" />
              </dt>
              <dd>
                <T es={project.kind} en={kindLabel(project.kind)} />
              </dd>
            </div>
            <div>
              <dt>
                <T es="Año" en="Year" />
              </dt>
              <dd>{project.year}</dd>
            </div>
            {project.awards.length > 0 && (
              <div>
                <dt>
                  <T es="Premios" en="Awards" />
                </dt>
                <dd className="project-awards">
                  {project.awards.map((award, i) => (
                    <span className="tag" key={i}>
                      <T es={award.medal} en={medalLabel(award.medal)} />
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
            <h2>
              <T es="Créditos" en="Credits" />
            </h2>
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
              <h2>
                <T es="Reconocimientos" en="Recognition" />
              </h2>
              <dl className="credits">
                {project.awards.map((award, i) => (
                  <div key={i} className="rv">
                    <dt>
                      <T es={award.medal} en={medalLabel(award.medal)} />
                    </dt>
                    <dd>
                      {award.festival}
                      {award.jury.length > 0 && (
                        <small>
                          <T es="Jurado" en="Jury" />: {award.jury.join(", ")}
                        </small>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
          <div className="rv">
            <GhostButton href={project.behance}>
              <T es="Ver en Behance" en="View on Behance" />
            </GhostButton>
          </div>
        </section>

        <Link href={`/work/${next.slug}`} className="project-next">
          <span className="mono-note">
            <T es="Siguiente proyecto" en="Next project" />
          </span>
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
