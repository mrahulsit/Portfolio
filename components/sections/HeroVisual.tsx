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
          className="absolute inset-[20%] rounded-full"
          style={{
            background:
              "radial-gradient(circle at 34% 28%, #34373c 0%, #0b0c0e 44%, #050607 100%)",
            boxShadow:
              "inset -16px -20px 46px rgba(0,0,0,0.85), 0 40px 80px -36px rgba(0,0,0,0.75)",
          }}
        />
        <div
          className="absolute inset-[2%] rounded-full opacity-60"
          style={{
            border: "1px solid var(--line)",
            transform: "rotate(-16deg) scaleY(0.36)",
          }}
        />
        <div
          className="absolute inset-[9%] rounded-full opacity-45"
          style={{
            border: "1px solid var(--line)",
            transform: "rotate(11deg) scaleY(0.42)",
          }}
        />
        <div
          className="absolute inset-[16%] rounded-full opacity-30"
          style={{
            border: "1px solid var(--line)",
            transform: "rotate(-28deg) scaleY(0.3)",
          }}
        />
        <div
          className="absolute left-[74%] top-[24%] h-2 w-2 rounded-full"
          style={{ background: "#cdf22b", boxShadow: "0 0 14px #cdf22b" }}
        />
        <div
          className="absolute left-[19%] top-[63%] h-1.5 w-1.5 rounded-full opacity-80"
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
