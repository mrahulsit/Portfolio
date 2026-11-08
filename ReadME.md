# Rahul Mishra — Portfolio

Personal portfolio site, rebuilt with **Next.js 15 (App Router) + React 19 + Tailwind CSS v4 + Framer Motion + GSAP**.

The original static site (vanilla JS/CSS) is preserved in [`legacy/`](./legacy) for reference.

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run start   # serve the production build
```

## Routes

| Route      | Description                                                        |
| ---------- | ------------------------------------------------------------------ |
| `/`        | Single-page site: hero, about, experience, projects, skills, GitHub, writing, contact |
| `/resume`  | Résumé page with a print-to-PDF toolbar (site chrome omitted)      |

`/resume.html` permanently redirects to `/resume` (see `next.config.ts`).

## Structure

```
app/
  layout.tsx            # fonts, metadata/OG, JSON-LD, theme script, providers
  globals.css           # design tokens, Tailwind @theme, easter-egg + resume CSS
  (site)/               # site chrome scope: Header, Footer, palette, easter egg
    layout.tsx
    page.tsx            # composes the 8 sections
  resume/page.tsx
components/
  sections/             # Hero, About, Experience(+Timeline), Projects, Skills, Github, Writing, Contact
  layout/               # Header (nav, theme toggle, mobile sheet), Footer (visitor stats)
  CommandPalette.tsx    # ⌘K / Ctrl+K command menu
  EasterEgg.tsx         # "sudo hire rahul" terminal + Keyhunter snake game
  ResumeToolbar.tsx     # print / back buttons on /resume
  ui/                   # Reveal (scroll-in), SectionHead
lib/
  data.ts               # all site content (nav, projects, skills, posts, profile)
  theme.tsx             # dark/light provider (data-theme, localStorage, no-flash)
  toast.tsx             # toast provider + useToast()
legacy/                 # original static site (HTML/CSS/JS) — not part of the build
public/                 # favicons, og-image.jpg
```

## Feature parity with the legacy site

- **⌘K / Ctrl+K command palette** — navigation, theme toggle, copy email, open résumé, GitHub/LinkedIn.
- **Easter egg** — type `sudo hire rahul` anywhere: terminal boot sequence, WebAudio blips, and the **Keyhunter** snake game (best score in `localStorage.keyhunter_best`).
- **Live GitHub section** — server component fetching `mrahulsit`'s profile + top repos, revalidated hourly, with graceful fallback.
- **Theme** — dark default, no-flash inline script, `localStorage.theme`.
- **Analytics** — local visitor/session counters in the footer.
- **Resume** — print stylesheet (`print-color-adjust`) for PDF export.

## Conventions

- **Animation split** — Framer Motion for entrance/stagger, hover, modals; GSAP + ScrollTrigger for index-card parallax, timeline line draw, stat counters (both respect `prefers-reduced-motion`).
- **Breakpoints** — legacy `980px` → Tailwind `lg`, legacy `640px` → `sm`.
- **Content** — edit `lib/data.ts` only; components are presentational.
- **Icons** — `lucide-react` (replaces the Font Awesome CDN).
- **Fonts** — Fraunces (display) + Inter (UI) via `next/font`.
- TypeScript strict; `tsconfig.json` excludes `legacy/`.
