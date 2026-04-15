import { useMemo, useState, useEffect } from "react";
import Hero from "../components/ui/hero/Hero";
import AnimalGrid from "../components/AnimalGrid/AnimalGrid";
import Adoption from "../components/Adoption/adoption";
import type { Animal } from "../types/animal";

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const filteredAnimals = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    if (!normalizedSearchTerm) {
      return animals;
    }

    return animals.filter((animal: Animal) => {
      return (
        animal.type?.toLowerCase().includes(normalizedSearchTerm) ||
        animal.breed?.toLowerCase().includes(normalizedSearchTerm) ||
        animal.name?.toLowerCase().includes(normalizedSearchTerm) ||
        animal.keyTraits?.toLowerCase().includes(normalizedSearchTerm) ||
        animal.age?.toString().includes(normalizedSearchTerm)
      );
    });
  }, [searchTerm, animals]);

  useEffect(() => {
    fetch("http://localhost:3000/api/animals")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Kunde inte hämta djur");
        }
        return res.json();
      })
      .then((data) => {
        setAnimals(data);
        setInfoMessage(null);
      })
      .catch((err) => {
        console.error(err);
        setInfoMessage("Kunde inte hämta djur från servern.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <Hero onSearch={setSearchTerm} />
      {loading && <p>Laddar djur...</p>}
      {!loading && infoMessage && <p>{infoMessage}</p>}
      {!loading && <AnimalGrid animals={filteredAnimals} />}

      <Adoption />
    </main>
  );
}
