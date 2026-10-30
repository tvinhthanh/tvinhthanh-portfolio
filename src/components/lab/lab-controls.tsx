"use client";

import type { LabModelId, LabState } from "./types";
import { T, t, type L } from "@/lib/i18n";
import { useT } from "@/lib/use-lang";

const models: { id: LabModelId; name: L; description: L }[] = [
  { id: "aero-chassis", name: t("Structure", "Cấu trúc"), description: t("Separate the components to explore how the model is assembled.", "Tách các chi tiết để quan sát cách mô hình được lắp ghép.") },
  { id: "powertrain", name: t("Motion", "Chuyển động"), description: t("Adjust the animation speed of a mechanical model.", "Điều chỉnh tốc độ chuyển động của mô hình cơ khí.") },
  { id: "telemetry-hud", name: t("Gauge", "Đồng hồ"), description: t("Change the sample values to see how the instrument responds.", "Thay đổi dữ liệu mẫu để quan sát cách đồng hồ phản hồi.") },
];

function RangeControl({ label, value, display, min, max, step, onChange }: { label: L; value: number; display: string; min: number; max: number; step: number; onChange: (value: number) => void }) {
  const translate = useT();
  return (
    <label className="block">
      <span className="flex items-center justify-between gap-4 text-step--1">
        <span className="text-ink"><T v={label} /></span>
        <span className="tnum text-ink-soft">{display}</span>
      </span>
      <input type="range" aria-label={translate(label)} min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} className="mt-3 h-6 w-full cursor-pointer accent-[var(--accent)]" />
    </label>
  );
}

export function LabControls({ state, onChange }: { state: LabState; onChange: (patch: Partial<LabState>) => void }) {
  const selected = models.find((model) => model.id === state.modelId)!;
  return (
    <div className="flex h-full flex-col gap-6 p-5 sm:p-7">
      <div>
        <p className="text-step--1 font-medium text-ink"><T v={t("Explore a model", "Chọn mô hình")} /></p>
        <div className="mt-3 grid grid-cols-3 gap-1 rounded-base border border-line bg-paper p-1">
          {models.map((model) => (
            <button key={model.id} type="button" aria-pressed={state.modelId === model.id} onClick={() => onChange({ modelId: model.id })} className={"min-h-11 rounded-base px-2 text-step--1 font-medium transition-colors " + (state.modelId === model.id ? "bg-accent-wash text-accent" : "text-ink-soft hover:bg-surface-2 hover:text-ink")}>
              <T v={model.name} />
            </button>
          ))}
        </div>
        <p className="mt-4 text-step--1 leading-relaxed text-ink-soft"><T v={selected.description} /></p>
      </div>

      <div className="space-y-5 border-t border-line pt-5">
        {state.modelId === "aero-chassis" && (
          <>
            <RangeControl label={t("Separation", "Độ tách chi tiết")} value={state.exploded} display={Math.round(state.exploded * 100) + "%"} min={0} max={1} step={0.01} onChange={(exploded) => onChange({ exploded })} />
            <div className="flex flex-wrap gap-2">
              {[{ value: 0, label: t("Assembled", "Lắp ghép") }, { value: 0.5, label: t("Halfway", "Tách một phần") }, { value: 1, label: t("Separated", "Tách toàn bộ") }].map((preset) => (
                <button key={preset.value} type="button" onClick={() => onChange({ exploded: preset.value })} className="min-h-10 rounded-base border border-line px-3 text-step--2 text-ink-soft hover:border-accent hover:text-accent"><T v={preset.label} /></button>
              ))}
            </div>
          </>
        )}
        {state.modelId === "powertrain" && (
          <RangeControl label={t("Animation speed", "Tốc độ chuyển động")} value={state.rpm} display={Math.round(state.rpm / 9000 * 100) + "%"} min={0} max={9000} step={100} onChange={(rpm) => onChange({ rpm })} />
        )}
        {state.modelId === "telemetry-hud" && (
          <>
            <RangeControl label={t("Sample RPM", "Vòng tua mẫu")} value={state.rpm} display={state.rpm + " RPM"} min={0} max={9000} step={100} onChange={(rpm) => onChange({ rpm })} />
            <RangeControl label={t("Sample speed", "Tốc độ mẫu")} value={state.speedKmh} display={state.speedKmh + " km/h"} min={0} max={300} step={1} onChange={(speedKmh) => onChange({ speedKmh })} />
          </>
        )}
      </div>

      <div className="mt-auto space-y-4 border-t border-line pt-5">
        <div className="flex flex-wrap gap-x-5 gap-y-3 text-step--1 text-ink-soft">
          <label className="flex min-h-11 cursor-pointer items-center gap-2"><input type="checkbox" checked={state.wireframe} onChange={(event) => onChange({ wireframe: event.target.checked })} className="accent-[var(--accent)]" /><T v={t("Wireframe", "Hiện lưới")} /></label>
          <label className="flex min-h-11 cursor-pointer items-center gap-2"><input type="checkbox" checked={state.autoRotate} onChange={(event) => onChange({ autoRotate: event.target.checked })} className="accent-[var(--accent)]" /><T v={t("Auto rotate", "Tự xoay")} /></label>
        </div>
        <button type="button" onClick={() => onChange({ exploded: 0, rpm: 5200, speedKmh: 165, gear: 4, driveMode: "sport", wireframe: false, autoRotate: false })} className="text-step--1 text-ink-soft underline decoration-line underline-offset-4 hover:text-accent"><T v={t("Reset settings", "Đặt lại thiết lập")} /></button>
        <p className="text-step--2 text-ink-faint">Three.js · React Three Fiber</p>
      </div>
    </div>
  );
}
