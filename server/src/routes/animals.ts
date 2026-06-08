import express from "express";
import {
  deleteAnimal,
  getAnimalById,
  getAnimals,
  createAnimal,
  updateAnimal,
} from "../controllers/animalController";
import authenticate from "../middleware/auth";
import multer from "multer";
import { animalSchema, updateAnimalSchema, deleteAnimalParamsSchema } from "../schemas/animalSchemas";
import { validateRequest } from "../middleware/validate";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
      return;
    }

    cb(new Error("Only image uploads are allowed"));
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.get("/", getAnimals);
router.get("/:id", getAnimalById);
router.delete("/:id", authenticate, validateRequest({ params: deleteAnimalParamsSchema }), deleteAnimal);
router.post("/", authenticate, validateRequest({ body: animalSchema }), upload.single("imageFile"), createAnimal);
router.put("/:id", authenticate, validateRequest({ body: updateAnimalSchema }), upload.single("imageFile"), updateAnimal);

export default router;
