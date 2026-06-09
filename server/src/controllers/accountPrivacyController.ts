import { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth";
import User from "../models/User";
import Notification from "../models/Notification";
import { anonymizeApplicationsForUser } from "../services/applicationPrivacyService";

export const deleteCurrentUserAccount = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Obehörig användare" });
      return;
    }

    const user = await User.findById(userId).select("_id").lean();
    if (!user) {
      res.status(404).json({ message: "Användaren hittades inte" });
      return;
    }

    await anonymizeApplicationsForUser(userId);
    await Notification.deleteMany({ recipientUserId: userId });
    await User.deleteOne({ _id: userId });

    res.status(200).json({
      message: "Ditt konto och dina personuppgifter har tagits bort.",
    });
  } catch {
    res.status(500).json({
      message: "Kontot kunde inte tas bort. Försök igen senare.",
    });
  }
};
