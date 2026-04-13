import { Request, Response, NextFunction } from "express";
import { ApplicationResponse, CreateApplicationBody } from "../types";

export const createApplication = async (
  req: Request<{}, {}, CreateApplicationBody>,
  res: Response<ApplicationResponse>,
  next: NextFunction,
): Promise<void> => {
  try {
    // logiken här
  } catch (error) {
    next(error);
  }
};