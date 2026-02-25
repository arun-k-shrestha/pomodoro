"use client";
import Link from "next/link";
import styles from "../auth-pages.module.css";
import Image from "next/image";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>Sign up</h1>
        </header>

        <form className={styles.form}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="name">
              Name
            </label>
            <input
              className={styles.input}
              id="name"
              type="text"
              placeholder="Your name"
            />
          </div>

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
            <label className={styles.fieldLabel} htmlFor="password">
              Password
            </label>
            <input
              className={styles.input}
              id="password"
              type="password"
              placeholder="Create password"
            />
          </div>

          <div className={styles.actions}>
            <button className={styles.primaryButton} type="submit">
              Create account
            </button>
          </div>
        </form>
        <div className={styles.actions}>
          <button
            className={styles.secondaryButton}
            type="button"
            onClick={() =>
              signIn("google", { callbackUrl: "/" }, { prompt: "select_account" })
            }
          >
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
        <footer className={styles.footer}>
          <div className={styles.footerRow}>
            <span>Already have an account?</span>
            <Link className={styles.link} href="/login">
              Login
            </Link>
          </div>
        </footer>
      </section>
    </main>
  );
}
