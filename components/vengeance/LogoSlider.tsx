/**
 * Logo Slider — adapted from Vengeance UI (`logo-slider`).
 * An infinite marquee. Items are rendered twice so the -50% loop is seamless;
 * the duplicate copy is hidden from assistive tech.
 */
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function LogoSlider({
  items,
  speed = 40,
  direction = "left",
  pauseOnHover = true,
  className,
  itemClassName,
  label,
}: {
  items: ReactNode[];
  /** Seconds for one full loop. */
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
  itemClassName?: string;
  label?: string;
}) {
  return (
    <div
      className={cn("vui-marquee", className)}
      data-direction={direction}
      data-pause-on-hover={pauseOnHover}
      style={{ "--speed": `${speed}s` } as CSSProperties}
      role={label ? "region" : undefined}
      aria-label={label}
    >
      <div className="vui-marquee__track">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1 ? true : undefined}
            className="m-0 flex shrink-0 list-none items-center p-0"
          >
            {items.map((item, i) => (
              <li key={i} className={cn("shrink-0", itemClassName)}>
                {item}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
