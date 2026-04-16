import { Request, Response, NextFunction } from "express";
import { CreateApplicationBody } from "../types/applicationTypes";
import Application from "../models/Application";
import type { AuthenticatedRequest } from "../middleware/auth";

type PopulatedAnimal = {
  _id?: unknown;
  name?: string;
} | null;

const normalizeStatus = (status: string) => {
  if (status === "Inskickad" || status === "Granskas" || status === "Godkänd" || status === "Nekad") {
    return status;
  }

  if (status === "pending") return "Inskickad";
  if (status === "reviewing") return "Granskas";
  if (status === "approved") return "Godkänd";
  if (status === "rejected") return "Nekad";

  return "Inskickad";
};

export const getMyApplications = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Obehörig användare" });
      return;
    }

    const applications = await Application.find({ userId })
      .sort({ createdAt: -1 })
      .populate({ path: "animalId", select: "name" });

    const formattedApplications = applications.map((application) => {
      const animal = application.animalId as unknown as PopulatedAnimal;
      const animalId =
        animal && typeof animal === "object" && animal._id
          ? String(animal._id)
          : application.animalId
            ? String(application.animalId)
            : null;

      return {
        applicationId: application.id,
        animalId,
        animalName: animal?.name ?? "Okänt djur",
        status: normalizeStatus(application.status),
        createdAt: application.createdAt,
      };
    });

    res.status(200).json({ applications: formattedApplications });
  } catch (error) {
    res.status(500).json({ message: "Kunde inte hämta ansökningar", error });
  }
};

export const createApplication = async (
  req: Request<Record<string, never>, unknown, CreateApplicationBody>,
  res: Response,
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
