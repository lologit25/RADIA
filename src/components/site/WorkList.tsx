"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { pad, type Project } from "@/lib/projects";

export function WorkList({ items }: { items: Project[] }) {
  const [active, setActive] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const preview = previewRef.current;
    if (!preview) return;
    const current = { x: 0, y: 0 };
    let raf = 0;
    const tick = () => {
      current.x += (target.current.x - current.x) * 0.12;
      current.y += (target.current.y - current.y) * 0.12;
      const tilt = (target.current.x - current.x) * 0.03;
      preview.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) rotate(${tilt.toFixed(2)}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="work-list"
      onPointerMove={(event) => {
        target.current = { x: event.clientX, y: event.clientY };
      }}
      onPointerLeave={() => setActive(null)}
    >
      {items.map((project, i) => (
        <Link
          key={project.slug}
          href={`/work/${project.slug}`}
          className="work-row rv"
          onPointerEnter={() => setActive(i)}
          onFocus={() => setActive(i)}
          onBlur={() => setActive(null)}
        >
          <span className="work-index">{pad(i + 1)}</span>
          <span className="work-thumb">
            <Image
              src={project.cover.src}
              alt=""
              width={project.cover.w}
              height={project.cover.h}
              sizes="(max-width: 900px) 100vw, 1px"
            />
          </span>
          <span className="work-title">{project.title}</span>
          <span className="work-client">{project.client ?? "—"}</span>
          <span className="work-kind">{project.kind}</span>
          <span className="work-year">{project.year}</span>
        </Link>
      ))}

      <div className={`work-preview${active === null ? "" : " is-on"}`} ref={previewRef} aria-hidden="true">
        <div className="work-preview-frame">
          {items.map((project, i) => (
            <Image
              key={project.slug}
              src={project.cover.src}
              alt=""
              width={project.cover.w}
              height={project.cover.h}
              sizes="380px"
              className={active === i ? "is-on" : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
