"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type RobotSettings = {
  enabled: boolean;
  available: boolean;
  toggle: () => void;
  setAvailable: (available: boolean) => void;
};

const RobotContext = createContext<RobotSettings | null>(null);

export function RobotSettingsProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(true);
  const [available, setAvailable] = useState(true);

  return (
    <RobotContext.Provider value={{ enabled, available, toggle: () => setEnabled((value) => !value), setAvailable }}>
      {children}
    </RobotContext.Provider>
  );
}

export function useRobotSettings() {
  const settings = useContext(RobotContext);
  if (!settings) throw new Error("Robot settings require RobotSettingsProvider");
  return settings;
}
