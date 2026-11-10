export const profile = {
  name: "Rahul Mishra",
  firstName: "Rahul",
  lastName: "Mishra",
  role: "Software Engineer",
  roleLong: "Software Engineer · Full Stack Developer",
  eyebrow: "Software Engineer · Full Stack Developer",
  location: "Rourkela, Odisha · IN",
  experienceYears: "1.8",
  workModes: "On-site, hybrid & remote",
  email: "mrahuls104@gmail.com",
  github: "https://github.com/mrahulsit",
  githubHandle: "mrahulsit",
  linkedin: "https://www.linkedin.com/in/rahulmishra-dev/",
  linkedinHandle: "rahulmishra-dev",
  blog: "https://effortlesswithrahul.hashnode.dev/",
  siteUrl: "https://www.mrahuls.in/",
  tagline: "Building products from architecture to deployment.",
  lede: "I engineer scalable web applications, robust backend systems, and intelligent AI-powered experiences using modern technologies.",
  heroChips: ["React.js", "Node.js", "TypeScript", "PostgreSQL", "Python"],
  availability: {
    open: true,
    openLabel: "Open to Software Engineering opportunities",
    shortLabel: "Open to software roles",
    busyLabel: "Currently focused on shipping",
  },
} as const;

export const navLinks = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Experience", href: "/#experience" },
  { label: "Projects", href: "/#projects" },
  { label: "Skills", href: "/#skills" },
  { label: "GitHub", href: "/#github" },
  { label: "Writing", href: "/#writing" },
  { label: "Contact", href: "/#contact" },
] as const;

export const contents = [
  { n: "01", label: "Experience", href: "#experience" },
  { n: "02", label: "Projects", href: "#projects" },
  { n: "03", label: "Skills", href: "#skills" },
  { n: "04", label: "Writing & Highlights", href: "#writing" },
  { n: "05", label: "Contact", href: "#contact" },
] as const;

export const about = {
  title: "Engineering across the full stack.",
  lede: "I'm a Software Engineer with 1.8 years of experience building enterprise web applications with React, Next.js and TypeScript — most recently at Aptus Data Labs.",
  paragraphs: [
    "At Aptus I shipped a production GenAI chatbot and an audit & compliance platform: reusable UI components, role-based access control, REST API integration, framework migrations, and end-to-end testing with Jest and Playwright — with CI/CD via GitHub Actions and Docker.",
    "I enjoy working across the entire development lifecycle — from requirements and architecture to implementation, testing, debugging, and deployment — and I'm increasingly focused on AI-powered products and data-driven systems.",
  ],
  note: "My foundation is a B.Tech in Electrical & Electronics Engineering — where I learned to reason about systems, constraints, and signals. That habit of thinking in systems is what I now apply to software.",
  focus: [
    {
      label: "Disciplines",
      items: ["Full-stack engineering", "System design", "AI applications"],
    },
    {
      label: "Tools",
      items: ["Next.js & React", "TypeScript", "PostgreSQL", "Testing & CI/CD"],
    },
  ],
};

export type Job = {
  chip: string;
  current?: boolean;
  when?: string;
  role: string;
  org: string;
  /** Titles held at this company, oldest first (rendered as a promotion path). */
  progression?: { title: string; when: string }[];
  points: string[];
  tags: string[];
  accentTags?: boolean;
};

