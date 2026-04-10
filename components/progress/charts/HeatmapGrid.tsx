import styles from "@/app/(dashboard)/progress/progress.module.css";

const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function HeatmapGrid({ weeks }: { weeks: number[][] }) {
  const CELL = 13, GAP = 2;
  const W = weeks.length * (CELL + GAP);
  const H = 7 * (CELL + GAP) + 24;

  let dayCount = 0;
  const monthXMap: Record<string, number> = {};
  const startDow = new Date(2026, 0, 1).getDay();
  for (let m = 0; m < 12; m++) {
    const daysInMonth = new Date(2026, m + 1, 0).getDate();
    const weekIndex = Math.floor((startDow + dayCount) / 7);
    monthXMap[MONTH_LABELS[m]] = weekIndex * (CELL + GAP);
    dayCount += daysInMonth;
  }

  const intensityClass = (v: number) =>
    v === -1 ? styles.cellEmpty :
    v === 0 ? styles.cell0 :
    v === 1 ? styles.cell1 :
    v === 2 ? styles.cell2 :
    v === 3 ? styles.cell3 :
    v === 4 ? styles.cell4 : styles.cell5;

  return (
    <div className={styles.heatmapWrap}>
      <svg viewBox={`0 0 ${W} ${H}`} className={styles.heatmapSvg}>
        {MONTH_LABELS.map((m) => (
          <text key={m} x={monthXMap[m]} y={10} className={styles.monthLabel}>{m}</text>
        ))}
        {weeks.map((week, wi) =>
          week.map((val, di) => {
            if (val === -1) return null;
            return (
              <rect
                key={`${wi}-${di}`}
                x={wi * (CELL + GAP)} y={18 + di * (CELL + GAP)}
                width={CELL} height={CELL} rx="3"
                className={intensityClass(val)}
              />
            );
          })
        )}
      </svg>
      <div className={styles.legend}>
        <span className={styles.legendLabel}>No time</span>
        {[styles.cell0, styles.cell1, styles.cell2, styles.cell3, styles.cell4, styles.cell5].map((c, i) => (
          <span key={i} className={`${styles.legendDot} ${c}`} />
        ))}
        <span className={styles.legendLabel}>More time</span>
      </div>
    </div>
  );
}