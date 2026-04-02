import Hero from "../components/ui/hero/Hero";
import AnimalGrid from "../components/AnimalGrid/AnimalGrid";
import { mockAnimals } from "../data/mockAnimals";
import Adoption from "../components/Adoption/adoption";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <AnimalGrid animals={mockAnimals} />
      <h2>Välkommen till PawPals</h2>
      <p>Hitta ditt nya husdjur </p>
    </main>
  );
}
