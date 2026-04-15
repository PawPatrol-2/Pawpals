import { Router } from "express";
import {
  createApplication,
  getAllApplications,
} from "../controllers/applicationController";

const router = Router();

router.post("/", createApplication);
router.get("/", getAllApplications);

//fler endpoints kommer

export default router;
