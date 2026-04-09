import { useEffect, useState } from "react";
import styles from "../progress.module.css";

type BarData = { label: string; hours: number };

export default function BarChart({
  data,
  maxH = 8,
}: {
  data: BarData[];
  maxH?: number;
}) {
  const [isLowerCount, setLowerCount] = useState(false);

  useEffect(() => {
    const check = () => {
      setLowerCount(window.innerWidth < 650);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const W = 460,
    H = 180,
    PAD_L = 36,
    PAD_B = 28,
    PAD_T = 12,
    PAD_R = 12;
  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_B - PAD_T;
  const barW = chartW / data.length;
  const steps = 4;
  // Changed: keep an empty/new-account chart on a valid scale to avoid duplicate keys and NaN SVG values.
  const safeMaxH = Math.max(maxH, 1);
  const stepSize = Math.ceil(safeMaxH / steps);
  const yMax = stepSize * steps; // ← top of the y-axis scale
  const yLines = Array.from({ length: steps + 1 }, (_, i) => i * stepSize);

  const labelInterval = isLowerCount ? Math.ceil(data.length / 8) : 1;

  const formatLabel = (label: string) =>
    isLowerCount ? label.slice(0, 3) : label;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={styles.chart}>
      {yLines.map((v) => {
        const y = PAD_T + chartH - (v / yMax) * chartH;
        return (
          <g key={v}>
            <line
              x1={PAD_L}
              y1={y}
              x2={W - PAD_R}
              y2={y}
              stroke="var(--grid)"
              strokeWidth="1"
            />
            <text
              x={PAD_L - 6}
              y={y + 4}
              textAnchor="end"
              className={styles.axisLabel}
            >
              {v}h
            </text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const bH = (d.hours / yMax) * chartH;
        const x = PAD_L + i * barW + barW * 0.2;
        const y = PAD_T + chartH - bH;
        const w = barW * 0.6;
        const showLabel = i % labelInterval === 0;

        return (
          <g key={d.label}>
            <rect
              x={x}
              y={y}
              width={w}
              height={bH}
              rx="4"
              className={styles.bar}
            />
            {showLabel && (
              <text
                x={x + w / 2}
                y={H - 8}
                textAnchor="middle"
                className={styles.axisLabel}
              >
                {formatLabel(d.label)}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
