import { Router } from "express";
import {
  createApplication,
  getAllApplications,
  getMyApplications,
} from "../controllers/applicationController";
import authenticate from "../middleware/auth";

const router = Router();

router.post("/", authenticate, createApplication);
router.get("/", getAllApplications);
router.get("/me", authenticate, getMyApplications);

export default router;
