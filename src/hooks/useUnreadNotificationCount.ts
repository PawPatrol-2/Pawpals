import { useCallback, useEffect, useMemo, useState } from "react";
import { useUser } from "../context/UserContext";
import { NOTIFICATION_CHANGED_EVENT } from "../utils/notificationEvents";
import {
  fetchNotificationSummary,
  type NotificationSummary,
} from "../utils/services/notifications";

const emptySummary: NotificationSummary = {
  applicationCreated: 0,
  applicationStatusUpdated: 0,
  total: 0,
};

export const useUnreadNotificationCount = () => {
  const { user } = useUser();
  const [summary, setSummary] = useState<NotificationSummary>(emptySummary);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setSummary(emptySummary);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setSummary(emptySummary);
      return;
    }

    try {
      setIsLoading(true);
      const nextSummary = await fetchNotificationSummary(token);
      setSummary(nextSummary);
    } catch {
      setSummary(emptySummary);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const handleRefresh = () => {
      void refresh();
    };

    window.addEventListener("focus", handleRefresh);
    window.addEventListener(NOTIFICATION_CHANGED_EVENT, handleRefresh);

    return () => {
      window.removeEventListener("focus", handleRefresh);
      window.removeEventListener(NOTIFICATION_CHANGED_EVENT, handleRefresh);
    };
  }, [refresh, user]);

  const unreadCount = useMemo(() => {
    if (!user) {
      return 0;
    }

    if (user.role === "organization") {
      return summary.applicationCreated;
    }

    if (user.role === "adopter") {
      return summary.applicationStatusUpdated;
    }

    return 0;
  }, [summary.applicationCreated, summary.applicationStatusUpdated, user]);

  return {
    unreadCount,
    isLoading,
    refresh,
  };
};
