import type { L } from "@/lib/i18n";

export type LabModelId = "aero-chassis" | "powertrain" | "telemetry-hud";

export type LabModelConfig = {
  id: LabModelId;
  name: L;
  system: L;
  tagline: L;
  stack: string[];
  protocol: string;
  metric: string;
};

export type LabState = {
  modelId: LabModelId;
  // Aero chassis controls
  exploded: number; // 0.0 to 1.0 (bodywork disassembly)
  // Powertrain controls
  rpm: number; // 1000 to 9000 RPM
  driveMode: "sport" | "track" | "corsa";
  // Telemetry controls
  speedKmh: number;
  gear: number;
  // Global controls
  wireframe: boolean;
  autoRotate: boolean;
};
