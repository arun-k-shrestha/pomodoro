import styles from "./settings.module.css";

type SettingPageProps = {
  soundRepeats: number;
  onSoundRepeatsChange: (value: number) => void;
};

export default function SettingPage({
  soundRepeats,
  onSoundRepeatsChange,
}: SettingPageProps) {
  return (
    <div className={styles.layout}>
      <main className={styles.main}>
        <section className={styles.card}>
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
