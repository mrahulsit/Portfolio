"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaArrowUp as ArrowUp,
  FaEnvelope as Mail,
  FaFileAlt as FileText,
  FaGithub as Github,
  FaLinkedin as Linkedin,
  FaMapMarkerAlt as MapPin,
} from "react-icons/fa";
import { FiArrowUpRight as ArrowUpRight } from "react-icons/fi";
import { navLinks, profile } from "@/lib/data";

function useVisitorStats() {
  const [stats, setStats] = useState<{ active: number; total: number } | null>(
    null,
  );

  useEffect(() => {
    const STORAGE_KEY = "rm-analytics";
    const SESSION_KEY = "rm-session";

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const data: {
        totalVisits: number;
        sessions: { id: string; time: number }[];
      } = raw ? JSON.parse(raw) : { totalVisits: 0, sessions: [] };

      let sessionId = sessionStorage.getItem(SESSION_KEY);
      if (!sessionId) {
        sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
        sessionStorage.setItem(SESSION_KEY, sessionId);
        data.totalVisits += 1;
        data.sessions.push({ id: sessionId, time: Date.now() });
        if (data.sessions.length > 100)
          data.sessions = data.sessions.slice(-100);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }

      const compute = () => {
        const fresh = localStorage.getItem(STORAGE_KEY);
        const d: {
          totalVisits: number;
          sessions: { id: string; time: number }[];
        } = fresh ? JSON.parse(fresh) : data;
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

/** Rahul's local time (IST), rendered client-side only to avoid hydration mismatch. */
function useLocalTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "Asia/Kolkata",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return time;
}

const heading =
  "mb-4 font-ui text-[10.5px] font-[650] uppercase tracking-[0.16em] text-faint";

const navLink =
  "inline-flex w-fit py-1.5 text-[14.5px] font-medium text-ink-2 transition-[color,transform] duration-200 hover:translate-x-[3px] hover:text-accent-strong focus-visible:text-accent-strong";

const kbd =
  "rounded-[5px] border border-line-strong bg-sink px-1.5 py-px font-ui text-[11px] font-[600] leading-[1.5] text-ink-2";

const connect = [
  {
    label: "GitHub",
    detail: `@${profile.githubHandle}`,
    href: profile.github,
    Icon: Github,
    external: true,
  },
  {
    label: "LinkedIn",
    detail: `in/${profile.linkedinHandle}`,
    href: profile.linkedin,
    Icon: Linkedin,
    external: true,
  },
  {
    label: "Email",
    detail: profile.email,
    href: `mailto:${profile.email}`,
    Icon: Mail,
    external: false,
  },
  {
    label: "Résumé",
    detail: "View or download",
    href: "/resume",
    Icon: FileText,
    external: true,
  },
];

export default function Footer() {
  const stats = useVisitorStats();
  const time = useLocalTime();
  const [year, setYear] = useState("2026");
  const [isMac, setIsMac] = useState(true);

  useEffect(() => {
    setYear(String(new Date().getFullYear()));
    setIsMac(
      /Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent),
    );
  }, []);

  const showStats = stats && (stats.active >= 2 || stats.total >= 25);

  const toTop = () => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <footer className="relative overflow-hidden border-t border-line bg-elev">
      <div className="shell">
        <div className="pt-16 max-sm:pt-12">
          <div className="grid gap-12 pb-12 md:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr] lg:gap-10">
            {/* Brand */}
            <div className="md:col-span-2 lg:col-span-1">
              <p className="font-display text-[28px] font-semibold leading-tight tracking-[-0.01em] text-ink">
                {profile.name}
                <span className="text-accent-ink">.</span>
              </p>
              <p className="mt-1 text-[15px] text-ink-2">{profile.roleLong}</p>
              <p className="mt-4 max-w-[36ch] text-[14.5px] leading-relaxed text-muted">
                {profile.tagline}
              </p>

              <div className="mt-6 flex flex-col items-start gap-3 text-[13px]">
                {profile.availability.open && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent-soft px-3 py-1 font-[650] text-accent-strong">
                    <span aria-hidden className="avail-dot" />
                    {profile.availability.shortLabel}
                  </span>
                )}
                <span className="inline-flex flex-wrap items-center gap-x-2 text-muted">
                  <MapPin size={12} aria-hidden className="opacity-70" />
                  <span>{profile.location}</span>
                  {time && (
                    <>
                      <span aria-hidden className="text-faint">
                        ·
                      </span>
                      <time className="tabular-nums text-faint">
                        {time} IST
                      </time>
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Navigate */}
            <div>
              <p className={heading}>Navigate</p>
              <nav
                aria-label="Footer navigation"
                className="grid grid-cols-2 gap-x-8"
              >
                {navLinks.map((l) => (
                  <Link key={l.href} href={l.href} className={navLink}>
                    {l.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Connect */}
            <div>
              <p className={heading}>Connect</p>
              <ul className="flex flex-col gap-1">
                {connect.map(({ label, detail, href, Icon, external }) => (
                  <li key={label}>
                    <a
                      href={href}
                      {...(external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="group -mx-2 flex items-center gap-3 rounded-[10px] px-2 py-1.5 transition-colors duration-200 hover:bg-sink focus-visible:bg-sink focus-visible:outline-none"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-ink-2 transition-colors duration-200 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-text">
                        <Icon size={13} aria-hidden />
                      </span>
                      <span className="flex min-w-0 flex-col leading-tight">
                        <span className="text-[14.5px] font-medium text-ink">
                          {label}
                        </span>
                        <span className="truncate text-[12px] text-faint">
                          {detail}
                        </span>
                      </span>
                      <ArrowUpRight
                        size={14}
                        aria-hidden
                        className="ml-auto shrink-0 text-faint opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-strong group-hover:opacity-100"
                      />
                      {external && (
                        <span className="sr-only">(opens in a new tab)</span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col gap-4 border-t border-line py-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-faint">
              <p>
                © {year} {profile.name}
                <span aria-hidden className="max-sm:hidden">
                  {" "}
                  ·{" "}
                </span>
                <span className="max-sm:block">
                  Built with Next.js, Three.js &amp; GSAP
                </span>
              </p>
              {showStats && (
                <p className="flex gap-4 text-muted">
                  {stats.active >= 2 && (
                    <span className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 animate-[pulse-dot_2s_ease-in-out_infinite] rounded-full bg-accent-strong" />
                      {stats.active} viewing now
                    </span>
                  )}
                  {stats.total >= 25 && <span>{stats.total} total visits</span>}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Keyboard shortcut hint: hidden on touch-only devices. */}
              <button
                type="button"
                onClick={() =>
                  window.dispatchEvent(new CustomEvent("open-palette"))
                }
                className="hidden cursor-pointer items-center gap-2 text-[13px] text-muted transition-colors hover:text-ink [@media(pointer:fine)]:inline-flex"
              >
                <span className="flex gap-1">
                  <kbd className={kbd}>{isMac ? "⌘" : "Ctrl"}</kbd>
                  <kbd className={kbd}>K</kbd>
                </span>
                to jump anywhere
              </button>
              <button
                type="button"
                onClick={toTop}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-3.5 py-1.5 text-[13px] font-[600] text-ink-2 transition-colors duration-200 hover:border-accent hover:bg-accent hover:text-accent-text focus-visible:border-accent focus-visible:bg-accent focus-visible:text-accent-text focus-visible:outline-none"
              >
                <ArrowUp size={11} aria-hidden />
                Back to top
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Oversized wordmark, cropped by the bottom edge of the page */}
      <div
        aria-hidden
        className="shell pointer-events-none select-none overflow-hidden"
      >
        <p
          className="-mb-[0.14em] whitespace-nowrap font-display font-semibold leading-[0.9] tracking-[-0.045em]"
          style={{
            // The name is ~4.83em wide: size it to span the shell's content
            // width (viewport minus 56px of padding), capped at the 1160px shell.
            fontSize: "min(calc(20.5vw - 12px), 226px)",
            // Pin Fraunces' optical size so small screens don't get the wider text cut.
            fontVariationSettings: '"opsz" 144',
            backgroundImage:
              "linear-gradient(180deg, color-mix(in srgb, var(--ink) 11%, transparent) 15%, transparent 92%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {profile.name}
        </p>
      </div>
    </footer>
  );
}
