import { useEffect, useState } from "react";
import AnimalCard from "./AnimalCard/AnimalCard";
import type { Animal } from "../types/animal";

function AnimalList() {
  const [animals, setAnimals] = useState<Animal[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/animals")
      .then((res) => res.json())
      .then((data) => setAnimals(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      {animals.map((animal) => (
        <AnimalCard key={animal._id} animal={animal} />
      ))}
    </div>
  );
}

export default AnimalList; 
