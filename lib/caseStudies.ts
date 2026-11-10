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
  /**
   * "built": a shipped project (default). "design": not built yet, so the page
   * labels architecture and decisions as planned, and challenges as open questions.
   */
  stage?: "built" | "design";
  /** What a user can actually do with it. */
  features?: string[];
  /**
   * Layers from client to data. Layers sharing a `tier` sit side by side
   * (e.g. a server that talks to both a database and an external API);
   * `protocol` is how the layer is reached from the tier above.
   */
  architecture: { layer: string; detail: string; protocol?: string; tier?: number }[];
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
    features: [
      "Discover films with full-text search and filters for genre, rating and watch state",
      "Watchlists with four states: planned, watching, completed and dropped",
      "Star ratings for every film",
      "An analytics dashboard of completion rates and viewing habits",
      "Secure sign-in with httpOnly cookie sessions",
    ],
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
    // TODO: add { label: "Source Code", href: ... } once the repository is public.
    links: [{ label: "Live Demo", href: "https://cinepulse-frontend.mrahuls104.workers.dev" }],
  },
  {
    slug: "pharmacy",
    index: "02",
    title: "MediCart",
    subtitle: "Online pharmacy storefront",
    status: "Shipped",
    tech: ["React", "Node.js", "Express", "MongoDB", "JWT", "Vercel"],
    overview:
      "A category-driven pharmacy storefront: medicine catalog with search, cart management, pincode serviceability checks, and JWT-secured authentication — React frontend over an Express API, deployed to production.",
    problem:
      "A pharmacy needs a simple online path from browsing medicines by category to a checked-out cart — without a heavyweight commerce stack. Built as the capstone of a web development course, the app covers the catalogue → cart → authenticated-order flow with just the pieces it needs.",
    role:
      "Full-stack developer on the project — built the React storefront and the Node.js/Express backend, then deployed the application to production on Vercel.",
    features: [
      "Browse medicines by category, or search the catalogue",
      "A cart that keeps its contents across pages",
      "Pincode check for delivery before checkout",
      "Account sign-up and sign-in with JWT authentication",
    ],
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
      // Live Demo removed: the deployment errors on load (see lib/data.ts).
      // TODO: restore { label: "Live Demo", href: "https://pharmacy-app-six.vercel.app" } once fixed.
      { label: "Source Code", href: "https://github.com/mrahulsit/Pharmacy-App" },
    ],
  },
  {
    // Design-stage project: nothing below is built yet. The approach, open
    // questions and build plan are proposals to review, not shipped work.
    // TODO: replace with real decisions as implementation starts.
    slug: "worktrack",
    index: "03",
    title: "WorkTrack",
    subtitle: "Timesheet & productivity platform",
    status: "In design",
    stage: "design",
    tech: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    overview:
      "A time-tracking platform with a live timer, idle detection, manual entries, project and task boards, and weekly and monthly reports. The wireframes are complete; implementation hasn't started yet.",
    problem:
      "Timesheets filled in at the end of the week are reconstructed from memory, so they're late and inaccurate. WorkTrack is meant to capture time as it happens — one click to start a timer against a task — and turn those entries into reports without anyone re-typing them.",
    role:
      "Scoped the features and produced the wireframes. I'll build it full-stack next: the React client, the Node.js API and the PostgreSQL schema.",
    features: [
      "Live timer that runs against a project and task",
      "Idle detection that flags time spent away from the keyboard",
      "Manual entries for time that wasn't tracked live",
      "Project and task boards",
      "Weekly and monthly reports",
    ],
    architecture: [
      { layer: "React + TypeScript", detail: "Timer · boards · entries · reports" },
      {
        layer: "Node.js API",
        detail: "Projects · tasks · time entries · reporting",
        protocol: "HTTPS / REST (JSON)",
      },
      {
        layer: "PostgreSQL",
        detail: "Users · projects · tasks · time entries",
        protocol: "SQL",
      },
    ],
    decisions: [
      {
        title: "The server owns running timers",
        body: "Store when a timer started, not a counter ticking in the browser. Elapsed time is derived from the start timestamp, so a timer survives a refresh, a closed tab or a switch to another device.",
      },
      {
        title: "Idle time is the user's call",
        body: "When the app detects inactivity, ask whether to keep, discard or reassign that time instead of silently trimming it — automatic cuts make people distrust the numbers.",
      },
      {
        title: "Reports computed in the database",
        body: "Weekly and monthly totals are aggregates grouped by project and task, calculated in PostgreSQL rather than by loading raw entries into the client.",
      },
      {
        title: "A relational schema",
        body: "Users own projects, projects own tasks, and tasks own time entries — data with clear relationships and integrity rules, which suits PostgreSQL.",
      },
    ],
    challenges: [
      {
        title: "Overlapping entries",
        body: "If a manual entry overlaps a running timer or another entry, should it be rejected, or should the overlap be split? The reports depend on the answer.",
      },
      {
        title: "Time zones and week boundaries",
        body: "A week starts on different days in different places, and entries that cross midnight need a consistent owner day for daily and weekly totals.",
      },
      {
        title: "Working offline",
        body: "Whether a timer started without a connection should queue locally and sync later, and how to resolve conflicts if it does.",
      },
    ],
    next: [
      "Accounts, projects and tasks",
      "Timer and manual time entries",
      "Idle detection",
      "Weekly and monthly reports",
      "Project and task boards",
    ],
    links: [],
    linksNote: "Wireframes and source code will be linked here as the build progresses.",
  },
  {
    slug: "lumina",
    index: "04",
    title: "Lumina",
    subtitle: "Full-stack AI chat assistant",
    status: "Shipped",
    tech: [
      "React 18",
      "TypeScript",
      "Vite",
      "Express",
      "Neon Postgres",
      "Gemini API",
      "JWT",
      "Tailwind CSS",
    ],
    overview:
      "A full-stack AI assistant built on Google's Gemini API: responses stream in as they're generated, conversations are saved and searchable, and users can switch models, ground answers in web search with cited sources, and generate images — a React + Vite client over an Express API with Neon Postgres.",
    problem:
      "Calling a language model from a web page is easy; building an assistant people come back to is not. Conversations have to persist per user, answers should appear as they're written rather than after a long wait, and the model's API key must never reach the browser. Lumina is the product around the model: accounts, saved history, settings, and a server that owns every call to Gemini.",
    role:
      "Built the full stack: the database schema, the Express API and authentication, the streaming pipeline to Gemini, and the React interface — landing page, chat workspace, search and settings.",
    features: [
      "Streaming answers, with the model's reasoning shown in its own collapsible block",
      "A choice of several Gemini models, plus an adjustable thinking level",
      "Optional web search, with numbered citations linked to their sources",
      "Image generation from a prompt",
      "Saved conversations that can be searched, pinned and renamed, with titles written automatically",
      "Markdown answers with code highlighting, tables and LaTeX maths",
      "Text files attached to a message as context",
      "Per-user settings: theme, accent colour, font size and custom instructions",
    ],
    architecture: [
      { layer: "React 18 + Vite", detail: "Chat workspace · markdown & maths · settings", tier: 0 },
      {
        layer: "Express API",
        detail: "Auth · chats & messages · streaming",
        protocol: "HTTPS · REST + server-sent events",
        tier: 1,
      },
      {
        layer: "Neon Postgres",
        detail: "Users · chats · messages · preferences · refresh tokens",
        protocol: "Serverless SQL driver",
        tier: 2,
      },
      {
        layer: "Google Gemini API",
        detail: "Chat models · reasoning · image generation",
        protocol: "@google/genai SDK",
        tier: 2,
      },
    ],
    decisions: [
      {
        title: "Server-sent events for streaming",
        body: "Gemini streams its answer in chunks, and the API forwards each one to the browser as a server-sent event. Reasoning and answer text travel as separate event types, so the interface can show the model's thinking in its own block; search sources follow as a final metadata event.",
      },
      {
        title: "Short-lived access tokens, single-use refresh tokens",
        body: "Access tokens expire after 15 minutes. Refresh tokens last 30 days but are stored server-side and deleted when used, so each one works once and logging out revokes it. Passwords are hashed with bcrypt.",
      },
      {
        title: "The server owns every model call",
        body: "The Gemini key lives only on the server. Models come from an allow-list with per-model token limits, so the client can choose a model but can't request one the server doesn't support.",
      },
      {
        title: "Serverless Postgres for conversations",
        body: "Users, chats, messages and preferences are relational, with cascading deletes when a chat or account goes. The schema is created and migrated idempotently at startup, and chat search matches both titles and message text.",
      },
    ],
    challenges: [
      {
        title: "Gemini's strict turn order",
        body: "The API rejects a conversation unless user and model turns alternate. Stored history is cleaned before every request: consecutive messages from the same side are merged, and a conversation never starts with a model turn.",
      },
      {
        title: "Errors after streaming has started",
        body: "Once the response headers are sent, the status code can't change. Failures before that return a normal JSON error; failures mid-stream are sent as an error event. Rate limits, overloads and safety blocks are translated into messages a person can act on.",
      },
      {
        title: "Image generation across model families",
        body: "The image endpoint tries Google's dedicated Imagen models first and falls back to Gemini models that can output images natively, so a model being unavailable doesn't break the feature.",
      },
      {
        title: "Titles that describe the conversation",
        body: "A short Gemini call writes a 3–8 word title from the first message. The result is validated for length and stray characters, with a cleaned-up excerpt of the message as the fallback.",
      },
    ],
    next: [
      "Move session tokens from localStorage to httpOnly cookies",
      "Sanitise model-generated HTML before rendering it",
      "Per-user rate limits on chat and image generation",
      "Accept images and PDFs as input, not just text files",
      "Automated tests for the streaming and authentication flows",
    ],
    links: [
      // TODO: add { label: "Live Demo", href: ... } once the deployment is back up.
      { label: "Source Code", href: "https://github.com/mrahulsit/GeminiClone" },
    ],
  },
  {
    slug: "supportiq",
    index: "05",
    title: "SupportIQ",
    subtitle: "Embeddable AI chat widget",
    status: "Shipped",
    tech: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "OpenRouter API"],
    overview:
      "A drop-in AI assistant for any website: one script tag adds a floating chat button that opens the assistant in an iframe. The chat app is built with Next.js 15 and React 19, with replies from an open language model through the OpenRouter API.",
    problem:
      "Adding a chat assistant to an existing site usually means changing that site's code and build. SupportIQ keeps the two apart: the assistant runs as its own Next.js app, and any host site embeds it with a single script — no framework or build step needed on the host's side.",
    role:
      "Built it end to end: the chat interface, the embeddable loader script and the OpenRouter integration.",
    features: [
      "One script tag adds the assistant to any page",
      "Floating chat button that opens and closes the panel",
      "Full-screen chat on phones, a compact panel on larger screens",
      "Typing indicator while the model replies",
      "Bold, italic and inline-code formatting in replies",
    ],
    architecture: [
      { layer: "Host website", detail: "Any site, any stack" },
      {
        layer: "Loader script",
        detail: "Floating button · iframe container · scoped styles",
        protocol: "One <script> tag",
      },
      {
        layer: "Next.js chat app",
        detail: "Chat UI · standalone /chatbot route",
        protocol: "iframe + postMessage",
      },
      {
        layer: "OpenRouter API",
        detail: "Open language model (GLM-Z1 32B)",
        protocol: "HTTPS · chat completions",
      },
    ],
    decisions: [
      {
        title: "An iframe instead of a component library",
        body: "The host page loads a small vanilla-JavaScript loader that creates the button and an iframe pointing at the hosted chat route. The assistant's CSS and JavaScript can't collide with the host page's, and updates ship without host sites redeploying.",
      },
      {
        title: "One component, two modes",
        body: "The same chat component renders as a floating popup on the demo page and full-screen on the standalone /chatbot route that the iframe loads.",
      },
      {
        title: "OpenRouter for model access",
        body: "OpenRouter exposes many providers behind one OpenAI-compatible endpoint, so changing the model is a one-line change. The widget runs on a free open model.",
      },
      {
        title: "A handshake with the host page",
        body: "On load, the chat app asks its parent page for its origin over postMessage — groundwork for configuring the assistant per site.",
      },
    ],
    challenges: [
      {
        title: "Staying out of the host page's way",
        body: "The loader injects its own styles with id-scoped selectors and a high stacking order, so the button and panel sit above the host's content without inheriting or overriding its CSS.",
      },
      {
        title: "Readable replies",
        body: "Model output arrives with markdown-style emphasis and inline code; it's converted to formatted text for display, and the conversation scrolls to the newest message automatically.",
      },
      {
        title: "One layout for every screen",
        body: "The panel fills the screen on phones and becomes a fixed 384px window on larger screens, with the same component and no separate mobile build.",
      },
    ],
    next: [
      "Route model calls through a server endpoint (credentials, rate limits, logging)",
      "Sanitise model output before rendering it",
      "Send conversation history so replies have multi-turn context",
      "Restrict the postMessage handshake to known origins",
      "Per-site configuration: name, colours and system prompt",
    ],
    links: [
      // The demo currently gets no reply from the model (see lib/data.ts).
      // TODO: restore { label: "Live Demo", href: "https://chatbot-zeta-topaz.vercel.app" } once fixed.
      { label: "Source Code", href: "https://github.com/mrahulsit/Chatbot" },
    ],
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
