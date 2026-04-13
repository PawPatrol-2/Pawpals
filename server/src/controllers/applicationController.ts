import { Response } from "express";
import Application from "../models/Application";
import { AuthenticatedRequest } from "../middleware/auth";

type PopulatedAnimal = {
  _id?: string;
  name?: string;
} | null;

export const getMyApplications = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Obehörig användare" });
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
        status: application.status,
        createdAt: application.createdAt,
      };
    });

    return res.status(200).json({ applications: formattedApplications });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ message: "Något gick fel", error: error.message });
    }

    return res.status(500).json({ message: "Något gick fel", error });
  }
};
