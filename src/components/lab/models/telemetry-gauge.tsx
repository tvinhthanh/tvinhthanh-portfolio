"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
  rpm: number;
  speedKmh: number;
  gear: number;
  driveMode: "sport" | "track" | "corsa";
  wireframe: boolean;
  autoRotate: boolean;
};

export function TelemetryGauge({
  rpm,
  speedKmh,
  gear,
  driveMode,
  wireframe,
  autoRotate,
}: Props) {
  const rootRef = useRef<THREE.Group>(null);
  const needleRef = useRef<THREE.Group>(null);
  const gBallRef = useRef<THREE.Mesh>(null);
  const speedBarRef = useRef<THREE.Mesh>(null);
  const ledRefs = useRef<(THREE.Mesh | null)[]>([]);
  const smoothedRpm = useRef(rpm);

  const modeAccent = useMemo(() => {
    switch (driveMode) {
      case "corsa":
        return "#ff3333";
      case "track":
        return "#f59e0b";
      case "sport":
      default:
        return "#edd49a";
    }
  }, [driveMode]);

  const materials = useMemo(() => {
    return {
      binnacleCarbon: new THREE.MeshStandardMaterial({
        color: "#111417",
        metalness: 0.9,
        roughness: 0.2,
        wireframe,
      }),
      dialFace: new THREE.MeshStandardMaterial({
        color: "#090d0f",
        metalness: 0.5,
        roughness: 0.5,
        wireframe,
      }),
      goldAccent: new THREE.MeshStandardMaterial({
        color: modeAccent,
        metalness: 0.95,
        roughness: 0.15,
        wireframe,
      }),
      needleMat: new THREE.MeshStandardMaterial({
        color: "#ff3e3e",
        emissive: "#d92323",
        emissiveIntensity: 0.8,
        metalness: 0.8,
        roughness: 0.2,
      }),
      tickNormal: new THREE.MeshStandardMaterial({
        color: "#8395a1",
        metalness: 0.7,
        roughness: 0.3,
      }),
      tickRedline: new THREE.MeshStandardMaterial({
        color: "#ff4d4d",
        emissive: "#cc1111",
        emissiveIntensity: 0.6,
      }),
      ledOff: new THREE.MeshStandardMaterial({
        color: "#22272b",
        metalness: 0.8,
        roughness: 0.5,
      }),
      ledGreen: new THREE.MeshStandardMaterial({
        color: "#22c55e",
        emissive: "#16a34a",
        emissiveIntensity: 1.2,
      }),
      ledYellow: new THREE.MeshStandardMaterial({
        color: "#eab308",
        emissive: "#ca8a04",
        emissiveIntensity: 1.2,
      }),
      ledRed: new THREE.MeshStandardMaterial({
        color: "#ef4444",
        emissive: "#dc2626",
        emissiveIntensity: 1.5,
      }),
      ledBlue: new THREE.MeshStandardMaterial({
        color: "#38bdf8",
        emissive: "#0284c7",
        emissiveIntensity: 1.8,
      }),
      gearActive: new THREE.MeshStandardMaterial({
        color: modeAccent,
        emissive: modeAccent,
        emissiveIntensity: 0.9,
      }),
      glassCover: new THREE.MeshPhysicalMaterial({
        color: "#0d171b",
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.8,
        transparent: true,
        opacity: 0.6,
      }),
    };
  }, [wireframe, modeAccent]);

  // Generate 28 radial dial ticks: from -130 deg to +130 deg
  const ticks = useMemo(() => {
    const list: Array<{ angle: number; isRedline: boolean; isMajor: boolean }> = [];
    const minAngle = -2.25;
    const maxAngle = 2.25;
    const count = 28;

    for (let i = 0; i <= count; i++) {
      const t = i / count;
      const angle = minAngle + t * (maxAngle - minAngle);
      const isRedline = t >= 0.75;
      const isMajor = i % 3 === 0;
      list.push({ angle, isRedline, isMajor });
    }
    return list;
  }, []);

  useFrame((_, delta) => {
    smoothedRpm.current = THREE.MathUtils.lerp(
      smoothedRpm.current,
      rpm,
      Math.min(delta * 8, 1)
    );
    const curRpm = smoothedRpm.current;

    // Tachometer needle angle: maps 0-9000 RPM to -2.25 to +2.25 radians
    const needleAngle = -2.25 + (curRpm / 9000) * 4.5;
    if (needleRef.current) {
      needleRef.current.rotation.z = -needleAngle;
    }

    // Shift Lights update directly in WebGL frame loop
    const shiftProgress = Math.min(Math.max((curRpm - 3500) / 5000, 0), 1);
    const activeLeds = Math.floor(shiftProgress * 9);
    const isBlinkingRedline = curRpm > 8400 && Math.floor(Date.now() / 80) % 2 === 0;

    ledRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      if (isBlinkingRedline) {
        mesh.material = materials.ledBlue;
      } else if (i < activeLeds) {
        if (i < 3) mesh.material = materials.ledGreen;
        else if (i < 6) mesh.material = materials.ledYellow;
        else mesh.material = materials.ledRed;
      } else {
        mesh.material = materials.ledOff;
      }
    });

    // Speed bar scale
    if (speedBarRef.current) {
      const speedNorm = Math.min(speedKmh / 350, 1);
      speedBarRef.current.scale.x = Math.max(0.01, speedNorm);
    }

    // G-Force Vector Ball: simulates lateral acceleration swing
    if (gBallRef.current) {
      const t = Date.now() * 0.002;
      const gX = Math.sin(t) * 0.12 * (curRpm / 4000);
      const gY = Math.cos(t * 1.3) * 0.08 * (curRpm / 4000);
      gBallRef.current.position.x = 1.05 + gX;
      gBallRef.current.position.y = -0.15 + gY;
    }

    if (autoRotate && rootRef.current) {
      rootRef.current.rotation.y = Math.sin(Date.now() * 0.001) * 0.25;
    }
  });

  return (
    <group ref={rootRef} scale={1.35} position={[0, -0.05, 0]} dispose={null}>
      {/* ---------------- BINNACLE HOUSING ---------------- */}
      {/* Curved Instrument Cowl */}
      <mesh position={[0, 0, -0.15]}>
        <boxGeometry args={[3.2, 1.8, 0.45]} />
        <primitive object={materials.binnacleCarbon} attach="material" />
      </mesh>

      {/* Outer Gold Cockpit Bezel */}
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[3.12, 1.72, 0.08]} />
        <primitive object={materials.goldAccent} attach="material" />
      </mesh>

      {/* Main Cluster Face (Recessed) */}
      <mesh position={[0, 0, 0.08]}>
        <boxGeometry args={[3.0, 1.6, 0.04]} />
        <primitive object={materials.dialFace} attach="material" />
      </mesh>

      {/* ---------------- TOP F1 SHIFT LIGHT VISOR ---------------- */}
      <group position={[0, 0.65, 0.11]}>
        {/* Visor Bar Backing */}
        <mesh>
          <boxGeometry args={[1.8, 0.12, 0.04]} />
          <primitive object={materials.binnacleCarbon} attach="material" />
        </mesh>

        {/* 9 Shift LEDs */}
        {[-0.64, -0.48, -0.32, -0.16, 0, 0.16, 0.32, 0.48, 0.64].map((x, i) => (
          <mesh
            key={i}
            ref={(el) => {
              ledRefs.current[i] = el;
            }}
            position={[x, 0, 0.02]}
          >
            <cylinderGeometry args={[0.038, 0.038, 0.04, 12]} />
            <primitive object={materials.ledOff} attach="material" />
          </mesh>
        ))}
      </group>

      {/* ---------------- CENTRAL TACHOMETER DIAL ---------------- */}
      <group position={[0, -0.05, 0.1]}>
        {/* Tach Dial Backplate */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.68, 0.68, 0.02, 32]} />
          <primitive object={materials.binnacleCarbon} attach="material" />
        </mesh>

        {/* Inner Ring Bezel */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.66, 0.015, 8, 32]} />
          <primitive object={materials.goldAccent} attach="material" />
        </mesh>

        {/* Radial Ticks */}
        {ticks.map((t, idx) => {
          const r = 0.58;
          const x = Math.sin(t.angle) * r;
          const y = Math.cos(t.angle) * r;
          const length = t.isMajor ? 0.08 : 0.045;
          const width = t.isMajor ? 0.018 : 0.01;

          return (
            <mesh
              key={idx}
              position={[x, y, 0.015]}
              rotation={[0, 0, -t.angle]}
            >
              <boxGeometry args={[width, length, 0.01]} />
              <primitive
                object={t.isRedline ? materials.tickRedline : materials.tickNormal}
                attach="material"
              />
            </mesh>
          );
        })}

        {/* Needle Hub Center Pin */}
        <mesh position={[0, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.04, 24]} />
          <primitive object={materials.goldAccent} attach="material" />
        </mesh>

        {/* Sweeping Needle Group */}
        <group ref={needleRef} position={[0, 0, 0.05]}>
          {/* Main Needle Blade */}
          <mesh position={[0, 0.28, 0]}>
            <boxGeometry args={[0.022, 0.48, 0.012]} />
            <primitive object={materials.needleMat} attach="material" />
          </mesh>
          {/* Counterbalance Tail */}
          <mesh position={[0, -0.08, 0]}>
            <boxGeometry args={[0.035, 0.12, 0.012]} />
            <primitive object={materials.binnacleCarbon} attach="material" />
          </mesh>
        </group>

        {/* Center Digital Speed Hub Plate & Dynamic Velocity Bar */}
        <mesh position={[0, -0.22, 0.03]}>
          <boxGeometry args={[0.42, 0.18, 0.02]} />
          <primitive object={materials.dialFace} attach="material" />
        </mesh>
        <mesh ref={speedBarRef} position={[0, -0.22, 0.04]}>
          <boxGeometry args={[0.38, 0.12, 0.01]} />
          <primitive object={materials.goldAccent} attach="material" />
        </mesh>
      </group>

      {/* ---------------- LEFT TELEMETRY SUB-PANEL ---------------- */}
      {/* Downforce, Gear Indicators & Tire Pressure Topology */}
      <group position={[-1.05, -0.05, 0.1]}>
        <mesh>
          <boxGeometry args={[0.7, 0.85, 0.02]} />
          <primitive object={materials.binnacleCarbon} attach="material" />
        </mesh>
        {/* Car Silhouette Wire/Box */}
        <mesh position={[0, 0.02, 0.02]}>
          <boxGeometry args={[0.26, 0.48, 0.01]} />
          <primitive object={materials.goldAccent} attach="material" />
        </mesh>
        {/* 4 Tire Status Nodes */}
        {[-0.2, 0.2].map((x, xi) =>
          [-0.18, 0.18].map((y, yi) => (
            <mesh key={`${xi}-${yi}`} position={[x, y, 0.02]}>
              <boxGeometry args={[0.07, 0.12, 0.015]} />
              <primitive object={materials.ledGreen} attach="material" />
            </mesh>
          ))
        )}

        {/* Gear Position Segment Notch (1 to 7) */}
        <group position={[0, -0.32, 0.02]}>
          {[-0.24, -0.16, -0.08, 0, 0.08, 0.16, 0.24].map((gx, gi) => (
            <mesh key={gi} position={[gx, 0, 0]}>
              <boxGeometry args={[0.05, 0.03, 0.01]} />
              <primitive
                object={gear === gi + 1 ? materials.gearActive : materials.ledOff}
                attach="material"
              />
            </mesh>
          ))}
        </group>
      </group>

      {/* ---------------- RIGHT TELEMETRY SUB-PANEL ---------------- */}
      {/* G-Force Gimbal Sphere & Boost Telemetry */}
      <group position={[1.05, -0.05, 0.1]}>
        {/* Sub-panel Backing */}
        <mesh>
          <boxGeometry args={[0.7, 0.85, 0.02]} />
          <primitive object={materials.binnacleCarbon} attach="material" />
        </mesh>
        {/* G-Force Radar Crosshairs */}
        <mesh position={[0, 0, 0.015]}>
          <ringGeometry args={[0.22, 0.23, 24]} />
          <primitive object={materials.goldAccent} attach="material" />
        </mesh>
        <mesh position={[0, 0, 0.015]}>
          <ringGeometry args={[0.12, 0.13, 24]} />
          <primitive object={materials.tickNormal} attach="material" />
        </mesh>
      </group>

      {/* Dynamic G-Force Vector Ball */}
      <mesh ref={gBallRef} position={[1.05, -0.05, 0.13]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <primitive object={materials.needleMat} attach="material" />
      </mesh>

      {/* ---------------- FRONT ANTI-REFLECTIVE SAPPHIRE GLASS ---------------- */}
      <mesh position={[0, 0, 0.16]}>
        <boxGeometry args={[3.08, 1.68, 0.01]} />
        <primitive object={materials.glassCover} attach="material" />
      </mesh>
    </group>
  );
}
