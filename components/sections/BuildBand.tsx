import { PiStarFourFill } from "react-icons/pi";
import LogoSlider from "@/components/vengeance/LogoSlider";
import { profile } from "@/lib/data";

/** Giant two-way type marquee that leads into the Contact panel. */
export default function BuildBand() {
  const big = ["Got an idea?", "Let’s ship it", "together"];
  return (
    <section aria-label="Got an idea? Let’s ship it together" className="overflow-hidden py-16 max-sm:py-10">
      <LogoSlider
        speed={38}
        items={big.map((w, i) => (
          <span key={w} className="flex items-center">
            <span
              className={`whitespace-nowrap px-6 font-display text-[clamp(64px,11vw,168px)] font-bold leading-[1] tracking-[-0.05em] ${
                i % 2 === 1 ? "text-transparent [-webkit-text-stroke:2px_var(--teal)]" : "text-ink"
              }`}
            >
              {w}
            </span>
            <span
              aria-hidden
              className="grid h-[clamp(44px,6vw,92px)] w-[clamp(44px,6vw,92px)] place-items-center rounded-full bg-lime text-[clamp(22px,3vw,44px)] text-teal"
            >
              <PiStarFourFill aria-hidden size="1em" />
            </span>
          </span>
        ))}
      />
      <LogoSlider
        speed={30}
        direction="right"
        className="mt-4"
        items={[profile.availability.openLabel, "On-site · hybrid · remote", "Available to join now"].map(
          (t) => (
            <span key={t} className="kicker flex items-center gap-6 whitespace-nowrap px-6 text-[15px] text-muted">
              {t}
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-teal" />
            </span>
          ),
        )}
      />
    </section>
  );
}
