import { Directory } from "@/components/lobby/directory";
import { About, Desk } from "@/components/lobby/desk";
import { LegacyHash } from "@/components/lobby/legacy-hash";
import { Threshold } from "@/components/lobby/threshold";
import { RobotSettingsProvider } from "@/components/robot/robot-settings";
import { RobotStage } from "@/components/robot/robot-stage";
import { RoomFrame } from "@/components/rooms/room";

/**
 * The lobby. Who this is and how to reach him are answered here without
 * entering a single room; the directory is for everyone who wants to look
 * closer. The docent stands at the entrance and does not follow you in.
 */
export default function Lobby() {
  return (
    <RobotSettingsProvider>
      <RobotStage />
      <LegacyHash />
      <RoomFrame lobby>
        <Threshold />
        <Directory />
        <About />
        <Desk />
      </RoomFrame>
    </RobotSettingsProvider>
  );
}
