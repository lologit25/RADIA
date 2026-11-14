import { clients, profile } from "@/lib/projects";
import { InkPen } from "./InkPen";

export function Hero() {
  return (
    <section className="hero">
      <InkPen />

      <h1 className="hero-title">
        <span className="line">
          <span>Paolo Pérez Ramos,</span>
        </span>
        <span className="line">
          <span>redactor creativo.</span>
        </span>
      </h1>

      <p className="hero-meta">
        <span>{profile.company}</span>
        <span>{profile.location}</span>
      </p>

      <div className="clients">
        <p className="clients-label">Marcas</p>
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
