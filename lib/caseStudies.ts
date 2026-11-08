export type CaseStudy = {
  slug: string;
  index: string;
  title: string;
  subtitle: string;
  status: string;
  tech: string[];
  overview: string;
  problem: string;
  role: string;
  architecture: { layer: string; detail: string; protocol?: string }[];
  decisions: { title: string; body: string }[];
  challenges: { title: string; body: string }[];
  next: string[];
  links: { label: string; href: string }[];
  linksNote?: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "cinepulse",
    index: "01",
    title: "CinePulse",
    subtitle: "Movie discovery & watchlist platform",
    status: "Production",
    tech: ["React 19", "Express 5", "PostgreSQL", "Prisma 7", "JWT Auth", "Zod"],
    overview:
      "A full-stack platform where users discover films, manage personal watchlists across four states, rate with stars, and analyse their viewing habits — a React SPA over a Node.js REST API with PostgreSQL persistence.",
    problem:
      "Personal film tracking tends to scatter across notes, spreadsheets, and streaming apps: what you want to watch, what you're watching, and what you've finished all live in different places — and nobody keeps the stats. CinePulse collapses that into one system with an explicit watchlist state model and an analytics view that makes the data useful.",
    role:
      "Sole engineer — designed the data model, built the REST API and authentication, implemented the React frontend, and owns deployment and schema migrations end to end.",
    architecture: [
      { layer: "React 19 SPA", detail: "UI · state management · API integration" },
      {
        layer: "Node.js + Express 5",
        detail: "Authentication · business logic · Zod validation",
        protocol: "HTTPS / REST API (JSON, cookie credentials)",
      },
      { layer: "Prisma ORM", detail: "Schema · migrations · type-safe queries", protocol: "Type-safe Prisma client" },
      {
        layer: "PostgreSQL",
        detail: "Relational data · full-text search · aggregation",
        protocol: "SQL",
      },
    ],
    decisions: [
      {
        title: "PostgreSQL + Prisma over a document database",
        body: "Users, films, list entries, and ratings are related data with real integrity requirements — one user rates one film once. A normalised relational schema with migrations keeps that consistent, and Prisma gives typed queries plus a versioned schema history.",
      },
      {
        title: "JWT in httpOnly cookies, not localStorage",
        body: "Tokens in localStorage are readable by any injected script. Storing the JWT in an httpOnly cookie with SameSite restrictions keeps XSS from exfiltrating credentials while the API stays stateless.",
      },
      {
        title: "Zod at the API boundary",
        body: "Every write endpoint validates its payload with Zod, so malformed input dies at the edge and the client/server contract stays explicit — the same shapes drive form validation in the UI.",
      },
      {
        title: "React SPA over a plain REST API",
        body: "The frontend is a fast Vite-served SPA; the API is a conventional REST surface. The separation keeps the backend portable and lets the client ship UI iterations without touching server code.",
      },
    ],
    challenges: [
      {
        title: "Four-state watchlist semantics",
        body: "Planned → watching → completed, plus dropped, is a small state machine rather than a boolean. Transitions are guarded server-side so invalid jumps (e.g. dropped → completed directly) can't corrupt analytics.",
      },
      {
        title: "Search that matches how people look for films",
        body: "Full-text search over titles combined with structured filters (genre, rating, watch state) in a single query path — ranked text results, filtered by the same facets, without loading the catalogue client-side.",
      },
      {
        title: "Analytics from raw watch history",
        body: "Completion rates, state distributions, and rating trends are SQL aggregates over the normalised tables, served as one dashboard payload so the client renders a single request instead of N.",
      },
      {
        title: "Cross-origin cookie authentication",
        body: "Cookies don't travel cross-origin by default — the fetch client sends credentials explicitly, and the API responds with the right SameSite/CORS headers so the SPA stays authenticated across requests.",
      },
    ],
    next: [
      "Cache catalogue responses and invalidate on demand",
      "Unit and E2E test coverage for the watchlist state machine",
      "Infinite scroll and prefetching for search results",
      "Rate limiting and abuse protection on write endpoints",
      "Offline-friendly PWA shell for the watchlist",
    ],
    // TODO: add repo/demo URLs once public
    links: [],
    linksNote: "Source code will be linked here once the repository is public.",
  },
  {
    slug: "pharmacy",
    index: "02",
    title: "Pharmacy",
    subtitle: "E-commerce pharmacy storefront",
    status: "Live",
    tech: ["React", "Node.js", "Express", "MongoDB", "JWT", "Vercel"],
    overview:
      "A category-driven pharmacy storefront: medicine catalog with search, cart management, pincode serviceability checks, and JWT-secured authentication — React frontend over an Express API, deployed to production.",
    problem:
      "A pharmacy needs a simple online path from browsing medicines by category to a checked-out cart — without a heavyweight commerce stack. Built as the engineering core of an internship project, the app covers the catalogue → cart → authenticated-order flow with just the pieces it needs.",
    role:
      "Full-stack developer on the internship team — built the React storefront and the Node.js/Express backend, then deployed the application to production on Vercel.",
    architecture: [
      { layer: "React storefront", detail: "Catalogue · search · cart (Context) · auth UI" },
      {
        layer: "Node.js + Express",
        detail: "REST endpoints · JWT auth · business rules",
        protocol: "HTTPS / REST API (JSON)",
      },
      {
        layer: "MongoDB",
        detail: "Products · categories · users · cart state",
        protocol: "MongoDB driver",
      },
    ],
    decisions: [
      {
        title: "React Context for the cart",
        body: "The cart is shared state with a handful of actions (add, remove, quantity). Context plus a reducer covers it without pulling in a global state library — fewer dependencies, same predictable updates.",
      },
      {
        title: "Category-driven catalogue",
        body: "Products hang off categories, which shapes both the navigation and the API: one query path for browse-by-category, another for search — matching how customers actually shop for medicine.",
      },
      {
        title: "Pincode serviceability as a first-class check",
        body: "Delivery feasibility is verified before checkout with a pincode lookup, so unsupported addresses fail early instead of after an order is placed.",
      },
      {
        title: "JWT auth + Vercel deployment",
        body: "Simple token auth keeps the API stateless, and Vercel gives the frontend production hosting with zero infra overhead.",
      },
    ],
    challenges: [
      {
        title: "Cart state across pages",
        body: "Cart contents had to survive navigation between category, product, and checkout views — solved with a single Context provider mounted above the router so state never resets mid-session.",
      },
      {
        title: "Catalogue consistency",
        body: "Price and stock fields are validated on the server for every cart mutation, so the client can't submit stale quantities or prices from an outdated page state.",
      },
      {
        title: "Deployment across two parts",
        body: "Frontend and API were wired into one production deployment on Vercel with environment-driven API URLs, keeping preview and production configurations separate.",
      },
    ],
    next: [
      "Order history and repeat-order flow",
      "Admin inventory management",
      "Payment integration",
      "Automated tests for cart and checkout",
    ],
    links: [
      { label: "Live Demo", href: "https://pharmacy-app-six.vercel.app" },
      { label: "Source Code", href: "https://github.com/mrahulsit/Pharmacy-App" },
    ],
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
