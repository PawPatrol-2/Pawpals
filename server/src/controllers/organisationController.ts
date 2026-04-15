import Organization from "../models/Organisation"
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginOrganization = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const org = await Organization.findOne({ email });
        if (!org) return res.status(401).json({ message: "Fel e-mail" });

        const isMatch = await bcrypt.compare(password, org.password);
        if (!isMatch) return res.status(401).json({ message: "Fel lösenord" });

        const token = jwt.sign({ id: org._id, role: org.id }, "hemligt nyckel");
        res.json({ token, role: org.role });
    } catch (error) {
        res.status(500).json({ message: "Serverfel", error });
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
