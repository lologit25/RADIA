import Image from "next/image";
import { clients, profile, projects } from "@/lib/projects";

const reel = projects.slice(0, 8);

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-reel" aria-hidden="true">
        <div className="hero-reel-glow" />
        <div className="hero-reel-frame">
          {reel.map((project, i) => (
            <Image
              key={project.slug}
              src={project.cover.src}
              alt=""
              width={project.cover.w}
              height={project.cover.h}
              sizes="(max-width: 700px) 60vw, 340px"
              priority={i === 0}
              style={{ animationDelay: `${i * 3}s` }}
            />
          ))}
        </div>
      </div>

      <h1 className="hero-title">
        <span className="line">
          <span>Escribo ideas que</span>
        </span>
        <span className="line">
          <span>se hacen escuchar.</span>
        </span>
      </h1>

      <p className="hero-meta">
        <span>{profile.role}</span>
        <span>{profile.company}</span>
        <span>{profile.location}</span>
      </p>

      <div className="clients">
        <p className="clients-label">Marcas cómplices</p>
        <div className="marquee">
          <div className="marquee-track">
            {[0, 1].map((copy) => (
              <ul key={copy} aria-hidden={copy === 1}>
                {clients.map((client) => (
                  <li key={client}>{client}</li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
