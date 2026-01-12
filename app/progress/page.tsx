"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./progress.module.css";
import MenuPage from "@/components/menu/HamburgerMenu";

// ── Mock data ────────────────────────────────────────────────────
const DAY_DATA = [
  { day: "Mon", hours: 3.8 },
  { day: "Tue", hours: 4.9 },
  { day: "Wed", hours: 2.4 },
  { day: "Thu", hours: 6.3 },
  { day: "Fri", hours: 4.4 },
  { day: "Sat", hours: 1.5 },
  { day: "Sun", hours: 0 },
];

const OVER_TIME_DATA = [
  { month: "Jan", hours: 4 },
  { month: "Feb", hours: 14 },
  { month: "Mar", hours: 22 },
  { month: "Apr", hours: 55 },
  { month: "May", hours: 75 },
  { month: "Jun", hours: 90 },
  { month: "Jul", hours: 100 },
  { month: "Aug", hours: 108 },
  { month: "Sep", hours: 112 },
  { month: "Oct", hours: 118 },
  { month: "Nov", hours: 124 },
  { month: "Dec", hours: 127 },
];

type TabKey = "day" | "week" | "month" | "year";

// ── Heatmap ──────────────────────────────────────────────────────
function generateHeatmap() {
  const weeks: number[][] = [];
  const now = new Date(2026, 0, 1); // Jan 1 2026
  // pad so first week starts on Sunday
  const firstDay = now.getDay();
  const cells: number[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(-1); // padding
  for (let d = 0; d < 365; d++) {
    const r = Math.random();
    cells.push(r < 0.22 ? 0 : r < 0.4 ? 1 : r < 0.6 ? 2 : r < 0.78 ? 3 : r < 0.9 ? 4 : 5);
  }
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

const HEATMAP_WEEKS = generateHeatmap();
const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ── Bar Chart ────────────────────────────────────────────────────
function BarChart() {
  const W = 460, H = 180, PAD_L = 36, PAD_B = 28, PAD_T = 12, PAD_R = 12;
  const maxH = 8;
  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_B - PAD_T;
  const barW = chartW / DAY_DATA.length;
  const yLines = [0, 2, 4, 6, 8];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={styles.chart}>
      {yLines.map((v) => {
        const y = PAD_T + chartH - (v / maxH) * chartH;
        return (
          <g key={v}>
            <line x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} stroke="var(--grid)" strokeWidth="1" />
            <text x={PAD_L - 6} y={y + 4} textAnchor="end" className={styles.axisLabel}>{v}h</text>
          </g>
        );
      })}
      {DAY_DATA.map((d, i) => {
        const bH = (d.hours / maxH) * chartH;
        const x = PAD_L + i * barW + barW * 0.2;
        const y = PAD_T + chartH - bH;
        const w = barW * 0.6;
        return (
          <g key={d.day}>
            <rect x={x} y={y} width={w} height={bH} rx="4" className={styles.bar} />
            <text x={x + w / 2} y={H - 8} textAnchor="middle" className={styles.axisLabel}>{d.day}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Line Chart ───────────────────────────────────────────────────
function LineChart() {
  const W = 440, H = 180, PAD_L = 44, PAD_B = 28, PAD_T = 12, PAD_R = 12;
  const maxH = 160;
  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_B - PAD_T;
  const yLines = [0, 40, 80, 120, 160];

  const pts = OVER_TIME_DATA.map((d, i) => {
    const x = PAD_L + (i / (OVER_TIME_DATA.length - 1)) * chartW;
    const y = PAD_T + chartH - (d.hours / maxH) * chartH;
    return [x, y] as [number, number];
  });

  const pathD = pts.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(" ");
  const areaD = `${pathD} L ${pts[pts.length-1][0]} ${PAD_T + chartH} L ${pts[0][0]} ${PAD_T + chartH} Z`;

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
      {OVER_TIME_DATA.filter((_, i) => i % 2 === 0).map((d, idx) => {
        const i = idx * 2;
        const x = PAD_L + (i / (OVER_TIME_DATA.length - 1)) * chartW;
        return <text key={d.month} x={x} y={H - 8} textAnchor="middle" className={styles.axisLabel}>{d.month}</text>;
      })}
      <path d={areaD} fill="url(#lineGrad)" />
      <path d={pathD} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="var(--accent)" />
      ))}
    </svg>
  );
}

// ── Heatmap Grid ─────────────────────────────────────────────────
function HeatmapGrid() {
  const CELL = 13, GAP = 2;
  const totalWeeks = HEATMAP_WEEKS.length;
  const W = totalWeeks * (CELL + GAP);
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
        {HEATMAP_WEEKS.map((week, wi) =>
          week.map((val, di) => {
            if (val === -1) return null;
            const x = wi * (CELL + GAP);
            const y = 18 + di * (CELL + GAP);
            return (
              <rect
                key={`${wi}-${di}`}
                x={x} y={y} width={CELL} height={CELL} rx="3"
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

// ── Main Page ─────────────────────────────────────────────────────
export default function ProgressPage() {
  const [tab, setTab] = useState<TabKey>("day");
   const router = useRouter();
   const handleCloseMenu = () => router.push("/");
  // const searchParams = useSearchParams();

  // const sidebarMode = searchParams.get("menu") === "sidebar";
  // // onClose is now a no-op — the Link in HamburgerMenu navigates to "/" directly
  // const handleCloseMenu = () => {};

  return (
    <div className={styles.layout}>
      <MenuPage variant="sidebar" onClose={handleCloseMenu} />

      <main className={`${styles.main} ${styles.mainWithSidebar}`}>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>PROGRESS</h1>
          <p className={styles.pageSubtitle}>Track your time, build your focus, and grow your streak.</p>
        </header>

        <div className={styles.tabs}>
          {(["day","week","month","year"] as TabKey[]).map((t) => (
            <button
              key={t}
              className={`${styles.tab} ${tab === t ? styles.tabActive : ""}`}
              onClick={() => setTab(t)}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>🕐</span>
            <div>
              <div className={styles.statLabel}>TIME TODAY</div>
              <div className={styles.statValue}>4h 25m</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>📅</span>
            <div>
              <div className={styles.statLabel}>DAYS THIS WEEK</div>
              <div className={styles.statValue}>5</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>🔥</span>
            <div>
              <div className={styles.statLabel}>CURRENT STREAK</div>
              <div className={styles.statValue}>12 days</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>📈</span>
            <div>
              <div className={styles.statLabel}>TOTAL HOURS</div>
              <div className={styles.statValue}>127h</div>
            </div>
          </div>
        </div>

        <div className={styles.chartsRow}>
          <div className={styles.chartCard}>
            <h2 className={styles.chartTitle}>TIME BY DAY</h2>
            <BarChart />
          </div>
          <div className={styles.chartCard}>
            <h2 className={styles.chartTitle}>OVER TIME</h2>
            <LineChart />
          </div>
        </div>

        <div className={styles.heatmapCard}>
          <h2 className={styles.chartTitle}>YEAR STREAK</h2>
          <p className={styles.heatmapDesc}>One square per day. Darker means more time.</p>
          <HeatmapGrid />
        </div>
      </main>
    </div>
  );
}