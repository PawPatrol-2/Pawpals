import Hero from "../components/ui/hero/Hero";
import AnimalGrid from "../components/AnimalGrid/AnimalGrid";
import Adoption from "../components/Adoption/adoption";
import { useEffect, useState } from "react";
import type { Animal } from "../types/animal";
import { mockAnimals } from "../data/mockAnimals";

export default function HomePage() {
  const [animals, setAnimals] = useState<Animal[]>(mockAnimals);
  const [loading, setLoading] = useState(true);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/animals")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Kunde inte hämta djur");
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAnimals(data);
          setInfoMessage(null);
          return;
        }

        setAnimals(mockAnimals);
        setInfoMessage("Visar lokala djur just nu.");
      })
      .catch((err) => {
        console.error(err);
        setAnimals(mockAnimals);
        setInfoMessage("Kunde inte hämta djur från servern. Visar lokala djur just nu.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <Hero />
      {loading && <p>Laddar djur...</p>}
      {!loading && infoMessage && <p>{infoMessage}</p>}
      {!loading && <AnimalGrid animals={animals} />}
      <Adoption />
    </main>
  );
}
