"use client";

import { useState, useEffect, useRef } from "react";
import { MODES, BG_COLORS, Mode } from "@/lib/constants";
import PomodoroHeader from "@/components/PomodoroHeader";
import ModeTabs from "@/components/ModeTabs";
import TimerDisplay from "@/components/TimerDisplay";
import StartButton from "@/components/StartButton";
import TaskInput from "@/components/TaskInput";
import TaskList from "@/components/TaskList";
import MenuPage from "@/components/menu/HamburgerMenu";
import ProgressPage from "@/components/progress/page";

type ActivePage = "home" | "progress";

export default function Home() {
  const [activePage, setActivePage] = useState<ActivePage>("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("pomodoro");
  const [timeLeft, setTimeLeft] = useState(MODES.pomodoro.duration);
  const [running, setRunning] = useState(false);
  const [tasks, setTasks] = useState<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const mm = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0");
  const ss = (timeLeft % 60).toString().padStart(2, "0");

  // Update document title
  useEffect(() => {
    const modeLabel =
      mode === "pomodoro"
        ? "Pomodoro"
        : mode === "shortBreak"
          ? "Short Break"
          : "Long Break";
    document.title = `${mm}:${ss} • ${modeLabel}`;
    return () => {
      document.title = "Pomodoro";
    };
  }, [mm, ss, mode]);

  // Timer logic
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play().catch(console.error);
            }
            const nextMode: Mode =
              mode === "pomodoro" ? "shortBreak" : "pomodoro";
            setMode(nextMode);
            setTimeLeft(MODES[nextMode].duration);
            return MODES[nextMode].duration;
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

  const addTask = (task: string) => {
    setTasks((prev) => [...prev, task]);
  };

  const removeTask = (index: number) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <main className="pomodoro-app" style={{ backgroundColor: BG_COLORS[mode] }}>
      <PomodoroHeader
        onMenuClick={() => setMenuOpen(true)}
        menuOpen={menuOpen}
      />

      {menuOpen && (
        <MenuPage
          onClose={() => {
            setMenuOpen(false);
            if (activePage === "progress") {
              setActivePage("home");
            }
          }}
          onProgressClick={() => {
            setActivePage("progress");
            setMenuOpen(true);
          }}
        />
      )}

      {activePage === "home" && (
        <>
          <div className="pomodoro-body">
            <ModeTabs mode={mode} onChangeMode={changeMode} />
            <TimerDisplay mode={mode} timeLeft={timeLeft} />
            <StartButton
              running={running}
              onToggle={() => setRunning((r) => !r)}
            />
          </div>

          <div className="pomodoro-footer">
            <TaskInput onAdd={addTask} />
            <TaskList tasks={tasks} onRemove={removeTask} />
          </div>
        </>
      )}

      {activePage === "progress" && (
        <>
          <div>
            <ProgressPage />
          </div>
        </>
      )}

      <audio ref={audioRef} src="/sounds/kitchen-timer.wav" preload="auto" />
    </main>
  );
}
