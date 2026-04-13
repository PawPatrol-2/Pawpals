import express from "express";
import {
  deleteAnimal,
  getAnimalById,
  getAnimals,
  createAnimal,
  updateAnimal,
} from "../controllers/animalController";

const router = express.Router();

router.get("/", getAnimals);
router.get("/:id", getAnimalById);
router.delete("/:id", deleteAnimal);
router.post("/", createAnimal);
router.put("/:id", updateAnimal);

export default router;
