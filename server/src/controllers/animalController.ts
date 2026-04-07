import { Request, Response } from "express";

type Animal = {
  id: string;
  type: string;
  breed: string;
  image: string;
  name: string;
  age: number;
  keyTraits: string;
};

let animals: Animal[] = [
  {
    id: "1",
    type: "Dog",
    breed: "Labrador",
    image: "https://placehold.co/200x200",
    name: "Kalle",
    age: 3,
    keyTraits: "Busig",
  },
  {
    id: "2",
    type: "Dog",
    breed: "Bulldog",
    image: "https://placehold.co/200x200",
    name: "Doris",
    age: 2,
    keyTraits: "Lat",
  },
  {
    id: "3",
    type: "Cat",
    breed: "Norsk Skogskatt",
    image: "https://placehold.co/200x200",
    name: "Simba",
    age: 5,
    keyTraits: "Självständig",
  },
  {
    id: "4",
    type: "Cat",
    breed: "Maine Coon",
    image: "https://placehold.co/200x200",
    name: "Mjausalot",
    age: 12,
    keyTraits: "Blyg",
  },
  {
    id: "5",
    type: "Orm",
    breed: "Kungspyton",
    image: "https://placehold.co/200x200",
    name: "Nyx",
    age: 3,
    keyTraits: "Kelig",
  },
  {
    id: "6",
    type: "Orm",
    breed: "Mjölksnok",
    image: "https://placehold.co/200x200",
    name: "Wiggles",
    age: 8,
    keyTraits: "Lugn",
  },
  {
    id: "7",
    type: "Fågel",
    breed: "Grå jako",
    image: "https://placehold.co/200x200",
    name: "Merlin",
    age: 15,
    keyTraits: "Pratglad",
  },
  {
    id: "8",
    type: "Fågel",
    breed: "Kakadua",
    image: "https://placehold.co/200x200",
    name: "Mira",
    age: 20,
    keyTraits: "Skygg",
  },
];

export const getAnimals = (_req: Request, res: Response) => {
  res.json(animals);
};

export const getAnimalById = (req: Request, res: Response) => {
  const animal = animals.find((item) => item.id === req.params.id);

  if (!animal) {
    return res.status(404).json({ error: "Animal not found" });
  }

  res.json(animal);
};

export const deleteAnimal = (req: Request, res: Response) => {
  const animal = animals.find((item) => item.id === req.params.id);

  if (!animal) {
    return res.status(404).json({ error: "Animal not found" });
  }

  animals = animals.filter((item) => item.id !== req.params.id);
  res.json({ message: "Animal deleted successfully" });
};
