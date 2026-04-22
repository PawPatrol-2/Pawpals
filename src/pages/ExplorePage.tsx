import { useEffect, useState } from "react";
import AnimalGrid from "../components/AnimalGrid/AnimalGrid";
import type { Animal } from "../types/animal";
import ExploreSearchBar from "../components/Explore/ExploreSearchBar";
import ExploreCategories from "../components/Explore/ExploreCategories";
import ExploreFilters from "../components/Explore/ExploreFilters";

export default function ExplorePage() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory ] = useState<string>("alla");

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
        setAnimals([]);
        setInfoMessage("Kunde inte hämta djur från servern.");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchAnimals();
  }, []);


  return (
    <main className="explore-page">
      <ExploreSearchBar
      value={searchTerm}
      onChange={setSearchTerm}
      />
      <ExploreCategories />
        <div className="explore-wrapper">
          <ExploreFilters />
          {isLoading && <p>Laddar djur...</p>}
          {!isLoading && infoMessage && <p>{infoMessage}</p>}
          {!isLoading && <AnimalGrid animals={animals} />}
        </div>
    </main>
  );
}
