"use client";

import { useEffect } from "react";
import { scrollToSection } from "@/lib/sectionNav";

/**
 * Intercepts clicks on any same-page section link (`#about`, `/#about` while
 * on `/`, …) and routes them through `scrollToSection`. Runs in the capture
 * phase so it acts before Next's <Link>, which skips navigation once the
 * event is default-prevented. Links to other pages are left alone, and Next
 * lands on their hash instantly.
 */
export default function SectionLinks() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest?.("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href, window.location.href);
      if (
        url.origin !== window.location.origin ||
        url.pathname !== window.location.pathname ||
        !url.hash
      ) {
        return;
      }

      const id = decodeURIComponent(url.hash.slice(1));
      // The skip link moves focus to <main>; let the browser handle it.
      if (!id || id === "main") return;

      if (scrollToSection(id)) event.preventDefault();
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
