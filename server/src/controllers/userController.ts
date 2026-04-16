import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../middleware/auth';
import Organization from '../models/Organisation';

const getJwtSecret = (): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET saknas i miljövariablerna');
    }
    return secret;
}

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

        const token = jwt.sign(
            { userId: user.id },
            getJwtSecret(),
            { expiresIn: '7d' }
        );

        res.status(200).json({
            message: "Inloggningen lyckades!",
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
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

export const getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Obehörig användare" });
        }

        const user = await User.findById(userId).select('_id username email');
        if (!user) {
            return res.status(404).json({ message: "Användaren hittades inte" });
        }

        res.status(200).json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
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
        const { email, username, password, role } = req.body;
        console.log('Payload mottagen:', { email, username, password, role });

        if (!['adopter', 'organization'].includes(role)) {
            return res.status(400).json({
                message: "Ogiltig roll. Tillåtna roller är 'adopter' och 'organization'."
            });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({
                message: "Användarnamnet är taget."
            });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({
                message: "E-postadressen är redan registrerad."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, username, password: hashedPassword, role });
        await user.save();

        res.status(201).json({
            message: "Användare skapad!",
            user: { email: user.email, username: user.username }
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

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // Kontrollera om det är en användare
        let user = await User.findOne({ email });
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Fel e-post eller lösenord" });
            }

            const token = jwt.sign(
                { userId: user.id, role: user.role },
                getJwtSecret(),
                { expiresIn: '7d' }
            );

            return res.status(200).json({
                message: "Inloggningen lyckades!",
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            });
        }

        // Kontrollera om det är en organisation
        const organization = await Organization.findOne({ email });
        if (organization) {
            const isMatch = await bcrypt.compare(password, organization.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Fel e-post eller lösenord" });
            }

            const token = jwt.sign(
                { userId: organization.id, role: organization.role },
                getJwtSecret(),
                { expiresIn: '7d' }
            );

            return res.status(200).json({
                message: "Inloggningen lyckades!",
                token,
                user: {
                    id: organization.id,
                    username: organization.organization,
                    email: organization.email,
                    role: organization.role
                }
            });
        }

        return res.status(404).json({ message: "Användare eller organisation hittades inte" });
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
