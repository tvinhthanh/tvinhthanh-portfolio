"use client";

import type { LabModelConfig, LabModelId, LabState } from "./types";
import { T, t } from "@/lib/i18n";

export const MODEL_CONFIGS: Record<LabModelId, LabModelConfig> = {
  "aero-chassis": {
    id: "aero-chassis",
    name: t("01. Aero Monocoque", "01. Khung Gầm Khí Động Học"),
    system: t(
      "Carbon-Composite Hypercar Monocoque",
      "Khung Gầm Liền Khối Siêu Xe Carbon-Composite"
    ),
    tagline: t(
      "Kinetic bodywork disassembly exposing the lightweight carbon tub, front aero winglets, active rear wing, and decoupled high-performance wheel assemblies.",
      "Bóc tách cơ khí khí động học: lộ khung gầm carbon tub siêu nhẹ, cánh gió trước sau chủ động và cụm phanh đĩa tản nhiệt hiệu năng cao."
    ),
    stack: [
      "Carbon Composite",
      "Active Aerodynamics",
      "Kinetic Disassembly",
      "On-demand WebGL",
    ],
    protocol: "Aero Kinematics",
    metric: "Downforce: 650kg @ 240km/h",
  },
  powertrain: {
    id: "powertrain",
    name: t("02. Hybrid Powertrain", "02. Khối Động Cơ Hybrid"),
    system: t(
      "Twin-Turbo V12 & High-Throughput Compute Inverter",
      "Động Cơ V12 Twin-Turbo & Inverter Xử Lý Cao Tốc"
    ),
    tagline: t(
      "Simulating mechanical throughput and backend service synchronization: spinning compressor turbines, velocity intake stacks, and dynamic drive-mode mapping.",
      "Mô phỏng thông lượng máy chủ tương đương động cơ V12: tua-bin tăng áp kép quay đồng tốc, van nạp đa họng và bản đồ đánh lửa Sport/Track/Corsa tức thì."
    ),
    stack: [
      "Twin-Turbo Spool",
      "V12 Plenum",
      "Dynamic Mapping",
      "Low-Latency Inverter",
    ],
    protocol: "High-Throughput Drivetrain",
    metric: "Redline: 9,000 RPM · 850 HP",
  },
  "telemetry-hud": {
    id: "telemetry-hud",
    name: t("03. Cockpit Telemetry", "03. Đồng Hồ Telemetry Buồng Lái"),
    system: t(
      "F1-Grade Digital Instrument Cluster & Telemetry HUD",
      "Đồng Hồ Đo Telemetry Buồng Lái Tiêu Chuẩn F1"
    ),
    tagline: t(
      "Live cockpit telemetry with sweeping tachometer needle, 9-stage LED shift lights, G-force accelerometer gimbal, and tire pressure thermal monitoring.",
      "Cụm đồng hồ buồng lái điện tử: kim vòng tua quét thời gian thực, dải LED báo sang số F1 9 cấp, con quay gia tốc kế đo lực G và giám sát áp suất lốp xe."
    ),
    stack: [
      "Real-time Tachometer",
      "F1 Shift Lights",
      "Lateral G-Force",
      "Cockpit HUD",
    ],
    protocol: "Telemetry Bus CAN",
    metric: "Sample Rate: 60Hz · 0 Jitter",
  },
};

type Props = {
  state: LabState;
  onChange: (patch: Partial<LabState>) => void;
};

