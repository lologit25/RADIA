"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

/**
 * Page-wide motion: smooth scrolling, reveal-on-enter, scroll-filled text,
 * the focus list and in-view playback of looping clips.
 */
export function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let lenis: Lenis | null = null;
    let raf = 0;
    if (!reduced) {
      lenis = new Lenis({ duration: 1.15, smoothWheel: true });
      const tick = (time: number) => {
        lenis?.raf(time);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }

    const onAnchor = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>(
        'a[href^="/#"], a[href^="#"]',
      );
      if (!link) return;
      const hash = link.getAttribute("href")!.replace(/^\//, "");
      const target = hash.length > 1 ? document.querySelector(hash) : null;
      if (!target || !lenis) return;
      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -24 });
      history.replaceState(null, "", hash);
    };
    document.addEventListener("click", onAnchor, true);

    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          revealObserver.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    document.querySelectorAll(".rv").forEach((el) => revealObserver.observe(el));

    const loopObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting && !reduced) {
            video.play().catch(() => undefined);
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.2 },
    );
    document
      .querySelectorAll<HTMLVideoElement>("video[data-loop]")
      .forEach((el) => loopObserver.observe(el));

    const fills = Array.from(document.querySelectorAll<HTMLElement>("[data-fill]"));
    const focusLists = Array.from(document.querySelectorAll<HTMLElement>("[data-focus]"));
    const nav = document.querySelector<HTMLElement>("[data-nav]");

    let queued = false;
    const update = () => {
      queued = false;
      const vh = window.innerHeight;

      nav?.classList.toggle("is-scrolled", window.scrollY > 40);

      for (const el of fills) {
        const rect = el.getBoundingClientRect();
        const progress = reduced
          ? 1
          : clamp((vh * 0.82 - rect.top) / (rect.height + vh * 0.3));
        const words = el.querySelectorAll<HTMLElement>(".w");
        const lit = Math.round(progress * words.length);
        words.forEach((word, i) => word.classList.toggle("is-lit", i < lit));
      }

      for (const list of focusLists) {
        for (const item of Array.from(list.children) as HTMLElement[]) {
          const rect = item.getBoundingClientRect();
          const distance = Math.abs(rect.top + rect.height / 2 - vh * 0.5) / (vh * 0.5);
          const focus = reduced ? 1 : clamp(1.25 - distance * 1.6);
          item.style.setProperty("--focus", focus.toFixed(3));
        }
      }
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
      document.removeEventListener("click", onAnchor, true);
      revealObserver.disconnect();
      loopObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  return null;
}
