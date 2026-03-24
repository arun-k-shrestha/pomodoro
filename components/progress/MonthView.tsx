import BarChart from "./charts/BarChart";
import { MONTH_DATA } from "@/lib/progressData";
import styles from "./progress.module.css";
import { formatHours } from "@/lib/time";

type MonthViewProps = {
  data: {
    monthData: {
      label: string;
      hours: number;
    }[];
  };
};

export default function MonthView({ data }: MonthViewProps) {
  const maxHours = Math.min(24, Math.max(...MONTH_DATA.map((d) => d.hours)));

  const totalHours = data.monthData.reduce((sum, day) => sum + day.hours, 0);

  return (
    <>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div>
            <div className={styles.statLabel}>THIS MONTH</div>
            <div className={styles.statValue}>{formatHours(totalHours)}</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div>
            <div className={styles.statLabel}>DAILY AVG</div>
            <div className={styles.statValue}>2h 58m</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div>
            <div className={styles.statLabel}>ACTIVE DAYS</div>
            <div className={styles.statValue}>24 / 30</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div>
            <div className={styles.statLabel}>VS LAST MONTH</div>
            <div className={styles.statValue}>+34%</div>
          </div>
        </div>
      </div>
      <div className={styles.chartsRow}>
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>DAILY HOURS THIS MONTH</h2>
          <BarChart
            data={MONTH_DATA.map((d) => ({ label: d.label, hours: d.hours }))}
            maxH={maxHours}
          />
        </div>
      </div>
    </>
  );
}
