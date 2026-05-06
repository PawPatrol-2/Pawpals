import { Router } from "express";
import authenticate from "../middleware/auth";
import {
  getUnreadNotificationSummary,
  markUnreadNotificationsAsRead,
} from "../controllers/notificationController";

const router = Router();

router.get("/summary", authenticate, getUnreadNotificationSummary);
router.patch("/read", authenticate, markUnreadNotificationsAsRead);

export default router;
