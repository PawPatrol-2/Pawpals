import { Router } from "express";
import authenticate, { requireRole } from "../middleware/auth";
import {
  createApplication,
  getMyApplications,
  updateApplicationStatus,
} from "../controllers/applicationController";

const router = Router();

router.post("/", authenticate, createApplication);
router.get("/me", authenticate, getMyApplications);
router.patch(
  "/:applicationId/status",
  authenticate,
  requireRole("organization"),
  updateApplicationStatus
);

//fler endpoints kommer

export default router;
