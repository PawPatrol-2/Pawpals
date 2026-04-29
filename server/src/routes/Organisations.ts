import express from "express";
import {
  registerOrganization,
  loginOrganization,
} from "../controllers/organisationController";
import { getCurrentUser } from "../controllers/userController";
import authenticate from "../middleware/auth";

const router = express.Router();

router.post("/register", registerOrganization);
router.post("/login", loginOrganization);
router.get("/me", authenticate, getCurrentUser);

export default router;
