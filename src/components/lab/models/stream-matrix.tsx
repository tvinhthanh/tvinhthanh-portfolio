"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
  streamState: "streaming" | "burst" | "idle";
  streamSpeed: number;
  wireframe: boolean;
  autoRotate: boolean;
};

const LOCALES_COUNT = 28;

export function StreamMatrix({
  streamState,
  streamSpeed,
  wireframe,
  autoRotate,
}: Props) {
  const rootRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const coreWireRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Generate 28 satellite node positions
  const satellites = useMemo(() => {
    const nodes: { pos: [number, number, number]; id: number; radius: number }[] = [];
    for (let i = 0; i < LOCALES_COUNT; i++) {
      const angle = (i / LOCALES_COUNT) * Math.PI * 2;
      const r = 1.75 + (i % 2) * 0.25;
      const y = Math.sin(angle * 3) * 0.2;
      nodes.push({
        id: i,
        pos: [Math.cos(angle) * r, y, Math.sin(angle) * r],
        radius: r,
      });
    }
    return nodes;
  }, []);

  // Generate token stream particle buffers
  const { particlePositions, particleVelocities, particleCount } = useMemo(() => {
    const count = 160;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Deterministic pseudo-random seed based on index
      const sat = satellites[i % LOCALES_COUNT];
      const t = ((i * 37 + 13) % 100) / 100;
      positions[i * 3] = sat.pos[0] * t;
      positions[i * 3 + 1] = sat.pos[1] * t;
      positions[i * 3 + 2] = sat.pos[2] * t;
      velocities[i] = 0.5 + (((i * 73 + 19) % 100) / 100) * 0.8;
    }

    return { particlePositions: positions, particleVelocities: velocities, particleCount: count };
  }, [satellites]);

  const materials = useMemo(() => {
    return {
      core: new THREE.MeshStandardMaterial({
        color: "#edd49a",
        emissive: "#d4a755",
        emissiveIntensity: 0.8,
        roughness: 0.15,
        metalness: 0.7,
        wireframe,
      }),
      coreWire: new THREE.MeshBasicMaterial({
        color: "#fff3d4",
        wireframe: true,
      }),
      satellite: new THREE.MeshStandardMaterial({
        color: "#182326",
        metalness: 0.9,
        roughness: 0.2,
        wireframe,
      }),
      satelliteAccent: new THREE.MeshStandardMaterial({
        color: "#edd49a",
        metalness: 0.8,
        roughness: 0.3,
      }),
      busRing: new THREE.MeshBasicMaterial({
        color: "#3d4e54",
        wireframe: true,
      }),
      particles: new THREE.PointsMaterial({
        color: "#f5e4b8",
        size: 0.055,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
      }),
    };
  }, [wireframe]);

  useFrame((_, delta) => {
    const mult = streamSpeed * (streamState === "burst" ? 2.5 : streamState === "idle" ? 0.3 : 1.0);

    // Rotate core & satellites
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.8 * mult;
      coreRef.current.rotation.z += delta * 0.4 * mult;
    }
    if (coreWireRef.current && coreRef.current) {
      coreWireRef.current.rotation.copy(coreRef.current.rotation);
    }
    if (ringRef.current && autoRotate) {
      ringRef.current.rotation.y += delta * 0.25;
    }
    if (rootRef.current && autoRotate) {
      rootRef.current.rotation.y += delta * 0.15;
    }

    // Stream token particles from center outward
    if (particlesRef.current && streamState !== "idle") {
      const geo = particlesRef.current.geometry;
      const pos = geo.attributes.position.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const sat = satellites[i % LOCALES_COUNT];
        const v = particleVelocities[i] * delta * mult * 1.5;

        pos[i * 3] += sat.pos[0] * v;
        pos[i * 3 + 1] += sat.pos[1] * v;
        pos[i * 3 + 2] += sat.pos[2] * v;

        // Reset if reached target radius
        const dist = Math.sqrt(
          pos[i * 3] ** 2 + pos[i * 3 + 1] ** 2 + pos[i * 3 + 2] ** 2
        );
        if (dist >= sat.radius) {
          pos[i * 3] = 0;
          pos[i * 3 + 1] = 0;
          pos[i * 3 + 2] = 0;
        }
      }
      geo.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={rootRef} scale={1.15} dispose={null}>
      {/* Central Transformer Core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.48, 1]} />
        <primitive object={materials.core} attach="material" />
      </mesh>
      <mesh ref={coreWireRef} scale={1.1}>
        <icosahedronGeometry args={[0.48, 1]} />
        <primitive object={materials.coreWire} attach="material" />
      </mesh>

      {/* Orbit Bus Rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.75, 0.008, 16, 64]} />
        <primitive object={materials.busRing} attach="material" />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.0, 0.008, 16, 64]} />
        <primitive object={materials.busRing} attach="material" />
      </mesh>

      {/* 28 Locale Satellite Nodes */}
      <group ref={ringRef}>
        {satellites.map((node) => (
          <group key={node.id} position={node.pos}>
            <mesh>
              <octahedronGeometry args={[0.075, 0]} />
              <primitive object={materials.satellite} attach="material" />
            </mesh>
            <mesh scale={0.4}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <primitive object={materials.satelliteAccent} attach="material" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Streaming Tokens (SSE Particles) */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <primitive object={materials.particles} attach="material" />
      </points>

      {/* Glow Point Light at Core */}
      <pointLight color="#edd49a" intensity={streamState === "burst" ? 25 : 8} distance={5} />
    </group>
  );
}
