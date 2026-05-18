import Organization from "../models/Organisation";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { handleControllerError } from "./controllerError";

export const registerOrganization = async (req: Request, res: Response) => {
    try {
        const { email, organization, password } = req.body;

        const existing = await Organization.findOne({ $or: [{ email }, { organization }] });
        if (existing) {
            return res.status(400).json({
                message: "E-postadressen eller organisationsnamnet är redan registrerat.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const org = new Organization({ email, organization, password: hashedPassword, role: "organization" });
        await org.save();

        return res.status(201).json({
            message: "Organisation skapad!",
            organization: { email: org.email, organization: org.organization, role: org.role },
        });
    } catch (error: unknown) {
        return handleControllerError(res, error, "Något gick fel");
    }
};
