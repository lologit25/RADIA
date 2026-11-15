"use client";

const set = (lang: "es" | "en") => {
  document.documentElement.lang = lang;
  try {
    localStorage.setItem("lang", lang);
  } catch {
    // Storage can be unavailable; the choice then lasts for this page only.
  }
  window.dispatchEvent(new Event("scroll"));
};

export function LangToggle() {
  return (
    <div className="lang" role="group" aria-label="Idioma / Language">
      <button type="button" data-set="es" onClick={() => set("es")}>
        ES
      </button>
      <button type="button" data-set="en" onClick={() => set("en")}>
        EN
      </button>
    </div>
  );
}
