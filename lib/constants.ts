export const MODES = {
  pomodoro: { label: "POMODORO", duration: 25 * 60 },
  shortBreak: { label: "SHORT BREAK", duration: 5 * 60 },
  longBreak: { label: "LONG BREAK", duration: 15 * 60 },
} as const;

export type Mode = keyof typeof MODES;

export const BG_COLORS: Record<Mode, string> = {
  pomodoro: "#edeae3",
  shortBreak: "#dfe7e4",
  longBreak: "#dbe9df",
};

export const R = 145;
export const CX = 180;
export const CY = 180;
export const CIRC = 2 * Math.PI * R;