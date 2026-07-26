import styles from "./settings.module.css";

type SettingPageProps = {
  soundRepeats: number;
  onSoundRepeatsChange: (value: number) => void;
  alarmSound: string;
  onAlarmSoundChange: (Value: string) => void;
};

export default function SettingPage({
  soundRepeats,
  onSoundRepeatsChange,
  alarmSound,
  onAlarmSoundChange,
}: SettingPageProps) {
  return (
    <div className={styles.layout}>
      <main className={styles.main}>
        <section className={styles.card}>
          {/* Allow the user to CHOOSE an alarm sound. */}
          <div className={styles.row}>
            <div>
              <p className={styles.label}>Alarm sound</p>
              <p className={styles.caption}>
                Choose the sound played when the timer finishes.
              </p>
            </div>

            <select
              value={alarmSound}
              onChange={(event) => onAlarmSoundChange(event.target.value)}
              aria-label="Alarm sound"
            >
              <option value="morning-alarm-short.wav">Morning alarm</option>
              <option value="calm-elegant.wav">Calm</option>
              <option value="kitchen-timer.wav">Kitchen timer</option>
              <option value="school-bell.wav">School bell</option>
            </select>
          </div>

          {/* Allow the user to REPEAT alarm sound. */}

          <div className={styles.row}>
            <div>
              <p className={styles.label}>Alarm repeats</p>
              <p className={styles.caption}>
                Choose how many times the timer sound should repeat.
              </p>
            </div>

            <div className={styles.stepper} aria-label="Alarm repeats">
              <button
                type="button"
                className={styles.stepperButton}
                onClick={() =>
                  onSoundRepeatsChange(Math.max(1, soundRepeats - 1))
                }
                aria-label="Decrease alarm repeats"
              >
                -
              </button>
              <span className={styles.value}>{soundRepeats}</span>
              <button
                type="button"
                className={styles.stepperButton}
                onClick={() =>
                  onSoundRepeatsChange(Math.min(10, soundRepeats + 1))
                }
                aria-label="Increase alarm repeats"
              >
                +
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
