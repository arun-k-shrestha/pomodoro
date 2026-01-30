import styles from "@/app/(dashboard)/progress/progress.module.css";

type SegmentType = "focus" | "break" | "idle";

export type TimelineSegment = {
  startHour: number;
  durationMin: number;
  type: SegmentType;
};

type Props = {
  segments: TimelineSegment[];
  startHour?: number;
  endHour?: number;
  period?: string;
};

const FOCUS_DUR = 25;
const BREAK_DUR = 5;

const TYPE_CLASS: Record<SegmentType, string> = {
  focus: styles.timelineFocus,
  break: styles.timelineBreak,
  idle: styles.timelineIdle,
};

export default function FocusTimeline({
  segments,
  startHour = 8,
  endHour = 18,
  period = "Today",
}: Props) {
  const W = 560,
    H = 160,
    PAD_L = 0,
    PAD_R = 0,
    PAD_T = 38,
    PAD_B = 44;
  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_T - PAD_B;
  const totalMins = (endHour - startHour) * 60;
  const tickHours = Array.from(
    { length: endHour - startHour + 1 },
    (_, i) => startHour + i,
  ).filter((h) => h % 2 === 0);

  const toX = (hour: number, offsetMin = 0) =>
    PAD_L + (((hour - startHour) * 60 + offsetMin) / totalMins) * chartW;

  const BAR_RX = 10;
  const BAR_H = chartH;

  return (
    <div className={styles.timelineWrapper}>
      <div className={styles.timelineHeader}>
        <span className={styles.sectionTitle}>Focus Timeline</span>
        <button className={styles.periodBtn}>{period} ▾</button>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className={styles.chart}>
        {tickHours.map((h) => {
          const x = toX(h);
          const label =
            h === 12 ? "12 PM" : h > 12 ? `${h - 12} PM` : `${h} AM`;
          return (
            <g key={h}>
              <circle
                cx={x}
                cy={PAD_T - 6}
                r={2.5}
                className={styles.timelineTick}
              />
              <circle
                cx={x}
                cy={PAD_T + BAR_H + 6}
                r={2.5}
                className={styles.timelineTick}
              />
              <text
                x={x}
                y={PAD_T - 14}
                textAnchor="middle"
                className={styles.axisLabel}
              >
                {label}
              </text>
            </g>
          );
        })}

        {segments.map((seg, i) => {
          const x = toX(seg.startHour, 0);
          const w = (seg.durationMin / totalMins) * chartW;
          return (
            <rect
              key={i}
              x={x + 2}
              y={PAD_T}
              width={Math.max(w - 4, 4)}
              height={BAR_H}
              rx={BAR_RX}
              className={TYPE_CLASS[seg.type]}
            />
          );
        })}
      </svg>

      <div className={styles.timelineLegend}>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.legendDotFocus}`} />
          Focus <span className={styles.legendMeta}>{FOCUS_DUR}m</span>
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.legendDotBreak}`} />
          Break <span className={styles.legendMeta}>{BREAK_DUR}m</span>
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.legendDotIdle}`} />
          Idle
        </span>
      </div>
    </div>
  );
}
