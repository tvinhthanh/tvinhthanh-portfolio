"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { AeroChassis } from "./models/aero-chassis";
import { PowertrainEngine } from "./models/powertrain-engine";
import { TelemetryGauge } from "./models/telemetry-gauge";
import { metal } from "./palette";
import type { LabState } from "./types";
import { T, t } from "@/lib/i18n";

type Props = {
  state: LabState;
  isIntersecting: boolean;
  reducedMotion: boolean;
};

function LoadingFallback() {
  return (
    <mesh>
      <octahedronGeometry args={[0.5, 1]} />
      <meshBasicMaterial color={metal.gold} wireframe />
    </mesh>
  );
}

export function LabCanvas({ state, isIntersecting, reducedMotion }: Props) {
  return (
    <Canvas
      camera={{ position: [5, 3, 7], fov: 50 }}
      dpr={[1, 1.5]}
      frameloop={isIntersecting ? (reducedMotion ? "demand" : "always") : "never"}
      fallback={
        <div className="p-8 text-ink-soft">
          <T v={t("3D preview unavailable on this device.", "Thiết bị này không hỗ trợ xem 3D.")} />
        </div>
      }
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      className="h-full w-full !touch-pan-y"
      style={{ touchAction: "pan-y" }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 4]} intensity={1.8} color="#ffffff" />
      <directionalLight position={[-4, -3, -3]} intensity={1.2} color={metal.gold} />
      <pointLight position={[0, 3, 2]} intensity={0.6} color="#fff" />

      <Suspense fallback={<LoadingFallback />}>
        {state.modelId === "aero-chassis" && (
          <AeroChassis
            exploded={state.exploded}
            wireframe={state.wireframe}
            autoRotate={state.autoRotate && !reducedMotion}
          />
        )}

        {state.modelId === "powertrain" && (
          <PowertrainEngine
            rpm={state.rpm}
            driveMode={state.driveMode}
            wireframe={state.wireframe}
            autoRotate={state.autoRotate && !reducedMotion}
          />
        )}

        {state.modelId === "telemetry-hud" && (
          <TelemetryGauge
            rpm={state.rpm}
            speedKmh={state.speedKmh}
            gear={state.gear}
            driveMode={state.driveMode}
            wireframe={state.wireframe}
            autoRotate={state.autoRotate && !reducedMotion}
          />
        )}

        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.5}
          scale={7}
          blur={2}
          far={3.5}
          color={metal.obsidian}
        />
      </Suspense>

      <OrbitControls
        enablePan={false}
        minDistance={4}
        maxDistance={12}
        autoRotate={false}
        touches={{
          ONE: -1 as unknown as THREE.TOUCH,
          TWO: THREE.TOUCH.ROTATE,
        }}
        makeDefault
      />
    </Canvas>
  );
}
