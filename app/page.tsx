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
  const [isNarrow, setIsNarrow] = useState(false);
  const [isVeryNarrow, setIsVeryNarrow] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const mm = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0");
  const ss = (timeLeft % 60).toString().padStart(2, "0");

  // Track viewport width
  useEffect(() => {
    const check = () => {
      setIsNarrow(window.innerWidth < 1042);
      setIsVeryNarrow(window.innerWidth < 740);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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

  const handleClose = () => {
    setMenuOpen(false);
    setActivePage("home");
  };

  const handleProgressClick = () => {
    setActivePage("progress");
    setMenuOpen(!isVeryNarrow);
  };

  // Below 1042px: sidebar pushes content. At or above: overlay.
  const showFullscreenMenu = menuOpen && isVeryNarrow;
  const showPushMenu = menuOpen && isNarrow && !isVeryNarrow;
  const showOverlayMenu = menuOpen && !isNarrow;

  return (
    <main className="pomodoro-app" style={{ backgroundColor: BG_COLORS[mode] }}>
      {/* Wide viewport: fixed overlay (original behaviour) */}
      {showFullscreenMenu && (
        <MenuPage
          variant="fullscreen"
          onClose={handleClose}
          onProgressClick={handleProgressClick}
        />
      )}

      {!showFullscreenMenu && (
        <>
          {showOverlayMenu && (
            <MenuPage
              onClose={handleClose}
              onProgressClick={handleProgressClick}
            />
          )}
          <div className={`pomodoro-layout${showPushMenu ? " push" : ""}`}>
            {/* Narrow viewport: in-flow sidebar that pushes content right */}
            {showPushMenu && (
              <MenuPage
                variant="sidebar"
                onClose={handleClose}
                onProgressClick={handleProgressClick}
              />
            )}

            {/* All page content lives here so it shifts as one unit */}
            <div
              className="pomodoro-main-content"
              style={
                showOverlayMenu
                  ? {
                      marginLeft: "300px",
                      transition:
                        "margin-left 0.26s cubic-bezier(0.22, 1, 0.36, 1)",
                    }
                  : {
                      transition:
                        "margin-left 0.26s cubic-bezier(0.22, 1, 0.36, 1)",
                    }
              }
            >
              <PomodoroHeader
                onMenuClick={() => setMenuOpen(true)}
                menuOpen={menuOpen}
              />

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
                <div>
                  <ProgressPage />
                </div>
              )}
            </div>
          </div>
        </>
      )}
      <audio ref={audioRef} src="/sounds/kitchen-timer.wav" preload="auto" />
    </main>
  );
}
