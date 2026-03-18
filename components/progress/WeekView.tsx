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
    lastWeekTotalHours: number;
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
  const maxHours = Math.min(24, Math.max(...data.weekData.map((d) => d.hours)));
  const totalHours = data.weekData.reduce((sum, day) => sum + day.hours, 0);
  const activeDays = data.weekData.filter((day) => day.hours > 0).length;
  const activeDayAverage = activeDays === 0 ? 0 : totalHours / activeDays;

  const bestDay = data.weekData.reduce(
    (best, day) => {
      return day.hours > best.hours ? day : best;
    },
    { label: "", hours: 0 },
  );

  const lastWeekTotalHours = data.lastWeekTotalHours;

  const weekChangePercent =
    lastWeekTotalHours === 0
      ? totalHours > 0
        ? 100
        : 0
      : ((totalHours - lastWeekTotalHours) / lastWeekTotalHours) * 100;

  const formattedWeekChange =
    weekChangePercent > 0
      ? `+${Math.round(weekChangePercent)}%`
      : `${Math.round(weekChangePercent)}%`;
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
            <div className={styles.statValue}>
              {bestDay.hours === 0
                ? "--"
                : `${bestDay.label.slice(0, 3)} · ${formatHours(bestDay.hours)}`}
            </div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div>
            <div className={styles.statLabel}>VS LAST WEEK</div>
            <div className={styles.statValue}>{formattedWeekChange}</div>
          </div>
        </div>
      </div>
      <div className={styles.chartsRow}>
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>HOURS BY DAY</h2>
          <BarChart
            data={data.weekData.map((d) => ({
              label: d.label,
              hours: d.hours,
            }))}
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
