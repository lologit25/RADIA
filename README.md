# RADIA — Portafolio de Paolo Pérez Ramos

Portafolio de redacción creativa. Next.js 16 (App Router) + Tailwind v4, armado sobre
[ai-website-cloner-template](https://github.com/JCodesMore/ai-website-cloner-template)
(licencia MIT, ver `THIRD_PARTY_LICENSES/`).

- **Dirección de diseño:** estructura, ritmo y paleta de [withhoney.com](https://www.withhoney.com/),
  con el acento coral reemplazado por celeste pastel (`--accent` en `src/app/globals.css`).
- **Contenido:** los 13 proyectos (9 profesionales y 4 de estudiante), créditos y premios del perfil de
  [Behance](https://www.behance.net/paoloperezramos). Los datos viven en `src/data/projects.json`
  y los medios en `public/work/<proyecto>/`.
- **Tipografías:** Geist y Geist Mono, ambas de Google Fonts (`next/font/google`).

## Comandos

```bash
npm install
npm run dev     # http://localhost:3000
npm run check   # lint + typecheck + build
```

## Estructura

```
src/app/page.tsx              # Home
src/app/work/[slug]/page.tsx  # Caso de cada proyecto
src/components/site/          # Secciones y piezas compartidas
src/components/site/Motion.tsx# Scroll suave (Lenis), reveals y texto que se ilumina
src/lib/projects.ts           # Tipos + perfil
docs/research/withhoney/      # Notas de la referencia
```
