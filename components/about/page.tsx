import styles from "./about.module.css";

export default function AboutPage() {
  return (
    <div className={styles.layout}>
      <main className={styles.main}>
        <section className={styles.card}>
          <div className={styles.copy}>
            <p>
              Hi, I am Arun. I have ADHD, and the Pomodoro technique really
              seems to help me.
            </p>

            <p>I try to work for 25 minutes and then take a 5-minute break.</p>

            <p>
              This started as something I made for myself, but it may be useful
              to other people too.
            </p>

            <p>If you have feedback or questions, feel free to reach out.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
