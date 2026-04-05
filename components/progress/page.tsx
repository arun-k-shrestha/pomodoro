"use client";

import { useEffect, useState } from "react";
import styles from "./progress.module.css";
import DayView from "./DayView";
import WeekView from "./WeekView";
import MonthView from "./MonthView";
import YearView from "./YearView";

type TabKey = "day" | "week" | "month" | "year";

type ProgressSession = {
  date: string;
  startTime: string;
  endTime: string;
  task: string;
  durationMin: number;
  type: "focus" | "break";
};

type ProgressData = {
  day: {
    totalSeconds: number;
    sessionCount: number;
    averageSessionMinutes: number;
    streakDays: number;
    timeLine: {
      startHour: number;
      durationMin: number;
      type: "focus" | "break";
    }[];
    recentSessions: {
      date?: string;
      startTime: string;
      endTime: string;
      task: string;
      durationMin: number;
      type: "focus" | "break";
    }[];
    allSessions: ProgressSession[];
  };
  week: {
    weekData: {
      label: string;
      hours: number;
    }[];
    lastWeekTotalHours: number;
  };
  month: {
    monthData: {
      label: string;
      hours: number;
    }[];
    lastMonthTotalHours: number;
  };
  year: {
    yearData: {
      label: string;
      hours: number;
    }[];
    yearActiveDays: number;
    longestYearStreak: number;
  };
};

const SESSIONS_PER_PAGE = 8;

function AllSessionsView({
  sessions,
  onClose,
}: {
  sessions: ProgressSession[];
  onClose: () => void;
}) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(sessions.length / SESSIONS_PER_PAGE));
  const startIndex = (page - 1) * SESSIONS_PER_PAGE;
  const visibleSessions = sessions.slice(
    startIndex,
    startIndex + SESSIONS_PER_PAGE,
  );

  return (
    <section className={styles.allSessionsPage}>
      <div className={styles.allSessionsHeader}>
        <div>
          <h2 className={styles.allSessionsTitle}>All Sessions</h2>
          <p className={styles.allSessionsMeta}>{sessions.length} sessions</p>
        </div>
        {/* View all sessions: close the center panel and return to the dashboard. */}
        <button
          className={styles.closeSessionsBtn}
          onClick={onClose}
          aria-label="Close all sessions"
        >
          x
        </button>
      </div>

      <table className={styles.sessionsTable}>
        <thead>
          <tr>
            <th className={styles.sessionsTh}>Date</th>
            <th className={styles.sessionsTh}>Time</th>
            <th className={styles.sessionsTh}>Task</th>
            <th className={styles.sessionsTh}>Type</th>
            <th className={styles.sessionsTh}>Duration</th>
          </tr>
        </thead>
        <tbody>
          {visibleSessions.length === 0 ? (
            <tr className={styles.sessionsTr}>
              <td className={styles.sessionsTd} colSpan={5}>
                No sessions yet.
              </td>
            </tr>
          ) : (
            visibleSessions.map((session, index) => (
              <tr
                key={`${session.date}-${session.startTime}-${index}`}
                className={styles.sessionsTr}
              >
                <td className={styles.sessionsTd}>{session.date}</td>
                <td className={styles.sessionsTd}>
                  {session.startTime} – {session.endTime}
                </td>
                <td className={styles.sessionsTd}>{session.task}</td>
                <td className={styles.sessionsTd}>
                  {session.type === "focus" ? "Focus" : "Break"}
                </td>
                <td
                  className={`${styles.sessionsTd} ${styles.sessionsDuration}`}
                >
                  {session.durationMin}m
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className={styles.paginationRow}>
        <button
          className={styles.paginationBtn}
          onClick={() => setPage((current) => Math.max(1, current - 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <span className={styles.paginationText}>
          Page {page} of {totalPages}
        </span>
        <button
          className={styles.paginationBtn}
          onClick={() =>
            setPage((current) => Math.min(totalPages, current + 1))
          }
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </section>
  );
}

export default function ProgressPage() {
  const [tab, setTab] = useState<TabKey>("day");
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [showAllSessions, setShowAllSessions] = useState(false);

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
    day: (
      <DayView
        data={progressData.day}
        onViewAllSessions={() => setShowAllSessions(true)}
      />
    ),
    week: <WeekView data={progressData.week} />,
    month: <MonthView data={progressData.month} />,
    year: <YearView data={progressData.year} />,
  };

  return (
    <div className={styles.layout}>
      <main className={styles.main}>
        {showAllSessions ? (
          <AllSessionsView
            sessions={progressData.day.allSessions}
            onClose={() => setShowAllSessions(false)}
          />
        ) : (
          <>
            <div className={styles.tabs}>
              {(["day", "week", "month", "year"] as TabKey[]).map((t) => (
                <button
                  key={t}
                  className={`${styles.tab} ${
                    tab === t ? styles.tabActive : ""
                  }`}
                  onClick={() => setTab(t)}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
            {views[tab]}
          </>
        )}
      </main>
    </div>
  );
}
