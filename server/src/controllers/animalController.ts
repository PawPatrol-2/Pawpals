import { Request, Response } from "express";
import { Animal } from "../models/animal";

export const getAnimals = async (_req: Request, res: Response) => {
  try {
    const animals = await Animal.find();
    res.json(animals);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch animals" });
  }
};

export const getAnimalById = async (req: Request, res: Response) => {
  try {
    const animal = await Animal.findById(req.params.id);

    if (!animal) {
      return res.status(404).json({ error: "Animal not found" });
    }

    res.json(animal);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch animal" });
  }
};

export const deleteAnimal = async (req: Request, res: Response) => {
  try {
    const animal = await Animal.findByIdAndDelete(req.params.id);

    if (!animal) {
      return res.status(404).json({ error: "Animal not found" });
    }

    res.json({ message: "Animal deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete animal" });
  }
};

export const createAnimal = async (req: Request, res: Response) => {
  try {
    const newAnimal = await Animal.create(req.body);
    res.status(201).json(newAnimal);
  } catch (error) {
    res.status(400).json({ error: "Failed to create animal" });
  }
};