import express from "express";
import {
  deleteAnimal,
  getAnimalById,
  getAnimals,
} from "../controllers/animalController";

const router = express.Router();

router.get("/", getAnimals);
router.get("/:id", getAnimalById);
router.delete("/:id", deleteAnimal);

export default router;
