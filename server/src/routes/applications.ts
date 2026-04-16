import { Router } from "express";
import {
  createApplication,
  getAllApplications,
} from "../controllers/applicationController";
import authenticate from "../middleware/auth";

const router = Router();

router.post("/", authenticate, createApplication);
router.get("/", getAllApplications);

//fler endpoints kommer

export default router;
