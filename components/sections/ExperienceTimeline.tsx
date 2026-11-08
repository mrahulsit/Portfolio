"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experience } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

/** Vertical timeline — GSAP draws the rail line and pops nodes in on scroll. */
export default function ExperienceTimeline() {
  const rootRef = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const line = root.querySelector<HTMLElement>("[data-tl-line]");
      const items = root.querySelectorAll<HTMLElement>("[data-tl-item]");

      if (line) {
        gsap.fromTo(
          line,
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: "top center",
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top 75%",
              end: "bottom 65%",
              scrub: 0.4,
            },
          },
        );
      }

      gsap.from(items, {
        opacity: 0,
        y: 26,
        duration: 0.55,
        ease: "power2.out",
        stagger: 0.12,
        scrollTrigger: { trigger: root, start: "top 78%", once: true },
      });
    });
    return () => mm.revert();
  }, [reduce]);

  return (
    <ol ref={rootRef} className="relative m-0 list-none p-0">
      {/* rail line (GSAP scales this in) */}
      <span
        data-tl-line
        aria-hidden
        className="absolute left-[11px] top-1.5 bottom-1.5 w-px bg-line-strong"
      />

      {experience.map((job) => (
        <li
          key={job.role + job.org}
          data-tl-item
          className={`relative mb-[54px] pl-[46px] last:mb-0 ${
            job.current ? "is-current" : ""
          }`}
        >
          <span
            aria-hidden
            className={`absolute left-[5px] top-1.5 h-[13px] w-[13px] rounded-full border-2 transition-all duration-300 ${
              job.current
                ? "border-accent bg-accent shadow-[0_0_0_4px_var(--accent-soft),0_0_20px_rgba(79,70,229,0.5)] [animation:pulse-node_2.5s_ease-in-out_infinite]"
                : "border-line-strong bg-bg"
            }`}
          />

          <div className="mb-2.5 flex items-center gap-3">
            <span
              className={`rounded-full border px-2.5 py-1 text-[11.5px] font-[650] uppercase tracking-[0.08em] ${
                job.current
                  ? "border-accent bg-accent-soft text-accent-ink"
                  : "border-line-strong text-muted"
              }`}
            >
              {job.chip}
            </span>
            {job.when && (
              <span className="text-[13px] font-[550] tracking-[0.02em] text-faint">
                {job.when}
              </span>
            )}
          </div>

          <h3 className="mb-0.5 font-display text-[26px] font-medium tracking-tight text-ink">
            {job.role}
          </h3>
          <p className="mb-4 font-display text-[17px] italic text-accent">{job.org}</p>
          {job.promo && (
            <p className="-mt-3 mb-4 max-w-[44em] text-[13.5px] font-[550] tracking-[0.01em] text-muted">
              {job.promo}
            </p>
          )}

          <ul className="mb-5 grid max-w-[44em] gap-2">
            {job.points.map((p) => (
              <li key={p} className="relative pl-[22px] before:absolute before:left-0 before:text-accent before:content-['—']">
                {p}
              </li>
            ))}
          </ul>

          <ul className="flex flex-wrap gap-2">
            {job.tags.map((t) => (
              <li
                key={t}
                className={`rounded-full border px-3 py-1.5 text-[12.5px] font-[550] ${
                  job.accentTags
                    ? "border-accent bg-accent-soft text-accent-ink"
                    : "border-line-strong bg-elev text-ink-2"
                }`}
              >
                {t}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
