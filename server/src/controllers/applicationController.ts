import { Response } from "express";
import { Types } from "mongoose";
import Application, {
  applicationStatuses,
  ApplicationStatus,
} from "../models/Application";
import { AuthenticatedRequest } from "../middleware/auth";
import { Animal } from "../models/animal";
import { CreateApplicationBody } from "../types";

type PopulatedAnimal = {
  _id?: string;
  name?: string;
} | null;

type PopulatedUser = {
  _id?: string;
  username?: string;
  email?: string;
} | null;

const normalizeStatus = (status: string): ApplicationStatus => {
  if ((applicationStatuses as readonly string[]).includes(status)) {
    return status as ApplicationStatus;
  }

  if (status === "pending") return "Inskickad";
  if (status === "reviewing") return "Granskas";
  if (status === "approved") return "Godkänd";
  if (status === "rejected") return "Nekad";

  return "Inskickad";
};

export const createApplication = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Obehörig användare" });
      return;
    }

    const body = req.body as CreateApplicationBody;
    const {
      animalId,
      housingType,
      housingSize,
      hasAnimalExperience,
      hasChildren,
      hasAllergies,
      allergyDetails = "",
      motivation,
      gdprConsent,
    } = body;

    if (!animalId || !Types.ObjectId.isValid(animalId)) {
      res.status(400).json({ message: "Ogiltigt djur-id" });
      return;
    }

    if (!housingType || !motivation || !gdprConsent) {
      res.status(400).json({ message: "Obligatoriska fält saknas i ansökan" });
      return;
    }

    const animal = await Animal.findById(animalId).select("_id name");
    if (!animal) {
      res.status(404).json({ message: "Djuret hittades inte" });
      return;
    }

    const application = await Application.create({
      userId,
      animalId,
      housingType,
      housingSize,
      hasAnimalExperience,
      hasChildren,
      hasAllergies,
      allergyDetails: hasAllergies ? allergyDetails.trim() : "",
      motivation: motivation.trim(),
      gdprConsent,
    });

    res.status(201).json({
      message: "Ansökan skickad!",
      application: {
        applicationId: application.id,
        animalId: animal.id,
        animalName: animal.name ?? "Okänt djur",
        status: normalizeStatus(application.status),
        createdAt: application.createdAt,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: "Något gick fel", error: error.message });
      return;
    }

    res.status(500).json({ message: "Något gick fel", error });
  }
};

export const getMyApplications = async (
  req: AuthenticatedRequest,
  res: Response
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

    const formattedApplications = applications.map((application) => {
      const animal = application.animalId as unknown as PopulatedAnimal;

      return {
        applicationId: application.id,
        animalId: animal?._id?.toString() ?? null,
        animalName: animal?.name ?? "Okänt djur",
        status: normalizeStatus(application.status),
        createdAt: application.createdAt,
      };
    });

    res.status(200).json({ applications: formattedApplications });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: "Något gick fel", error: error.message });
      return;
    }

    res.status(500).json({ message: "Något gick fel", error });
  }
};

export const getAllApplications = async (
  _req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const applications = await Application.find()
      .sort({ createdAt: -1 })
      .populate({ path: "animalId", select: "name" })
      .populate({ path: "userId", select: "username email" });

    const formattedApplications = applications.map((application) => {
      const animal = application.animalId as unknown as PopulatedAnimal;
      const applicant = application.userId as unknown as PopulatedUser;

      return {
        applicationId: application.id,
        animalId: animal?._id?.toString() ?? null,
        animalName: animal?.name ?? "Okänt djur",
        applicantName: applicant?.username ?? "Okänd användare",
        applicantEmail: applicant?.email ?? "Okänd e-post",
        status: normalizeStatus(application.status),
        createdAt: application.createdAt,
      };
    });

    res.status(200).json({ applications: formattedApplications });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: "Något gick fel", error: error.message });
      return;
    }

    res.status(500).json({ message: "Något gick fel", error });
  }
};

export const updateApplicationStatus = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { applicationId } = req.params as { applicationId?: string };
    const { status } = req.body as { status?: string };

    if (!applicationId || !Types.ObjectId.isValid(applicationId)) {
      res.status(400).json({ message: "Ogiltigt ansöknings-id" });
      return;
    }

    const allowedStatusUpdates: ApplicationStatus[] = [
      "Granskas",
      "Godkänd",
      "Nekad",
    ];

    if (!status || !allowedStatusUpdates.includes(status as ApplicationStatus)) {
      res.status(400).json({
        message: "Ogiltig status. Tillåtna värden är Granskas, Godkänd eller Nekad.",
      });
      return;
    }

    const updated = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    ).populate({ path: "animalId", select: "name" });

    if (!updated) {
      res.status(404).json({ message: "Ansökan hittades inte" });
      return;
    }

    const animal = updated.animalId as unknown as PopulatedAnimal;

    res.status(200).json({
      message: "Status uppdaterad!",
      application: {
        applicationId: updated.id,
        animalId: animal?._id?.toString() ?? null,
        animalName: animal?.name ?? "Okänt djur",
        status: normalizeStatus(updated.status),
        createdAt: updated.createdAt,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: "Något gick fel", error: error.message });
      return;
    }

    res.status(500).json({ message: "Något gick fel", error });
  }
};
