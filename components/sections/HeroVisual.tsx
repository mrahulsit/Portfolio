"use client";

import { Component, useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

const StackScene = dynamic(() => import("@/components/three/StackScene"), { ssr: false });

class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

const noSubscribe = () => () => {};

let webgl2: boolean | undefined;
/** Probed once per page load: creating a GL context is not free. */
function hasWebGL2() {
  if (webgl2 === undefined) {
    const gl = document.createElement("canvas").getContext("webgl2");
    webgl2 = Boolean(gl);
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  }
  return webgl2;
}

function useMediaQuery(query: string) {
  const subscribe = useCallback((onChange: () => void) => {
    const list = window.matchMedia(query);
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  }, [query]);
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
}

export default function HeroVisual() {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const webgl = useSyncExternalStore(noSubscribe, hasWebGL2, () => false);
  const supported = webgl && !failed;
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const quality = useMediaQuery("(max-width: 768px)") ? "low" : "high";
  const [active, setActive] = useState(true);
  const onReady = useCallback(() => setReady(true), []);
  const onError = useCallback(() => { setReady(false); setFailed(true); }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting));
    if (host.current) observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={host} className="pointer-events-none absolute inset-0" aria-hidden>
    {!ready && <Image src="/hero-full-stack.png" alt="" fill priority sizes="(min-width: 640px) 560px, 100vw" className="object-contain"
      style={{ maskImage: "radial-gradient(ellipse at center, black 58%, transparent 73%)" }} />}
    {supported && <SceneBoundary onError={onError}><StackScene quality={quality} reduced={reduced} active={active} onReady={onReady} /></SceneBoundary>}
  </div>;
}
