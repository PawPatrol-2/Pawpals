import express from "express";
import { registerOrganization, loginOrganization} from "../controllers/organisationController";

const router = express.Router();

router.post("/register", registerOrganization);
router.post("/login", loginOrganization);

export default router;