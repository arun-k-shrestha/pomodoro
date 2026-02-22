import Image from "next/image";
import Link from "next/link";
import styles from "../auth-pages.module.css";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  async function googleLogin() {
    "use server";
    await signIn("google", { redirectTo: "/" });
  }
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>Login</h1>
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

          <div className={styles.fieldGroup}>
            <div className={styles.inlineRow}>
              <label className={styles.fieldLabel} htmlFor="password">
                Password
              </label>
              <Link className={styles.link} href="/forgot-password">
                Forgot password
              </Link>
            </div>
            <input
              className={styles.input}
              id="password"
              type="password"
              placeholder="Enter password"
            />
          </div>
        </form>

        <form action={googleLogin}>
          <div className={styles.actions}>
            <button className={styles.primaryButton} type="submit">
              Login
            </button>
            <button className={styles.secondaryButton} type="button">
              <Image
                src="/google-logo.svg"
                alt=""
                width={18}
                height={18}
                className={styles.buttonIcon}
              />
              Continue with Google
            </button>
          </div>
        </form>

        <footer className={styles.footer}>
          <div className={styles.footerRow}>
            <Link className={styles.link} href="/signup">
              Create account
            </Link>
          </div>
        </footer>
      </section>
    </main>
  );
}
