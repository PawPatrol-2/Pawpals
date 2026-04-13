import express from "express";
import authenticate from "../middleware/auth";
import { getMyApplications } from "../controllers/applicationController";

const router = express.Router();

router.get("/me", authenticate, getMyApplications);

export default router;
