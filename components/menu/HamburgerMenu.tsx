import styles from "./HamburgerMenu.module.css";
import Link from "next/link";

type MenuPageProps = {
  onClose: () => void;
  variant? : "overlay" | "sidebar";
};

export default function MenuPage({
  onClose,
  variant = "overlay",
}: MenuPageProps) {
  const isSidebar = variant === "sidebar";

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
            { label: "Progress", icon: "▧", href: "/progress?menu=sidebar" },
            { label: "Settings", icon: "⚙" },
            { label: "About", icon: "◎" },
            { label: "Login", icon: "⇥" },
          ].map(({ label, icon, href }) => (
            <li key={label}>
              {href ? (
                <Link href={href} className={styles.navItem} onClick={onClose}>
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
          ))}
        </ul>
      </nav>
    </div>
  );

  if (isSidebar) {
    return <aside className={styles.sidebarShell}>{content}</aside>;
  }

  return <div className={styles.overlay}>{content}</div>;
}