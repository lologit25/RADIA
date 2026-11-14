import Link from "next/link";

export function Arrow({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" width="1em" height="1em" fill="none" aria-hidden="true">
      <path d="M2 10 10 2M3.5 2H10v6.5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function SectionHead({ index, total, label }: { index: number; total: number; label: string }) {
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

export function Words({ text, className }: { text: string; className?: string }) {
  return (
    <p className={className} data-fill>
      {text.split(" ").map((word, i) => (
        <span className="w" key={i}>
          {word}{" "}
        </span>
      ))}
    </p>
  );
}
