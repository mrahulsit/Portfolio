/**
 * In-page section navigation.
 *
 * Next.js' <Link> doesn't scroll when you click a hash link whose hash is
 * already in the URL, and CSS smooth scrolling made cross-page arrivals crawl
 * down the whole page. Everything that jumps to a section goes through here
 * instead, so behaviour is identical from the navbar, footer, hero CTAs and
 * command palette.
 */

/** Fired with the target section id so the header can pin its highlight. */
export const SECTION_NAV_EVENT = "section-nav";

export type SectionNavDetail = { id: string };

/**
 * Smoothly scrolls to `#id` on the current page and updates the URL hash.
 * Returns false if the section isn't on this page (caller should navigate).
 */
export function scrollToSection(id: string): boolean {
  const target = document.getElementById(id);
  if (!target) return false;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const behavior: ScrollBehavior = reduce ? "auto" : "smooth";

  window.dispatchEvent(
    new CustomEvent<SectionNavDetail>(SECTION_NAV_EVENT, { detail: { id } }),
  );

  if (id === "home") {
    window.scrollTo({ top: 0, behavior });
  } else {
    // Honours `scroll-padding-top` on <html>, which clears the sticky header.
    target.scrollIntoView({ behavior, block: "start" });
  }

  // Keep Next's router state; only the hash changes.
  window.history.replaceState(window.history.state, "", `${window.location.pathname}#${id}`);
  return true;
}
