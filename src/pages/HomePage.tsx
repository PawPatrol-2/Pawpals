import Hero from "../components/ui/hero/Hero";
import AnimalGrid from "../components/AnimalGrid/AnimalGrid";
import Adoption from "../components/Adoption/adoption";
import { useEffect, useState } from "react";
import type { Animal } from "../types/Animal";

export default function HomePage() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/animals")
      .then((res) => {
        if (!res.ok) {
          throw new Error ("Kunde inte hämta djur")
        }
        return res.json()
      })
      .then ((data) => setAnimals(data))
      .catch ((err) => {
        console.error(err);
        setError("Något gick fel när vi hämtade djuren.");
      })
      .finally (() => setLoading(false));
  }, []);

  return (
    <main>
      <Hero />
      {loading && <p>Laddar djur...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && <AnimalGrid animals={animals} />}
      <Adoption />
    </main>
  )}