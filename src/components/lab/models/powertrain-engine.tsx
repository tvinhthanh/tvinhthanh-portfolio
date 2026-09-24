"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
  rpm: number;
  driveMode: "sport" | "track" | "corsa";
  wireframe: boolean;
  autoRotate: boolean;
};

export function PowertrainEngine({ rpm, driveMode, wireframe, autoRotate }: Props) {
  const rootRef = useRef<THREE.Group>(null);
  const leftTurbineRef = useRef<THREE.Group>(null);
  const rightTurbineRef = useRef<THREE.Group>(null);
  const pulseCoreRef = useRef<THREE.Mesh>(null);
  const smoothedRpm = useRef(rpm);

  const modeColors = useMemo(() => {
    switch (driveMode) {
      case "corsa":
        return {
          glow: "#ff3333",
          accent: "#ff4d4d",
          intensity: 1.4,
        };
      case "track":
        return {
          glow: "#f59e0b",
          accent: "#fbbf24",
          intensity: 1.1,
        };
      case "sport":
      default:
        return {
          glow: "#edd49a",
          accent: "#d4a755",
          intensity: 0.8,
        };
    }
  }, [driveMode]);

  const materials = useMemo(() => {
    return {
      blockMetal: new THREE.MeshStandardMaterial({
        color: "#1c2226",
        metalness: 0.9,
        roughness: 0.3,
        wireframe,
      }),
      carbonCover: new THREE.MeshStandardMaterial({
        color: "#0f1315",
        metalness: 0.8,
        roughness: 0.2,
        wireframe,
      }),
      goldAccent: new THREE.MeshStandardMaterial({
        color: "#edd49a",
        metalness: 0.95,
        roughness: 0.15,
        wireframe,
      }),
      titaniumExhaust: new THREE.MeshStandardMaterial({
        color: "#5c6670",
        metalness: 0.95,
        roughness: 0.25,
        wireframe,
      }),
      turbineBlades: new THREE.MeshStandardMaterial({
        color: "#d4a755",
        metalness: 0.95,
        roughness: 0.1,
        wireframe,
      }),
      coreGlow: new THREE.MeshStandardMaterial({
        color: modeColors.glow,
        emissive: modeColors.glow,
        emissiveIntensity: modeColors.intensity,
        metalness: 0.4,
        roughness: 0.2,
        wireframe,
      }),
    };
  }, [wireframe, modeColors]);

  useFrame((_, delta) => {
    smoothedRpm.current = THREE.MathUtils.lerp(
      smoothedRpm.current,
      rpm,
      Math.min(delta * 6, 1)
    );
    const currentRpm = smoothedRpm.current;

    // Turbo spooling rotation speed
    const spoolSpeed = (currentRpm / 1000) * delta * 15;
    if (leftTurbineRef.current) leftTurbineRef.current.rotation.z += spoolSpeed;
    if (rightTurbineRef.current) rightTurbineRef.current.rotation.z -= spoolSpeed;

    // Subtle engine vibration at high RPM
    if (rootRef.current) {
      const vibration = (currentRpm / 9000) * 0.003;
      rootRef.current.position.y =
        -0.05 + Math.sin(Date.now() * 0.04) * vibration;

      if (autoRotate) {
        rootRef.current.rotation.y += delta * 0.35;
      }
    }

    // Dynamic core pulse
    if (pulseCoreRef.current) {
      const scalePulse = 1 + Math.sin(Date.now() * 0.008 * (currentRpm / 2000)) * 0.04;
      pulseCoreRef.current.scale.set(scalePulse, scalePulse, scalePulse);
    }
  });

  return (
    <group ref={rootRef} scale={1.25} position={[0, -0.05, 0]} dispose={null}>
      {/* ---------------- CRANKCASE & ENGINE BLOCK ---------------- */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.9, 0.55, 1.4]} />
        <primitive object={materials.blockMetal} attach="material" />
      </mesh>

      {/* Sump Pan */}
      <mesh position={[0, -0.26, 0]}>
        <boxGeometry args={[0.75, 0.12, 1.25]} />
        <primitive object={materials.blockMetal} attach="material" />
      </mesh>

      {/* ---------------- V-BANK CYLINDER HEADS ---------------- */}
      {/* Left Bank (angled 30 deg) */}
      <group position={[-0.42, 0.36, 0]} rotation={[0, 0, 0.45]}>
        <mesh>
          <boxGeometry args={[0.42, 0.28, 1.35]} />
          <primitive object={materials.carbonCover} attach="material" />
        </mesh>
        {/* Cam cover badge line */}
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.15, 0.03, 1.2]} />
          <primitive object={materials.goldAccent} attach="material" />
        </mesh>
      </group>

      {/* Right Bank (angled -30 deg) */}
      <group position={[0.42, 0.36, 0]} rotation={[0, 0, -0.45]}>
        <mesh>
          <boxGeometry args={[0.42, 0.28, 1.35]} />
          <primitive object={materials.carbonCover} attach="material" />
        </mesh>
        {/* Cam cover badge line */}
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.15, 0.03, 1.2]} />
          <primitive object={materials.goldAccent} attach="material" />
        </mesh>
      </group>

      {/* ---------------- INTAKE PLENUM & VELOCITY RUNNERS ---------------- */}
      <group position={[0, 0.5, 0]}>
        {/* Central Carbon Fiber Intake Plenum */}
        <mesh position={[0, 0.12, 0]}>
          <boxGeometry args={[0.5, 0.18, 1.2]} />
          <primitive object={materials.carbonCover} attach="material" />
        </mesh>

        {/* 6 Velocity Stack Pairs (V12) */}
        {[-0.45, -0.27, -0.09, 0.09, 0.27, 0.45].map((z, idx) => (
          <group key={idx} position={[0, 0.22, z]}>
            {/* Left stack */}
            <mesh position={[-0.18, 0, 0]} rotation={[0, 0, 0.2]}>
              <cylinderGeometry args={[0.045, 0.035, 0.12, 12]} />
              <primitive object={materials.goldAccent} attach="material" />
            </mesh>
            {/* Right stack */}
            <mesh position={[0.18, 0, 0]} rotation={[0, 0, -0.2]}>
              <cylinderGeometry args={[0.045, 0.035, 0.12, 12]} />
              <primitive object={materials.goldAccent} attach="material" />
            </mesh>
          </group>
        ))}
      </group>

      {/* ---------------- TWIN TURBOCHARGER HOUSINGS ---------------- */}
      {/* Left Turbo */}
      <group position={[-0.65, 0.05, 0.45]}>
        {/* Snail Housing */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.16, 0.07, 12, 24]} />
          <primitive object={materials.titaniumExhaust} attach="material" />
        </mesh>
        {/* Spinning Compressor Turbine */}
        <group ref={leftTurbineRef} position={[0, 0, 0.05]}>
          <mesh>
            <cylinderGeometry args={[0.12, 0.12, 0.04, 8]} />
            <primitive object={materials.turbineBlades} attach="material" />
          </mesh>
        </group>
        {/* Wastegate Actuator */}
        <mesh position={[-0.08, 0.14, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.12, 8]} />
          <primitive object={materials.goldAccent} attach="material" />
        </mesh>
      </group>

      {/* Right Turbo */}
      <group position={[0.65, 0.05, 0.45]}>
        {/* Snail Housing */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.16, 0.07, 12, 24]} />
          <primitive object={materials.titaniumExhaust} attach="material" />
        </mesh>
        {/* Spinning Compressor Turbine */}
        <group ref={rightTurbineRef} position={[0, 0, 0.05]}>
          <mesh>
            <cylinderGeometry args={[0.12, 0.12, 0.04, 8]} />
            <primitive object={materials.turbineBlades} attach="material" />
          </mesh>
        </group>
        {/* Wastegate Actuator */}
        <mesh position={[0.08, 0.14, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.12, 8]} />
          <primitive object={materials.goldAccent} attach="material" />
        </mesh>
      </group>

      {/* ---------------- TITANIUM EXHAUST DOWNPIPES ---------------- */}
      {/* Left Exhaust Pipe */}
      <group position={[-0.55, -0.05, -0.6]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.7, 16]} />
          <primitive object={materials.titaniumExhaust} attach="material" />
        </mesh>
      </group>

      {/* Right Exhaust Pipe */}
      <group position={[0.55, -0.05, -0.6]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.7, 16]} />
          <primitive object={materials.titaniumExhaust} attach="material" />
        </mesh>
      </group>

      {/* ---------------- HYBRID ELECTRIC INVERTER CORE ---------------- */}
      {/* Represents distributed backend sync & microservice throughput */}
      <mesh ref={pulseCoreRef} position={[0, -0.05, 0]}>
        <boxGeometry args={[0.6, 0.28, 0.9]} />
        <primitive object={materials.coreGlow} attach="material" />
      </mesh>
    </group>
  );
}
