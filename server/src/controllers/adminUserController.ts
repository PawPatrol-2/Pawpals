import { Request, Response, RequestHandler } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import Organization from "../models/Organisation";
import { handleControllerError } from "./controllerError";

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const user = await User.findByIdAndDelete(userId);
    if (user) {
      return res.status(200).json({ message: "Användaren borttagen" });
    }

    const organization = await Organization.findByIdAndDelete(userId);
    if (organization) {
      return res.status(200).json({ message: "Organisationen borttagen" });
    }

    return res.status(404).json({ message: "Användaren hittades inte" });
  } catch (error: unknown) {
    return handleControllerError(res, error, "Ett fel inträffade");
  }
};

export const getAllUsers: RequestHandler = async (_req, res) => {
  try {
    const users = await User.find().select("_id email username role");
    const organizations = await Organization.find().select(
      "_id email organization role",
    );
    const orgsAsUsers = organizations.map((org) => ({
      _id: org._id,
      email: org.email,
      organisationsnamn: org.organization,
      role: org.role,
    }));
    const usersWithFullname = users.map((u) => ({
      _id: u._id,
      email: u.email,
      fullname: u.username,
      role: u.role,
    }));
    return res.json([...usersWithFullname, ...orgsAsUsers]);
  } catch (error: unknown) {
    return handleControllerError(res, error, "Kunde inte hämta användare");
  }
};

export const createAdminUser = async (req: Request, res: Response) => {
  if (req.body.secret !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ message: "Otillåtet" });
  }
  const { email, username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      username,
      password: hashedPassword,
      role: "admin",
    });
    await user.save();
    return res.status(201).json({ message: "Admin skapad!" });
  } catch (error: unknown) {
    return handleControllerError(res, error, "Något gick fel");
  }
};
