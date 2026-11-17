"use client";

/**
 * Highlight Grid — adapted from Vengeance UI (`highlight-grid`).
 * A grid of labelled cells; a single lime highlight glides behind whichever
 * cell is hovered or focused. Rows wrap into a 2/3-column grid on small
 * screens instead of the original's fixed 760px min-width.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type HighlightItem = { label: string; note?: string };

export default function HighlightGrid({
  items,
  className,
  transitionDuration = 280,
}: {
  items: HighlightItem[];
  className?: string;
  transitionDuration?: number;
}) {
  const gridRef = useRef<HTMLDivElement>(null);
  const hlRef = useRef<HTMLDivElement>(null);
  const cells = useRef<Map<number, HTMLElement>>(new Map());
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  const moveTo = useCallback((i: number, instant = false) => {
    const grid = gridRef.current;
    const hl = hlRef.current;
    const el = cells.current.get(i);
    if (!grid || !hl || !el) return;
    const r = el.getBoundingClientRect();
    const g = grid.getBoundingClientRect();
    if (!r.width) return;
    if (instant) hl.style.transitionDuration = "0s";
    hl.style.opacity = "1";
    hl.style.transform = `translate(${r.left - g.left}px, ${r.top - g.top}px)`;
    hl.style.width = `${r.width}px`;
    hl.style.height = `${r.height}px`;
    if (instant) {
      requestAnimationFrame(() => {
        hl.style.transitionDuration = `${transitionDuration}ms`;
      });
    }
    activeRef.current = i;
  }, [transitionDuration]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => moveTo(activeRef.current, true));
    const grid = gridRef.current;
    const ro = new ResizeObserver(() => moveTo(activeRef.current, true));
    if (grid) ro.observe(grid);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [moveTo]);

  const pick = (i: number) => {
    setActive(i);
    moveTo(i);
  };

  return (
    <div ref={gridRef} className={cn("relative", className)}>
      <div
        ref={hlRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-0 bg-lime opacity-0"
        style={{
          backgroundImage:
            "radial-gradient(120% 120% at 50% 0%, rgba(255,255,255,0.35), rgba(255,255,255,0) 55%)",
          transitionProperty: "transform, width, height, opacity",
          transitionDuration: `${transitionDuration}ms`,
          transitionTimingFunction: "cubic-bezier(.22,1,.36,1)",
        }}
      />
      <ul className="relative m-0 grid list-none grid-cols-2 border-l border-t border-line p-0 sm:grid-cols-3 lg:grid-cols-6">
      {items.map((item, i) => {
        const on = active === i;
        return (
          <li
            key={item.label}
            ref={(el) => {
              if (el) cells.current.set(i, el);
              else cells.current.delete(i);
            }}
            tabIndex={0}
            onMouseEnter={() => pick(i)}
            onFocus={() => pick(i)}
            data-active={on}
            className="vui-hgrid-cell relative flex min-h-[112px] flex-col justify-between border-b border-r border-line p-4 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-strong sm:min-h-[128px]"
          >
            <span
              className={cn(
                "relative z-[1] font-mono text-[11px] tabular-nums transition-colors duration-200",
                on ? "text-teal/70" : "text-faint",
              )}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              className={cn(
                "vui-hgrid-label relative z-[1] font-display text-[19px] font-medium leading-tight tracking-[-0.01em] transition-colors duration-200",
                on ? "text-teal" : "text-ink",
              )}
            >
              {item.label}
              {item.note && (
                <span
                  className={cn(
                    "mt-1 block font-mono text-[10.5px] font-normal uppercase tracking-[0.08em] transition-colors duration-200",
                    on ? "text-teal/70" : "text-faint",
                  )}
                >
                  {item.note}
                </span>
              )}
            </span>
          </li>
        );
      })}
      </ul>
    </div>
  );
}
