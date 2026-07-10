import { Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth';
import { getNotificationSummary, markNotificationsAsRead } from '../services/notificationService';
import type { NotificationType } from '../models/Notification';
import type { MarkNotificationsAsReadInput } from '../schemas/notificationSchemas';

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
  } catch {
    res.status(500).json({ message: 'Kunde inte hämta notiser' });
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

    // Här använder vi den validerade bodyn från Zod-kompletteringen ovan.
    const { type, applicationId } = req.validatedBody as MarkNotificationsAsReadInput;
    const normalizedType = type as NotificationType | undefined;

    const updatedCount = await markNotificationsAsRead(userId, normalizedType, applicationId);
    const summary = await getNotificationSummary(userId);

    res.status(200).json({ updatedCount, summary });
  } catch {
    res.status(500).json({ message: 'Kunde inte uppdatera notiser' });
  }
};
