import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User";
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
    if (!user) {
      return res.status(401).json({
        message: "Fel e-post eller lösenord",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Fel e-post eller lösenord",
      });
    }

    const token = jwt.sign({ userId: user._id }, getJwtSecret(), {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Inloggningen lyckades!",
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        role: user.role,
      },
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

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      username,
      password: hashedPassword,
      role: role === "organization" ? "organization" : "adopter",
    });
    await user.save();

    res.status(201).json({
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

export const getCurrentUser = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Saknar giltig token" });
    }

    const user = await User.findById(userId).select("email username role");
    if (!user) {
      return res.status(404).json({ message: "Användare hittades inte" });
    }

    return res.status(200).json({
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res
        .status(500)
        .json({ message: "Något gick fel", error: err.message });
    }

    return res.status(500).json({ message: "Något gick fel", error: err });
  }
};
