"use client";

/**
 * "The stack" — the hero's 3D piece. Three floating glass layers (Interface,
 * API, Data) with lime request/response packets travelling between them: a
 * literal picture of full-stack work. The layers assemble on load, tilt
 * toward the cursor, and pull apart into an exploded view as the page scrolls.
 */
import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

const SLAB = "#123d5a";
const PART = "#1c5274";
const PEARL = "#f2f0e9";
const LIME = "#b9f12f";

const W = 3.2;
const D = 2.2;
const GAP = 1.15;
const TOP = 0.07;

const LAYERS = [
  { key: "ui", n: "01", label: "Interface", stack: "React · Next.js", y: GAP },
  { key: "api", n: "02", label: "API", stack: "Node · Express", y: 0 },
  { key: "data", n: "03", label: "Data", stack: "PostgreSQL · Prisma", y: -GAP },
] as const;

const COLUMNS: [number, number][] = [
  [-1.15, -0.55],
  [1.15, -0.55],
  [-0.35, 0.75],
  [1.2, 0.8],
];

const PACKETS = [
  { col: 0, up: true, speed: 0.32, phase: 0 },
  { col: 1, up: false, speed: 0.27, phase: 0.4 },
  { col: 2, up: true, speed: 0.38, phase: 0.65 },
  { col: 3, up: false, speed: 0.3, phase: 0.15 },
  { col: 0, up: false, speed: 0.24, phase: 0.55 },
  { col: 2, up: false, speed: 0.29, phase: 0.1 },
];

const outline: [number, number, number][] = [
  [-W / 2, TOP, -D / 2],
  [W / 2, TOP, -D / 2],
  [W / 2, TOP, D / 2],
  [-W / 2, TOP, D / 2],
  [-W / 2, TOP, -D / 2],
];

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

function Slab() {
  return (
    <>
      <RoundedBox args={[W, 0.12, D]} radius={0.05} smoothness={3}>
        <meshPhysicalMaterial
          color={SLAB}
          roughness={0.35}
          metalness={0.15}
          clearcoat={1}
          clearcoatRoughness={0.25}
          transparent
          opacity={0.92}
        />
      </RoundedBox>
      <Line points={outline} color={LIME} lineWidth={1} transparent opacity={0.55} />
    </>
  );
}

/** UI layer: a few interface cards with lime header bars. */
function InterfaceParts() {
  const cards: [number, number, number, number][] = [
    [-0.8, -0.38, 1.2, 0.95],
    [0.65, -0.38, 1.4, 0.95],
    [-0.08, 0.62, 2.65, 0.55],
  ];
  return (
    <>
      {cards.map(([x, z, w, d], i) => (
        <group key={i} position={[x, TOP + 0.04, z]}>
          <mesh>
            <boxGeometry args={[w, 0.06, d]} />
            <meshStandardMaterial color={PART} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.035, -d / 2 + 0.09]}>
            <boxGeometry args={[w * 0.86, 0.012, 0.07]} />
            <meshBasicMaterial color={i === 0 ? LIME : PEARL} toneMapped={false} />
          </mesh>
          <mesh position={[-w * 0.18, 0.035, 0.08]}>
            <boxGeometry args={[w * 0.45, 0.01, 0.05]} />
            <meshBasicMaterial color={PEARL} transparent opacity={0.35} />
          </mesh>
        </group>
      ))}
    </>
  );
}

/** API layer: a grid of endpoint nodes and the routes between them. */
function ApiParts() {
  const { nodes, links } = useMemo(() => {
    const ns: [number, number, number][] = [];
    for (let r = 0; r < 3; r++)
      for (let c = 0; c < 5; c++) ns.push([-1.2 + c * 0.6, TOP + 0.06, -0.65 + r * 0.65]);
    const ls: [number, number, number][][] = [];
    ns.forEach((p, i) => {
      if (i % 5 < 4 && (i * 7) % 3 !== 0) ls.push([p, ns[i + 1]]);
      if (i < 10 && (i * 5) % 4 !== 1) ls.push([p, ns[i + 5]]);
    });
    return { nodes: ns, links: ls };
  }, []);
  return (
    <>
      {links.map((pts, i) => (
        <Line key={i} points={pts} color={PEARL} lineWidth={1} transparent opacity={0.28} />
      ))}
      {nodes.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.065, 16, 16]} />
          {i % 4 === 1 ? (
            <meshBasicMaterial color={LIME} toneMapped={false} />
          ) : (
            <meshStandardMaterial color={PEARL} roughness={0.4} />
          )}
        </mesh>
      ))}
    </>
  );
}

