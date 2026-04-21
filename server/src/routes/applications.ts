import { Router } from "express";
import {
  createApplication,
  getMyApplications,
} from "../controllers/applicationController";
import authenticate from "../middleware/auth";

const router = Router();

router.post("/", authenticate, createApplication);
router.get("/", authenticate, getMyApplications);
router.get("/me", authenticate, getMyApplications);

export default router;
