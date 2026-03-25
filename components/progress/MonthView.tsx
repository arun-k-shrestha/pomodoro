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
    lastMonthTotalHours: number;
  };
};

export default function MonthView({ data }: MonthViewProps) {
  const maxHours = Math.min(
    24,
    Math.max(...data.monthData.map((d) => d.hours)),
  );

  const totalHours = data.monthData.reduce((sum, day) => sum + day.hours, 0);
  const activeDays = data.monthData.filter((day) => day.hours > 0).length;
  const activeDayAverage = activeDays === 0 ? 0 : totalHours / activeDays;
  const totalDaysInMonth = data.monthData.length;

  const lastMonthTotalHours = data.lastMonthTotalHours;

  const monthChangePercent =
    lastMonthTotalHours === 0
      ? totalHours > 0
        ? 100
        : 0
      : ((totalHours - lastMonthTotalHours) / lastMonthTotalHours) * 100;

  const formattedWeekChange =
    monthChangePercent > 0
      ? `+${Math.round(monthChangePercent)}%`
      : `${Math.round(monthChangePercent)}%`;

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
            <div className={styles.statLabel}>ACTIVE DAY AVG</div>
            <div className={styles.statValue}>
              {formatHours(activeDayAverage)}
            </div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div>
            <div className={styles.statLabel}>ACTIVE DAYS</div>
            <div className={styles.statValue}>
              {activeDays} / {totalDaysInMonth}
            </div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div>
            <div className={styles.statLabel}>VS LAST MONTH</div>
            <div className={styles.statValue}>{formattedWeekChange}</div>
          </div>
        </div>
      </div>
      <div className={styles.chartsRow}>
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>DAILY HOURS THIS MONTH</h2>
          <BarChart
            data={data.monthData.map((d) => ({
              label: d.label,
              hours: d.hours,
            }))}
            maxH={maxHours}
          />
        </div>
      </div>
    </>
  );
}