export function LabControls({ state, onChange }: Props) {
  const currentConfig = MODEL_CONFIGS[state.modelId];

  // Auto-recalculate speed when gear or RPM changes
  const updateRpmAndSpeed = (newRpm: number, newGear = state.gear) => {
    const calcSpeed = Math.min(
      355,
      Math.round((newRpm / 9000) * 48 * newGear)
    );
    onChange({ rpm: newRpm, gear: newGear, speedKmh: calcSpeed });
  };

  return (
    <div className="flex flex-col justify-between gap-5 p-4 sm:gap-6 sm:p-8">
      {/* System Selector Tabs */}
      <div>
        <div className="flex items-center justify-between">
          <p className="mono text-step--2 uppercase tracking-[0.14em] text-ink-faint">
            <T v={t("Select Motorsport System", "Chọn Hệ Thống Hiệu Năng")} />
          </p>
          <span className="mono rounded-chip border border-accent/30 bg-accent/10 px-2 py-0.5 text-step--2 text-accent">
            {currentConfig.protocol}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-1.5 sm:gap-2">
          {(["aero-chassis", "powertrain", "telemetry-hud"] as LabModelId[]).map(
            (id) => {
              const active = state.modelId === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onChange({ modelId: id })}
                  className={`rounded-card border px-2 py-2 text-center sm:px-3 sm:py-2.5 sm:text-left transition-all duration-200 ${
                    active
                      ? "border-accent bg-accent/15 text-accent font-medium shadow-[0_0_15px_rgba(237,212,154,0.12)]"
                      : "border-line bg-surface-2 text-ink-soft hover:border-hairline hover:text-ink"
                  }`}
                >
                  <div className="mono text-step--2 font-medium truncate">
                    <T v={MODEL_CONFIGS[id].name} />
                  </div>
                </button>
              );
            }
          )}
        </div>

        {/* System Name & Tagline */}
        <div className="mt-3">
          <h4 className="text-step-0 font-medium text-ink">
            <T v={currentConfig.system} />
          </h4>
          <p className="mt-1 text-step--1 leading-relaxed text-ink-soft">
            <T v={currentConfig.tagline} />
          </p>
        </div>
      </div>

      {/* Contextual System Controls */}
      <div className="rounded-card border border-line-soft bg-surface-2/70 p-4">
        {/* MODEL 1: AERO CHASSIS */}
        {state.modelId === "aero-chassis" && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="mono text-step--2 uppercase tracking-[0.12em] text-ink-faint">
                  <T
                    v={t(
                      "Kinetic Aerodynamic Disassembly",
                      "Bóc Tách Khí Động Học Cơ Khí"
                    )}
                  />
                </span>
                <span className="mono text-step--2 text-accent tnum font-semibold">
                  {Math.round(state.exploded * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={state.exploded}
                onChange={(e) =>
                  onChange({ exploded: parseFloat(e.target.value) })
                }
                className="mt-3 w-full accent-[#edd49a]"
              />
            </div>

            {/* Quick Stage Presets */}
            <div className="space-y-1.5 border-t border-line-soft pt-3">
              <span className="mono text-step--2 text-ink-faint block">
                <T
                  v={t("Aero Disassembly Stages:", "Các Giai Đoạn Bóc Tách:")}
                />
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  {
                    val: 0.0,
                    label: t("0% Aero Sealed", "0% Kín Gió"),
                  },
                  {
                    val: 0.45,
                    label: t("45% Airflow Inflow", "45% Khoang Máy"),
                  },
                  {
                    val: 1.0,
                    label: t("100% Full Exploded", "100% Bung Tách"),
                  },
                ].map((st) => (
                  <button
                    key={st.val}
                    type="button"
                    onClick={() => onChange({ exploded: st.val })}
                    className={`mono rounded border px-2 py-1.5 text-center text-step--2 transition-colors ${
                      Math.abs(state.exploded - st.val) < 0.05
                        ? "border-accent bg-accent/20 text-accent font-medium"
                        : "border-line bg-paper/50 text-ink-soft hover:border-hairline hover:text-ink"
                    }`}
                  >
                    <T v={st.label} />
                  </button>
                ))}
              </div>
            </div>
            <p className="text-step--2 text-ink-faint italic">
              <T
                v={t(
                  "* Page scrolling smoothly articulates the canopy, active wing, and wheel decouple positions.",
                  "* Thao tác cuộn trang tự động điều khiển nâng buồng lái, cánh gió và tách cụm bánh xe.",
                )}
              />
            </p>
          </div>
        )}

        {/* MODEL 2: POWERTRAIN */}
        {state.modelId === "powertrain" && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="mono text-step--2 uppercase tracking-[0.12em] text-ink-faint">
                  <T v={t("Drive Mode Mapping", "Bản Đồ Chế Độ Lái")} />
                </span>
                <span className="mono text-step--2 uppercase text-accent font-semibold">
                  {state.driveMode} MODE
                </span>
              </div>
              <div className="mt-2.5 grid grid-cols-3 gap-2">
                {[
                  { id: "sport", label: "SPORT" },
                  { id: "track", label: "TRACK" },
                  { id: "corsa", label: "CORSA" },
                ].map((dm) => (
                  <button
                    key={dm.id}
                    type="button"
                    onClick={() =>
                      onChange({
                        driveMode: dm.id as LabState["driveMode"],
                      })
                    }
                    className={`mono rounded-chip border px-3 py-1.5 text-center text-step--2 transition-all duration-150 ${
                      state.driveMode === dm.id
                        ? "border-accent bg-accent text-on-accent font-semibold shadow-sm"
                        : "border-line bg-paper/60 text-ink-soft hover:border-hairline hover:text-ink"
                    }`}
                  >
                    {dm.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Throttle RPM Slider */}
            <div className="border-t border-line-soft pt-3">
              <div className="flex items-center justify-between">
                <span className="mono text-step--2 uppercase tracking-[0.12em] text-ink-faint">
                  <T v={t("Engine Throttle", "Bướm Ga Động Cơ")} />
                </span>
                <span className="mono text-step--2 text-accent tnum font-semibold">
                  {state.rpm.toLocaleString()} RPM
                </span>
              </div>
              <input
                type="range"
                min="1200"
                max="9000"
                step="100"
                value={state.rpm}
                onChange={(e) =>
                  updateRpmAndSpeed(parseInt(e.target.value, 10))
                }
                className="mt-3 w-full accent-[#edd49a]"
              />
            </div>

            {/* Turbo Boost & Service Telemetry */}
            <div className="flex items-center justify-between border-t border-line-soft pt-3 text-step--2">
              <span className="mono text-ink-faint uppercase">
                <T v={t("Turbo Manifold Boost", "Áp Suất Tăng Áp")} />
              </span>
              <span className="mono text-accent font-semibold">
                {((state.rpm / 9000) * 2.4).toFixed(2)} BAR
              </span>
            </div>
          </div>
        )}

        {/* MODEL 3: TELEMETRY GAUGE */}
        {state.modelId === "telemetry-hud" && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="mono text-step--2 uppercase tracking-[0.12em] text-ink-faint">
                  <T v={t("Tachometer Sweep", "Vòng Tua Máy (RPM)")} />
                </span>
                <span className="mono text-step--2 text-accent tnum font-semibold">
                  {state.rpm.toLocaleString()} RPM
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="9000"
                step="100"
                value={state.rpm}
                onChange={(e) =>
                  updateRpmAndSpeed(parseInt(e.target.value, 10))
                }
                className="mt-3 w-full accent-[#edd49a]"
              />
            </div>

            {/* Gear Selector */}
            <div className="border-t border-line-soft pt-3">
              <div className="flex items-center justify-between">
                <span className="mono text-step--2 uppercase tracking-[0.12em] text-ink-faint">
                  <T v={t("Sequential Transmission", "Hộp Số Tuần Tự")} />
                </span>
                <span className="mono text-step--2 text-accent font-semibold">
                  GEAR: {state.gear}
                </span>
              </div>
              <div className="mt-2 flex gap-1.5">
                {[1, 2, 3, 4, 5, 6, 7].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => updateRpmAndSpeed(state.rpm, g)}
                    className={`mono flex-1 rounded py-1 text-center text-step--2 transition-colors ${
                      state.gear === g
                        ? "bg-accent text-on-accent font-bold shadow-sm"
                        : "border border-line bg-paper/50 text-ink-soft hover:border-hairline hover:text-ink"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Speed Calculated */}
            <div className="flex items-center justify-between border-t border-line-soft pt-3 text-step--2">
              <span className="mono text-ink-faint uppercase">
                <T v={t("Velocity HUD Readout", "Tốc Độ Buồng Lái")} />
              </span>
              <span className="mono text-accent text-step-0 font-bold tnum">
                {state.speedKmh} KM/H
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Global Deck & Telemetry */}
      <div className="space-y-3 border-t border-line-soft pt-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={state.wireframe}
                onChange={(e) => onChange({ wireframe: e.target.checked })}
                className="accent-[#edd49a]"
              />
              <span className="mono text-step--2 uppercase tracking-[0.1em] text-ink-soft">
                <T v={t("Wireframe", "Khung Dây")} />
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={state.autoRotate}
                onChange={(e) => onChange({ autoRotate: e.target.checked })}
                className="accent-[#edd49a]"
              />
              <span className="mono text-step--2 uppercase tracking-[0.1em] text-ink-soft">
                <T v={t("Auto Rotate", "Tự Xoay")} />
              </span>
            </label>
          </div>

          <div className="mono text-step--2 text-accent font-medium">
            {currentConfig.metric}
          </div>
        </div>

        {/* Tech Stack Chips */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {currentConfig.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-chip border border-line bg-paper/60 px-2 py-0.5 text-step--2 text-ink-faint"
            >
              {tech}
            </span>
          ))}
          <span className="rounded-chip border border-accent/30 bg-accent/10 px-2 py-0.5 text-step--2 text-accent">
            High-Performance Systems
          </span>
        </div>
      </div>
    </div>
  );
}
