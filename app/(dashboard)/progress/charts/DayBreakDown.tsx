import styles from "@/app/(dashboard)/progress/progress.module.css";

type DayData = {
  day: string;
  duration: { hours: number; minutes: number };
  sessions: number;
  isBest?: boolean;
};

type Props = {
  days: DayData[];
};

export default function DayBreakdown({ days }: Props) {
  return (
    <table className={styles.sessionsTable}>
      <tbody>
        {days.map((d, i) => (
          <tr key={i} className={styles.sessionsTr}>
            <td className={styles.sessionsTd}>{d.day}</td>
            <td className={`${styles.sessionsTd} ${styles.sessionsDuration}`}>
              {d.duration.hours}h {String(d.duration.minutes).padStart(2, "0")}m
            </td>
            <td className={`${styles.sessionsTd} ${styles.dayBadgeCell}`}>
              <span className={`${styles.badge} ${styles.badgeBest}`}>
                {d.isBest ? "Best" : `${d.sessions} sessions`}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
