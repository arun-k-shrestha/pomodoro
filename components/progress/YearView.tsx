import LineChart from "./charts/LineChart";
import HeatmapGrid from "./charts/HeatmapGrid";
import { OVER_TIME_DATA, YEAR_DATA, generateHeatmap } from "@/lib/progressData";
import styles from "./progress.module.css";
import BarChart from "./charts/BarChart";
import { formatHours } from "@/lib/time";

type YearViewProp = {
  data: {
    yearData: {
      label: string;
      hours: number;
    }[];
    yearActiveDays: number;
  };
};

const HEATMAP_WEEKS = generateHeatmap();

export default function YearView({ data }: YearViewProp) {
  const maxHours = Math.min(
    744,
    Math.max(...data.yearData.map((d) => d.hours)),
  );
  const totalHours = data.yearData.reduce((sum, day) => sum + day.hours, 0);
  const activeDays = data.yearData.filter((day) => day.hours > 0).length;
  return (
    <>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div>
            <div className={styles.statLabel}>TOTAL HOURS</div>
            <div className={styles.statValue}>{formatHours(totalHours)}</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div>
            <div className={styles.statLabel}>ACTIVE DAYS</div>
            <div className={styles.statValue}>{data.yearActiveDays}</div>
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
          <h2 className={styles.chartTitle}>HOURS BY DAY</h2>
          <BarChart
            data={data.yearData.map((d) => ({
              label: d.label,
              hours: d.hours,
            }))}
            maxH={maxHours}
          />
        </div>
      </div>
      {/* <div className={styles.chartsRow}>
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>OVER TIME</h2>
          <LineChart data={OVER_TIME_DATA} />
        </div>
      </div> */}
      {/* <div className={styles.heatmapCard}>
        <h2 className={styles.chartTitle}>YEAR STREAK</h2>
        <p className={styles.heatmapDesc}>
          One square per day. Darker means more time.
        </p>
        <HeatmapGrid weeks={HEATMAP_WEEKS} />
      </div> */}
    </>
  );
}
