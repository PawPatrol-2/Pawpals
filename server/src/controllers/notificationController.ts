import { Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth';
import { getNotificationSummary, markNotificationsAsRead } from '../services/notificationService';
import type { NotificationType } from '../models/Notification';

export const getUnreadNotificationSummary = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Obehörig användare' });
      return;
    }

    const summary = await getNotificationSummary(userId);
    res.status(200).json({ summary });
  } catch (error) {
    res.status(500).json({ message: 'Kunde inte hämta notiser', error });
  }
};

export const markUnreadNotificationsAsRead = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Obehörig användare' });
      return;
    }

    const { type, applicationId } = req.body as {
      type?: NotificationType;
      applicationId?: string;
    };
    const validTypes: NotificationType[] = ['application-created', 'application-status-updated'];

    const normalizedType = validTypes.includes(type as NotificationType)
      ? (type as NotificationType)
      : undefined;

    const updatedCount = await markNotificationsAsRead(
      userId,
      normalizedType,
      typeof applicationId === 'string' && applicationId.trim() ? applicationId.trim() : undefined,
    );
    const summary = await getNotificationSummary(userId);

    res.status(200).json({ updatedCount, summary });
  } catch (error) {
    res.status(500).json({ message: 'Kunde inte uppdatera notiser', error });
  }
};