/** Data layer: three database cylinders. */
function DataParts() {
  return (
    <>
      {[-0.95, 0, 0.95].map((x, i) => (
        <group key={x} position={[x, TOP, i === 1 ? 0.15 : -0.1]}>
          {[0.07, 0.2, 0.33].map((y) => (
            <mesh key={y} position={[0, y, 0]}>
              <cylinderGeometry args={[0.34, 0.34, 0.1, 40]} />
              <meshStandardMaterial color={PART} roughness={0.45} metalness={0.2} />
            </mesh>
          ))}
          <mesh position={[0, 0.385, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.34, 0.012, 8, 56]} />
            <meshBasicMaterial color={i === 1 ? LIME : PEARL} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </>
  );
}

/** Soft lime pool of light under the stack. */
function Glow() {
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, "rgba(185,241,47,0.55)");
    grad.addColorStop(1, "rgba(185,241,47,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -GAP - 0.55, 0]}>
      <planeGeometry args={[5.5, 4.2]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

// Where each layer's label hangs: just off the slab's right-hand edge.
const LABEL_ANCHOR = new THREE.Vector3(W / 2 + 0.15, 0, -0.2);

function Stack({
  reduced,
  hostRef,
  labelRefs,
}: {
  reduced: boolean;
  hostRef: React.RefObject<HTMLDivElement | null>;
  labelRefs: React.RefObject<(HTMLDivElement | null)[]>;
}) {
  const projected = useMemo(() => new THREE.Vector3(), []);
  const root = useRef<THREE.Group>(null);
  const layerRefs = useRef<(THREE.Group | null)[]>([]);
  const connectors = useRef<THREE.Group>(null);
  const packetRefs = useRef<(THREE.Group | null)[]>([]);
  const pointer = useRef(new THREE.Vector2());
  const smooth = useRef(new THREE.Vector2());
  const scroll = useRef(0);
  const scrollTarget = useRef(0);
  const intro = useRef(reduced ? 1 : 0);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      const r = hostRef.current?.getBoundingClientRect();
      if (!r || !r.width) return;
      pointer.current.set(
        THREE.MathUtils.clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1, 1),
        THREE.MathUtils.clamp(-(((e.clientY - r.top) / r.height) * 2 - 1), -1, 1),
      );
    };
    const onScroll = () => {
      scrollTarget.current = THREE.MathUtils.clamp(window.scrollY / 650, 0, 1);
    };
    const reset = () => pointer.current.set(0, 0);
    onScroll();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseleave", reset);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseleave", reset);
    };
  }, [reduced, hostRef]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    const t = state.clock.elapsedTime;
    if (!reduced) intro.current = Math.min(1, intro.current + dt / 1.8);
    smooth.current.x = THREE.MathUtils.damp(smooth.current.x, pointer.current.x, 3.5, dt);
    smooth.current.y = THREE.MathUtils.damp(smooth.current.y, pointer.current.y, 3.5, dt);
    scroll.current = THREE.MathUtils.damp(scroll.current, scrollTarget.current, 4, dt);

    const p = easeOut(intro.current);
    // Layers start pulled apart, click together, then explode again on scroll.
    const spread = 1 + (1 - p) * 0.9 + scroll.current * 0.45;

    if (root.current) {
      const sway = reduced ? 0 : Math.sin(t * 0.35) * 0.12;
      root.current.rotation.y = sway + smooth.current.x * 0.32;
      root.current.rotation.x = smooth.current.y * -0.1;
      root.current.position.y = reduced ? 0 : Math.sin(t * 0.8) * 0.04;
    }

    LAYERS.forEach((layer, i) => {
      const g = layerRefs.current[i];
      if (!g) return;
      g.position.y = layer.y * spread;
      const local = THREE.MathUtils.clamp(p * 1.4 - i * 0.2, 0, 1);
      g.scale.setScalar(0.85 + 0.15 * local);

      // Pin the DOM label to the slab's projected screen position.
      const label = labelRefs.current?.[i];
      if (label) {
        g.updateWorldMatrix(true, false);
        projected.copy(LABEL_ANCHOR).applyMatrix4(g.matrixWorld).project(state.camera);
        const x = ((projected.x + 1) / 2) * state.size.width;
        const y = ((1 - projected.y) / 2) * state.size.height;
        label.style.transform = `translate(${x}px, ${y}px) translateY(-50%)`;
        label.style.opacity = String(local);
      }
    });

    if (connectors.current) connectors.current.scale.y = spread;

    PACKETS.forEach((pk, i) => {
      const g = packetRefs.current[i];
      if (!g) return;
      const f = reduced ? pk.phase : (t * pk.speed + pk.phase) % 1;
      const k = pk.up ? f : 1 - f;
      const [x, z] = COLUMNS[pk.col];
      g.position.set(x, THREE.MathUtils.lerp(-GAP, GAP, k) * spread, z);
      // Fade in/out at the layers so packets look like they pass through them.
      const edge = Math.min(k, 1 - k) * 8;
      g.scale.setScalar(Math.min(1, edge) * p);
    });
  });

  return (
    <group ref={root}>
      <Glow />

      <group ref={connectors}>
        {COLUMNS.map(([x, z], i) => (
          <Line
            key={i}
            points={[
              [x, -GAP, z],
              [x, GAP, z],
            ]}
            color={PEARL}
            lineWidth={1}
            dashed
            dashSize={0.06}
            gapSize={0.06}
            transparent
            opacity={0.3}
          />
        ))}
      </group>

      {LAYERS.map((layer, i) => (
        <group
          key={layer.key}
          ref={(el) => {
            layerRefs.current[i] = el;
          }}
        >
          <Slab />
          {layer.key === "ui" && <InterfaceParts />}
          {layer.key === "api" && <ApiParts />}
          {layer.key === "data" && <DataParts />}
        </group>
      ))}

      {PACKETS.map((_, i) => (
        <group
          key={i}
          ref={(el) => {
            packetRefs.current[i] = el;
          }}
        >
          <mesh>
            <boxGeometry args={[0.08, 0.2, 0.08]} />
            <meshBasicMaterial color={LIME} toneMapped={false} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial
              color={LIME}
              transparent
              opacity={0.16}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function StackScene({
  quality,
  reduced,
  active,
}: {
  quality: "high" | "low";
  reduced: boolean;
  active: boolean;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const showLabels = quality === "high";
  return (
    <div ref={hostRef} className="absolute inset-0">
      <Canvas
        dpr={[1, quality === "high" ? 2 : 1.5]}
        camera={{ position: [5.4, 3.9, 7.4], fov: 30 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={active ? "always" : "never"}
        onCreated={({ gl, camera }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          camera.lookAt(0, -0.1, 0);
        }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 8, 5]} intensity={1.6} color={PEARL} />
        <directionalLight position={[-6, 2, -4]} intensity={0.5} color={LIME} />
        <pointLight position={[0, -2.2, 0]} intensity={6} distance={6} color={LIME} />
        <Stack reduced={reduced} hostRef={hostRef} labelRefs={labelRefs} />
      </Canvas>
      {showLabels &&
        LAYERS.map((layer, i) => (
          <div
            key={layer.key}
            ref={(el) => {
              labelRefs.current[i] = el;
            }}
            className="pointer-events-none absolute left-0 top-0 whitespace-nowrap pl-3 font-mono leading-tight opacity-0"
          >
            <div className="text-[10px] uppercase tracking-[0.12em] text-[#94a9b4]">
              {layer.n} · {layer.label}
            </div>
            <div className="text-[11.5px] text-[#f2f0e9]">{layer.stack}</div>
          </div>
        ))}
    </div>
  );
}
