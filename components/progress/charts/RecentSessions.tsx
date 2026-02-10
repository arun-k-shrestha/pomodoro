import styles from "../progress.module.css";

type SessionType = "focus" | "break";

export type Session = {
  startTime: string;
  endTime: string;
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
                {s.startTime} – {s.endTime}
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
