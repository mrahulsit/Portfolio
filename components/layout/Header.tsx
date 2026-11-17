"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion } from "framer-motion";
import { FaGithub as Github, FaLinkedin as Linkedin } from "react-icons/fa";
import { FiArrowUpRight, FiX as X } from "react-icons/fi";
import { navLinks, profile } from "@/lib/data";
import { SECTION_NAV_EVENT, type SectionNavDetail } from "@/lib/sectionNav";

/**
 * Section links with the Vengeance UI "Spotlight Navbar" lighting: a soft lime
 * glow follows the cursor, and a lime bar springs to sit under the active link.
 */
function SpotlightLinks({ isLinkActive }: { isLinkActive: (href: string) => boolean }) {
  const navRef = useRef<HTMLElement>(null);
  const [hovering, setHovering] = useState(false);
  const ambienceX = useRef(0);
  const ambienceW = useRef(0);
  const activeHref = navLinks.find((l) => isLinkActive(l.href))?.href;

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const el = activeHref
      ? nav.querySelector<HTMLElement>(`[data-href="${activeHref}"]`)
      : null;
    if (!el) {
      nav.style.setProperty("--ambience-o", "0");
      return;
    }
    const navRect = nav.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const x = r.left - navRect.left + r.width / 2;
    const w = r.width * 0.5;
    nav.style.setProperty("--ambience-o", "1");
    // Jump into place the first time; spring on every later change.
    const opts =
      ambienceW.current === 0
        ? { duration: 0 }
        : { type: "spring" as const, stiffness: 260, damping: 26 };
    const ax = animate(ambienceX.current, x, {
      ...opts,
      onUpdate: (v) => {
        ambienceX.current = v;
        nav.style.setProperty("--ambience-x", `${v}px`);
      },
    });
    const aw = animate(ambienceW.current, w, {
      ...opts,
      onUpdate: (v) => {
        ambienceW.current = v;
        nav.style.setProperty("--ambience-w", `${v}px`);
      },
    });
    return () => {
      ax.stop();
      aw.stop();
    };
  }, [activeHref]);

  return (
    <nav
      ref={navRef}
      aria-label="Sections"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--spotlight-x", `${e.clientX - r.left}px`);
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className="relative hidden h-10 items-center overflow-hidden rounded-full lg:flex"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: hovering ? 1 : 0,
          background:
            "radial-gradient(90px circle at var(--spotlight-x) 100%, rgba(185,241,47,0.2), transparent 70%)",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0.5 h-[2px] rounded-full bg-lime shadow-[0_0_12px_rgba(185,241,47,0.9)] transition-opacity duration-300"
        style={{
          left: "calc(var(--ambience-x, 0px) - var(--ambience-w, 0px) / 2)",
          width: "var(--ambience-w, 0px)",
          opacity: "var(--ambience-o, 0)",
        }}
      />
      {navLinks.map((l) => {
        const isActive = isLinkActive(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            data-href={l.href}
            aria-current={isActive ? "page" : undefined}
            className={`relative z-[1] whitespace-nowrap rounded-full px-3 py-2 text-[13px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime ${
              isActive ? "text-pearl" : "text-[#94a9b4] hover:text-pearl"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
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

  const iconBtn =
    "relative hidden h-10 w-10 items-center justify-center rounded-full border border-line text-pearl/80 transition-colors duration-200 hover:border-lime hover:bg-lime hover:text-teal sm:inline-flex";

  return (
    <header className="pointer-events-none sticky top-0 z-[100] px-4 pt-5 sm:px-6">
      <div className="pointer-events-auto mx-auto w-full max-w-[1160px]">
        <div
          className={`band-dark relative flex items-center justify-between gap-4 rounded-full border py-2.5 pl-5 pr-2.5 backdrop-blur-[18px] backdrop-saturate-[1.4] transition-[background-color,border-color,box-shadow] duration-300 ${
            // Translucent only while it floats over the home hero's teal panel.
            scrolled || !isHome
              ? "border-line-strong !bg-teal/90 shadow-[0_18px_40px_-18px_rgba(7,34,51,0.6)]"
              : "border-line !bg-teal/50"
          }`}
        >
          <Link
            href="/#home"
            aria-label={`${profile.name} — home`}
            className="inline-flex items-center whitespace-nowrap font-display text-[20px] font-bold tracking-[-0.04em] text-pearl"
          >
            {profile.firstName}
            <span className="text-lime">.</span>
          </Link>

          <SpotlightLinks isLinkActive={isLinkActive} />

          <div className="flex items-center gap-2">
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile (opens in a new tab)"
              className={iconBtn}
            >
              <Github size={15} />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile (opens in a new tab)"
              className={iconBtn}
            >
              <Linkedin size={15} />
            </a>
            <Link
              href="/#contact"
              className="group inline-flex h-10 items-center gap-1.5 rounded-full bg-lime px-4 text-[13.5px] font-[650] text-teal transition-transform duration-200 hover:-translate-y-0.5"
            >
              Let&rsquo;s talk
              <FiArrowUpRight
                size={14}
                aria-hidden
                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="relative inline-flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-full border border-line bg-transparent p-0 lg:hidden"
            >
              {menuOpen ? (
                <X size={18} className="text-pearl" />
              ) : (
                <>
                  <span className="block h-0.5 w-[18px] rounded-sm bg-pearl" />
                  <span className="block h-0.5 w-3 translate-x-[3px] rounded-sm bg-lime" />
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
            className="band-dark pointer-events-auto fixed left-4 right-4 top-[calc(var(--header-h)+1.75rem)] z-[99] max-h-[calc(100dvh-var(--header-h)-3rem)] overflow-y-auto rounded-[28px] border border-line pb-6 shadow-[0_30px_60px_-20px_rgba(7,34,51,0.7)]"
          >
            <nav aria-label="Sections" className="py-4">
              {navLinks.map((l, i) => {
                const isActive = isLinkActive(l.href);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`mx-3 flex items-baseline gap-3 rounded-[16px] px-4 py-2 font-display text-[28px] font-semibold tracking-[-0.03em] transition-colors duration-200 ${
                      isActive ? "bg-lime text-teal" : "text-pearl hover:bg-line"
                    }`}
                  >
                    <span
                      className={`font-mono text-[11px] font-normal tracking-normal ${
                        isActive ? "text-teal/70" : "text-faint"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {l.label}
                  </Link>
                );
              })}
            </nav>
            <Link
              href="/resume"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="mx-6 mt-2 inline-flex items-center gap-1.5 rounded-full border border-line-strong px-4 py-2 text-[13.5px] font-[650] text-pearl transition-colors duration-200 hover:border-lime hover:text-lime"
            >
              Download résumé <FiArrowUpRight size={14} aria-hidden />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
