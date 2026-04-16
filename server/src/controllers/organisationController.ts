import Organization from "../models/Organisation"
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../middleware/auth";

const getJwtSecret = (): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET saknas i miljövariablerna");
    }
    return secret;
};

export const loginOrganization = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const org = await Organization.findOne({ email }).select("_id organization email password role");
        if (!org) return res.status(401).json({ message: "Fel e-post eller lösenord" });

        const isMatch = await bcrypt.compare(password, org.password);
        if (!isMatch) return res.status(401).json({ message: "Fel e-post eller lösenord" });

        const token = jwt.sign(
            { userId: org.id, role: "organization" },
            getJwtSecret(),
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            message: "Inloggningen lyckades!",
            token,
            user: {
                id: org.id,
                username: org.organization,
                email: org.email,
                role: "organization",
            },
        });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: "Serverfel", error: error.message });
        }
        return res.status(500).json({ message: "Serverfel", error });
    }
}



export const registerOrganization = async (req: Request, res: Response) => {
    try {
        const { email, organization, password } = req.body;

        const existingOrganization = await Organization.findOne({ organization });
        if (existingOrganization) {
            return res.status(400).json({
                message: "Organisationsnamnet är taget."
            });
        }

        const existingEmail = await Organization.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({
                message: "Organisationsnamnet är redan upptaget"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const org = new Organization({ email, organization, password: hashedPassword, role: "organization" });
        await org.save();

        res.status(201).json({
            message: "Organisation skapad!",
            organization: { email: org.email, organization: org.organization, role: org.role }
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).json({
                message: "Något gick fel", error: err.message
            });
        } else {
            res.status(500).json({
                message: "Något gick fel", error: err
            });
        }
    }
};

export const getCurrentOrganization = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Obehörig användare" });
        }

        const org = await Organization.findById(userId).select("_id organization email role");
        if (!org) {
            return res.status(404).json({ message: "Organisationen hittades inte" });
        }

        return res.status(200).json({
            user: {
                id: org.id,
                username: org.organization,
                email: org.email,
                role: "organization",
            },
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ message: "Något gick fel", error: error.message });
        }
        return res.status(500).json({ message: "Något gick fel", error });
    }
};
