import Link from "next/link";
import { profile } from "@/lib/projects";

export function Nav() {
  return (
    <header className="nav" data-nav>
      <Link className="nav-logo" href="/" aria-label="Inicio">
        PAOLO—
        <br />
        ©{new Date().getFullYear()}
      </Link>
      <nav className="nav-links" aria-label="Principal">
        <Link href="/#trabajos">
          <i />
          Trabajos
        </Link>
        <Link href="/#premios">
          <i />
          Premios
        </Link>
        <a href={profile.behance} target="_blank" rel="noreferrer">
          <i />
          Behance
        </a>
      </nav>
      <Link className="nav-cta" href="/#contacto">
        Hablemos
      </Link>
    </header>
  );
}
