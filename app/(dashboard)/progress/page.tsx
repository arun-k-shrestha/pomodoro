"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./progress.module.css";
import MenuPage from "@/components/menu/HamburgerMenu";
import DayView from "./DayView";
import WeekView from "./WeekView";
import MonthView from "./MonthView";
import YearView from "./YearView";

type TabKey = "day" | "week" | "month" | "year";

export default function ProgressPage() {
  const [tab, setTab] = useState<TabKey>("day");
  const router = useRouter();
  const handleCloseMenu = () => router.push("/");

  const views: Record<TabKey, React.ReactNode> = {
    day:   <DayView />,
    week:  <WeekView />,
    month: <MonthView />,
    year:  <YearView />,
  };

  return (
    <div className={styles.layout}>
      <MenuPage variant="sidebar" onClose={handleCloseMenu} />
      <main className={styles.main}>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>PROGRESS</h1>
          <p className={styles.pageSubtitle}>Track your time, build your focus, and grow your streak.</p>
        </header>
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