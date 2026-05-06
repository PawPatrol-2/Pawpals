import { RequestHandler } from "express";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User";
import Organization from "../models/Organisation";
import { AuthenticatedRequest } from "../middleware/auth";


export const getAllUsers: RequestHandler = async (req, res) => {
  try {
    const users = await User.find().select("_id email username role");
    const organizations = await Organization.find().select("_id email organization role");
    const orgsAsUsers = organizations.map(org => ({
      _id: org._id,
      email: org.email,
      organisationsnamn: org.organization,
      role: org.role
    }));
    const usersWithFullname = users.map(u => ({
      _id: u._id,
      email: u.email,
      fullname: u.username,
      role: u.role
    }));
    res.json([...usersWithFullname, ...orgsAsUsers]);
  } catch (error: unknown) {
    if(typeof error === "object" && error !== null && "name" in error) {
      const err = error as { name: string; message?: string; path?: string;}
      if(err.name === "ValidationError") {
        return res.status(400).json({ error: err.message })
      }
      if(err.name === "CastError") {
        if(err.path === "_id") {
          return res.status(404).json({ error: 'Invalid id-format'})
        }
        return res.status(400).json({ error: `Invalid value for ${err.path}`})
      }
    }
      res.status(500).json({ message: "Kunde inte hämta användare", error: error });
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
    res.status(201).json({ message: "Admin skapad!" });
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "name" in error) {
      const err = error as { name: string; message?: string; path?: string };
      if (err.name === "ValidationError") {
        return res.status(400).json({ error: err.message });
      }
      if (err.name === "CastError") {
        if (err.path === "_id") {
          return res.status(404).json({ error: "Invalid id-format" });
        }
        return res.status(400).json({ error: `Invalid value for ${err.path}` });
      }
    }
    res.status(500).json({ message: "Något gick fel", error });
  }
};

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
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'name' in error ) {
    const err = error as { name: string; message?: string; path?: string }
    if(err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message })
    }
    if(err.name === "CastError") {
      if(err.path === "_id") {
        return res.status(404).json({ error: "Invalid id-format"})
      }
      return res.status(400).json({ error: `Invalid value for ${err.path}`})
    }
    }  
    res.status(500).json({message: "Något gick fel", error})
    
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
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "name" in error) {
      const err = error as { name: string; message?: string; path?: string };
      if (err.name === "ValidationError") {
        return res.status(400).json({ error: err.message });
      }
      if (err.name === "CastError") {
        if (err.path === "_id") {
          return res.status(404).json({ error: "Invalid id-format" });
        }
        return res.status(400).json({ error: `Invalid value for ${err.path}` });
      }
    }
    res.status(500).json({ message: "Något gick fel", error });
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
    if (user) {
      return res.status(200).json({
        user: {
          id: user._id.toString(),
          email: user.email,
          fullname: user.username,
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
          organisationsnamn: organization.organization,
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

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "Användaren hittades inte" });
    }
    res.status(200).json({ message: "Användaren borttagen" });
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "name" in error) {
      const err = error as { name: string; message?: string; path?: string };
      if (err.name === "ValidationError") {
        return res.status(400).json({ error: err.message });
      }
      if (err.name === "CastError") {
        if (err.path === "_id") {
          return res.status(404).json({ error: "Invalid id-format" });
        }
        return res.status(400).json({ error: `Invalid value for ${err.path}` });
      }
    }
    res.status(500).json({ message: "Ett fel inträffade", error });
  }
};

export const login = loginUser;
