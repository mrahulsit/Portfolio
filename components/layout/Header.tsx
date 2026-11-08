"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Github, Linkedin, Menu, Moon, Sun, X } from "lucide-react";
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
      className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-full border border-line-strong text-ink-2 transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:border-accent hover:text-ink"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-full border border-line-strong px-[18px] py-2.5 text-[14.5px] font-[550] text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-ink hover:text-ink hover:shadow-[0_4px_14px_-6px_rgba(205,242,43,0.35)]";

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
      { rootMargin: "-45% 0px -50% 0px" },
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
    <header
      className={`sticky top-0 z-[100] border-b bg-bg/85 backdrop-blur-[12px] backdrop-saturate-[1.2] transition-all duration-300 ${
        scrolled
          ? "h-[56px] border-line shadow-[0_6px_24px_-20px_rgba(8,9,11,0.5)]"
          : "h-(--header-h) border-transparent"
      }`}
    >
      <div className="shell flex h-full items-center justify-between gap-6">
        <Link
          href="#home"
          aria-label={`${profile.name} — home`}
          className="inline-flex items-center gap-2.5 whitespace-nowrap font-display text-[19px] font-semibold tracking-tight text-ink"
        >
          {profile.firstName}
          <span className="text-accent">.</span>
        </Link>

        <nav aria-label="Sections" className="hidden gap-[26px] lg:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`relative py-1.5 text-[14.5px] font-medium transition-colors duration-200 ${
                active === l.href.slice(1) ? "text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {l.label}
              <span
                className={`absolute bottom-0 left-0 h-0.5 w-full origin-left bg-accent transition-transform duration-200 ${
                  active === l.href.slice(1) ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/resume"
            target="_blank"
            rel="noopener noreferrer"
            className={`${btnBase} hidden px-3.5 py-[7px] text-[13.5px] sm:inline-flex sm:bg-accent sm:border-accent sm:text-accent-text sm:hover:bg-accent-ink sm:hover:border-accent-ink sm:hover:shadow-[0_8px_24px_-8px_rgba(205,242,43,0.45)]`}
          >
            Résumé
          </Link>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile (opens in a new tab)"
            className="hidden h-[38px] w-[38px] items-center justify-center rounded-full border border-line-strong text-ink-2 transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:border-accent hover:text-ink md:inline-flex"
          >
            <Github size={16} />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile (opens in a new tab)"
            className="hidden h-[38px] w-[38px] items-center justify-center rounded-full border border-line-strong text-ink-2 transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:border-accent hover:text-ink md:inline-flex"
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
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] border-none bg-transparent p-0 lg:hidden"
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

      {/* Mobile sheet */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed inset-x-0 bottom-0 top-(--header-h) z-[99] flex flex-col gap-[22px] overflow-y-auto bg-bg px-7 pt-[18px] pb-[30px] lg:hidden"
          >
            <nav aria-label="Sections" className="flex flex-col">
              {[...navLinks.slice(0, 5), { label: "Writing", href: "#writing" }, navLinks[5]].map(
                (l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between border-b border-line py-3 font-display text-[30px] text-ink transition-colors hover:text-accent"
                  >
                    {l.label}
                    <span className="text-xl text-faint transition-transform duration-150 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                ),
              )}
            </nav>
            <Link
              href="/resume"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="block w-full rounded-full bg-accent border-accent px-[18px] py-2.5 text-center text-[14.5px] font-[550] text-accent-text transition-all duration-200 hover:bg-accent-ink hover:border-accent-ink"
            >
              Download résumé
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
