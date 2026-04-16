import { Request, Response, NextFunction } from "express";
import { ApplicationResponse, CreateApplicationBody } from "../types/applicationTypes";
import Application from "../models/Application";
import type { AuthenticatedRequest } from "../middleware/auth";

export const getMyApplications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId
    if(!userId) {
      return res.status(400).json({ message: "Användar-ID saknas"})
    }

    const applications = await Application.find({ userId})
    res.status(200).json({ applications })
  } catch (error) {
    res.status(500).json({ message: "Kunde inte hämta ansökningar", error})
  }
}
export const createApplication = async (
  req: Request<Record<string, never>, unknown, CreateApplicationBody>,
  res: Response<ApplicationResponse>,
  next: NextFunction,
): Promise<void> => {
  try {
    const application = await Application.create(req.body);
    res.status(201).json(application);
  } catch (error) {
    next(error);
  }
};

export const getAllApplications = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const getApplication = await Application.find();
    res.json(getApplication);
  } catch (error) {
    next(error);
  }
};
