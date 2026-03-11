"use client";

import { useEffect, useState } from "react";
import styles from "./progress.module.css";
import DayView from "./DayView";
import WeekView from "./WeekView";
import MonthView from "./MonthView";
import YearView from "./YearView";

type TabKey = "day" | "week" | "month" | "year";

type ProgressData = {
  day: {
    totalSeconds: number;
    sessionCount: number;
    averageSessionMinutes: number;
    timeLine: {
      startHour: number;
      durationMin: number;
      type: "focus" | "break";
    }[];
    recentSessions: {
      startTime: string;
      endTime: string;
      task: string;
      durationMin: number;
      type: "focus" | "break";
    }[];
  };
  week: {
    weekData: {
      label: string;
      hours: number;
    }[];
  };
};

export default function ProgressPage() {
  const [tab, setTab] = useState<TabKey>("day");
  const [progressData, setProgressData] = useState<ProgressData | null>(null);

  useEffect(() => {
    async function loadProgress() {
      const response = await fetch("/api/progress");

      if (!response.ok) {
        console.error("Failed to load progress data");
        return;
      }

      const data = await response.json();
      setProgressData(data);
    }
    loadProgress();
  }, []);

  if (!progressData) {
    return (
      <div className={styles.layout}>
        <main className={styles.main}>Loading progress...</main>
      </div>
    );
  }
  const views: Record<TabKey, React.ReactNode> = {
    day: <DayView data={progressData.day} />,
    week: <WeekView data={progressData.week} />,
    month: <MonthView />,
    year: <YearView />,
  };

  return (
    <div className={styles.layout}>
      <main className={styles.main}>
        <div className={styles.tabs}>
          {(["day", "week", "month", "year"] as TabKey[]).map((t) => (
            <button
              key={t}
              className={`${styles.tab} ${tab === t ? styles.tabActive : ""}`}
              onClick={() => setTab(t)}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
        {views[tab]}
      </main>
    </div>
  );
}
