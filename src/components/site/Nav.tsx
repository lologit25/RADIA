import Link from "next/link";
import { T } from "./Bits";
import { LangToggle } from "./LangToggle";

export function Nav() {
  return (
    <header className="nav" data-nav>
      <nav className="nav-links" aria-label="Principal">
        <Link href="/#trabajos">
          <T es="Trabajos" en="Work" />
        </Link>
        <Link href="/#sobre-mi">
          <T es="Sobre mí" en="About me" />
        </Link>
        <Link href="/#contacto">
          <T es="Contacto" en="Contact" />
        </Link>
      </nav>
      <LangToggle />
    </header>
  );
}
