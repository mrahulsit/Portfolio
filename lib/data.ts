export const profile = {
  name: "Rahul Mishra",
  firstName: "Rahul",
  lastName: "Mishra",
  role: "Software Engineer",
  roleLong: "Software Engineer · Full Stack Developer",
  eyebrow: "Software Engineer · Full Stack Developer",
  location: "Rourkela, Odisha · IN",
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
    busyLabel: "Currently focused on shipping",
  },
} as const;

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
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
    "Full-stack engineering",
    "Next.js & React",
    "TypeScript",
    "PostgreSQL",
    "Testing & CI/CD",
    "AI applications",
    "System design",
  ],
};

export type Job = {
  chip: string;
  current?: boolean;
  when?: string;
  role: string;
  org: string;
  promo?: string;
  points: string[];
  tags: string[];
  accentTags?: boolean;
};

export const experience: Job[] = [
  {
    chip: "1.8 yrs",
    when: "Jan 2025 — Oct 2026",
    role: "Full Stack Engineer",
    org: "Aptus Data Labs",
    promo:
      "Intern (Jan–Jun 2025) → Junior Software Engineer (Jul 2025–Jul 2026) → Full Stack Engineer (Jul–Oct 2026)",
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
    chip: "Internship",
    role: "Web Development Intern",
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
    chip: "Internship",
    when: "Jul 2024",
    role: "Core Java Intern",
    org: "Internship Studio",
    points: [
      "Built a menu-driven pizza billing application in core and advanced Java.",
      "Applied class overriding and overloading to model the order and billing flow.",
      "Generated itemised bills from user-selected menu orders.",
    ],
    tags: ["Java", "OOP"],
  },
  {
    chip: "Internship",
    when: "Aug 2022",
    role: "Core Java Intern",
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
    // TODO: add Source Code action once the repo is public
    caseStudy: "cinepulse",
    mockup: "cinepulse",
  },
  {
    id: "pharmacy",
    title: "Pharmacy",
    subtitle: "E-commerce pharmacy storefront",
    desc: "Category-driven pharmacy platform with medicine catalog, cart management via React Context, pincode serviceability check, and JWT-secured authentication.",
    status: "live",
    statusLabel: "Live",
    tech: [
      { label: "React", kind: "react" },
      { label: "Express", kind: "node" },
      { label: "MongoDB", kind: "db" },
      { label: "JWT" },
    ],
    actions: [
      { label: "Live Demo", href: "https://pharmacy-app-six.vercel.app", primary: true },
      { label: "Source", href: "https://github.com/mrahulsit/Pharmacy-App" },
    ],
    caseStudy: "pharmacy",
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
    mockup: "worktrack",
  },
  {
    id: "gemini",
    title: "Gemini Clone",
    subtitle: "Multimodal AI chat interface",
    desc:
      "Chat interface built with the Gemini API — streaming responses, conversation history, and multimodal input handling.",
    status: "live",
    statusLabel: "Live",
    tech: [
      { label: "React 19", kind: "react" },
      { label: "TypeScript" },
      { label: "Gemini API" },
      { label: "Vite" },
    ],
    actions: [
      { label: "Live Demo", href: "https://gemini-clone-five-mu.vercel.app", primary: true },
      { label: "Source", href: "https://github.com/mrahulsit/GeminiClone" },
    ],
    mockup: "gemini",
  },
  {
    id: "chatbot",
    title: "Support Chatbot",
    subtitle: "AI customer-support assistant",
    desc:
      "AI-powered support chatbot with contextual replies, quick-reply suggestions, and a clean support-desk interface.",
    status: "live",
    statusLabel: "Live",
    tech: [
      { label: "React", kind: "react" },
      { label: "TypeScript" },
      { label: "OpenAI API" },
      { label: "Node.js", kind: "node" },
    ],
    actions: [
      { label: "Live Demo", href: "https://chatbot-zeta-topaz.vercel.app", primary: true },
      { label: "Source", href: "https://github.com/mrahulsit/Chatbot" },
    ],
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
    tags: ["Express.js", "FastAPI", "REST APIs", "JWT", "Zod", "Docker"],
  },
  {
    title: "Testing & quality",
    desc: "Unit, E2E, and CI pipelines that keep refactors safe.",
    tags: ["Jest", "Playwright", "Vitest", "SonarQube", "GitHub Actions"],
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
  title: "AI-driven banking compliance and autonomous oversight",
  body: "A written exploration of how autonomous systems could take on continuous compliance monitoring in banking — where the oversight burden is constant, the rules are explicit, and the audit trail matters as much as the decision.",
  href: "https://effortlesswithrahul.hashnode.dev/",
  highlights: [
    "1.8 years at Aptus Data Labs — production GenAI chatbot and audit platform",
    "Full-stack applications deployed to production on Vercel and Render",
    "Designed and shipped a normalised PostgreSQL schema with Prisma migrations",
    "Implemented cookie-based JWT authentication across origins",
    "Three engineering internships spanning core Java and the MERN stack",
    "Publish technical writing on engineering and AI topics",
  ],
};

export const contact = {
  title: "Let's build something useful.",
  lede: "I'm always interested in discussing software engineering, full-stack development, interesting technical problems, and opportunities to build impactful products. Available to join immediately — open to on-site, hybrid and remote roles.",
};
