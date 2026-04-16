import express from "express";
import authenticate from "../middleware/auth";
import {
  registerOrganization,
  loginOrganization,
  getCurrentOrganization
} from "../controllers/organisationController";

const router = express.Router();

router.post("/register", registerOrganization);
router.post("/login", loginOrganization);
router.get("/me", authenticate, getCurrentOrganization);

export default router;
