"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Github, Linkedin, Mail } from "lucide-react";
import { profile } from "@/lib/data";

function useVisitorStats() {
  const [stats, setStats] = useState<{ active: number; total: number } | null>(null);

  useEffect(() => {
    const STORAGE_KEY = "rm-analytics";
    const SESSION_KEY = "rm-session";

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const data: { totalVisits: number; sessions: { id: string; time: number }[] } = raw
        ? JSON.parse(raw)
        : { totalVisits: 0, sessions: [] };

      let sessionId = sessionStorage.getItem(SESSION_KEY);
      if (!sessionId) {
        sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
        sessionStorage.setItem(SESSION_KEY, sessionId);
        data.totalVisits += 1;
        data.sessions.push({ id: sessionId, time: Date.now() });
        if (data.sessions.length > 100) data.sessions = data.sessions.slice(-100);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }

      const compute = () => {
        const fresh = localStorage.getItem(STORAGE_KEY);
        const d: { totalVisits: number; sessions: { id: string; time: number }[] } = fresh
          ? JSON.parse(fresh)
          : data;
        const fiveMinAgo = Date.now() - 5 * 60 * 1000;
        setStats({
          active: d.sessions.filter((s) => s.time > fiveMinAgo).length,
          total: d.totalVisits,
        });

        const idx = d.sessions.findIndex((s) => s.id === sessionId);
        if (idx !== -1) {
          d.sessions[idx].time = Date.now();
          localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
        }
      };

      compute();
      const interval = setInterval(compute, 60_000);
      return () => clearInterval(interval);
    } catch {
      /* storage unavailable */
    }
  }, []);

  return stats;
}

const footLink =
  "inline-flex items-center gap-2.5 py-1.5 text-[14.5px] font-medium text-ink-2 transition-all duration-200 hover:translate-x-[3px] hover:text-accent";

export default function Footer() {
  const stats = useVisitorStats();
  const [year, setYear] = useState("2026");

  useEffect(() => {
    setYear(String(new Date().getFullYear()));
  }, []);

  return (
    <footer className="mt-20 border-t border-line bg-elev px-0 py-[60px] pb-8">
      <div className="shell">
        <div className="mb-7 grid gap-[60px] border-b border-line pb-10 md:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="mb-1 font-display text-2xl font-semibold text-ink">{profile.name}</p>
            <p className="mb-1.5 text-[15px] text-muted">{profile.roleLong}</p>
            <p className="text-sm italic text-faint">Building reliable, user-centric applications</p>
          </div>

          <div className="grid grid-cols-2 gap-10">
            <div>
              <p className="mb-3.5 text-[11px] font-[650] uppercase tracking-[0.12em] text-faint">
                Navigate
              </p>
              <nav aria-label="Footer navigation" className="flex flex-col gap-2.5">
                <Link href="#about" className={footLink}>
                  About
                </Link>
                <Link href="#experience" className={footLink}>
                  Experience
                </Link>
                <Link href="#projects" className={footLink}>
                  Projects
                </Link>
                <Link href="#skills" className={footLink}>
                  Skills
                </Link>
              </nav>
            </div>
            <div>
              <p className="mb-3.5 text-[11px] font-[650] uppercase tracking-[0.12em] text-faint">
                Connect
              </p>
              <nav aria-label="Social links" className="flex flex-col gap-2.5">
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className={footLink}>
                  <Github size={14} className="opacity-70" /> GitHub
                </a>
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className={footLink}>
                  <Linkedin size={14} className="opacity-70" /> LinkedIn
                </a>
                <a href={`mailto:${profile.email}`} className={footLink}>
                  <Mail size={14} className="opacity-70" /> Email
                </a>
              </nav>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="flex gap-6 text-[13px] text-muted">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-[pulse-dot_2s_ease-in-out_infinite] rounded-full bg-[#10b981]" />
              {stats ? stats.active : "—"} viewing now
            </span>
            <span>{stats ? stats.total : "—"} total visits</span>
          </div>
          <p className="text-[13px] text-faint">
            © {year} {profile.name} · Built with Next.js, Tailwind &amp; GSAP ·{" "}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("open-palette"))}
              className="cursor-pointer border-none bg-transparent p-0 font-[inherit] text-accent underline decoration-dashed underline-offset-[3px] hover:text-accent-ink"
            >
              Press ⌘K
            </button>
          </p>
        </div>
      </div>
    </footer>
  );
}
