import type { Mode } from "@/lib/constants";

export type PomodoroSessionType = "focus" | "break";
export type PomodoroSessionStatus = "started" | "completed";

export type PomodoroSession = {
  id: string;
  userEmail: string | null;
  task: string | null;
  type: PomodoroSessionType;
  mode: Mode;
  startedAt: string;
  endedAt: string | null;
  plannedDurationSeconds: number;
  actualDurationSeconds: number | null;
  status: PomodoroSessionStatus;
};
