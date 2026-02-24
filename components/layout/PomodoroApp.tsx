"use client";

import { useState } from "react";
import { BG_COLORS } from "@/lib/constants";
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

  const { isNarrow, isVeryNarrow, isMenuOverLay } = useViewport();
  const { tasks, addTask, removeTask } = useTasks();
  const { mode, timeLeft, running, audioRef, changeMode, toggleRunning } =
    useTimer(soundRepeats);

  const handleClose = () => {
    setMenuOpen(false);
    setActivePage("home");
  };

  const handleProgressClick = () => {
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
              <ModeTabs mode={mode} onChangeMode={changeMode} />
              <TimerDisplay mode={mode} timeLeft={timeLeft} />
              <StartButton running={running} onToggle={toggleRunning} />
            </div>
            <div className="pomodoro-footer">
              <TaskInput onAdd={addTask} />
              <TaskList tasks={tasks} onRemove={removeTask} />
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
