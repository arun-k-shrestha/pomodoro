import styles from "./HamburgerMenu.module.css";

type MenuPageProps = {
  onClose: () => void;
};

export default function MenuPage({ onClose }: MenuPageProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.page}>

        {/* Header row: close btn left, title right */}
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
              { label: "Timer Settings", icon: "⏱" },
              { label: "Sound",          icon: "♪"  },
              { label: "Theme",          icon: "◐"  },
              { label: "About",          icon: "◎"  },
            ].map(({ label, icon }) => (
              <li key={label}>
                <a href="#" className={styles.navItem}>
                  <span className={styles.navIcon}>{icon}</span>
                  <span className={styles.navLabel}>{label}</span>
                  <span className={styles.navArrow}>›</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

      </div>
    </div>
  );
}