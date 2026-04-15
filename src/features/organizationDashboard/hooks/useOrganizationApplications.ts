import { useMemo, useState } from "react";
import { initialApplications } from "../constants";
import type { ApplicationItem, ApplicationStatus } from "../types";

export const useOrganizationApplications = () => {
  const [applications, setApplications] =
    useState<ApplicationItem[]>(initialApplications);

  const updateApplicationStatus = (
    id: number,
    nextStatus: ApplicationStatus,
  ) => {
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
