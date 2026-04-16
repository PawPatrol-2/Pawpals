import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User";
import Organization from "../models/Organisation";
import { AuthenticatedRequest } from "../middleware/auth";

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET saknas i miljövariablerna");
  }
  return secret;
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          message: "Fel e-post eller lösenord",
        });
      }

      const token = jwt.sign({ userId: user._id }, getJwtSecret(), {
        expiresIn: "7d",
      });

      return res.status(200).json({
        message: "Inloggningen lyckades!",
        token,
        user: {
          id: user._id.toString(),
          email: user.email,
          username: user.username,
          role: user.role,
        },
      });
    }

    const organization = await Organization.findOne({ email });
    if (organization) {
      const isMatch = await bcrypt.compare(password, organization.password);
      if (!isMatch) {
        return res.status(401).json({
          message: "Fel e-post eller lösenord",
        });
      }

      const token = jwt.sign({ userId: organization._id }, getJwtSecret(), {
        expiresIn: "7d",
      });

      return res.status(200).json({
        message: "Inloggningen lyckades!",
        token,
        user: {
          id: organization._id.toString(),
          email: organization.email,
          username: organization.organization,
          role: organization.role,
        },
      });
    }

    return res.status(401).json({
      message: "Fel e-post eller lösenord",
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({
        message: "Något gick fel",
        error: err.message,
      });
    } else {
      res.status(500).json({
        message: "Något gick fel",
        error: err,
      });
    }
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, username, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === "organization") {
      const existingOrganization = await Organization.findOne({
        $or: [{ email }, { organization: username }],
      });

      if (existingOrganization) {
        return res.status(400).json({
          message: "Organisationen eller e-postadressen är redan registrerad.",
        });
      }

      const organization = new Organization({
        email,
        organization: username,
        password: hashedPassword,
        role: "organization",
      });
      await organization.save();

      return res.status(201).json({
        message: "Organisation skapad!",
        user: {
          email: organization.email,
          username: organization.organization,
          role: organization.role,
        },
      });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        message: "Användarnamnet är taget.",
      });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        message: "E-postadressen är redan registrerad.",
      });
    }

    const user = new User({
      email,
      username,
      password: hashedPassword,
      role: "adopter",
    });
    await user.save();

    return res.status(201).json({
      message: "Användare skapad!",
      user: { email: user.email, username: user.username, role: user.role },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({
        message: "Något gick fel",
        error: err.message,
      });
    } else {
      res.status(500).json({
        message: "Något gick fel",
        error: err,
      });
    }
  }
};

<<<<<<< HEAD
export const getCurrentUser = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Saknar giltig token" });
=======
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {

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
>>>>>>> f3512f33873ae1d040bf4ebef653e3b25bf343ba
    }

    const user = await User.findById(userId).select("email username role");
    if (user) {
      return res.status(200).json({
        user: {
          id: user._id.toString(),
          email: user.email,
          username: user.username,
          role: user.role,
        },
      });
    }

    const organization = await Organization.findById(userId).select(
      "email organization role",
    );
    if (organization) {
      return res.status(200).json({
        user: {
          id: organization._id.toString(),
          email: organization.email,
          username: organization.organization,
          role: organization.role,
        },
      });
    }

    return res.status(404).json({ message: "Användare hittades inte" });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res
        .status(500)
        .json({ message: "Något gick fel", error: err.message });
    }

    return res.status(500).json({ message: "Något gick fel", error: err });
  }
};

export const login = loginUser;
