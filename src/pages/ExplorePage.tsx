import { useEffect, useState } from "react";
import AnimalGrid from "../components/AnimalGrid/AnimalGrid";
import type { Animal } from "../types/animal";

export default function ExplorePage() {
  const [animals, setAnimals] = useState<Animal[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/animals")
      .then((res) => res.json())
      .then((data) => setAnimals(data))
      .catch((err) => console.error(err));
  }, []);
  
    return(
        <main>
            <AnimalGrid animals={animals} />
        </main>
    )
}