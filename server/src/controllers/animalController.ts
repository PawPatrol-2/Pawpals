import { Request, Response } from "express";
import { Animal } from "../models/animal";
import Organization from "../models/Organisation";
import type { AuthenticatedRequest } from "../middleware/auth";
import {
  deleteAnimalImage,
  uploadAnimalImage,
} from "../services/cloudinaryService";
import { CreateAnimalInput, UpdateAnimalInput, DeleteAnimalInput } from "../types/animal";

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

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getQueryValues = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .flatMap((item) => (typeof item === "string" ? item.split(",") : []))
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const traitKeywords: Record<string, string[]> = {
  lugn: ["lugn", "mjuk", "gosig", "snäll"],
  aktiv: ["aktiv", "lekfull", "energisk", "busig"],
};

export const getAnimals = async (req: Request, res: Response) => {
  try {
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit as string) || 10, 1);
    const searchTerm =
      typeof req.query.q === "string" ? req.query.q.trim() : "";
    const category =
      typeof req.query.category === "string" ? req.query.category.trim() : "";
    const ageFilters = getQueryValues(req.query.age);
    const traitFilters = getQueryValues(req.query.trait);
    const childFriendlyOnly = req.query.childFriendly === "true";
    const searchRegex = searchTerm
      ? new RegExp(escapeRegex(searchTerm), "i")
      : null;
    const queryParts: Record<string, unknown>[] = [];

    if (searchRegex) {
      queryParts.push({
        $or: [
          { name: searchRegex },
          { type: searchRegex },
          { breed: searchRegex },
          { keyTraits: searchRegex },
          { personality: searchRegex },
          { city: searchRegex },
          { organizationOwner: searchRegex },
        ],
      });
    }

    if (category && category !== "alla") {
      queryParts.push({ type: new RegExp(`^${escapeRegex(category)}$`, "i") });
    }

    if (ageFilters.length > 0) {
      const ageQuery: Record<string, unknown>[] = [];

      if (ageFilters.includes("baby")) {
        ageQuery.push({ age: { $lt: 1 } });
      }

      if (ageFilters.includes("young")) {
        ageQuery.push({ age: { $gte: 1, $lte: 3 } });
      }

      if (ageFilters.includes("adult")) {
        ageQuery.push({ age: { $gt: 3 } });
      }

      if (ageQuery.length > 0) {
        queryParts.push({ $or: ageQuery });
      }
    }

    const selectedTraitKeywords = traitFilters.flatMap(
      (filter) => traitKeywords[filter] ?? [],
    );
    if (selectedTraitKeywords.length > 0) {
      const traitRegex = new RegExp(
        selectedTraitKeywords.map(escapeRegex).join("|"),
        "i",
      );
      queryParts.push({
        $or: [{ keyTraits: traitRegex }, { personality: traitRegex }],
      });
    }

    if (childFriendlyOnly) {
      queryParts.push({ childFriendly: true });
    }

    const query = queryParts.length > 0 ? { $and: queryParts } : {};

    const startIndex = (page - 1) * limit;
    console.log("Mongoose collection:", Animal.collection.collectionName);
    const animals = await Animal.find(query)
      .sort({ createdAt: -1, _id: -1 })
      .skip(startIndex)
      .limit(limit);
    console.log("Hittade dessa djur i databasen:", animals);
    const totalAnimals = await Animal.countDocuments(query);
    const totalPages = Math.ceil(totalAnimals / limit);
    res.json({
      animals,
      pagination: { page, limit, totalPages, totalAnimals },
    });
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
    const params = req.validatedParams as DeleteAnimalInput
    const existingAnimal = await Animal.findById(params.id);

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

    await Animal.findByIdAndUpdate(params.id, { deletedAt: new Date() });

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
    const body = req.validatedBody as CreateAnimalInput;

    if ((!req.file && !body.image) || !body.name || !body.type || !body.breed || !body.city) {
      return res.status(400).json({
        error:
          "Obligatoriska fält saknas. Du måste ange bild, namn, typ, ras och stad.",
      });
    }

    const uploadedImage = req.file ? await uploadAnimalImage(req.file) : null;
    const imagePath = uploadedImage?.url ?? req.body.image;

    const payload = {
      ...body,
      name: body.name,
      type: body.type,
      breed: body.breed,
      image: imagePath,
      imagePublicId: uploadedImage?.publicId,
      city: body.city,
      age: body.age,
      keyTraits: toOptionalText(body.keyTraits),
      personality: toOptionalText(body.personality),
      description: toOptionalText(body.description),
      childFriendly: toBoolean(body.childFriendly),
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

    const { requester: _requester, ...restBody } = req.body as {
      requester?: string;
      [key: string]: unknown;
    };

   const body = req.validatedBody as UpdateAnimalInput;

    if (!body.image || !body.name || !body.type || !body.breed || !body.city) {
      return res.status(400).json({
        error:
          "Obligatoriska fält saknas. Du måste ange bild, namn, typ, ras och stad.",
      });
    }

    const uploadedImage = req.file ? await uploadAnimalImage(req.file) : null;
    const imagePath = uploadedImage?.url ?? restBody.image;

    const payload = {
      ...body,
      name: body.name,
      type: body.type,
      breed: body.breed,
      image: imagePath,
      imagePublicId:
        uploadedImage?.publicId ??
        (existingAnimal as unknown as { imagePublicId?: string }).imagePublicId,
      city: body.city,
      age: body.age,
      keyTraits: toOptionalText(body.keyTraits),
      personality: toOptionalText(body.personality),
      description: toOptionalText(body.description),
      childFriendly: toBoolean(body.childFriendly),
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

    if (uploadedImage) {
      await deleteAnimalImage(
        (existingAnimal as unknown as { imagePublicId?: string }).imagePublicId,
      );
    }

    res.json(updatedAnimal);
  } catch (err) {
    res.status(400).json({ error: "Failed to update animal", err });
  }
};
