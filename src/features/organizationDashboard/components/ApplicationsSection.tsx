import { applicationStatuses } from "../constants";
import type { ApplicationItem, ApplicationStatus } from "../types";

type ApplicationsSectionProps = {
  applications: ApplicationItem[];
  overviewStats: {
    approved: number;
    rejected: number;
    pending: number;
  };
  statusClassMap: Record<ApplicationStatus, string>;
  onUpdateStatus: (id: number, nextStatus: ApplicationStatus) => void;
  onSetMessage: (message: string) => void;
  styles: Record<string, string>;
};

export default function ApplicationsSection({
  applications,
  overviewStats,
  statusClassMap,
  onUpdateStatus,
  onSetMessage,
  styles,
}: ApplicationsSectionProps) {
  return (
    <div className={styles.contentGrid}>
      <article className={styles.tableCard}>
        <h2 className={styles.sectionTitle}>Sökande / Djur</h2>
        <div className={styles.tableWrap}>
          <table className={styles.applicationTable}>
            <thead>
              <tr>
                <th>Sökande / Djur</th>
                <th>Datum</th>
                <th>Status</th>
                <th>Åtgärd</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr key={application.id}>
                  <td>
                    <div className={styles.applicantName}>
                      {application.applicant}
                    </div>
                    <div className={styles.animalName}>
                      {application.animal}
                    </div>
                  </td>
                  <td>{application.date}</td>
                  <td>
                    <select
                      value={application.status}
                      onChange={(event) =>
                        onUpdateStatus(
                          application.id,
                          event.target.value as ApplicationStatus,
                        )
                      }
                      className={`${styles.statusSelect} ${statusClassMap[application.status]}`}
                    >
                      {applicationStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <div className={styles.actionGroup}>
                      <button
                        type="button"
                        className={styles.actionLink}
                        onClick={() =>
                          onSetMessage(
                            `Öppnade ansökan för ${application.applicant}.`,
                          )
                        }
                      >
                        Visa
                      </button>
                      <button
                        type="button"
                        className={styles.secondaryAction}
                        onClick={() =>
                          onSetMessage(`Kontaktade ${application.applicant}.`)
                        }
                      >
                        Kontakta
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <section className={styles.panel}>
        <h3>Snabböverblick</h3>
        <p className={styles.helperText}>
          Uppdatera status direkt i tabellen. Alla ändringar syns omedelbart.
        </p>
        <div className={styles.badgeRow} style={{ marginTop: "14px" }}>
          <span className={styles.badge}>{overviewStats.pending} pågående</span>
          <span className={styles.badge}>
            {overviewStats.approved} godkända
          </span>
          <span className={styles.badge}>{overviewStats.rejected} nekade</span>
        </div>
      </section>
    </div>
  );
}