export const experience: Job[] = [
  {
    chip: "Full-time",
    when: "Jan 2025 — Oct 2026",
    role: "Full Stack Engineer",
    org: "Aptus Data Labs",
    progression: [
      { title: "Intern", when: "Jan – Jun 2025" },
      { title: "Junior Software Engineer", when: "Jul 2025 – Jul 2026" },
      { title: "Full Stack Engineer", when: "Jul – Oct 2026" },
    ],
    points: [
      "One of two core frontend developers on an enterprise GenAI chatbot — carried it from first version to production.",
      "Built core chat features: conversation workspace, search, file upload, model selection, and voice input with live transcription.",
      "Built a mobile-responsive admin and analytics dashboard for managing users, roles, permissions, and agents.",
      "Set up the frontend architecture for an audit & compliance platform and co-developed Planning, Assignments, Programs, Controls and Execution with multi-level approval workflows.",
      "Implemented role-based access control (RBAC) and improved data handling across organisation switches.",
      "Migrated a production frontend from Create React App to Next.js; introduced Vitest, Docker and GitHub Actions CI/CD.",
      "Wrote unit and E2E tests with Jest and Playwright and resolved SonarQube code-quality findings.",
      "Designed and built the company website in Webflow to WCAG guidelines, with HubSpot integration and a resume parser for the careers form.",
    ],
    tags: ["Next.js", "React.js", "TypeScript", "MUI", "Jest & Playwright", "FastAPI", "Docker", "GitHub Actions"],
    accentTags: true,
  },
  {
    chip: "Course",
    // TODO: confirm the Codebeat course start/end dates, then add `when` here.
    role: "Web Development Course",
    org: "Codebeat",
    points: [
      "Built a pharmacy web application frontend in React, bundled with Vite.",
      "Implemented the backend using Node.js and Express.js.",
      "Adopted Git and GitHub for version control and collaboration.",
      "Deployed the application to production on Vercel.",
    ],
    tags: ["React", "Vite", "Node.js", "Express.js", "Git", "Vercel"],
  },
  {
    chip: "Course",
    when: "Jul 2024",
    role: "Core Java Course",
    org: "Internship Studio",
    points: [
      "Built a menu-driven pizza billing application in core and advanced Java.",
      "Applied class overriding and overloading to model the order and billing flow.",
      "Generated itemised bills from user-selected menu orders.",
    ],
    tags: ["Java", "OOP"],
  },
  {
    chip: "Course",
    when: "Aug 2022",
    role: "Core Java Course",
    org: "Syllogistek Systems",
    points: [
      "Built a menu-driven student record system in core Java.",
      "Connected the application to MySQL over JDBC for persistence.",
      "Exposed create and read operations on student records through the menu interface.",
    ],
    tags: ["Java", "JDBC", "MySQL"],
  },
];

export const education = {
  degree: "B.Tech — Electrical & Electronics Engineering",
  org: "Silicon University (formerly SIT), Bhubaneswar",
  when: "2021 — 2025",
  cgpa: "7.73 / 10",
};

export type Project = {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  status: "live" | "design";
  statusLabel: string;
  featured?: boolean;
  tech: { label: string; kind?: "react" | "node" | "db" | "muted" }[];
  highlights?: string[];
  actions?: { label: string; href: string; primary?: boolean }[];
  caseStudy?: string;
  note?: string;
  /**
   * TODO: add a real screenshot under /public/projects/<name>.png to replace
   * the placeholder mockup. When present, ProjectScreen renders it instead.
   */
  image?: string;
  mockup: "cinepulse" | "pharmacy" | "worktrack" | "gemini" | "chatbot";
};

