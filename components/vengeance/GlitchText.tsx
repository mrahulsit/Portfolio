"use client";

/**
 * Glitch Text — adapted from Vengeance UI (`ascii-glitch-ripple`).
 * On hover, a wave of ASCII glyphs ripples out from the cursor through the
 * text, then settles back. Renders a <span> so it can sit inside any link;
 * the real text stays in an aria-label, and reduced-motion users get none of it.
 */
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const CHARS = '.,·-─~+:;=*π"┐┌┘┴┬╗╔╝╚╬╠╣╩╦║░▒▓█▄▀▌▐■!?&#$@0123456789';
const THRESH = 3;
const MULT = 3;
const STEP = 40;
const BUF = 5;

export default function GlitchText({
  text,
  className,
  duration = 900,
}: {
  text: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Hover target: the nearest link/button, so the whole control triggers it.
    const target = (el.closest("a,button") as HTMLElement | null) ?? el;
    const chars = text.split("");
    let waves: { pos: number; t: number }[] = [];
    let raf = 0;
    let cursor = 0;
    let hovering = false;

    const posFrom = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const p = Math.round(((e.clientX - r.left) / (r.width || 1)) * chars.length);
      cursor = Math.max(0, Math.min(p, chars.length - 1));
    };

    const frame = () => {
      const now = performance.now();
      waves = waves.filter((w) => now - w.t < duration);
      if (!waves.length) {
        el.textContent = text;
        el.style.width = "";
        raf = 0;
        return;
      }
      el.textContent = chars
        .map((ch, i) => {
          if (ch === " ") return " ";
          let out = ch;
          for (const w of waves) {
            const age = now - w.t;
            const prog = Math.min(age / duration, 1);
            const dist = Math.abs(i - w.pos);
            const maxDist = Math.max(w.pos, chars.length - w.pos - 1);
            const rad = prog * (maxDist + BUF);
            const intens = rad - dist;
            if (intens > 0 && intens <= THRESH) {
              out = CHARS[(dist * MULT + Math.floor(age / STEP)) % CHARS.length];
            }
          }
          return out;
        })
        .join("");
      raf = requestAnimationFrame(frame);
    };

    const wave = () => {
      waves.push({ pos: cursor, t: performance.now() });
      if (!raf) {
        // Lock the width so scrambled glyphs never shift the layout.
        el.style.width = `${el.getBoundingClientRect().width}px`;
        raf = requestAnimationFrame(frame);
      }
    };

    const onEnter = (e: MouseEvent) => {
      hovering = true;
      posFrom(e);
      wave();
    };
    const onMove = (e: MouseEvent) => {
      if (!hovering) return;
      const before = cursor;
      posFrom(e);
      if (cursor !== before) wave();
    };
    const onLeave = () => {
      hovering = false;
    };

    target.addEventListener("mouseenter", onEnter);
    target.addEventListener("mousemove", onMove);
    target.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      target.removeEventListener("mouseenter", onEnter);
      target.removeEventListener("mousemove", onMove);
      target.removeEventListener("mouseleave", onLeave);
      el.textContent = text;
    };
  }, [text, duration]);

  return (
    <span aria-label={text} className={cn("relative inline-block whitespace-nowrap", className)}>
      <span ref={ref} aria-hidden className="inline-block">
        {text}
      </span>
    </span>
  );
}
