"use client";

import { useState } from "react";
import styles from "./progress.module.css";
import DayView from "./DayView";
import WeekView from "./WeekView";
import MonthView from "./MonthView";
import YearView from "./YearView";

type TabKey = "day" | "week" | "month" | "year";

export default function ProgressPage() {
  const [tab, setTab] = useState<TabKey>("day");

  const views: Record<TabKey, React.ReactNode> = {
    day: <DayView />,
    week: <WeekView />,
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
