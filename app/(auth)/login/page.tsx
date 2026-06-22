"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "../auth-pages.module.css";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push("/");
    router.refresh();
  }
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>Login</h1>
        </header>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="email">
              Email
            </label>
            <input
              className={styles.input}
              id="email"
              name="email"
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
              name="password"
              type="password"
              placeholder="Enter password"
            />
          </div>
          {error && <p>{error}</p>}
          <div className={styles.actions}>
            <button className={styles.primaryButton} type="submit">
              Login
            </button>
          </div>
        </form>

        <div className={styles.actions}>
          <button
            className={styles.secondaryButton}
            type="button"
            onClick={() =>
              signIn(
                "google",
                { callbackUrl: "/" },
                { prompt: "select_account" },
              )
            }
          >
            <Image
              src="/assets/google-logo.svg"
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
            <Link className={styles.link} href="/signup">
              Create account
            </Link>
          </div>
        </footer>
      </section>
    </main>
  );
}
