import { Request, Response } from "express";
import { Animal } from "../models/animal";
import Organization from "../models/Organisation";
import type { AuthenticatedRequest } from "../middleware/auth";

type AnimalRequest = AuthenticatedRequest & { file?: Express.Multer.File };

const toBoolean = (value: unknown): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true" || normalized === "1" || normalized === "on") {
      return true;
    }
  }
  return false;
};

const toCity = (value: unknown): string => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
};

const resolveOrganizationName = async (
  req: AuthenticatedRequest,
): Promise<string | null> => {
  const userId = req.user?.userId;
  if (!userId) {
    return null;
  }

  const organization =
    await Organization.findById(userId).select("organization");

  if (!organization?.organization) {
    return null;
  }

  return organization.organization;
};

export const getAnimals = async (_req: Request, res: Response) => {
  try {
    console.log("Mongoose collection:", Animal.collection.collectionName);
    const animals = await Animal.find().sort({ createdAt: -1, _id: -1 });
    console.log("Hittade dessa djur i databasen:", animals);
    res.json(animals);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch animals", err });
  }
};

export const getAnimalById = async (req: Request, res: Response) => {
  try {
    const animal = await Animal.findById(req.params.id);

    if (!animal) {
      return res.status(404).json({ error: "Animal not found" });
    }

    res.json(animal);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch animal", err });
  }
};

export const deleteAnimal = async (req: AnimalRequest, res: Response) => {
  try {
    const existingAnimal = await Animal.findById(req.params.id);

    if (!existingAnimal) {
      return res.status(404).json({ error: "Animal not found" });
    }

    const requester = await resolveOrganizationName(req);
    const owner = (existingAnimal as unknown as { organizationOwner?: string })
      .organizationOwner;

    if (!requester || !owner || owner !== requester) {
      return res.status(403).json({
        error: "Du kan bara ta bort djur som din organisation har laddat upp.",
      });
    }

    const animal = await Animal.findByIdAndDelete(req.params.id);

    if (!animal) {
      return res.status(404).json({ error: "Animal not found" });
    }

    res.json({ message: "Animal deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete animal", err });
  }
};

export const createAnimal = async (req: AnimalRequest, res: Response) => {
  try {
    const requester = await resolveOrganizationName(req);
    if (!requester) {
      return res.status(403).json({
        error: "Endast organisationer får lägga upp djur.",
      });
    }

    const imagePath = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.image;
    const payload = {
      ...req.body,
      image: imagePath,
      city: toCity(req.body.city),
      childFriendly: toBoolean(req.body.childFriendly),
      organizationOwner: requester,
    };

    const newAnimal = await Animal.create(payload);
    res.status(201).json(newAnimal);
  } catch (err) {
    res.status(400).json({ error: "Failed to create animal", err });
  }
};

export const updateAnimal = async (req: AnimalRequest, res: Response) => {
  try {
    const requester = await resolveOrganizationName(req);
    if (!requester) {
      return res.status(403).json({
        error: "Endast organisationer får redigera djur.",
      });
    }

    const existingAnimal = await Animal.findById(req.params.id);

    if (!existingAnimal) {
      return res.status(404).json({ error: "Animal not found" });
    }

    const owner = (existingAnimal as unknown as { organizationOwner?: string })
      .organizationOwner;

    if (!requester || !owner || owner !== requester) {
      return res.status(403).json({
        error: "Du kan bara redigera djur som din organisation har laddat upp.",
      });
    }

    const imagePath = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.image;
    const { requester: _requester, ...restBody } = req.body as {
      requester?: string;
      [key: string]: unknown;
    };

    const payload = {
      ...restBody,
      image: imagePath,
      city: toCity(restBody.city),
      childFriendly: toBoolean(restBody.childFriendly),
      organizationOwner: owner,
    };

    const updatedAnimal = await Animal.findByIdAndUpdate(
      req.params.id,
      payload,
      {
        new: true,
        runValidators: true,
      },
    );

    res.json(updatedAnimal);
  } catch (err) {
    res.status(400).json({ error: "Failed to update animal", err });
  }
};
