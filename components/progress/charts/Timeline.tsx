import styles from "../progress.module.css";

export type TimelineSegment = {
  startHour: number;
  durationMin: number;
  type: "focus" | "break";
};

type Props = {
  segments: TimelineSegment[];
  startHour?: number;
  endHour?: number;
  period?: string;
};

const SEGMENT_CLASS: Record<string, string> = {
  focus: styles.timelineFocus,
  break: styles.timelineBreak,
};

const SEGMENT_RX: Record<string, number> = {
  focus: 4,
  break: 0,
};

export default function FocusTimeline({
  segments,
  startHour = 0,
  endHour = 24,
}: Props) {
  const W = 680,
    H = 200;
  const PAD_L = 24,
    PAD_R = 24;
  const BAR_Y = 70,
    BAR_H = 60;
  const chartW = W - PAD_L - PAD_R;
  const totalMins = (endHour - startHour) * 60;

  const tickHours = Array.from(
    { length: endHour - startHour + 1 },
    (_, i) => startHour + i,
  ).filter((h) => h % 4 === 0);

  const toX = (hour: number, offsetMin = 0) =>
    PAD_L + (((hour - startHour) * 60 + offsetMin) / totalMins) * chartW;

  const toW = (min: number) => (min / totalMins) * chartW;

  const fmtHour = (h: number) => {
    const h24 = h % 24;
    if (h24 === 0) return "12 AM";
    if (h24 === 12) return "12 PM";
    return h24 < 12 ? `${h24} AM` : `${h24 - 12} PM`;
  };

  return (
    <div className={styles.timelineWrapper}>
      <div className={styles.timelineHeader}>
        <span className={styles.sectionTitle}>Focus Timeline</span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className={styles.chart}>
        {/* Tick dots + labels */}
        {tickHours.map((h) => {
          const x = toX(h);
          return (
            <g key={h}>
              <circle cx={x} cy={62} r={2.5} className={styles.timelineTick} />
              <text
                x={x}
                y={52}
                textAnchor="middle"
                className={styles.axisLabel}
                style={{ fontSize: "16px" }}
              >
                {fmtHour(h)}
              </text>
            </g>
          );
        })}

        {/* Segments */}
        {segments.map((seg, i) => (
          <rect
            key={i}
            x={toX(seg.startHour) + 1}
            y={BAR_Y}
            width={Math.max(toW(seg.durationMin) - 2, 4)}
            height={BAR_H}
            rx={SEGMENT_RX[seg.type]}
            className={SEGMENT_CLASS[seg.type]}
          />
        ))}
      </svg>
    </div>
  );
}
