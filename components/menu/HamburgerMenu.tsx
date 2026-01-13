"use client";

import styles from "./HamburgerMenu.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

type MenuPageProps = {
  onClose: () => void;
  variant?: "overlay" | "sidebar";
};

export default function MenuPage({ onClose, variant = "overlay",}: MenuPageProps) 

{
  const isSidebar = variant === "sidebar";
  const pathname = usePathname();

  const content = (
    <div className={`${styles.page} ${isSidebar ? styles.sidebarPage : ""}`}>
      <div className={styles.menuHeader}>
        {isSidebar ? (
          // Link replaces router.push + setState — no intermediate flash
          <Link href="/" className={styles.closeBtn} aria-label="Close menu">
            ✕
          </Link>
        ) : (
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close menu"
          >
            ✕
          </button>
        )}
      </div>

      <nav className={styles.nav}>
        <ul>
          {[
            { label: "Progress", icon: "▧", href: "/progress" },
            { label: "Settings", icon: "⚙", href: "/settings" },
            { label: "About", icon: "◎", href: undefined },
            { label: "Login", icon: "⇥", href: undefined },
          ].map(({ label, icon, href }) => {
            // Strip query string to compare just the pathname
            const hrefPathname = href?.split("?")[0];
            const isCurrentPage = !!hrefPathname && pathname === hrefPathname;

            return (
              <li key={label}>
                {href ? (
                  <Link
                    href={href}
                    className={styles.navItem}
                    // // Already here — don't close (which would navigate home)
                    // onClick={isCurrentPage ? undefined : onClose}
                  >
                    <span className={styles.navIcon}>{icon}</span>
                    <span className={styles.navLabel}>{label}</span>
                    <span className={styles.navArrow}>›</span>
                  </Link>
                ) : (
                  <a href="#" className={styles.navItem} onClick={onClose}>
                    <span className={styles.navIcon}>{icon}</span>
                    <span className={styles.navLabel}>{label}</span>
                    <span className={styles.navArrow}>›</span>
                  </a>
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

  return <div className={styles.overlay}>{content}</div>;
}