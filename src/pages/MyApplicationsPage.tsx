import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useMarkNotificationsAsReadOnMount } from "../hooks/useMarkNotificationsAsReadOnMount";
import styles from "./MyApplicationsPage.module.css";

type ApplicationStatus =
  | "Inskickad"
  | "Granskas"
  | "Godkänd"
  | "Nekad"
  | "Behöver mer info";

type MyApplication = {
  applicationId: string;
  animalId: string | null;
  animalName: string;
  status: ApplicationStatus;
  createdAt: string;
};

const statusClassMap: Record<ApplicationStatus, string> = {
  Inskickad: styles.submitted,
  Granskas: styles.reviewing,
  Godkänd: styles.approved,
  Nekad: styles.rejected,
  "Behöver mer info": styles.moreInfo,
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "Okänt datum";
  }

  return new Intl.DateTimeFormat("sv-SE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

export default function MyApplicationsPage() {
  const navigate = useNavigate();
  const { user, isAuthLoading, logout } = useUser();
  useMarkNotificationsAsReadOnMount("application-status-updated");
  const [applications, setApplications] = useState<MyApplication[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const fetchMyApplications = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      logout();
      navigate("/logga-in", { replace: true });
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await fetch(
        "http://localhost:3000/api/applications/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 401) {
        logout();
        navigate("/logga-in", { replace: true });
        return;
      }

      if (!response.ok) {
        throw new Error("Det gick inte att hämta dina ansökningar.");
      }

      const data = await response.json();
      const safeApplications = Array.isArray(data.applications)
        ? (data.applications as MyApplication[])
        : [];
      setApplications(safeApplications);
    } catch {
      setErrorMessage("Något gick fel när vi hämtade dina ansökningar.");
    } finally {
      setIsLoading(false);
    }
  }, [logout, navigate, user]);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate("/logga-in", { replace: true });
    }
  }, [isAuthLoading, user, navigate]);

  useEffect(() => {
    void fetchMyApplications();
  }, [fetchMyApplications]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const handleFocus = () => {
      void fetchMyApplications();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [fetchMyApplications, user]);

  const content = useMemo(() => {
    if (isLoading) {
      return <p className={styles.stateMessage}>Hämtar dina ansökningar...</p>;
    }

    if (errorMessage) {
      return (
        <p className={`${styles.stateMessage} ${styles.error}`}>
          {errorMessage}
        </p>
      );
    }

    if (applications.length === 0) {
      return (
        <p className={styles.stateMessage}>
          Du har inga ansökningar ännu. När du skickar in en ansökan visas den
          här.
        </p>
      );
    }

    return (
      <ul className={styles.list}>
        {applications.map((application) => (
          <li key={application.applicationId} className={styles.card}>
            <div>
              <h3 className={styles.animalName}>
                {application.animalName || "Okänt djur"}
              </h3>
              <p className={styles.meta}>
                Ansökt: {formatDate(application.createdAt)}
              </p>
              {application.status === "Godkänd" && (
                <p className={`${styles.resultText} ${styles.approvedText}`}>
                  Din ansökan är godkänd.
                </p>
              )}
              {application.status === "Nekad" && (
                <p className={`${styles.resultText} ${styles.rejectedText}`}>
                  Din ansökan har nekats.
                </p>
              )}
              {application.status === "Behöver mer info" && (
                <p className={`${styles.resultText} ${styles.moreInfoText}`}>
                  Din ansökan behöver mer information.
                </p>
              )}
            </div>
            <span
              className={`${styles.badge} ${
                statusClassMap[application.status] ?? styles.submitted
              }`}
            >
              {application.status}
            </span>
          </li>
        ))}
      </ul>
    );
  }, [applications, errorMessage, isLoading]);

  return (
    <main className={styles.page}>
      <section className={styles.profileCard}>
        <h2 className={styles.profileTitle}>Mina uppgifter</h2>
        <div className={styles.profileGrid}>
          <div className={styles.profileItem}>
            <span className={styles.profileLabel}>Namn</span>
            <strong className={styles.profileValue}>
              {user?.username || "Ej angivet"}
            </strong>
          </div>
          <div className={styles.profileItem}>
            <span className={styles.profileLabel}>E-post</span>
            <strong className={styles.profileValue}>
              {user?.email || "Ej angivet"}
            </strong>
          </div>
        </div>
      </section>

      <h1 className={styles.title}>Mina ansökningar</h1>
      <p className={styles.subtitle}>
        Här ser du dina ansökningar, datum och aktuell status.
      </p>
      {content}
    </main>
  );
}
