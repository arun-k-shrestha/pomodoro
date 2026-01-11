import styles from "./HamburgerMenu.module.css";
import Link from "next/link";

type MenuPageProps = {
  onClose: () => void;
};

export default function MenuPage({ onClose }: MenuPageProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.page}>

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
              { label: "Progress", icon: "▧", href: "/progress" },  // ← added href
              { label: "Settings", icon: "⚙" },
              { label: "About",    icon: "◎" },
              { label: "Login",    icon: "⇥" },
            ].map(({ label, icon, href }) => (
              <li key={label}>
                {href ? (
                  <Link href={href} className={styles.navItem} onClick={onClose}>
                    <span className={styles.navIcon}>{icon}</span>
                    <span className={styles.navLabel}>{label}</span>
                    <span className={styles.navArrow}>›</span>
                  </Link>
                ) : (
                  <a href="#" className={styles.navItem}>
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
    </div>
  );
}