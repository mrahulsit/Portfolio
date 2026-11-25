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
        body: "Planned, watching and completed, plus dropped, form a small state machine rather than a boolean. Transitions are guarded server-side so invalid jumps (e.g. jumping straight from dropped to completed) can't corrupt analytics.",
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
      "A pharmacy needs a simple online path from browsing medicines by category to a checked-out cart — without a heavyweight commerce stack. Built as the capstone of a web development course, the app covers the whole flow from catalogue to cart to authenticated order with just the pieces it needs.",
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
    slug: "hourweft",
    index: "03",
    title: "Hourweft",
    subtitle: "Work-log & timesheet platform",
    status: "Shipped",
    tech: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Express 5",
      "PostgreSQL",
      "Prisma",
      "Tailwind CSS",
      "Zod",
      "ExcelJS",
      "jsPDF",
    ],
    overview:
      "A full-stack work-log and timesheet application. People log what they worked on each day, review it in day, week and month views, bring in existing Excel or PDF timesheets through an editable preview, and export formatted reports — a Next.js client over a separate Express API with PostgreSQL and Prisma.",
    problem:
      "Timesheets are usually rebuilt from memory at the end of the month, then retyped into whatever spreadsheet or PDF format someone else expects. Hourweft keeps a daily record as the work happens and turns it into those documents directly — and it can read the old spreadsheets in, so switching doesn't mean starting from zero.",
    role:
      "Built it end to end: the Prisma schema and migrations, the Express API with authentication and document processing, and the Next.js interface — dashboard, daily log, timesheet views, import review and settings.",
    features: [
      "Accounts with registration, profile photos, password change and security-question recovery",
      "Multiple entries per day with project, category, start/end time, description and remarks",
      "Edit, duplicate and delete entries; project names autocomplete from your history",
      "Dashboard with today, week and month hours, a weekly chart and a daily timeline",
      "Day, week and month timesheet views with search and project/category filters",
      "Excel and PDF import with a preview where rows can be edited or dropped before saving",
      "Formatted Excel and PDF export for a week, a month or a custom date range",
      "Light, dark and system themes, timezone and standard-hours preferences",
    ],
    architecture: [
      { layer: "Next.js 16 + React 19", detail: "Dashboard · daily log · timesheets · import review" },
      {
        layer: "Express 5 API",
        detail: "Auth · entries · dashboard stats · import & export · Swagger docs",
        protocol: "HTTPS / REST (JSON) · bearer JWT",
      },
      {
        layer: "PostgreSQL",
        detail: "Users · work entries · user settings",
        protocol: "Prisma ORM",
      },
    ],
    decisions: [
      {
        title: "A separate API, not Next.js route handlers",
        body: "The interface and the API are two TypeScript apps. The Express server owns authentication, validation, persistence and file processing, so the heavy Excel and PDF work never runs in the frontend, and the API is documented on its own with Swagger.",
      },
      {
        title: "Dates as dates, hours as decimals",
        body: "Work dates are stored as PostgreSQL DATE values rather than timestamps, so an entry belongs to a calendar day whatever the time zone. Hours use fixed-precision decimals, so totals don't drift the way floating-point sums do.",
      },
      {
        title: "Review before import",
        body: "Parsing an uploaded file and saving its rows are separate steps. The parser returns a preview with warnings; the user edits or removes rows, and only the reviewed set is validated and committed, with created, skipped and error counts.",
      },
      {
        title: "Every query scoped to its owner",
        body: "Entries and settings belong to an account, and the API checks ownership on every read and write, so a signed-in user can't touch someone else's records. Composite indexes on user + date and user + project keep those queries fast.",
      },
    ],
    challenges: [
      {
        title: "Reading real-world timesheets",
        body: "Spreadsheets put dates in text and native Excel formats, with project details in header rows. The importer finds the header row, accepts both date forms, and reads text-based PDFs line by line — anything it can't place shows up as a warning in the preview instead of being saved silently.",
      },
      {
        title: "Two export formats, two shapes",
        body: "An Excel timesheet is read one day per row, so entries are consolidated by date with daily and grand totals; the PDF keeps one row per entry under a branded header. Both are generated on the server from the same date range.",
      },
      {
        title: "Password recovery without email",
        body: "There's no mail service, so recovery uses a security question: answers are normalised and hashed like passwords (salted scrypt), and a correct answer issues a reset token that expires after 15 minutes.",
      },
    ],
    next: [
      "Expiring login tokens that are revoked on password change",
      "One timezone source for frontend dates, backend dates and exports",
      "Import deduplication per entry rather than per date",
      "Automated tests for the API and the import/export round trip",
      "A public deployment",
    ],
    links: [{ label: "Source Code", href: "https://github.com/mrahulsit/Hourweft" }],
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
    subtitle: "AI customer support platform",
    status: "Shipped",
    tech: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS 4",
      "PostgreSQL + pgvector",
      "Prisma 7",
      "OpenRouter",
      "Zod",
      "Vitest",
      "Docker",
    ],
    overview:
      "An AI customer support platform that any website adds with one script tag. The assistant answers from the site's own knowledge base with cited sources, triages every conversation with a language model, and hands off to a human when needed; the support team works from an inbox with an AI copilot and an analytics dashboard.",
    problem:
      "Most chat widgets are either scripted decision trees or a language model with nothing to stand on — they make up answers and never know when to give up. SupportIQ grounds every reply in the business's own documents, says so when it doesn't know, and routes the conversations that need a person to someone who can help.",
    role:
      "Built it end to end: the Postgres and pgvector schema, ingestion and hybrid retrieval, the streaming chat API, the LLM triage and copilot features, the embeddable loader and widget, and the team dashboard.",
    features: [
      "One script tag adds the assistant; the chat runs in an isolated iframe",
      "Replies stream token by token and cite their sources",
      "Knowledge base from pasted text or a URL, chunked and embedded automatically",
      "Automatic triage: summary, topic, sentiment, priority and whether a person is needed",
      "Human handoff: agents take over, reply live in the widget, then hand back to the AI",
      "AI copilot drafts grounded replies for agents, never sent without approval",
      "Low-confidence questions become one-click draft help articles",
      "Analytics: containment rate, helpfulness, CSAT, reply latency and top topics",
    ],
    architecture: [
      { layer: "Host website", detail: "Any site, any stack", tier: 0 },
      {
        layer: "Loader script",
        detail: "Floating button · lazy iframe · origin-checked messages",
        protocol: "One <script> tag (~4 KB)",
        tier: 1,
      },
      {
        layer: "Next.js 16 app",
        detail: "Widget UI · chat API · team dashboard · auth proxy",
        protocol: "iframe + postMessage · SSE",
        tier: 2,
      },
      {
        layer: "PostgreSQL + pgvector",
        detail: "Bots · documents · chunks (vector + full-text) · conversations",
        protocol: "Prisma + raw SQL",
        tier: 3,
      },
      {
        layer: "OpenRouter API",
        detail: "Chat completions (streamed) · embeddings",
        protocol: "HTTPS",
        tier: 3,
      },
    ],
    decisions: [
      {
        title: "Hybrid retrieval with rank fusion",
        body: "A question is matched two ways, pgvector cosine similarity over embeddings and Postgres full-text search, and the two rankings are merged with Reciprocal Rank Fusion. Semantic search catches paraphrases; keyword search catches product names and error codes that embeddings blur.",
      },
      {
        title: "Triage after the reply, not before",
        body: "The answer streams first; summary, sentiment, priority and the needs-a-human decision run afterwards in Next.js after(), with the model's JSON validated by Zod. The visitor never waits on classification.",
      },
      {
        title: "Every AI feature has an offline fallback",
        body: "Without an API key, answers are extracted from the best-matching passages, triage is rule-based and retrieval falls back to full-text search. The whole product runs as a demo with no key, and degrades instead of breaking when a model is rate-limited mid-stream.",
      },
      {
        title: "Per-site embedding control",
        body: "Each assistant has a list of allowed websites, enforced with a per-bot Content-Security-Policy frame-ancestors header, and the loader only trusts messages from the iframe's own origin.",
      },
    ],
    challenges: [
      {
        title: "Knowing when it doesn't know",
        body: "Retrieval produces a confidence score. Below the threshold the assistant says it isn't sure instead of guessing, and the question is logged as a knowledge gap the team can turn into an article.",
      },
      {
        title: "Fetching URLs safely",
        body: "URL ingestion fetches pages the user names, which is an SSRF risk. Private and loopback addresses are blocked, every redirect hop is re-checked, and responses are limited by size and content type.",
      },
      {
        title: "Untrusted model output",
        body: "Replies are rendered as markdown with raw HTML disabled, so nothing a model writes can inject markup into the widget or the dashboard.",
      },
      {
        title: "Keeping the widget public but bounded",
        body: "The widget API is open to any visitor, so input is validated with Zod, requests are rate-limited per visitor and IP, and visitors can only read their own conversation.",
      },
    ],
    next: [
      "Redis-backed rate limiting and a queue for ingestion",
      "Live updates for the inbox instead of polling",
      "PDF and sitemap ingestion with scheduled re-crawls",
      "Answer-quality evals run in CI",
      "Team members with roles and email alerts for escalations",
    ],
    links: [
      // The demo (support-iq-puce.vercel.app) returns 404 (see lib/data.ts).
      // TODO: add { label: "Live Demo", href: "https://support-iq-puce.vercel.app" } once redeployed.
      { label: "Source Code", href: "https://github.com/mrahulsit/SupportIQ" },
    ],
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
