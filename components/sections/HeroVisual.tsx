"use client";

import { Component, type ReactNode, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "@/lib/theme";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
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

  componentDidCatch() {
    this.setState({ failed: true });
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function Fallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative aspect-square w-[80%] max-w-[440px]">
        <div
          className="absolute inset-[11%] rounded-full"
          style={{
            background:
              "radial-gradient(circle at 34% 28%, #34373c 0%, #0b0c0e 44%, #050607 100%)",
            boxShadow:
              "inset -22px -28px 60px rgba(0,0,0,0.85), 0 44px 90px -38px rgba(0,0,0,0.75)",
          }}
        />
        <div
          className="absolute inset-[1%] rounded-full opacity-55"
          style={{
            border: "1px solid var(--line)",
            transform: "rotate(-14deg) scaleY(0.4)",
          }}
        />
        <div
          className="absolute inset-[7%] rounded-full opacity-40"
          style={{
            border: "1px solid var(--line)",
            transform: "rotate(12deg) scaleY(0.46)",
          }}
        />
        <div
          className="absolute left-[74%] top-[26%] h-2 w-2 rounded-full"
          style={{ background: "#cdf22b", boxShadow: "0 0 14px #cdf22b" }}
        />
        <div
          className="absolute left-[17%] top-[66%] h-1.5 w-1.5 rounded-full opacity-70"
          style={{ background: "var(--line)" }}
        />
      </div>
    </div>
  );
}

type Env = {
  reduced: boolean;
  quality: "high" | "low";
};

function detectWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") || canvas.getContext("webgl")
    );
  } catch {
    return false;
  }
}

export default function HeroVisual() {
  const { theme } = useTheme();
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

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "120px" }
    );
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
    <div
      ref={hostRef}
      className="pointer-events-none absolute inset-0"
      aria-hidden
    >
      {env ? (
        <SceneBoundary fallback={<Fallback />}>
          <HeroScene
            theme={theme}
            quality={env.quality}
            reduced={env.reduced}
            active={active}
          />
        </SceneBoundary>
      ) : null}
    </div>
  );
}
