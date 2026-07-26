import styles from "./progress.module.css";
import FocusTimeline from "./charts/Timeline";
import RecentSessions from "./charts/RecentSessions";

type DayViewProps = {
  data: {
    totalSeconds: number;
    sessionCount: number;
    averageSessionMinutes: number;
    streakDays: number;
    timeLine: {
      startedAt: string;
      durationMin: number;
      type: "focus" | "break";
    }[];
    recentSessions: {
      startedAt: string;
      endedAt: string | null;
      task: string;
      durationMin: number;
      type: "focus" | "break";
    }[];
  };
  onViewAllSessions: () => void;
};

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);

  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
}

export default function DayView({ data, onViewAllSessions }: DayViewProps) {
  const localTimeline = data.timeLine.map((segment) => {
    const localStart = new Date(segment.startedAt);

    return {
      startHour: localStart.getHours() + localStart.getMinutes() / 60,
      durationMin: segment.durationMin,
      type: segment.type,
    };
  });
  return (
    <>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div>
            <div className={styles.statLabel}>TIME TODAY</div>
            <div className={styles.statValue}>
              {formatDuration(data.totalSeconds)}
            </div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div>
            <div className={styles.statLabel}>SESSIONS</div>
            <div className={styles.statValue}>{data.sessionCount}</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div>
            <div className={styles.statLabel}>CURRENT STREAK</div>
            <div className={styles.statValue}>{data.streakDays} days</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div>
            <div className={styles.statLabel}>AVG SESSION</div>
            <div className={styles.statValue}>
              {data.averageSessionMinutes}m
            </div>
          </div>
        </div>
      </div>

      <div className={styles.chartsRow}>
        <div className={styles.chartCardWide}>
          <FocusTimeline
            segments={localTimeline}
            startHour={0}
            endHour={24}
            period="Today"
          />
        </div>
        <div className={styles.chartCardNarrow}>
          <RecentSessions
            sessions={data.recentSessions}
            onViewAll={onViewAllSessions}
          />
        </div>
      </div>
    </>
  );
}
