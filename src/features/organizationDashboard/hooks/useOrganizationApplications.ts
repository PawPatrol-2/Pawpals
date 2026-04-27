import { useEffect, useMemo, useState } from "react";
import type { ApplicationItem, ApplicationStatus } from "../types";

type ApiApplication = {
  applicationId?: string;
  _id?: string;
  id?: string;
  applicantName?: string;
  animalName?: string;
  status?: string;
  createdAt?: string;
  housingType?: string;
  housingSize?: number;
  hasAnimalExperience?: boolean;
  hasChildren?: boolean;
  hasAllergies?: boolean;
  allergyDetails?: string;
  motivation?: string;
  gdprConsent?: boolean;
  details?: {
    housingType?: string;
    housingSize?: number;
    hasAnimalExperience?: boolean;
    hasChildren?: boolean;
    hasAllergies?: boolean;
    allergyDetails?: string;
    motivation?: string;
    gdprConsent?: boolean;
  };
};

const toBooleanOrNull = (value: unknown): boolean | null => {
  if (typeof value === "boolean") {
    return value;
  }

  return null;
};

const mapApiStatus = (status: string | undefined): ApplicationStatus => {
  if (status === "Granskas" || status === "reviewing") return "Granskas";
  if (status === "Godkänd" || status === "approved") return "Godkänd";
  if (status === "Nekad" || status === "rejected") return "Nekad";
  if (status === "Behöver mer info") return "Behöver mer info";
  return "Inskickad";
};

const toRelativeDate = (dateText: string | undefined): string => {
  if (!dateText) {
    return "okänt datum";
  }

  const created = new Date(dateText);
  if (Number.isNaN(created.getTime())) {
    return "okänt datum";
  }

  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;
  const diffDays = Math.max(
    0,
    Math.floor((now.getTime() - created.getTime()) / oneDay),
  );

  if (diffDays === 0) return "idag";
  if (diffDays === 1) return "igår";
  return `${diffDays} dgr`;
};

export const useOrganizationApplications = (_username?: string) => {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setApplications([]);
          return;
        }

        const response = await fetch(
          "http://localhost:3000/api/applications/organization",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          setApplications([]);
          return;
        }

        const data = (await response.json()) as {
          applications?: ApiApplication[];
        };

        const apiApplications = Array.isArray(data.applications)
          ? data.applications
          : [];

        const mappedApplications: ApplicationItem[] = apiApplications.map(
          (application, index) => {
            const status = mapApiStatus(application.status);
            const details = application.details;

            return {
              id:
                application.applicationId ||
                application._id ||
                application.id ||
                `application-${index + 1}`,
              applicant: application.applicantName || "Okänd adoptör",
              animal: application.animalName || "Okänt djur",
              date: toRelativeDate(application.createdAt),
              status,
              action:
                status === "Godkänd" || status === "Nekad" ? "Klar" : "Granska",
              details: {
                housingType:
                  details?.housingType || application.housingType || "",
                housingSize:
                  typeof details?.housingSize === "number"
                    ? details.housingSize
                    : typeof application.housingSize === "number"
                      ? application.housingSize
                      : null,
                hasAnimalExperience: toBooleanOrNull(
                  details?.hasAnimalExperience ??
                    application.hasAnimalExperience,
                ),
                hasChildren: toBooleanOrNull(
                  details?.hasChildren ?? application.hasChildren,
                ),
                hasAllergies: toBooleanOrNull(
                  details?.hasAllergies ?? application.hasAllergies,
                ),
                allergyDetails:
                  details?.allergyDetails || application.allergyDetails || "",
                motivation: details?.motivation || application.motivation || "",
                gdprConsent: toBooleanOrNull(
                  details?.gdprConsent ?? application.gdprConsent,
                ),
              },
            };
          },
        );

        setApplications(mappedApplications);
      } catch {
        setApplications([]);
      }
    };

    void loadApplications();
  }, [_username]);

  const updateApplicationStatus = async (
    id: number | string,
    nextStatus: ApplicationStatus,
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const response = await fetch(
        `http://localhost:3000/api/applications/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: nextStatus }),
        },
      );

      if (!response.ok) {
        return;
      }

      setApplications((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                status: nextStatus,
                action:
                  nextStatus === "Godkänd" || nextStatus === "Nekad"
                    ? "Klar"
                    : "Granska",
              }
            : item,
        ),
      );
    } catch {
      // Behåll nuvarande status om uppdateringen misslyckas.
    }
  };

  const overviewStats = useMemo(() => {
    const approved = applications.filter(
      (application) => application.status === "Godkänd",
    ).length;
    const rejected = applications.filter(
      (application) => application.status === "Nekad",
    ).length;

    return {
      approved,
      rejected,
      pending: applications.length - approved - rejected,
    };
  }, [applications]);

  const reviewCount = useMemo(
    () =>
      applications.filter(
        (item) => item.status === "Inskickad" || item.status === "Granskas",
      ).length,
    [applications],
  );

  return {
    applications,
    updateApplicationStatus,
    overviewStats,
    reviewCount,
  };
};
