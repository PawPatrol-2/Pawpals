import type { SectionKey } from "../types";

type DashboardHeaderProps = {
  activeSection: SectionKey;
  sectionMeta: Record<SectionKey, { title: string; description: string }>;
  onOpenApplications: () => void;
  onOpenAddAnimal: () => void;
  styles: Record<string, string>;
};

export default function DashboardHeader({
  activeSection,
  sectionMeta,
  onOpenApplications,
  onOpenAddAnimal,
  styles,
}: DashboardHeaderProps) {
  return (
    <header className={styles.header}>
      <div>
        <h1>{sectionMeta[activeSection].title}</h1>
        <p>{sectionMeta[activeSection].description}</p>
      </div>
      <div className={styles.headerActions}>
        <button
          type="button"
          className={styles.ghostButton}
          onClick={onOpenApplications}
        >
          Visa ansökningar
        </button>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={onOpenAddAnimal}
        >
          Lägg upp djur
        </button>
      </div>
    </header>
  );
}
