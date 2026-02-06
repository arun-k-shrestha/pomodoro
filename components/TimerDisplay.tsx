"use client";
import { MODES, BG_COLORS, Mode, R, CX, CY, CIRC } from "@/lib/constants";

type Props = {
  mode: Mode;
  timeLeft: number;
};

export default function TimerDisplay({ mode, timeLeft }: Props) {
  const total = MODES[mode].duration;
  const progress = (total - timeLeft) / total;

  const isReverse = mode === "shortBreak" || mode === "longBreak";
  const visualProgress = isReverse ? progress - 1 : progress;

  const offset = CIRC * (1 - visualProgress);

  const mm = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const ss = (timeLeft % 60).toString().padStart(2, "0");

  return (
    <div className="timer-wrap">
      <svg className="timer-svg" viewBox="0 0 360 360" width="360" height="360">
        <circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke="#C5614A"
          strokeWidth={4}
        />
        <circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke={BG_COLORS[mode]}
          strokeWidth={5}
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${CX} ${CY})`}
        />
      </svg>

      <div className="timer-center">
        <span className="timer-text">
          {mm}:{ss}
        </span>
      </div>
    </div>
  );
}
