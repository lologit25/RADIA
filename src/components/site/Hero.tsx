import Image from "next/image";
import { logos } from "@/lib/logos";
import { clients, profile } from "@/lib/projects";
import { T } from "./Bits";
import { HeroFilm } from "./HeroFilm";

const brands = clients.map((client) => logos[client]).filter(Boolean);

export function Hero() {
  return (
    <section className="hero" data-hero>
      <HeroFilm />

      <h1 className="hero-title">
        <span className="line">
          <span>Paolo Pérez Ramos</span>
        </span>
      </h1>
      <p className="hero-role">
        <span className="line">
          <span>
            <T es="Redactor creativo" en="Creative copywriter" />
          </span>
        </span>
      </p>

      <p className="hero-meta">
        <span>{profile.company}</span>
        <span>{profile.location}</span>
      </p>

      <div className="clients">
        <p className="clients-label">
          <T es="Marcas" en="Brands" />
        </p>
        <div className="marquee">
          <div className="marquee-track">
            {[0, 1].map((copy) => (
              <ul key={copy} aria-hidden={copy === 1}>
                {brands.map((logo) => (
                  <li key={logo.name}>
                    <Image
                      src={logo.src}
                      alt={copy === 0 ? logo.name : ""}
                      width={logo.w}
                      height={logo.h}
                      style={{ height: `calc(var(--logo-h) * ${logo.scale})` }}
                      unoptimized
                    />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
