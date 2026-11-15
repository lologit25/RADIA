import { profile } from "@/lib/projects";
import { Arrow } from "./Bits";

export function Footer() {
  return (
    <footer className="footer" id="contacto">
      <a className="footer-cta" href={profile.linkedin} target="_blank" rel="noreferrer">
        <span className="footer-cta-q">¿Hablamos?</span>
        <span className="footer-cta-a">
          Acá
          <Arrow />
          <Arrow />
          <Arrow />
        </span>
      </a>
      <div className="footer-meta">
        <span>
          {profile.role} — {profile.company}
        </span>
        <span>{profile.location}</span>
        <a href={profile.behance} target="_blank" rel="noreferrer">
          Behance ↗
        </a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer">
          LinkedIn ↗
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
