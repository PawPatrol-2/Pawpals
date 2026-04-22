import { Request, Response, NextFunction } from "express";
import {
  ApplicationResponse,
  CreateApplicationBody,
} from "../types/applicationTypes";
import Application from "../models/Application";
import Organization from "../models/Organisation";
import type { AuthenticatedRequest } from "../middleware/auth";

type LocalizedStatus = "Inskickad" | "Granskas" | "Godkänd" | "Nekad";

type MyApplicationResponse = {
  applicationId: string;
  animalId: string | null;
  animalName: string;
  status: LocalizedStatus;
  createdAt: Date;
};

type OrganizationApplicationResponse = MyApplicationResponse & {
  applicantName: string;
};

type PopulatedAnimal = {
  _id?: unknown;
  name?: string;
  organizationOwner?: string;
} | null;

type PopulatedApplicant = {
  _id?: unknown;
  username?: string;
  email?: string;
} | null;

type ApplicationWithOptionalAnimal = {
  id: string;
  animalId?: PopulatedAnimal | string;
  userId?: PopulatedApplicant | string;
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

const resolveAnimalName = (
  application: ApplicationWithOptionalAnimal,
): string => {
  const animal = application.animalId;
  if (animal && typeof animal === "object" && typeof animal.name === "string") {
    const name = animal.name.trim();
    if (name) return name;
  }
  const fallbackName = application.animalNameSnapshot?.trim();
  if (fallbackName) return fallbackName;
  return "Okänt djur";
};

const resolveAnimalId = (
  application: ApplicationWithOptionalAnimal,
): string | null => {
  const animal = application.animalId;
  if (typeof animal === "string") return animal;
  if (animal && typeof animal === "object" && animal._id)
    return String(animal._id);
  return null;
};

const resolveApplicantName = (
  application: ApplicationWithOptionalAnimal,
): string => {
  const applicant = application.userId;

  if (
    applicant &&
    typeof applicant === "object" &&
    typeof applicant.username === "string"
  ) {
    const username = applicant.username.trim();
    if (username) return username;
  }

  if (
    applicant &&
    typeof applicant === "object" &&
    typeof applicant.email === "string"
  ) {
    const email = applicant.email.trim();
    if (email) return email;
  }

  return "Okänd adoptör";
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
    const animalId = body.animalId;

    if (animalId) {
      const existing = await Application.findOne({ userId, animalId });
      if (existing) {
        res.status(409).json({ message: "Du har redan ansökt om detta djur" });
        return;
      }
    }

    const application = await Application.create({ ...body, userId });
    res.status(201).json(application as ApplicationResponse);
  } catch (error) {
    next(error);
  }
};

export const getOrganizationApplications = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Obehörig användare" });
      return;
    }

    const organization =
      await Organization.findById(userId).select("organization");

    if (!organization?.organization) {
      res
        .status(403)
        .json({ message: "Endast organisationer kan hämta dessa ansökningar" });
      return;
    }

    const applications = await Application.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "animalId",
        select: "name organizationOwner",
        match: { organizationOwner: organization.organization },
      })
      .populate({
        path: "userId",
        select: "username email",
      });

    const formattedApplications: OrganizationApplicationResponse[] =
      applications
        .map(
          (application) =>
            application as unknown as ApplicationWithOptionalAnimal,
        )
        .filter(
          (application) =>
            !!application.animalId && typeof application.animalId === "object",
        )
        .map((application) => ({
          applicationId: application.id,
          applicantName: resolveApplicantName(application),
          animalId: resolveAnimalId(application),
          animalName: resolveAnimalName(application),
          status: normalizeStatus(application.status),
          createdAt: application.createdAt,
        }));

    res.status(200).json({ applications: formattedApplications });
  } catch (error) {
    res.status(500).json({ message: "Kunde inte hämta ansökningar", error });
  }
};
