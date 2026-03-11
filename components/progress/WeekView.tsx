import BarChart from "./charts/BarChart";
import DayBreakdown from "./charts/DayBreakDown";
import { WEEK_DATA, DAY_BREAKDOWN_DATA } from "@/lib/progressData";
import styles from "./progress.module.css";

type WeekViewProps = {
  data: {
    weekData: {
      label: string;
      hours: number;
    }[];
  };
};

export default function WeekView({ data }: WeekViewProps) {
  const maxHours = Math.min(24, Math.max(...WEEK_DATA.map((d) => d.hours)));
  const totalHours = data.weekData.reduce((sum, day) => sum + day.hours, 0);
  return (
    <>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div>
            <div className={styles.statLabel}>THIS WEEK</div>
            <div className={styles.statValue}>{totalHours.toFixed(1)}h</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div>
            <div className={styles.statLabel}>DAILY AVG</div>
            <div className={styles.statValue}>{totalHours / 7}</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div>
            <div className={styles.statLabel}>BEST DAY</div>
            <div className={styles.statValue}>Thu · 6h</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div>
            <div className={styles.statLabel}>VS LAST WEEK</div>
            <div className={styles.statValue}>+18%</div>
          </div>
        </div>
      </div>
      <div className={styles.chartsRow}>
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>HOURS BY DAY</h2>
          <BarChart
            data={WEEK_DATA.map((d) => ({ label: d.label, hours: d.hours }))}
            maxH={maxHours}
          />
        </div>
        {/* <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Day Breakdown</h2>
          <DayBreakdown days={DAY_BREAKDOWN_DATA} />
        </div> */}
      </div>
    </>
  );
}
