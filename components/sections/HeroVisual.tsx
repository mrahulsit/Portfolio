"use client";

import { Component, type ReactNode, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const StackScene = dynamic(() => import("@/components/three/StackScene"), {
  ssr: false,
  loading: () => null,
});

class SceneBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/** Flat stand-in for the 3D stack when WebGL is unavailable. */
function Fallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative h-[62%] w-[64%]">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute left-0 right-0 h-[30%] rounded-[14px] border border-[rgba(185,241,47,0.45)] bg-[#123d5a]"
            style={{
              top: `${i * 34}%`,
              transform: "perspective(600px) rotateX(58deg) rotateZ(-32deg)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

type Env = { reduced: boolean; quality: "high" | "low" };

function detectWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function HeroVisual() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [env, setEnv] = useState<Env | null>(null);
  const [supported, setSupported] = useState(true);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!detectWebGL()) {
      setSupported(false);
      return;
    }
    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const widthQuery = window.matchMedia("(max-width: 768px)");
    const read = () =>
      setEnv({
        reduced: reduceQuery.matches,
        quality: widthQuery.matches ? "low" : "high",
      });
    read();
    reduceQuery.addEventListener("change", read);
    widthQuery.addEventListener("change", read);
    return () => {
      reduceQuery.removeEventListener("change", read);
      widthQuery.removeEventListener("change", read);
    };
  }, []);

  // Pause rendering while the hero is off screen.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), {
      rootMargin: "120px",
    });
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  if (!supported) {
    return (
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Fallback />
      </div>
    );
  }

  return (
    <div ref={hostRef} className="pointer-events-none absolute -inset-[6%]" aria-hidden>
      {env ? (
        <SceneBoundary fallback={<Fallback />}>
          <StackScene quality={env.quality} reduced={env.reduced} active={active} />
        </SceneBoundary>
      ) : null}
    </div>
  );
}
