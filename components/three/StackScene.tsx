"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, Line, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

const LIME = "#b9f12f";
const PEARL = "#f2f0e9";
const GAP = 1.48;
const columns = [-1.25, 0, 1.25];

function Plate() {
  const edge = useMemo(() => {
    const shape = new THREE.Shape();
    const w = 1.95, d = 1.12, r = 0.24;
    shape.moveTo(-w + r, -d);
    shape.lineTo(w - r, -d); shape.quadraticCurveTo(w, -d, w, -d + r);
    shape.lineTo(w, d - r); shape.quadraticCurveTo(w, d, w - r, d);
    shape.lineTo(-w + r, d); shape.quadraticCurveTo(-w, d, -w, d - r);
    shape.lineTo(-w, -d + r); shape.quadraticCurveTo(-w, -d, -w + r, -d);
    return shape.getPoints(16).map(p => new THREE.Vector3(p.x, 0.035, p.y));
  }, []);
  return <>
    <RoundedBox args={[3.9, 0.09, 2.24]} radius={0.044} smoothness={4}>
      <meshPhysicalMaterial color="#50787a" metalness={0.12} roughness={0.22}
        transparent opacity={0.65} depthWrite={false} clearcoat={1} envMapIntensity={1.4} side={THREE.DoubleSide} />
    </RoundedBox>
    <Line points={edge} color={PEARL} lineWidth={0.85} transparent opacity={0.55} />
    <Line points={edge} position={[0, -0.065, 0]} color={LIME} lineWidth={1.2} transparent opacity={0.6} />
  </>;
}

function Block({ position, size, color = PEARL }: {
  position: [number, number, number]; size: [number, number, number]; color?: string;
}) {
  return <RoundedBox position={position} args={size} radius={Math.min(...size) * 0.35} smoothness={3}>
    <meshStandardMaterial color={color} roughness={0.34} metalness={0.14}
      emissive={color === LIME ? LIME : "#000000"} emissiveIntensity={0.5} />
  </RoundedBox>;
}

function WindowPanel({ x, scale = 1 }: { x: number; scale?: number }) {
  return <group position={[x, 0.54 * scale + 0.09, -0.28]} rotation={[-0.16, 0, 0]} scale={scale}>
    <Block position={[0, 0, 0]} size={[1.3, 1.04, 0.075]} color="#9baca1" />
    <Block position={[0, 0.43, 0.045]} size={[1.29, 0.19, 0.045]} color={LIME} />
    {[-0.51, -0.4, -0.29].map(x => <mesh key={x} position={[x, 0.44, 0.073]}>
      <sphereGeometry args={[0.028, 12, 12]} /><meshStandardMaterial color="#0b3048" />
    </mesh>)}
    <Block position={[-0.3, 0.08, 0.065]} size={[0.5, 0.43, 0.045]} />
    {[0.22, 0.08, -0.06].map(y => <Block key={y} position={[0.3, y, 0.065]} size={[0.43, 0.055, 0.045]} />)}
    {[-0.4, 0, 0.4].map(x => <Block key={x} position={[x, -0.31, 0.065]} size={[0.33, 0.19, 0.045]} />)}
  </group>;
}

function Interface() {
  return <>
    <WindowPanel x={0} /><WindowPanel x={-1.25} scale={0.55} /><WindowPanel x={1.25} scale={0.6} />
    {[-0.57, 0.63].map(x => <group key={x} position={[x, 0.1, 0.65]}>
      <Block position={[0, 0, 0]} size={[1, 0.09, 0.4]} color="#9baca1" />
      <Block position={[-0.08, 0.065, 0]} size={[0.65, 0.045, 0.19]} />
    </group>)}
  </>;
}

function Api() {
  return <>
    {[0, 1, 2].map(r => <Line key={r} points={[[-1.3, 0.2, -0.6 + r * 0.6], [1.3, 0.2, -0.6 + r * 0.6]]} color={PEARL} lineWidth={1.3} />)}
    {[0, 1, 2, 3, 4].map(c => <group key={c}>
      <Line points={[[-1.3 + c * 0.65, 0.2, -0.6], [-1.3 + c * 0.65, 0.2, 0.6]]} color={PEARL} lineWidth={1.3} />
      {[0, 1, 2].map(r => <mesh key={r} position={[-1.3 + c * 0.65, 0.2, -0.6 + r * 0.6]}>
        <sphereGeometry args={[0.105, 24, 16]} /><meshStandardMaterial color={PEARL} metalness={0.25} roughness={0.23} />
      </mesh>)}
    </group>)}
  </>;
}

