import type { SectionKey } from "../types";

type SidebarNavProps = {
  activeSection: SectionKey;
  navItems: Array<{ key: SectionKey; label: string }>;
  onSectionClick: (key: SectionKey) => void;
  styles: Record<string, string>;
};

export default function SidebarNav({
  activeSection,
  navItems,
  onSectionClick,
  styles,
}: SidebarNavProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarTitle}>Min organisation</div>
      <ul className={styles.navList}>
        {navItems.map((item) => (
          <li key={item.key}>
            <button
              type="button"
              className={`${styles.navItem} ${activeSection === item.key ? styles.navItemActive : ""}`}
              onClick={() => onSectionClick(item.key)}
            >
              <span className={styles.navDot} />
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
