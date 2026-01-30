import LineChart from "./charts/LineChart";
import HeatmapGrid from "./charts/HeatmapGrid";
import { OVER_TIME_DATA, generateHeatmap } from "@/lib/progressData";
import styles from "@/app/(dashboard)/progress/progress.module.css";

const HEATMAP_WEEKS = generateHeatmap();

export default function YearView() {
  return (
    <>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div>
            <div className={styles.statLabel}>TOTAL HOURS</div>
            <div className={styles.statValue}>127h</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div>
            <div className={styles.statLabel}>ACTIVE DAYS</div>
            <div className={styles.statValue}>214</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div>
            <div className={styles.statLabel}>LONGEST STREAK</div>
            <div className={styles.statValue}>21 days</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div>
            <div className={styles.statLabel}>BEST MONTH</div>
            <div className={styles.statValue}>Dec · 127h</div>
          </div>
        </div>
      </div>
      <div className={styles.chartsRow}>
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>OVER TIME</h2>
          <LineChart data={OVER_TIME_DATA} />
        </div>
      </div>
      <div className={styles.heatmapCard}>
        <h2 className={styles.chartTitle}>YEAR STREAK</h2>
        <p className={styles.heatmapDesc}>
          One square per day. Darker means more time.
        </p>
        <HeatmapGrid weeks={HEATMAP_WEEKS} />
      </div>
    </>
  );
}
