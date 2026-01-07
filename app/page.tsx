"use client";

import { useState, useEffect, useRef } from "react";

const MODES = {
  pomodoro: { label: "POMODORO", duration: 25 * 60 },
  shortBreak: { label: "SHORT BREAK", duration: 5 * 60 },
  longBreak: { label: "LONG BREAK", duration: 15 * 60 },
} as const;

type Mode = keyof typeof MODES;

const BG_COLORS: Record<Mode, string> = {
  pomodoro: "#edeae3",     // keep your current / neutral
  shortBreak: "#dfe7e4",   // mild blue
  longBreak: "#dbe9df",    // mild green
};

const R = 145;
const CX = 180;
const CY = 180;
const CIRC = 2 * Math.PI * R;

export default function Home() {
  const [mode, setMode] = useState<Mode>("pomodoro");
  const [timeLeft, setTimeLeft] = useState(MODES.pomodoro.duration);
  const [running, setRunning] = useState(false);
  const [task, setTask] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const total = MODES[mode].duration;
  const progress = (total - timeLeft) / total;

  const isReverse = mode === "shortBreak" || mode === "longBreak";
  const visualprogress = isReverse ? progress -1: progress;

  const offset = CIRC * (1 - visualprogress);
  const angle = -Math.PI / 2 + 2 * Math.PI * visualprogress;
  const dotX = CX + R * Math.cos(angle);
  const dotY = CY + R * Math.sin(angle);

  const mm = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0");
  const ss = (timeLeft % 60).toString().padStart(2, "0");

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current!);
    }

    return () => clearInterval(intervalRef.current!);
  }, [running]);

  const changeMode = (m: Mode) => {
    clearInterval(intervalRef.current!);
    setRunning(false);
    setMode(m);
    setTimeLeft(MODES[m].duration);
  };

  return (
    <main className="pomodoro-app" style={{ backgroundColor: BG_COLORS[mode] }}>
      <header className="pomodoro-header">
        <button className="icon-btn" aria-label="Menu">
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <rect y="0" width="16" height="1.5" rx="1" fill="#999" />
            <rect y="5.25" width="16" height="1.5" rx="1" fill="#999" />
            <rect y="10.5" width="16" height="1.5" rx="1" fill="#999" />
          </svg>
        </button>

        <span className="brand-name"></span>

        <button className="icon-btn" aria-label="Settings">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="2.5" stroke="#999" strokeWidth="1.4" />
            <path
              d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M12.95 3.05l-1.06 1.06M4.11 11.89l-1.06 1.06"
              stroke="#999"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </header>

      <div className="pomodoro-body">
        <div className="mode-tabs">
          {(Object.keys(MODES) as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => changeMode(m)}
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

        <div className="timer-wrap">
          <svg viewBox="0 0 360 360" width="360" height="360">
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

        <button onClick={() => setRunning((r) => !r)} className="start-btn">
          {running ? "PAUSE" : "START"}
        </button>
      </div>

      <div className="pomodoro-footer">
        <input
          className="task-name"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="CURRENT TASK"
        />

        <button
          className="add-task-btn"
          onClick={() => {
            const name = window.prompt("Task name:");
            if (name) setTask(name);
          }}
          aria-label="Add task"
        >
          +
        </button>
      </div>
    </main>
  );
}