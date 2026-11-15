# RADIA — Portafolio de Paolo Pérez Ramos

Portafolio de redacción creativa. Next.js 16 (App Router) + Tailwind v4, armado sobre
[ai-website-cloner-template](https://github.com/JCodesMore/ai-website-cloner-template)
(licencia MIT, ver `THIRD_PARTY_LICENSES/`).

- **Dirección de diseño:** estructura, ritmo y paleta de [withhoney.com](https://www.withhoney.com/),
  con el acento coral reemplazado por celeste pastel (`--accent` en `src/app/globals.css`).
- **Contenido:** los 13 proyectos (8 profesionales y 5 de estudiante), créditos y premios del perfil de
  [Behance](https://www.behance.net/paoloperezramos). Los datos viven en `src/data/projects.json`
  y los medios en `public/work/<proyecto>/`.
- **Inicio:** video de tinta negra cayendo sobre una pluma de ave (`public/hero/feather.*`, generado con
  Google Flow), reproducido por `src/components/site/HeroFilm.tsx`.
- **Logos:** los de las marcas son los oficiales, convertidos a blanco (`public/logos/`). Pertenecen a
  sus respectivos dueños y se usan solo para identificar a los clientes.
- **Trayectoria:** dentro de "Sobre mí"; se edita en `src/data/career.json`.
- **Animación:** pantalla de carga (`Loader.tsx`), cortina entre páginas (`app/template.tsx`), cursor
  (`Cursor.tsx`), banda deslizante (`Band.tsx`) y el resto en `Motion.tsx` + `globals.css`.
- **Idiomas:** ES/EN con el componente `T` (`src/components/site/Bits.tsx`); el idioma elegido se guarda
  en el navegador.
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

## Publicar en Cloudflare (gratis)

El sitio se exporta como archivos estáticos en la carpeta `out`; `wrangler.jsonc` le indica a Cloudflare
que publique esa carpeta.

En el proyecto de Cloudflare (**Settings → Build**):

- Branch: la rama que se quiera publicar.
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`

El campo `name` de `wrangler.jsonc` tiene que coincidir con el nombre del proyecto en Cloudflare.
