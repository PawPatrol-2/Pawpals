import { Request, Response, NextFunction } from "express";
import { ApplicationResponse, CreateApplicationBody } from "../types";
import Application from "../models/Application";

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
