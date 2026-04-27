import { Router } from "express";
import {
  createApplication,
  getOrganizationApplications,
  getMyApplications,
  updateApplicationStatus,
} from "../controllers/applicationController";
import authenticate from "../middleware/auth";

const router = Router();

router.post("/", authenticate, createApplication);
router.get("/organization", authenticate, getOrganizationApplications);
router.patch("/:id/status", authenticate, updateApplicationStatus);
router.get("/", authenticate, getMyApplications);
router.get("/me", authenticate, getMyApplications);

export default router;