export const projects: Project[] = [
  {
    id: "cinepulse",
    title: "CinePulse",
    subtitle: "Movie discovery & watchlist platform",
    desc: "A full-stack platform for discovering movies, managing watchlists, tracking viewing activity, and analysing personal viewing habits — four watchlist states, star ratings, and an analytics dashboard over a normalised PostgreSQL schema.",
    status: "live",
    statusLabel: "Production",
    featured: true,
    tech: [
      { label: "React 19", kind: "react" },
      { label: "Express 5", kind: "node" },
      { label: "PostgreSQL", kind: "db" },
      { label: "Prisma 7" },
      { label: "JWT Auth" },
      { label: "Zod" },
    ],
    highlights: [
      "Cookie-based authentication with httpOnly JWT",
      "Normalised relational architecture with Prisma migrations",
      "Full-text search and advanced filtering",
      "Viewing analytics with completion tracking",
    ],
    actions: [{ label: "Live Demo", href: "https://cinepulse-frontend.mrahuls104.workers.dev", primary: true }],
    // TODO: add a Source action once the repo is public
    caseStudy: "cinepulse",
    // Real screenshot of the live sign-in page (the catalogue needs an account), 2026-11-09.
    image: "/projects/cinepulse.webp",
    mockup: "cinepulse",
  },
  {
    id: "pharmacy",
    title: "MediCart",
    subtitle: "Online pharmacy storefront",
    desc: "Category-driven pharmacy platform with medicine catalog, cart management via React Context, pincode serviceability check, and JWT-secured authentication.",
    status: "live",
    // The deployment (pharmacy-app-six.vercel.app) shows "Application error: a
    // server-side exception has occurred" on its home page as of 2026-11-09, so
    // the Live Demo action is removed.
    // TODO: fix the deployment, then restore statusLabel "Live" and the Live Demo action.
    statusLabel: "Shipped",
    tech: [
      { label: "React", kind: "react" },
      { label: "Express", kind: "node" },
      { label: "MongoDB", kind: "db" },
      { label: "JWT" },
    ],
    actions: [
      { label: "Source", href: "https://github.com/mrahulsit/Pharmacy-App", primary: true },
    ],
    caseStudy: "pharmacy",
    // Real screenshot, taken from the repo's client running locally (2026-11-09).
    image: "/projects/medicart.webp",
    mockup: "pharmacy",
  },
  {
    id: "worktrack",
    title: "WorkTrack",
    subtitle: "Timesheet & productivity platform",
    desc: "Time tracking platform with live timer, idle detection, manual entries, project/task boards, and weekly/monthly reports. Currently at design stage — wireframes complete.",
    status: "design",
    statusLabel: "In Design",
    tech: [
      { label: "React", kind: "muted" },
      { label: "TypeScript", kind: "muted" },
      { label: "Node.js", kind: "muted" },
      { label: "PostgreSQL", kind: "muted" },
    ],
    note: "Stack planned, implementation pending",
    caseStudy: "worktrack",
    mockup: "worktrack",
  },
  {
    id: "gemini",
    title: "Lumina",
    subtitle: "Full-stack AI chat assistant",
    desc:
      "An AI assistant on Google's Gemini API with streaming answers, saved and searchable conversations, web search with citations, and image generation — React over an Express and Postgres backend.",
    status: "live",
    // The Vercel deployment (gemini-clone-five-mu.vercel.app) returns
    // DEPLOYMENT_NOT_FOUND as of 2026-11-09, so the Live Demo action is removed.
    // TODO: redeploy, then restore statusLabel "Live" and the Live Demo action.
    statusLabel: "Shipped",
    tech: [
      { label: "React 18", kind: "react" },
      { label: "Express", kind: "node" },
      { label: "Postgres", kind: "db" },
      { label: "Gemini API" },
      { label: "TypeScript" },
    ],
    actions: [
      { label: "Source", href: "https://github.com/mrahulsit/GeminiClone", primary: true },
    ],
    caseStudy: "lumina",
    // Real screenshot of the landing page, taken from the repo running locally (2026-11-09).
    image: "/projects/lumina.webp",
    mockup: "gemini",
  },
  {
    id: "chatbot",
    title: "SupportIQ",
    subtitle: "Embeddable AI chat widget",
    desc:
      "A drop-in AI assistant for any website: one script tag adds a chat button that opens the assistant in an iframe, with replies from an open model via OpenRouter.",
    status: "live",
    // The demo (chatbot-zeta-topaz.vercel.app) loads, but every message gets
    // "No response from AI" as of 2026-11-09, so the Live Demo action is removed.
    // TODO: fix the OpenRouter key/model, then restore statusLabel "Live", the
    // Live Demo action below, and add a real screenshot as `image`.
    statusLabel: "Shipped",
    tech: [
      { label: "Next.js 15", kind: "react" },
      { label: "React 19", kind: "react" },
      { label: "TypeScript" },
      { label: "OpenRouter API" },
    ],
    actions: [
      // { label: "Live Demo", href: "https://chatbot-zeta-topaz.vercel.app", primary: true },
      { label: "Source", href: "https://github.com/mrahulsit/Chatbot", primary: true },
    ],
    caseStudy: "supportiq",
    mockup: "chatbot",
  },
];

