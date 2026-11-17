import Image from "next/image";

/** The original full-stack render created for the portfolio. */
export default function HeroVisual() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      aria-hidden
      style={{
        maskImage: "radial-gradient(ellipse at center, black 58%, transparent 73%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 58%, transparent 73%)",
      }}
    >
      <Image
        src="/hero-full-stack.png"
        alt=""
        fill
        priority
        sizes="(min-width: 640px) 560px, 100vw"
        className="object-contain"
      />
    </div>
  );
}
