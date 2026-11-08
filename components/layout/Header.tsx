"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaGithub as Github,
  FaLinkedin as Linkedin,
  FaBars as Menu,
  FaMoon as Moon,
  FaSun as Sun,
} from "react-icons/fa";
import { SiX as X } from "react-icons/si";
import { navLinks, profile } from "@/lib/data";
import { useTheme } from "@/lib/theme";

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
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Active section highlighting */
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll("main section[id]"));
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -45% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

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
            href="#home"
            aria-label={`${profile.name} — home`}
            className="inline-flex items-center gap-2.5 whitespace-nowrap font-display text-[18px] font-semibold tracking-tight text-ink"
          >
            {profile.firstName}
            <span className="text-accent">.</span>
          </Link>

          <nav aria-label="Sections" className="hidden gap-[26px] lg:flex">
            {navLinks.map((l) => {
              const isActive = active === l.href.slice(1);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`relative py-1.5 text-[13.5px] font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-accent text-accent-text rounded-full px-3 py-0.5 shadow-[0_0_0_1px_rgba(205,242,43,0.4)]"
                      : "text-ink-2 hover:text-ink hover:bg-accent/10"
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
              className="inline-flex items-center justify-center gap-2 rounded-full border border-accent bg-accent px-[16px] py-2 text-[13.5px] font-[650] text-accent-text transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-ink hover:border-accent-ink hover:shadow-[0_6px_20px_-8px_rgba(205,242,43,0.5)] hidden sm:inline-flex"
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
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed top-[calc(var(--header-h)+1rem)] left-4 right-4 z-[99] mt-4 rounded-[2rem] border border-line-strong bg-elev/90 backdrop-blur-[24px] backdrop-saturate-[1.2] shadow-card overflow-hidden"
          >
            <nav aria-label="Sections" className="py-[18px]">
              {[...navLinks.slice(0, 5), { label: "Writing", href: "#writing" }, navLinks[5]].map(
                (l) => {
                  const isActive = active === l.href.slice(1);
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setMenuOpen(false)}
                      className={`block border-b border-line/50 py-3 px-6 font-display text-[26px] transition-colors duration-200 ${
                        isActive
                          ? "bg-accent/20 text-accent-text rounded-[12px] mx-3"
                          : "text-ink hover:text-accent hover:bg-accent/10"
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