export const skills = [
  {
    title: "Core stack",
    desc:
      "Production-proven tools I use daily — from interface to database and deployment.",
    tags: [
      "React.js",
      "Next.js",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Prisma",
      "Tailwind CSS",
      "GitHub Actions",
      "Docker",
    ],
  },
  {
    title: "Backend & APIs",
    desc: "REST architecture, auth, validation, and containerised deployment.",
    tags: ["Express.js", "FastAPI", "REST APIs", "JWT", "Zod"],
  },
  {
    title: "Testing & quality",
    desc: "Unit, E2E, and CI pipelines that keep refactors safe.",
    tags: ["Jest", "Playwright", "Vitest", "SonarQube"],
  },
  {
    title: "AI & data",
    tag: "exploring",
    desc: "LLM interfaces, retrieval-augmented features, and data-driven products.",
    tags: ["Gemini API", "OpenAI API", "Chatbot interfaces", "Vector search", "RAG patterns"],
  },
  {
    title: "Languages",
    desc:
      "JavaScript and TypeScript for product work; Java and Python from earlier engineering.",
    tags: ["TypeScript", "JavaScript", "Java", "Python", "SQL"],
  },
];

export const writing = {
  eyebrow: "Technical writing / research",
  // TODO: add more posts here as they're published (title, body, href, date, reading time).
  posts: [
    {
      title: "AI-driven banking compliance and autonomous oversight",
      body: "A written exploration of how autonomous systems could take on continuous compliance monitoring in banking — where the oversight burden is constant, the rules are explicit, and the audit trail matters as much as the decision.",
      href: "https://effortlesswithrahul.hashnode.dev/",
      topics: ["AI", "Compliance", "Oversight"],
    },
  ],
};

/**
 * Curated one-line descriptions keyed by GitHub repository name. GitHub's API
 * descriptions are often empty or generic; these override them. Any repo that
 * has neither a curated description nor an API description is hidden from the
 * homepage list.
 *
 * TODO: review names and copy for the repositories that should appear.
 */
export const githubRepoDescriptions: Record<string, string> = {
  "Pharmacy-App":
    "Online pharmacy storefront with catalog, cart, pincode serviceability and JWT auth.",
  GeminiClone:
    "Full-stack Gemini chat assistant with streaming, saved chats and web search.",
  Chatbot:
    "Embeddable AI chat widget — one script tag adds an assistant to any site.",
};

/**
 * Product names shown in place of raw GitHub repository names (the repo name
 * is still shown underneath, since that's what the link opens).
 */
export const githubDisplayNames: Record<string, string> = {
  "Pharmacy-App": "MediCart",
  GeminiClone: "Lumina",
  Chatbot: "SupportIQ",
};

/**
 * Repos whose GitHub "homepage" deployment is currently offline. Their "Live"
 * badge is hidden so the GitHub section never advertises a dead link.
 * Remove a name once its deployment is back up.
 */
export const githubOfflineHomepages = new Set<string>(["GeminiClone", "Pharmacy-App", "Chatbot"]);

export const contact = {
  title: "Let's build something useful.",
  lede: "I'm always interested in discussing software engineering, full-stack development, interesting technical problems, and opportunities to build impactful products. Available to join immediately — open to on-site, hybrid and remote roles.",
};
