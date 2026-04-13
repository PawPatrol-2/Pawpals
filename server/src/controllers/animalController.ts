import { Request, Response } from "express";
import { Animal } from "../models/animal";

export const getAnimals = async (_req: Request, res: Response) => {
  try {
    console.log("Mongoose collection:", Animal.collection.collectionName);
    const animals = await Animal.find();
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

export const deleteAnimal = async (req: Request, res: Response) => {
  try {
    const animal = await Animal.findByIdAndDelete(req.params.id);

    if (!animal) {
      return res.status(404).json({ error: "Animal not found" });
    }

    res.json({ message: "Animal deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete animal", err });
  }
};

export const createAnimal = async (req: Request, res: Response) => {
  try {
    const newAnimal = await Animal.create(req.body);
    res.status(201).json(newAnimal);
  } catch (err) {
    res.status(400).json({ error: "Failed to create animal", err });
  }
};

export const updateAnimal = async (req: Request, res: Response) => {
  try {
    const existingAnimal = await Animal.findById(req.params.id);

    if (!existingAnimal) {
      return res.status(404).json({ error: "Animal not found" });
    }

    const requester = req.body.requester as string | undefined;
    const owner = (existingAnimal as unknown as { organizationOwner?: string })
      .organizationOwner;

    if (!requester || !owner || owner !== requester) {
      return res.status(403).json({
        error: "Du kan bara redigera djur som din organisation har laddat upp.",
      });
    }

    const updatedAnimal = await Animal.findByIdAndUpdate(
      req.params.id,
      req.body,
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
