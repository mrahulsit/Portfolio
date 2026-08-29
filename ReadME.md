# Rahul Mishra — Portfolio

Personal resume/portfolio website for **Rahul Mishra — Software Engineer / Full Stack Developer**.

Designed as a clean, editorial-minimal engineering platform: warm paper background, stately serif display type (Fraunces), hairline rules, and a single terracotta accent. Includes full light/dark theming, a print-ready résumé page, and responsive layouts from mobile to desktop.

## Features

- **Hero** — name, role, CTAs, and an editorial contents index
- **About** — engineering direction and current focus
- **Experience** — vertical timeline with current role, internships, education
- **Projects** — featured CinePulse case study (problem, data model, API surface, challenges), Pharmacy and WorkTrack cards
- **Skills** — grouped technology cards (frontend, backend, database, engineering, AI/data)
- **Writing & Highlights** — technical article, verified highlights, GitHub link
- **Contact** — email/linkedin/github fields with one-click copy, message form (opens email app)
- **Résumé** — dedicated `resume.html` page with a "Download / Print PDF" button
- **Theming** — light/dark with system-preference detection and persisted choice
- **Interactions** — sticky nav, active-section highlighting, scroll reveal, mobile menu, toast, copy feedback (respects `prefers-reduced-motion`)

## Tech

Pure HTML + CSS + vanilla JS. No build step, no dependencies.

- **Fonts:** Fraunces (display), Inter (UI) via Google Fonts
- **Icons:** inline SVG

## File structure

```
.
├── index.html              # Main portfolio page
├── resume.html             # Print-ready résumé page
├── assets/
│   ├── css/style.css       # Design system + layout
│   ├── js/main.js          # Theme, nav, reveal, copy, form
│   └── img/
│       ├── favicon.svg     # Site icon
│       └── rahul-source.jpg# Source image
└── resume/                 # Drop a PDF here to add direct PDF download
```

## Run locally

```bash
# from the project root
python3 -m http.server 8000
# open http://localhost:8000
```

Or simply open `index.html` in a browser.

## Deploy

Static site — deploy the repository as-is to Vercel, Netlify, or GitHub Pages.

## License

MIT
