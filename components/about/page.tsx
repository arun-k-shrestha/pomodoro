import styles from "./about.module.css";

export default function AboutPage() {
  return (
    <div className={styles.layout}>
      <main className={styles.main}>
        <section className={styles.card}>
          <div className={styles.copy}>
            <p>
              Hi, I am Arun. I have ADHD, and the Pomodoro technique really
              seems to help me. I try to work for 25 minutes and then take a
              5-minute break. I break big tasks into smaller ones that fit into
              these 25-minute sessions. Each 25 minutes feels like a capsule of
              focused work.
            </p>
            <p>
              Whenever I think of something, I set a timer and just start
              working on it for 25 minutes. It helps me get started without
              overthinking. Over time, I can see my progress—what I worked on,
              when I was most productive, and how consistent I’ve been. This
              structure makes it easier to manage ADHD, since short bursts of
              focus feel more doable than long, unstructured work sessions.
            </p>
            <p>
              This started as something I made for myself, but it may be useful
              to other people too. If you have feedback or questions, feel free
              to reach out.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
