"use client";

import { useState } from "react";
import styles from "./HamburgerMenu.module.css";
import Link from "next/link";

type MenuPageProps = {
  onClose: () => void;
  onProgressClick: () => void;
  onSettingsClick: () => void;
  onAboutClick: () => void;
  variant?: "overlay" | "sidebar" | "fullscreen";
};

export default function MenuPage({
  onClose,
  onProgressClick,
  onSettingsClick,
  onAboutClick,
  variant = "overlay",
}: MenuPageProps) {
  const isSidebar = variant === "sidebar";
  const isFullscreen = variant === "fullscreen";
  const [activeItem, setactiveItem] = useState<string | null>(null);

  const content = (
    <div
      className={`${styles.page} ${isSidebar ? styles.sidebarPage : ""} ${
        isFullscreen ? styles.fullscreenPage : ""
      }`}
    >
      <div className={styles.menuHeader}>
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close menu"
        >
          ✕
        </button>
      </div>

      <nav className={styles.nav}>
        <ul>
          {[
            { label: "Progress", icon: "▧", action: onProgressClick },
            { label: "Settings", icon: "⚙", action: onSettingsClick },
            { label: "About", icon: "◎", action: onAboutClick },
            { label: "Login", icon: "⇥", href: "/login" }, // fix path
          ].map(({ label, icon, href, action }) => {
            const className = `${styles.navItem} ${
              activeItem === label ? styles.active : ""
            }`;

            return (
              <li key={label}>
                {href ? (
                  <Link href={href} className={className}>
                    <span className={styles.navIcon}>{icon}</span>
                    <span className={styles.navLabel}>{label}</span>
                    <span className={styles.navArrow}>›</span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    className={className}
                    onClick={() => {
                      setactiveItem(label);
                      action?.();
                    }}
                  >
                    <span className={styles.navIcon}>{icon}</span>
                    <span className={styles.navLabel}>{label}</span>
                    <span className={styles.navArrow}>›</span>
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );

  if (isSidebar) {
    return <aside className={styles.sidebarShell}>{content}</aside>;
  }
  if (isFullscreen)
    return <div className={styles.fullscreenShell}>{content}</div>;
  return <div className={styles.overlay}>{content}</div>;
}
