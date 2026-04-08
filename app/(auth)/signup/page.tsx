"use client";
import Link from "next/link";
import styles from "../auth-pages.module.css";
import Image from "next/image";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const password = formData.get("password");

    if (typeof password !== "string" || password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Could not create account.");
      return;
    }

    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>Sign up</h1>
        </header>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="name">
              Name
            </label>
            <input
              className={styles.input}
              id="name"
              name="name"
              type="text"
              placeholder="Your name"
              required
            />
          </div>

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
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="password">
              Password
            </label>
            <input
              className={styles.input}
              id="password"
              name="password"
              type="password"
              placeholder="Create password"
              required
            />
          </div>
          {error && <p>{error}</p>}
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
            onClick={() => signIn("google", { callbackUrl: "/" })}
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
