import Link from "next/link";
import styles from "../auth-pages.module.css";

export default function ForgotPasswordPage() {
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>Forgot password</h1>
        </header>

        <form className={styles.form}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="email">
              Email
            </label>
            <input
              className={styles.input}
              id="email"
              type="email"
              placeholder="you@example.com"
            />
          </div>

          <div className={styles.actions}>
            <button className={styles.primaryButton} type="submit">
              Send link
            </button>
          </div>
        </form>

        <footer className={styles.footer}>
          <div className={styles.footerRow}>
            <Link className={styles.link} href="/login">
              Back to login
            </Link>
          </div>
        </footer>
      </section>
    </main>
  );
}
