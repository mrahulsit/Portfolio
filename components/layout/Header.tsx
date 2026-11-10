"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaGithub as Github,
  FaLinkedin as Linkedin,
  FaBars as Menu,
  FaMoon as Moon,
  FaSun as Sun,
} from "react-icons/fa";
import { FaTimes as X } from "react-icons/fa";
import { navLinks, profile } from "@/lib/data";
import { useTheme } from "@/lib/theme";
import { SECTION_NAV_EVENT, type SectionNavDetail } from "@/lib/sectionNav";

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={theme === "light"}
      className="relative inline-flex h-[40px] w-[40px] items-center justify-center rounded-full border border-line-strong text-ink-2 transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:border-accent hover:bg-accent hover:text-accent-text"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const projectsRoute = pathname === "/projects" || pathname.startsWith("/projects/");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("home");
  // While a nav click is scrolling, the highlight stays on the destination
  // instead of flickering through every section it passes.
  const navLock = useRef<string | null>(null);

  const isLinkActive = (href: string) => {
    const id = href.split("#")[1] ?? "home";
    if (id === "projects" && projectsRoute) return true;
    return isHome && active === id;
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Active section highlighting (homepage only).
     The active section is the last one whose top edge has crossed a probe
     line 35% down the viewport. At the very bottom of the page the last
     section wins, so short closing sections (Contact) still get highlighted. */
  useEffect(() => {
    if (!isHome) return;
    let sections = Array.from(document.querySelectorAll<HTMLElement>("main section[id]"));
    if (!sections.length) {
      sections = Array.from(document.querySelectorAll<HTMLElement>("section[id]"));
    }
    if (!sections.length) return;

    let frame = 0;
    let idle = 0;
    let hardStop = 0;

    const update = () => {
      frame = 0;
      if (navLock.current) return;
      const probe = window.innerHeight * 0.35;
      let current = sections[0].id;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= probe) current = section.id;
      }
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) current = sections[sections.length - 1].id;
      setActive(current);
    };
    const release = () => {
      window.clearTimeout(idle);
      window.clearTimeout(hardStop);
      navLock.current = null;
      update();
    };
    const schedule = () => {
      if (navLock.current) {
        // Release the lock once scrolling has been idle for a moment.
        window.clearTimeout(idle);
        idle = window.setTimeout(release, 160);
        return;
      }
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onSectionNav = (event: Event) => {
      const { id } = (event as CustomEvent<SectionNavDetail>).detail;
      navLock.current = id;
      setActive(id);
      window.clearTimeout(idle);
      window.clearTimeout(hardStop);
      // Covers clicks that don't scroll at all (already there) or user takeovers.
      idle = window.setTimeout(release, 400);
      hardStop = window.setTimeout(release, 2500);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener(SECTION_NAV_EVENT, onSectionNav);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(idle);
      window.clearTimeout(hardStop);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener(SECTION_NAV_EVENT, onSectionNav);
    };
  }, [isHome]);

  /* Close mobile sheet on resize / escape */
  useEffect(() => {
    const onResize = () => window.innerWidth > 980 && setMenuOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("resize", onResize);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header className="sticky top-4 z-[100] pointer-events-none">
        <div className="mx-auto max-w-[1160px] w-full pointer-events-auto">
        <div
          className={`relative flex items-center justify-between gap-5 rounded-[2rem] border border-line-strong bg-elev/70 backdrop-blur-[20px] backdrop-saturate-[1.5] shadow-card px-5 py-2.5 transition-colors duration-300 ${
            scrolled
              ? "shadow-lift border-accent/40"
              : ""
          }`}
        >
          <Link
            href="/#home"
            aria-label={`${profile.name} — home`}
            className="inline-flex items-center gap-2.5 whitespace-nowrap font-display text-[18px] font-semibold tracking-tight text-ink"
          >
            {profile.firstName}
            <span className="text-accent-strong">.</span>
          </Link>

          <nav aria-label="Sections" className="hidden items-center gap-0.5 lg:flex">
            {navLinks.map((l) => {
              const isActive = isLinkActive(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={isActive ? "page" : undefined}
                  // Every link shares the same pill box, so moving the
                  // highlight never shifts neighbouring items.
                  className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    isActive
                      ? "bg-accent text-accent-text"
                      : "text-ink-2 hover:bg-line hover:text-ink"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              href="/resume"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center justify-center gap-2 rounded-full border border-accent bg-accent px-[16px] py-2 text-[13.5px] font-[650] text-accent-text transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-ink hover:border-accent-ink hover:shadow-[0_6px_20px_-8px_rgba(205,242,43,0.5)] sm:inline-flex"
            >
              Résumé
            </Link>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile (opens in a new tab)"
              className="relative inline-flex h-[40px] w-[40px] items-center justify-center rounded-full border border-line-strong text-ink-2 transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:border-accent hover:bg-accent hover:text-accent-text md:inline-flex"
            >
              <Github size={16} />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile (opens in a new tab)"
              className="relative inline-flex h-[40px] w-[40px] items-center justify-center rounded-full border border-line-strong text-ink-2 transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:border-accent hover:bg-accent hover:text-accent-text md:inline-flex"
            >
              <Linkedin size={16} />
            </a>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="relative inline-flex h-[40px] w-[40px] flex-col items-center justify-center gap-[5px] border-none bg-transparent p-0 lg:hidden"
            >
              {menuOpen ? (
                <X size={20} className="text-ink" />
              ) : (
                <>
                  <span className="block h-0.5 w-5 rounded-sm bg-ink" />
                  <span className="block h-0.5 w-5 rounded-sm bg-ink" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sheet */}
      <AnimatePresence>
        {menuOpen && (
          // The <header> is pointer-events-none (so its transparent margins don't
          // block the page); the sheet must opt back in or taps fall through.
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="pointer-events-auto fixed top-[calc(var(--header-h)+1rem)] left-4 right-4 z-[99] mt-4 rounded-[2rem] border border-line-strong bg-elev/90 backdrop-blur-[24px] backdrop-saturate-[1.2] shadow-card max-h-[calc(100dvh-var(--header-h)-3rem)] overflow-y-auto pb-5"
          >
            <nav aria-label="Sections" className="py-[18px]">
              {navLinks.map(
                (l) => {
                  const isActive = isLinkActive(l.href);
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setMenuOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className={`mx-3 block rounded-[12px] px-4 py-2.5 font-display text-[24px] transition-colors duration-200 ${
                        isActive
                          ? "bg-accent text-accent-text"
                          : "text-ink hover:bg-line"
                      }`}
                    >
                      {l.label}
                    </Link>
                  );
                },
              )}
            </nav>
            <Link
              href="/resume"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="mx-6 mt-4 inline-block w-auto rounded-full border border-accent bg-accent px-[16px] py-2 text-center text-[13.5px] font-[650] text-accent-text transition-all duration-200 hover:bg-accent-ink hover:border-accent-ink"
            >
              Download résumé
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
