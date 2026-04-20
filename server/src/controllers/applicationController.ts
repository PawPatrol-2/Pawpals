import { Request, Response, NextFunction } from "express";
import { ApplicationResponse, CreateApplicationBody } from "../types/applicationTypes";
import Application from "../models/Application";
import type { AuthenticatedRequest } from "../middleware/auth";

type LocalizedStatus = "Inskickad" | "Granskas" | "Godkänd" | "Nekad";

type MyApplicationResponse = {
  applicationId: string;
  animalId: string | null;
  animalName: string;
  status: LocalizedStatus;
  createdAt: Date;
};

type PopulatedAnimal = {
  _id?: unknown;
  name?: string;
} | null;

type ApplicationWithOptionalAnimal = {
  id: string;
  animalId?: PopulatedAnimal | string;
  animalNameSnapshot?: string;
  status?: string;
  createdAt: Date;
};

const normalizeStatus = (status: string | undefined): LocalizedStatus => {
  if (status === "Granskas" || status === "reviewing") return "Granskas";
  if (status === "Godkänd" || status === "approved") return "Godkänd";
  if (status === "Nekad" || status === "rejected") return "Nekad";
  return "Inskickad";
};

const resolveAnimalName = (application: ApplicationWithOptionalAnimal): string => {
  const animal = application.animalId;
  if (animal && typeof animal === "object" && typeof animal.name === "string") {
    const name = animal.name.trim();
    if (name) return name;
  }

  const fallbackName = application.animalNameSnapshot?.trim();
  if (fallbackName) return fallbackName;
  return "Okänt djur";
};

const resolveAnimalId = (application: ApplicationWithOptionalAnimal): string | null => {
  const animal = application.animalId;
  if (typeof animal === "string") return animal;
  if (animal && typeof animal === "object" && animal._id) return String(animal._id);
  return null;
};

export const getMyApplications = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Obehörig användare" });
      return;
    }

    const applications = await Application.find({ userId })
      .sort({ createdAt: -1 })
      .populate({ path: "animalId", select: "name" });

    const formattedApplications: MyApplicationResponse[] = applications.map(
      (application) => {
        const app = application as unknown as ApplicationWithOptionalAnimal;
        return {
          applicationId: app.id,
          animalId: resolveAnimalId(app),
          animalName: resolveAnimalName(app),
          status: normalizeStatus(app.status),
          createdAt: app.createdAt,
        };
      },
    );

    res.status(200).json({ applications: formattedApplications });
  } catch (error) {
    res.status(500).json({ message: "Kunde inte hämta ansökningar", error });
  }
};

export const createApplication = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Obehörig användare" });
      return;
    }

    const body = req.body as CreateApplicationBody;
    const application = await Application.create({
      ...body,
      userId,
    });

    res.status(201).json(application as ApplicationResponse);
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
