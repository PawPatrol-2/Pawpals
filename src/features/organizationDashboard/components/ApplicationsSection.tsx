import { Fragment, useState, useMemo, type ChangeEvent } from 'react';
import { applicationStatuses } from '../constants';
import type { ApplicationItem, ApplicationStatus } from '../types';

type ApplicationsSectionProps = {
  applications: ApplicationItem[];
  overviewStats: {
    approved: number;
    rejected: number;
    pending: number;
  };
  statusClassMap: Record<ApplicationStatus, string>;
  onUpdateStatus: (id: number | string, nextStatus: ApplicationStatus) => void;
  onDeleteApplication: (id: number | string) => Promise<boolean>;
  onMarkNotificationRead: (applicationId: string) => void;
  styles: Record<string, string>;
};

export default function ApplicationsSection({
  applications,
  overviewStats,
  statusClassMap,
  onUpdateStatus,
  onDeleteApplication,
  onMarkNotificationRead,
  styles,
}: ApplicationsSectionProps) {
  const [expandedApplicationId, setExpandedApplicationId] = useState<number | string | null>(null);

  const formatBooleanAnswer = (value: boolean | null) => {
    if (value === null) {
      return 'Ej angivet';
    }

    return value ? 'Ja' : 'Nej';
  };
  const formatHousingType = (housingType: string) => {
    if (!housingType) {
      return 'Ej angivet';
    }

    return housingType.charAt(0).toUpperCase() + housingType.slice(1);
  };

  const handleToggleApplication = (application: ApplicationItem) => {
    const nextExpanded = expandedApplicationId === application.id ? null : application.id;

    setExpandedApplicationId(nextExpanded);

    if (nextExpanded === application.id && application.notification?.isUnread) {
      onMarkNotificationRead(String(application.id));
    }
  };

  const handleChangeStatus = (id: number | string, event: ChangeEvent<HTMLSelectElement>) => {
    const nextStatus = event.target.value as ApplicationStatus;
    if (nextStatus === 'Godkänd') {
      const confirmed = window.confirm(
        'Är du säker på att du vill godkänna denna adoption? Detta kommer markera djuret som adopterad.',
      );
      if (!confirmed) return;
    }

    onUpdateStatus(id, nextStatus);
  };

  const handleContactApplicant = (application: ApplicationItem) => {
    if (!application.applicantEmail) {
      window.alert('Saknar e-postadress för den här ansökningen.');
      return;
    }

    const subject = encodeURIComponent(`Angående din ansökan om ${application.animal}`);
    const body = encodeURIComponent(
      `Hej ${application.applicant},\n\nJag kontaktar dig angående din ansökan om ${application.animal}.\n\nVänliga hälsningar`,
    );

    window.location.href = `mailto:${application.applicantEmail}?subject=${subject}&body=${body}`;
  };

  const handleDeleteApplication = async (id: number | string) => {
    const confirmed = window.confirm('Godkänner du att ta bort denna ansökan?');
    if (!confirmed) {
      return;
    }

    await onDeleteApplication(id);
  };

  // Sortera: olästa först, sedan senaste först
  const sortedApplications = useMemo(() => {
    return [...applications].sort((a, b) => {
      const aUnread = a.notification?.isUnread ? 0 : 1;
      const bUnread = b.notification?.isUnread ? 0 : 1;
      if (aUnread !== bUnread) {
        return aUnread - bUnread;
      }
      const aDate = new Date(a.date).getTime();
      const bDate = new Date(b.date).getTime();
      return bDate - aDate;
    });
  }, [applications]);

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
              {sortedApplications.length === 0 && (
                <tr>
                  <td colSpan={4} className={styles.helperText}>
                    Inga ansökningar ännu.
                  </td>
                </tr>
              )}
              {sortedApplications.map((application) => (
                <Fragment key={application.id}>
                  <tr className={application.notification?.isUnread ? styles.unreadRow : undefined}>
                    <td>
                      <div className={styles.applicationIdentity}>
                        <div>
                          <div className={styles.applicantName}>{application.applicant}</div>
                          <div className={styles.animalName}>{application.animal}</div>
                        </div>
                        {application.notification?.isUnread && (
                          <div
                            className={styles.unreadMarker}
                            role="button"
                            onClick={() => onMarkNotificationRead(String(application.id))}
                            title="Markera som läst"
                          >
                            <span className={styles.unreadDot} aria-label="Ny uppdatering" />
                            <span className={styles.unreadBadge}>Nytt</span>
                          </div>
                        )}
                      </div>
                      {application.notification?.isUnread && (
                        <div className={styles.rowUpdateNotification}>
                          <p className={styles.rowUpdateText}>
                            ✓ {application.notification.message || 'Din ansökan har uppdaterats'}
                          </p>
                        </div>
                      )}
                    </td>
                    <td>{application.date}</td>
                    <td>
                      <select
                        value={application.status}
                        onChange={(event) => handleChangeStatus(application.id, event)}
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
                          onClick={() => handleToggleApplication(application)}
                        >
                          {expandedApplicationId === application.id ? 'Dölj' : 'Visa'}
                        </button>
                        <button
                          type="button"
                          className={styles.secondaryAction}
                          onClick={() => handleContactApplicant(application)}
                        >
                          Kontakta
                        </button>
                        <button
                          type="button"
                          className={styles.secondaryAction}
                          onClick={() => handleDeleteApplication(application.id)}
                          aria-label="Ta bort ansökan"
                          title="Ta bort ansökan"
                        >
                          X
                        </button>
                      </div>
                    </td>
                  </tr>

                  {expandedApplicationId === application.id && (
                    <tr className={styles.expandedRow}>
                      <td colSpan={4}>
                        <div className={styles.applicationDetailsCard}>
                          <div className={styles.applicationDetailsGrid}>
                            <p>
                              <strong>Boendetyp:</strong>{' '}
                              {formatHousingType(application.details.housingType)}
                            </p>
                            <p>
                              <strong>Storlek på bostad:</strong>{' '}
                              {application.details.housingSize === null
                                ? 'Ej angivet'
                                : `${application.details.housingSize} kvm`}
                            </p>
                            <p>
                              <strong>Djurvana:</strong>{' '}
                              {formatBooleanAnswer(application.details.hasAnimalExperience)}
                            </p>
                            <p>
                              <strong>Barn i hemmet:</strong>{' '}
                              {formatBooleanAnswer(application.details.hasChildren)}
                            </p>
                            <p>
                              <strong>Allergier i hemmet:</strong>{' '}
                              {formatBooleanAnswer(application.details.hasAllergies)}
                            </p>
                          </div>

                          {application.details.hasAllergies && (
                            <div className={styles.applicationMessageBlock}>
                              <strong>Allergidetaljer</strong>
                              <p>
                                {application.details.allergyDetails || 'Inga detaljer angivna.'}
                              </p>
                            </div>
                          )}

                          <div className={styles.applicationMessageBlock}>
                            <strong>Meddelande till organisationen</strong>
                            <p>{application.details.motivation || 'Inget meddelande angivet.'}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
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
        <div className={styles.badgeRow} style={{ marginTop: '14px' }}>
          <span className={styles.badge}>{overviewStats.pending} pågående</span>
          <span className={styles.badge}>{overviewStats.approved} godkända</span>
          <span className={styles.badge}>{overviewStats.rejected} nekade</span>
        </div>
      </section>
    </div>
  );
}
