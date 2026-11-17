"use client";

import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

const StackScene = dynamic(() => import("@/components/three/StackScene"), { ssr: false });

class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function HeroVisual() {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [supported, setSupported] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [active, setActive] = useState(true);
  const [quality, setQuality] = useState<"high" | "low">("low");
  const onReady = useCallback(() => setReady(true), []);
  const onError = useCallback(() => { setReady(false); setSupported(false); }, []);
  useEffect(() => {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    setSupported(Boolean(gl));
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 768px)");
    const sync = () => { setReduced(motion.matches); setQuality(mobile.matches ? "low" : "high"); };
    sync();
    motion.addEventListener("change", sync); mobile.addEventListener("change", sync);
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting));
    if (host.current) observer.observe(host.current);
    return () => { observer.disconnect(); motion.removeEventListener("change", sync); mobile.removeEventListener("change", sync); };
  }, []);
  return <div ref={host} className="pointer-events-none absolute inset-0" aria-hidden>
    {!ready && <Image src="/hero-full-stack.png" alt="" fill priority sizes="(min-width: 640px) 560px, 100vw" className="object-contain"
      style={{ maskImage: "radial-gradient(ellipse at center, black 58%, transparent 73%)" }} />}
    {supported && <SceneBoundary onError={onError}><StackScene quality={quality} reduced={reduced} active={active} onReady={onReady} /></SceneBoundary>}
  </div>;
}
