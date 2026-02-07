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

export default function DayView() {
  return (
    <>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div>
            <div className={styles.statLabel}>TIME TODAY</div>
            <div className={styles.statValue}>4h 25m</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div>
            <div className={styles.statLabel}>SESSIONS</div>
            <div className={styles.statValue}>6</div>
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
            <div className={styles.statValue}>44m</div>
          </div>
        </div>
      </div>

      <div className={styles.chartsRow}>
        <div className={styles.chartCardWide}>
          <FocusTimeline
            segments={TIMELINE_DATA}
            startHour={0}
            endHour={24}
            period="Today"
          />
        </div>
        <div className={styles.chartCardNarrow}>
          <RecentSessions
            sessions={SESSION_DATA}
            onViewAll={() => router.push("/")}
          />
        </div>
      </div>
    </>
  );
}
