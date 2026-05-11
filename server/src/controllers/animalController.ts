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

const toRequiredText = (value: unknown): string => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
};

const toOptionalText = (value: unknown): string | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
};

const toOptionalAge = (value: unknown): number | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
    return value;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return undefined;
    }

    const parsed = Number(trimmed);
    if (Number.isFinite(parsed) && parsed >= 0) {
      return parsed;
    }
  }

  return undefined;
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

export const getAnimals = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    console.log("Mongoose collection:", Animal.collection.collectionName);
    const animals = await Animal.find().sort({ createdAt: -1, _id: -1 }).skip(startIndex).limit(limit);
    console.log("Hittade dessa djur i databasen:", animals);
    const totalAnimals = await Animal.countDocuments();
    const totalPages = Math.ceil(totalAnimals / limit);
    res.json({animals, pagination: { page, limit, totalPages, totalAnimals }});
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

    const name = toRequiredText(req.body.name);
    const type = toRequiredText(req.body.type);
    const breed = toRequiredText(req.body.breed);
    const city = toCity(req.body.city);

    if (!imagePath || !name || !type || !breed || !city) {
      return res.status(400).json({
        error:
          "Obligatoriska fält saknas. Du måste ange bild, namn, typ, ras och stad.",
      });
    }

    const payload = {
      ...req.body,
      name,
      type,
      breed,
      image: imagePath,
      city,
      age: toOptionalAge(req.body.age),
      keyTraits: toOptionalText(req.body.keyTraits),
      personality: toOptionalText(req.body.personality),
      description: toOptionalText(req.body.description),
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

    const name = toRequiredText(restBody.name);
    const type = toRequiredText(restBody.type);
    const breed = toRequiredText(restBody.breed);
    const city = toCity(restBody.city);

    if (!imagePath || !name || !type || !breed || !city) {
      return res.status(400).json({
        error:
          "Obligatoriska fält saknas. Du måste ange bild, namn, typ, ras och stad.",
      });
    }

    const payload = {
      ...restBody,
      name,
      type,
      breed,
      image: imagePath,
      city,
      age: toOptionalAge(restBody.age),
      keyTraits: toOptionalText(restBody.keyTraits),
      personality: toOptionalText(restBody.personality),
      description: toOptionalText(restBody.description),
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
