import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt'

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Fel e-post eller lösenord"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Fel e-post eller lösenord"
            });
        }

        res.status(200).json({
            message: "Inloggningen lyckades!",
            username: user.username
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

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { email, username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, username, password: hashedPassword });
        await user.save();

        res.status(201).json({
            message: "Användare skapad!",
            user: { email: user.email, username: user.username }
        });
    } catch (err: unknown) {
        if (typeof err === "object" && err !== null && "code" in err && (err as { code?: number }).code === 11000) {
            res.status(400).json({
                message: "E-postadressen är redan registrerad."
            });
        } else if (err instanceof Error) {
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