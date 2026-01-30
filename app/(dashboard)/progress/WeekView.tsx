import BarChart from "./charts/BarChart";
import { WEEK_DATA } from "@/lib/progressData";
import styles from "@/app/(dashboard)/progress/progress.module.css";

export default function WeekView() {
  return (
    <>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>📅</span>
          <div>
            <div className={styles.statLabel}>THIS WEEK</div>
            <div className={styles.statValue}>27h</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>📊</span>
          <div>
            <div className={styles.statLabel}>DAILY AVG</div>
            <div className={styles.statValue}>3h 51m</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>🔥</span>
          <div>
            <div className={styles.statLabel}>BEST DAY</div>
            <div className={styles.statValue}>Thu · 6h</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>📈</span>
          <div>
            <div className={styles.statLabel}>VS LAST WEEK</div>
            <div className={styles.statValue}>+18%</div>
          </div>
        </div>
      </div>
      <div className={styles.chartsRow}>
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>HOURS BY WEEK</h2>
          <BarChart
            data={WEEK_DATA.map((d) => ({ label: d.label, hours: d.hours }))}
            maxH={40}
          />
        </div>
      </div>
    </>
  );
}
