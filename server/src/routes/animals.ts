import { Router } from "express";

const router = Router();

const mockAnimals = [
  {
    id: "1",
    name: "Bella",
    species: "Hund",
    breed: "Labrador",
    age: 3,
    description: "Glad och lekfull hund som älskar barn.",
    image: "https://placedog.net/400/300?id=1",
  },
  {
    id: "2",
    name: "Missan",
    species: "Katt",
    breed: "Huskatt",
    age: 5,
    description: "Lugn katt som gillar att mysa.",
    image: "https://placekitten.com/400/300",
  },
];

router.get("/", (_req, res) => {
  res.json(mockAnimals);
});

router.get("/:id", (req, res) => {
  const animal = mockAnimals.find((a) => a.id === req.params.id);
  if (!animal) {
     res.status(404).json({ message: "Djur hittades inte" });
     return;
  }
  res.json(animal);
});

export default router;