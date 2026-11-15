import { profile } from "@/lib/projects";
import { Arrow, T } from "./Bits";

export function Footer() {
  return (
    <footer className="footer" id="contacto">
      <a className="footer-cta" href={profile.linkedin} target="_blank" rel="noreferrer">
        <span className="footer-cta-q">
          <T es="¿Hablamos?" en="Shall we talk?" />
        </span>
        <span className="footer-cta-a">
          <T es="Acá" en="Here" />
          <Arrow />
          <Arrow />
          <Arrow />
        </span>
      </a>
      <div className="footer-meta">
        <span>
          <T es="Redactor creativo" en="Creative copywriter" /> — {profile.company}
        </span>
        <span>{profile.location}</span>
        <a href={profile.linkedin} target="_blank" rel="noreferrer">
          LinkedIn ↗
        </a>
        <a href={profile.behance} target="_blank" rel="noreferrer">
          Behance ↗
        </a>
        <span>©{new Date().getFullYear()}</span>
      </div>
      <p className="footer-word rv" aria-hidden="true">
        {"paolo".split("").map((letter, i) => (
          <span key={i} style={{ transitionDelay: `${i * 70}ms` }}>
            {letter}
          </span>
        ))}
      </p>
    </footer>
  );
}
