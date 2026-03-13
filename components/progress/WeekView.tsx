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

function formatHours(hours: number) {
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;

  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;

  return `${h}h ${m}m`;
}

export default function WeekView({ data }: WeekViewProps) {
  const maxHours = Math.min(24, Math.max(...WEEK_DATA.map((d) => d.hours)));
  const totalHours = data.weekData.reduce((sum, day) => sum + day.hours, 0);
  const activeDays = data.weekData.filter((day) => day.hours > 0).length;
  const activeDayAverage = activeDays === 0 ? 0 : totalHours / activeDays;
  return (
    <>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div>
            <div className={styles.statLabel}>THIS WEEK</div>
            <div className={styles.statValue}>{formatHours(totalHours)}</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div>
            <div className={styles.statLabel}>ACTIVE DAY AVG</div>
            <div className={styles.statValue}>
              {formatHours(activeDayAverage)}
            </div>
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
