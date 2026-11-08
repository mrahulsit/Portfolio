import type { Metadata } from "next";
import ResumeToolbar from "@/components/ResumeToolbar";
import { education, experience, profile } from "@/lib/data";

export const metadata: Metadata = {
  title: "Rahul Mishra — Software Engineer · Résumé",
  description: "Rahul Mishra — Software Engineer / Full Stack Developer résumé.",
  robots: { index: true, follow: true },
};

const [current, ...earlier] = experience;

const resumeSkills = [
  {
    title: "Frontend",
    body: "React.js, Next.js, TypeScript, JavaScript (ES6+), HTML5, CSS3, MUI, Tailwind CSS, shadcn/ui, TanStack Query, Framer Motion, Recharts",
  },
  {
    title: "Testing & QA",
    body: "Test automation, unit testing, E2E testing, Jest, Vitest, Playwright, SonarQube, ESLint, Prettier",
  },
  {
    title: "Backend & data",
    body: "Node.js, Express.js, FastAPI, Python, REST APIs, Prisma, PostgreSQL, MongoDB, SQL, Java",
  },
  {
    title: "DevOps & tools",
    body: "Git, GitHub Actions (CI/CD), Docker, Nginx, Vite, Webflow, HubSpot",
  },
  {
    title: "Design",
    body: "Figma, Photoshop, CorelDRAW, Canva; UI/UX design, design systems, responsive design, accessibility (WCAG)",
  },
];

export default function ResumePage() {
  return (
    <div className="resume-shell">
      <ResumeToolbar />

      <article className="resume-page">
        <header>
          <h1 className="resume-name">Rahul Mishra</h1>
          <p className="resume-role">Software Engineer / Full&nbsp;Stack&nbsp;Developer</p>
          <div className="resume-contact">
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <a href={profile.github} target="_blank" rel="noopener noreferrer">
              {profile.github.replace("https://", "")}
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
              linkedin.com/in/{profile.linkedinHandle}
            </a>
            <span>Rourkela, Odisha — India</span>
          </div>
        </header>

        <h2>Profile</h2>
        <p className="resume-p">
          Full Stack Engineer with 1.8 years of experience building enterprise web applications
          with React.js, Next.js and TypeScript at Aptus Data Labs. Delivered a production GenAI
          chatbot and an audit &amp; compliance platform — covering reusable UI components,
          role-based access control, REST API integration, framework migrations, and testing with
          Jest, Vitest and Playwright. Available to join immediately; open to on-site, hybrid and
          remote roles.
        </p>

        <h2>Experience</h2>

        <div className="resume-item">
          <div className="top">
            <div>
              <h3>{current.role}</h3>
              <p className="org">{current.org}</p>
            </div>
            <span className="resume-when">{current.when}</span>
          </div>
          {current.promo && <p className="resume-p">{current.promo}</p>}
          <ul>
            {current.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <ul className="resume-tags">
            {current.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>

        <div className="resume-grid">
          {earlier.map((job) => (
            <div key={job.org + job.role} className="resume-item">
              <div className="top">
                <div>
                  <h3>{job.role}</h3>
                  <p className="org">{job.org}</p>
                </div>
                {job.when && <span className="resume-when">{job.when}</span>}
              </div>
              <ul>
                {job.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <ul className="resume-tags">
                {job.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h2>Projects</h2>
        <div className="resume-item">
          <div className="top">
            <div>
              <h3>CinePulse — Full-stack movie discovery &amp; watchlist platform</h3>
            </div>
          </div>
          <ul>
            <li>
              React client over a Node.js REST API with a PostgreSQL/Prisma database; cookie-based
              JWT auth, catalogue filters &amp; search, four-state watchlist CRUD, ratings and
              viewing analytics.
            </li>
          </ul>
          <ul className="resume-tags">
            {["React 19", "Express 5", "Prisma", "PostgreSQL", "JWT", "Zod"].map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
        <div className="resume-item">
          <div className="top">
            <div>
              <h3>Pharmacy — Online pharmacy storefront</h3>
            </div>
          </div>
          <ul>
            <li>
              Category-driven React storefront over an Express API with MongoDB; cart via Context,
              pincode delivery check, hashed login; deployed to production on Vercel.
            </li>
          </ul>
          <ul className="resume-tags">
            {["React", "Express", "MongoDB", "JWT", "Vercel"].map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
        <div className="resume-item">
          <div className="top">
            <div>
              <h3>Timesheet Tracker — Work logging &amp; timesheet export</h3>
            </div>
            <span className="resume-when">2026</span>
          </div>
          <ul>
            <li>
              Full-stack web app for logging daily work and generating monthly timesheets, with
              Excel and PDF export. Next.js, Express.js, Prisma, PostgreSQL.
            </li>
          </ul>
          <ul className="resume-tags">
            {["Next.js", "Express", "Prisma", "PostgreSQL"].map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>

        <h2>Skills</h2>
        <div className="resume-grid">
          <div>
            {resumeSkills.slice(0, 3).map((s, i) => (
              <p key={s.title} className={`resume-p${i === 2 ? " last" : ""}`}>
                <strong className="resume-strong">{s.title}</strong> — {s.body}
              </p>
            ))}
          </div>
          <div>
            {resumeSkills.slice(3).map((s, i) => (
              <p key={s.title} className={`resume-p${i === 1 ? " last" : ""}`}>
                <strong className="resume-strong">{s.title}</strong> — {s.body}
              </p>
            ))}
          </div>
        </div>

        <h2>Education</h2>
        <div className="resume-item">
          <div className="top">
            <div>
              <h3>{education.degree}</h3>
              <p className="org">
                {education.org} · CGPA {education.cgpa}
              </p>
            </div>
            <span className="resume-when">{education.when}</span>
          </div>
        </div>
      </article>
    </div>
  );
}
