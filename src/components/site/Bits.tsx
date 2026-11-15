import Link from "next/link";

/** Bilingual text: both languages are rendered and CSS shows the active one. */
export function T({ es, en }: { es: React.ReactNode; en: React.ReactNode }) {
  return (
    <>
      <span data-l="es">{es}</span>
      <span data-l="en">{en}</span>
    </>
  );
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" width="1em" height="1em" fill="none" aria-hidden="true">
      <path d="M2 10 10 2M3.5 2H10v6.5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function SectionHead({ index, total, label }: { index: number; total: number; label: React.ReactNode }) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="section-head rv">
      <span>
        [ {pad(index)} / {pad(total)} ]
      </span>
      <span>{label}</span>
    </div>
  );
}

export function GhostButton({ href, children }: { href: string; children: React.ReactNode }) {
  const external = href.startsWith("http");
  const content = (
    <>
      <span>{children}</span>
      <Arrow />
    </>
  );
  return external ? (
    <a className="ghost-btn" href={href} target="_blank" rel="noreferrer">
      {content}
    </a>
  ) : (
    <Link className="ghost-btn" href={href}>
      {content}
    </Link>
  );
}

function Fill({ text, className, lang }: { text: string; className?: string; lang: "es" | "en" }) {
  return (
    <p className={className} data-fill data-l={lang} lang={lang}>
      {text.split(" ").map((word, i) => (
        <span className="w" key={i}>
          {word}{" "}
        </span>
      ))}
    </p>
  );
}

export function Words({ es, en, className }: { es: string; en: string; className?: string }) {
  return (
    <>
      <Fill text={es} className={className} lang="es" />
      <Fill text={en} className={className} lang="en" />
    </>
  );
}
