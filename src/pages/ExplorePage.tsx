import { useEffect, useState } from "react";
import AnimalGrid from "../components/AnimalGrid/AnimalGrid";
import { mockAnimals } from "../data/mockAnimals";
import type { Animal } from "../types/animal";

export default function ExplorePage() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/animals");
        if (!response.ok) {
          throw new Error("Kunde inte hämta djur");
        }

        const data = (await response.json()) as Animal[];
        setAnimals(data);
        setInfoMessage(null);
      } catch {
        setAnimals(mockAnimals);
        setInfoMessage(
          "Kunde inte hämta djur från servern. Visar lokala djur just nu.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchAnimals();
  }, []);

  return (
    <main>
      {isLoading && <p>Laddar djur...</p>}
      {!isLoading && infoMessage && <p>{infoMessage}</p>}
      {!isLoading && <AnimalGrid animals={animals} />}
    </main>
  );
}
