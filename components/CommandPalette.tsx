"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaSearch as Search } from "react-icons/fa";
import { useTheme } from "@/lib/theme";
import { useToast } from "@/lib/toast";
import { profile } from "@/lib/data";

type Command = {
  label: string;
  run: () => void;
};

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const { toggle } = useTheme();
  const toast = useToast();

  const commands = useMemo<Command[]>(() => {
    const goto = (id: string) => () => {
      document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    return [
      { label: "Go to Experience", run: goto("#experience") },
      { label: "Go to Projects", run: goto("#projects") },
      { label: "Go to Skills", run: goto("#skills") },
      { label: "Go to GitHub", run: goto("#github") },
      { label: "Go to Writing", run: goto("#writing") },
      { label: "Go to Contact", run: goto("#contact") },
      {
        label: "Toggle theme",
        run: () => {
          toggle();
          toast(document.documentElement.getAttribute("data-theme") === "light" ? "Light theme on" : "Dark theme on");
        },
      },
      {
        label: "Download résumé",
        run: () => window.open("/resume", "_blank", "noopener,noreferrer"),
      },
      {
        label: "Copy email",
        run: () => {
          navigator.clipboard?.writeText(profile.email).then(
            () => toast("Email copied"),
            () => toast(profile.email),
          );
        },
      },
      {
        label: "Open GitHub",
        run: () => window.open(profile.github, "_blank", "noopener,noreferrer"),
      },
      {
        label: "Open LinkedIn",
        run: () => window.open(profile.linkedin, "_blank", "noopener,noreferrer"),
      },
      {
        label: "Open blog",
        run: () => window.open(profile.blog, "_blank", "noopener,noreferrer"),
      },
    ];
  }, [toggle, toast]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(q));
  }, [query, commands]);

  const show = useCallback((next: boolean) => {
    setOpen(next);
    if (next) {
      setQuery("");
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, []);

  const run = useCallback(
    (c: Command) => {
      show(false);
      c.run();
    },
    [show],
  );

  /* open: ⌘K / Ctrl+K, and the footer's custom event */
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === "k") {
        ev.preventDefault();
        const next = !open;
        setOpen(next);
        if (next) {
          setQuery("");
          setActive(0);
          requestAnimationFrame(() => inputRef.current?.focus());
        }
        return;
      }
      if (!open) return;
      if (ev.key === "Escape") {
        ev.preventDefault();
        show(false);
      } else if (ev.key === "ArrowDown") {
        ev.preventDefault();
        setActive((a) => (results.length ? (a + 1) % results.length : 0));
      } else if (ev.key === "ArrowUp") {
        ev.preventDefault();
        setActive((a) => (results.length ? (a - 1 + results.length) % results.length : 0));
      } else if (ev.key === "Enter") {
        ev.preventDefault();
        const c = results[active];
        if (c) run(c);
      }
    };
    const onOpenEvent = () => show(true);

    document.addEventListener("keydown", onKey);
    window.addEventListener("open-palette", onOpenEvent);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("open-palette", onOpenEvent);
    };
  }, [open, active, results, run, show]);

  /* lock scroll behind the dialog */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* keep active item in view */
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.children[active] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) show(false);
          }}
          className="fixed inset-0 z-[400] flex items-start justify-center bg-black/55 pt-[14vh] px-4"
        >
          <motion.div
            initial={{ opacity: 0, y: -14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-[560px] overflow-hidden rounded-card border border-line-strong bg-elev shadow-lift"
          >
            <div className="flex items-center gap-3 border-b border-line px-[18px] py-4">
              <Search size={15} className="shrink-0 text-faint" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                placeholder="Type a command or jump to…"
                autoComplete="off"
                role="combobox"
                aria-expanded="true"
                aria-controls="palette-list"
                className="flex-1 border-none bg-none text-base text-ink focus:outline-none"
                style={{ background: "transparent" }}
              />
              <kbd className="rounded-md border border-line-strong px-2 py-0.5 font-ui text-[11px] text-muted">
                esc
              </kbd>
            </div>

            <ul
              ref={listRef}
              id="palette-list"
              role="listbox"
              className="grid max-h-80 gap-0.5 overflow-y-auto p-2"
            >
              {results.length === 0 && (
                <li className="px-5 py-5 text-center text-sm text-faint">No matching commands</li>
              )}
              {results.map((c, i) => (
                <li key={c.label} role="option" aria-selected={i === active}>
                  <button
                    type="button"
                    onClick={() => run(c)}
                    onMouseEnter={() => setActive(i)}
                    className={`flex w-full items-center justify-between gap-3 rounded-lg px-3.5 py-2.5 text-left transition-colors ${
                      i === active ? "bg-accent-soft" : "hover:bg-sink"
                    }`}
                  >
                    <b
                      className={`text-[14.5px] font-semibold ${
                        i === active ? "text-accent-ink" : "text-ink"
                      }`}
                    >
                      {c.label}
                    </b>
                    <kbd className="font-ui text-[11px] text-muted">↵</kbd>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
