import express from "express";
import {
  deleteAnimal,
  getAnimalById,
  getAnimals,
  createAnimal,
} from "../controllers/animalController";

const router = express.Router();

router.get("/", getAnimals);
router.get("/:id", getAnimalById);
router.delete("/:id", deleteAnimal);
router.post("/", createAnimal);

export default router;
