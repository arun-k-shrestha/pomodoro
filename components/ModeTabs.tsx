"use client";
import { MODES, Mode } from "@/lib/constants";

type Props = {
  mode: Mode;
  onChangeMode: (m: Mode) => void;
};

export default function ModeTabs({ mode, onChangeMode }: Props) {
  return (
    <div className="mode-tabs">
      {(Object.keys(MODES) as Mode[]).map((m) => (
        <button
          key={m}
          onClick={() => onChangeMode(m)}
          className={`mode-tab ${mode === m ? "active" : ""}`}
        >
          {m === "pomodoro"
            ? "Pomodoro"
            : m === "shortBreak"
            ? "Short break"
            : "Long break"}
        </button>
      ))}
    </div>
  );
}