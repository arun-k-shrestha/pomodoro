import styles from "@/app/(dashboard)/progress/progress.module.css";

type LineData = { month: string; hours: number };

export default function LineChart({ data }: { data: LineData[] }) {
  const W = 440, H = 180, PAD_L = 44, PAD_B = 28, PAD_T = 12, PAD_R = 12;
  const maxH = 160;
  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_B - PAD_T;
  const yLines = [0, 40, 80, 120, 160];

  const pts = data.map((d, i) => {
    const x = PAD_L + (i / (data.length - 1)) * chartW;
    const y = PAD_T + chartH - (d.hours / maxH) * chartH;
    return [x, y] as [number, number];
  });

  const pathD = pts.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(" ");
  const areaD = `${pathD} L ${pts[pts.length - 1][0]} ${PAD_T + chartH} L ${pts[0][0]} ${PAD_T + chartH} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={styles.chart}>
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.01" />
        </linearGradient>
      </defs>
      {yLines.map((v) => {
        const y = PAD_T + chartH - (v / maxH) * chartH;
        return (
          <g key={v}>
            <line x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} stroke="var(--grid)" strokeWidth="1" />
            <text x={PAD_L - 6} y={y + 4} textAnchor="end" className={styles.axisLabel}>{v}h</text>
          </g>
        );
      })}
      {data.filter((_, i) => i % 2 === 0).map((d, idx) => {
        const i = idx * 2;
        const x = PAD_L + (i / (data.length - 1)) * chartW;
        return <text key={d.month} x={x} y={H - 8} textAnchor="middle" className={styles.axisLabel}>{d.month}</text>;
      })}
      <path d={areaD} fill="url(#lineGrad)" />
      <path d={pathD} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="var(--accent)" />)}
    </svg>
  );
}