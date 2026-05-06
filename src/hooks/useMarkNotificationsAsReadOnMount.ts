import { useEffect } from "react";
import { useUser } from "../context/UserContext";
import { emitNotificationChange } from "../utils/notificationEvents";
import {
  markNotificationsAsRead,
  type NotificationType,
} from "../utils/services/notifications";

export const useMarkNotificationsAsReadOnMount = (type?: NotificationType) => {
  const { user } = useUser();

  useEffect(() => {
    if (!user || !type) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    let isMounted = true;

    const markRead = async () => {
      try {
        await markNotificationsAsRead(token, type);
        if (isMounted) {
          emitNotificationChange();
        }
      } catch {
        // Intentionally ignored: the badge can retry on focus or next mount.
      }
    };

    void markRead();

    return () => {
      isMounted = false;
    };
  }, [type, user]);
};
