import styles from "../progress.module.css";

type SessionType = "focus" | "break";

export type Session = {
  startedAt: string;
  endedAt: string | null;
  task: string;
  durationMin: number;
  type: SessionType;
};

type Props = {
  sessions: Session[];
  onViewAll?: () => void;
};

const TYPE_LABEL: Record<SessionType, string> = {
  focus: "Focus",
  break: "Break",
};

const TYPE_BADGE_CLASS: Record<SessionType, string> = {
  focus: "badgeFocus",
  break: "badgeBreak",
};

function formatLocalTime(timestamp: string | null) {
  if (!timestamp) return "--";

  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}
export default function RecentSessions({ sessions, onViewAll }: Props) {
  return (
    <div className={styles.sessionsWrapper}>
      <div className={styles.timelineHeader}>
        <span className={styles.sectionTitle}>Recent Sessions</span>
        {onViewAll && (
          <button className={styles.viewAllBtn} onClick={onViewAll}>
            View all
          </button>
        )}
      </div>

      <table className={styles.sessionsTable}>
        <thead>
          <tr>
            <th className={styles.sessionsTh}>Time</th>
            <th className={styles.sessionsTh}>Task</th>
            <th className={styles.sessionsTh}>Duration</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s, i) => (
            <tr key={i} className={styles.sessionsTr}>
              <td className={styles.sessionsTd}>
                {formatLocalTime(s.startedAt)}
                {" – "}
                {formatLocalTime(s.endedAt)}
              </td>
              <td className={styles.sessionsTd}>{s.task}</td>
              <td className={`${styles.sessionsTd} ${styles.sessionsDuration}`}>
                {s.durationMin}m
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
