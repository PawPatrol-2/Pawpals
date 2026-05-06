const API_BASE = "http://localhost:3000/api";

export type NotificationType =
  | "application-created"
  | "application-status-updated";

export type NotificationSummary = {
  applicationCreated: number;
  applicationStatusUpdated: number;
  total: number;
};

const requestJson = async <T>(
  path: string,
  token: string,
  init?: RequestInit,
): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
};

export const fetchNotificationSummary = async (token: string) => {
  const data = await requestJson<{ summary: NotificationSummary }>(
    "/notifications/summary",
    token,
  );

  return data.summary;
};

export const markNotificationsAsRead = async (
  token: string,
  type?: NotificationType,
) => {
  await requestJson<{ updatedCount: number; summary: NotificationSummary }>(
    "/notifications/read",
    token,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(type ? { type } : {}),
    },
  );
};
