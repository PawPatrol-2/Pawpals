import { useMemo, useState } from "react";
import Hero from "../components/ui/hero/Hero";
import AnimalGrid from "../components/AnimalGrid/AnimalGrid";
import { mockAnimals } from "../data/mockAnimals";
import Adoption from "../components/Adoption/adoption";
// import { mock } from "node:test";

export default function HomePage() {

  const [searchTerm, setSearchTerm] = useState("");

  const filteredAnimals = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    if (!normalizedSearchTerm) {
      return mockAnimals;
    }

    return mockAnimals.filter((animal) => {
      return (
        animal.type.toLowerCase().includes(normalizedSearchTerm) ||
        animal.breed.toLowerCase().includes(normalizedSearchTerm) ||
        animal.name.toLowerCase().includes(normalizedSearchTerm) ||
        animal.keyTraits.toLowerCase().includes(normalizedSearchTerm) ||
        animal.age.toString().includes(normalizedSearchTerm) 
      );
    });
  }, [searchTerm]);

  return (
    <main>
      <Hero onSearch={setSearchTerm} />
      <AnimalGrid animals={filteredAnimals} />
      <h2>Välkommen till PawPals</h2>
      <p>Hitta ditt nya husdjur </p>
      <Adoption />
    </main>
  )}