function Data() {
  return <>{columns.map(x => <group key={x} position={[x, 0.06, 0.18]}>
    {[0, 1, 2, 3].map(i => <mesh key={i} position={[0, 0.075 + i * 0.13, 0]}>
      <cylinderGeometry args={[0.37, 0.37, 0.115, 48]} />
      <meshStandardMaterial color={PEARL} metalness={0.38} roughness={0.27} />
    </mesh>)}
    <mesh position={[0, 0.535, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.35, 0.022, 12, 64]} /><meshBasicMaterial color={LIME} toneMapped={false} />
    </mesh>
    <pointLight position={[0, 0.62, 0]} color={LIME} intensity={0.55} distance={1.1} />
  </group>)}</>;
}

function Sculpture({ reduced }: { reduced: boolean }) {
  const root = useRef<THREE.Group>(null);
  const packets = useRef<(THREE.Mesh | null)[]>([]);
  const glow = useMemo(() => {
    const data = new Uint8Array(64 * 64 * 4);
    for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) {
      const i = (y * 64 + x) * 4;
      const r = Math.hypot((x - 31.5) / 31.5, (y - 31.5) / 31.5);
      data.set([185, 241, 47, Math.round(Math.pow(Math.max(0, 1 - r), 3) * 220)], i);
    }
    const texture = new THREE.DataTexture(data, 64, 64);
    texture.needsUpdate = true;
    return texture;
  }, []);
  useEffect(() => () => glow.dispose(), [glow]);
  useFrame(({ clock }, delta) => {
    if (reduced) return;
    const t = clock.elapsedTime;
    if (root.current) {
      root.current.position.y = Math.sin(t * 0.65) * 0.035;
      root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, Math.sin(t * 0.25) * 0.045, 3, delta);
    }
    packets.current.forEach((packet, i) => {
      if (packet) packet.position.y = -GAP + ((t * 0.28 + i / 3) % 1) * GAP * 2;
    });
  });
  return <group ref={root}>
    <mesh position={[0, -2.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[5.7, 3.5]} /><meshBasicMaterial map={glow} transparent depthWrite={false} toneMapped={false} />
    </mesh>
    {columns.map((x, i) => <group key={x}>
      <Line points={[[x, -GAP, -0.65], [x, GAP, -0.65]]} color={PEARL} dashed dashSize={0.055} gapSize={0.055} transparent opacity={0.65} lineWidth={1} />
      <mesh ref={el => { packets.current[i] = el; }} position={[x, -0.8 + i * 0.8, -0.65]}>
        <capsuleGeometry args={[0.035, 0.15, 4, 12]} /><meshBasicMaterial color={LIME} toneMapped={false} />
      </mesh>
    </group>)}
    <group position={[0, GAP, 0]}><Plate /><Interface /></group>
    <group><Plate /><Api /></group>
    <group position={[0, -GAP, 0]}><Plate /><Data /></group>
  </group>;
}

export default function StackScene({ reduced, active, quality, onReady }: {
  reduced: boolean; active: boolean; quality: "high" | "low"; onReady: () => void;
}) {
  return <Canvas orthographic camera={{ position: [4.2, 3.3, 7.5], zoom: 70 }}
    dpr={[1, quality === "high" ? 2 : 1.25]} frameloop={active ? (reduced ? "demand" : "always") : "never"}
    gl={{ alpha: true, antialias: true }}
    onCreated={({ camera, gl, size }) => {
      const orthographic = camera as THREE.OrthographicCamera;
      orthographic.zoom = Math.min(size.width, size.height) / 6.4;
      orthographic.updateProjectionMatrix();
      camera.lookAt(0, 0.25, 0);
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      onReady();
    }}>
    <ambientLight intensity={0.85} />
    <directionalLight position={[3, 7, 5]} intensity={3.2} color={PEARL} />
    <directionalLight position={[-4, 1, -3]} intensity={1.7} color={LIME} />
    <Environment resolution={128}>
      <Lightformer position={[0, 5, -4]} rotation={[Math.PI / 2, 0, 0]} scale={[8, 8, 1]} intensity={3} color={PEARL} />
      <Lightformer position={[4, 2, 2]} rotation={[0, -Math.PI / 2, 0]} scale={[3, 6, 1]} intensity={4} color={PEARL} />
      <Lightformer position={[-4, 0, -2]} rotation={[0, Math.PI / 2, 0]} scale={[2, 5, 1]} intensity={2} color={LIME} />
    </Environment>
    <Sculpture reduced={reduced} />
    <FitCamera />
  </Canvas>;
}

function FitCamera() {
  useFrame(({ camera, size }) => {
    const c = camera as THREE.OrthographicCamera;
    const zoom = Math.min(size.width, size.height) / 6.4;
    if (c.zoom !== zoom) { c.zoom = zoom; c.updateProjectionMatrix(); }
  });
  return null;
}
