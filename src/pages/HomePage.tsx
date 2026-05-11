import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../components/ui/hero/Hero";
import AnimalGrid from "../components/AnimalGrid/AnimalGrid";
import Adoption from "../components/Adoption/adoption";
import type { Animal } from "../types/animal";

export default function HomePage() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/api/animals")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Kunde inte hämta djur");
        }
        return res.json();
      })
      .then((data) => {
        setAnimals(data.animals);
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
      <Hero
        onSearch={(value) => {
          const params = new URLSearchParams();
          if (value) {
            params.set("q", value);
          }

          navigate(`/utforska${params.toString() ? `?${params.toString()}` : ""}`);
        }}
      />
      {loading && <p>Laddar djur...</p>}
      {!loading && infoMessage && <p>{infoMessage}</p>}
      {!loading && <AnimalGrid animals={animals} />}

      <Adoption />
    </main>
  );
}
