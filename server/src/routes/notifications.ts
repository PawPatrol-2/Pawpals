import { Router } from 'express';
import authenticate from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import {
  getUnreadNotificationSummary,
  markUnreadNotificationsAsRead,
} from '../controllers/notificationController';
import { markNotificationsAsReadSchema } from '../schemas/notificationSchemas';

const router = Router();

router.get('/summary', authenticate, getUnreadNotificationSummary);
// Zod-validering här gör att controllern får validerad body istället för rå input.
router.patch(
  '/read',
  authenticate,
  validateRequest({ body: markNotificationsAsReadSchema }),
  markUnreadNotificationsAsRead,
);

export default router;
