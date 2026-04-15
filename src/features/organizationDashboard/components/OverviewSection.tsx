import type { ApplicationItem } from "../types";

type OverviewSectionProps = {
  stats: {
    total: number;
    reviewCount: number;
    newToday: number;
  };
  overviewStats: {
    approved: number;
    rejected: number;
    pending: number;
  };
  applications: ApplicationItem[];
  styles: Record<string, string>;
};

export default function OverviewSection({
  stats,
  overviewStats,
  applications,
  styles,
}: OverviewSectionProps) {
  return (
    <>
      <div className={styles.statsGrid}>
        <article className={styles.statCard}>
          <span className={styles.statValue}>{stats.total}</span>
          <span className={styles.statLabel}>Mina djur</span>
        </article>
        <article className={styles.statCard}>
          <span className={styles.statValue}>{overviewStats.pending}</span>
          <span className={styles.statLabel}>Pågående ansökningar</span>
        </article>
        <article className={styles.statCard}>
          <span className={styles.statValue}>{overviewStats.approved}</span>
          <span className={styles.statLabel}>Godkända</span>
        </article>
      </div>

      <div className={styles.overviewGrid}>
        <section className={styles.panel}>
          <h3>Senaste ansökningar</h3>
          <ul className={styles.timelineList}>
            {applications.slice(0, 4).map((application) => (
              <li key={application.id}>
                <strong>{application.applicant}</strong> ansökte om{" "}
                {application.animal}
                <span className={styles.helperText}>{application.date}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className={styles.panel}>
          <h3>Att göra idag</h3>
          <div className={styles.badgeRow}>
            <span className={styles.badge}>Gå igenom nya ansökningar</span>
            <span className={styles.badge}>Följ upp "Behöver mer info"</span>
            <span className={styles.badge}>
              Publicera djur med komplett profil
            </span>
          </div>
        </section>
      </div>
    </>
  );
}
