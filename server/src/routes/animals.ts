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
router.delete("/:id", authenticate, deleteAnimal);
router.post("/", authenticate, upload.single("imageFile"), createAnimal);
router.put("/:id", authenticate, upload.single("imageFile"), updateAnimal);

export default router;
