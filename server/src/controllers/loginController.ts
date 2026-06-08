import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User";
import Organization from "../models/Organisation";
import { handleControllerError } from "./controllerError";
import type { LoginBody } from "../types/user";

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET saknas i miljövariablerna");
  }
  return secret;
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginBody;

  try {
    const user = await User.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Fel e-post eller lösenord" });
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
        return res.status(401).json({ message: "Fel e-post eller lösenord" });
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

    return res.status(401).json({ message: "Fel e-post eller lösenord" });
  } catch (error: unknown) {
    return handleControllerError(res, error, "Något gick fel");
  }
};
