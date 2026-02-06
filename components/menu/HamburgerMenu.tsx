"use client";

import { useState } from "react";
import styles from "./HamburgerMenu.module.css";
import Link from "next/link";

type MenuPageProps = {
  onClose: () => void;
  onProgressClick: () => void;
  variant?: "overlay" | "sidebar";
};

export default function MenuPage({
  onClose,
  onProgressClick,
  variant = "overlay",
}: MenuPageProps) {
  const isSidebar = variant === "sidebar";
  const [activeItem, setactiveItem] = useState<string | null>(null);

  const content = (
    <div className={`${styles.page} ${isSidebar ? styles.sidebarPage : ""}`}>
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
            { label: "Settings", icon: "⚙", href: "/settings" },
            { label: "About", icon: "◎", href: undefined },
            { label: "Login", icon: "⇥", href: undefined },
          ].map(({ label, icon, href, action }) => {
            return (
              <li key={label}>
                <button
                  type="button"
                  className={`${styles.navItem} ${
                    activeItem === label ? styles.active : ""
                  }`}
                  onClick={() => {
                    setactiveItem(label);
                    action?.();
                  }}
                >
                  <span className={styles.navIcon}>{icon}</span>
                  <span className={styles.navLabel}>{label}</span>
                  <span className={styles.navArrow}>›</span>
                </button>
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

  return <div className={styles.overlay}>{content}</div>;
}
