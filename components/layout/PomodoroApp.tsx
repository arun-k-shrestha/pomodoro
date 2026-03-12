"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { BG_COLORS, MODES } from "@/lib/constants";
import { useTimer } from "@/hooks/useTimer";
import { useTasks } from "@/hooks/useTasks";
import { useViewport } from "@/hooks/useViewport";
import { AppLayout } from "@/components/layout/AppLayout";
import PomodoroHeader from "@/components/PomodoroHeader";
import ModeTabs from "@/components/ModeTabs";
import TimerDisplay from "@/components/TimerDisplay";
import StartButton from "@/components/StartButton";
import TaskInput from "@/components/TaskInput";
import TaskList from "@/components/TaskList";
import ProgressPage from "@/components/progress/page";
import SettingPage from "@/components/settings/page";
import AboutPage from "@/components/about/page";

type ActivePage = "home" | "progress" | "settings" | "about";

export function PomodoroApp() {
  const [activePage, setActivePage] = useState<ActivePage>("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundRepeats, setSoundRepeats] = useState(1);

  const sessionIdRef = useRef<string | null>(null); // DB row id from POST
  const timerStartedAtRef = useRef<string | null>(null); // first start time for this timer
  const runStartRef = useRef<number | null>(null); // timestamp when current segment began
  const totalElapsedRef = useRef<number>(0); // cumulative running seconds
  const saveInFlightRef = useRef(false);
  const onCompleteRef = useRef<(() => Promise<void>) | undefined>(undefined);

  const router = useRouter();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const { isNarrow, isVeryNarrow, isMenuOverLay } = useViewport();

  const { mode, timeLeft, running, audioRef, changeMode, toggleRunning } =
    useTimer(soundRepeats, () => onCompleteRef.current?.());

  const getPomodoroElapsedSeconds = useCallback(() => {
    if (mode !== "pomodoro") return 0;
    return MODES.pomodoro.duration - timeLeft;
  }, [mode, timeLeft]);

  const { tasks, addTask, completeTask, removeTask } = useTasks(
    isAuthenticated,
    getPomodoroElapsedSeconds,
  );
  const activeTaskTitle = tasks[0]?.title ?? null;

  // CHANGE: session name stored with tasks added at any time.
  const currentSessionName = MODES[mode].label;

  const handleClose = () => {
    setMenuOpen(false);
    setActivePage("home");
  };

  const handleProgressClick = () => {
    if (status !== "authenticated") {
      setMenuOpen(false);
      router.push("/login");
      return;
    }

    setActivePage("progress");
    setMenuOpen(!isVeryNarrow);
  };

  const handleSettingsClick = () => {
    setActivePage("settings");
    setMenuOpen(!isVeryNarrow);
  };

  const handleAboutClick = () => {
    setActivePage("about");
    setMenuOpen(!isVeryNarrow);
  };

  const getElapsedSeconds = useCallback(
    () =>
      totalElapsedRef.current +
      (runStartRef.current ? (Date.now() - runStartRef.current) / 1000 : 0),
    [],
  );

  const resetSessionTracking = useCallback(() => {
    sessionIdRef.current = null;
    timerStartedAtRef.current = null;
    runStartRef.current = null;
    totalElapsedRef.current = 0;
    saveInFlightRef.current = false;
  }, []);

  const createSessionIfEligible = useCallback(async () => {
    if (
      !isAuthenticated ||
      sessionIdRef.current ||
      saveInFlightRef.current ||
      !timerStartedAtRef.current ||
      getElapsedSeconds() < 10
    ) {
      return sessionIdRef.current;
    }

    saveInFlightRef.current = true;
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          task: activeTaskTitle,
          startedAt: timerStartedAtRef.current,
        }),
      });

      if (!res.ok) {
        return null;
      }

      const data = await res.json();
      sessionIdRef.current = data.session.id;
      return sessionIdRef.current;
    } finally {
      saveInFlightRef.current = false;
    }
  }, [activeTaskTitle, getElapsedSeconds, isAuthenticated, mode]);

  const handleTimerToggle = async () => {
    if (!running) {
      if (!timerStartedAtRef.current) {
        timerStartedAtRef.current = new Date().toISOString();
      }
      runStartRef.current = Date.now();
    } else {
      if (runStartRef.current) {
        totalElapsedRef.current += (Date.now() - runStartRef.current) / 1000;
        runStartRef.current = null;
      }

      await createSessionIfEligible();
    }
    toggleRunning();
  };

  const finishCurrentSession = useCallback(async () => {
    if (runStartRef.current) {
      totalElapsedRef.current += (Date.now() - runStartRef.current) / 1000;
      runStartRef.current = null;
    }

    const sessionId = await createSessionIfEligible();

    if (sessionId && isAuthenticated) {
      await fetch("/api/sessions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          endedAt: new Date().toISOString(),
          actualDurationSeconds: Math.min(
            Math.round(totalElapsedRef.current),
            MODES[mode].duration,
          ), // temporary fix, need to replace the timer count in the useTimer.tsx
        }),
      });
    }
  }, [createSessionIfEligible, isAuthenticated]);

  const handleTimerComplete = async () => {
    await finishCurrentSession();
    resetSessionTracking();
  };

  onCompleteRef.current = handleTimerComplete;

  const handleModeChange = async (nextMode: typeof mode) => {
    await finishCurrentSession();
    resetSessionTracking();
    changeMode(nextMode);
  };

  useEffect(() => {
    if (!running) return;
    void createSessionIfEligible();
  }, [createSessionIfEligible, running, timeLeft]);

  return (
    <main className="pomodoro-app" style={{ backgroundColor: BG_COLORS[mode] }}>
      <AppLayout
        menuOpen={menuOpen}
        isNarrow={isNarrow}
        isVeryNarrow={isVeryNarrow}
        isMenuOverLay={isMenuOverLay}
        activePage={activePage}
        onClose={handleClose}
        onProgressClick={handleProgressClick}
        onSettingsClick={handleSettingsClick}
        onAboutClick={handleAboutClick}
      >
        <PomodoroHeader
          onMenuClick={() => setMenuOpen(true)}
          menuOpen={menuOpen}
        />

        {activePage === "home" && (
          <>
            <div className="pomodoro-body">
              <ModeTabs mode={mode} onChangeMode={handleModeChange} />
              <TimerDisplay mode={mode} timeLeft={timeLeft} />
              {/* <StartButton running={running} onToggle={toggleRunning} /> */}
              <StartButton running={running} onToggle={handleTimerToggle} />
            </div>
            <div className="pomodoro-footer">
              {tasks.length === 0 && (
                <TaskInput
                  onAdd={(task) =>
                    addTask(task, currentSessionName, getElapsedSeconds())
                  }
                />
              )}
              <TaskList
                tasks={tasks}
                onComplete={completeTask}
                onRemove={removeTask}
              />
            </div>
          </>
        )}

        {activePage === "progress" && <ProgressPage />}
        {activePage === "settings" && (
          <SettingPage
            soundRepeats={soundRepeats}
            onSoundRepeatsChange={setSoundRepeats}
          />
        )}
        {activePage === "about" && <AboutPage />}
      </AppLayout>

      <audio ref={audioRef} src="/sounds/kitchen-timer.wav" preload="auto" />
    </main>
  );
}
