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
import path from "node:path";
import fs from "node:fs";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadDir = path.join(process.cwd(), "uploads");
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    cb(null, `animal-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const upload = multer({ storage });

router.get("/", getAnimals);
router.get("/:id", getAnimalById);
router.delete("/:id", authenticate, deleteAnimal);
router.post("/", authenticate, upload.single("imageFile"), createAnimal);
router.put("/:id", authenticate, upload.single("imageFile"), updateAnimal);

export default router;
