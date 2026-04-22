import { Router } from "express";
import {
  createApplication,
  getOrganizationApplications,
  getMyApplications,
} from "../controllers/applicationController";
import authenticate from "../middleware/auth";

const router = Router();

router.post("/", authenticate, createApplication);
router.get("/organization", authenticate, getOrganizationApplications);
router.get("/", authenticate, getMyApplications);
router.get("/me", authenticate, getMyApplications);

export default router;
