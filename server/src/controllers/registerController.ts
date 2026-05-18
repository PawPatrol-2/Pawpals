import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import Organization from "../models/Organisation";
import { handleControllerError } from "./controllerError";

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
      return res.status(400).json({ message: "Användarnamnet är taget." });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "E-postadressen är redan registrerad." });
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
  } catch (error: unknown) {
    return handleControllerError(res, error, "Något gick fel");
  }
};
