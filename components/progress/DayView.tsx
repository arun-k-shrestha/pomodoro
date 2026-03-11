import BarChart from "./charts/BarChart";
import {
  DAY_DATA,
  TIMELINE_DATA,
  SESSION_DATA,
  generateHeatmap,
} from "@/lib/progressData";
import styles from "./progress.module.css";
import HeatmapGrid from "./charts/HeatmapGrid";
import FocusTimeline from "./charts/Timeline";
import RecentSessions from "./charts/RecentSessions";
import router from "next/router";

const HEATMAP_WEEKS = generateHeatmap();

type DayViewProps = {
  data: {
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
};

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);

  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
}

export default function DayView({ data }: DayViewProps) {
  return (
    <>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div>
            <div className={styles.statLabel}>TIME TODAY</div>
            <div className={styles.statValue}>
              {formatDuration(data.totalSeconds)}
            </div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div>
            <div className={styles.statLabel}>SESSIONS</div>
            <div className={styles.statValue}>{data.sessionCount}</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div>
            <div className={styles.statLabel}>STREAK</div>
            <div className={styles.statValue}>12 days</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div>
            <div className={styles.statLabel}>AVG SESSION</div>
            <div className={styles.statValue}>
              {data.averageSessionMinutes}m
            </div>
          </div>
        </div>
      </div>

      <div className={styles.chartsRow}>
        <div className={styles.chartCardWide}>
          <FocusTimeline
            segments={data.timeLine}
            startHour={0}
            endHour={24}
            period="Today"
          />
        </div>
        <div className={styles.chartCardNarrow}>
          <RecentSessions
            sessions={data.recentSessions}
            onViewAll={() => router.push("/")}
          />
        </div>
      </div>
    </>
  );
}
