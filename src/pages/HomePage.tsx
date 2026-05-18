import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../components/ui/hero/Hero";
import AnimalGrid from "../components/AnimalGrid/AnimalGrid";
import Adoption from "../components/Adoption/adoption";
import type { Animal } from "../types/animal";
import { useUser } from "../context/UserContext";
import {
  getFavoriteIdsSnapshot,
  parseFavoriteIdsSnapshot,
  subscribeToFavorites,
} from "../utils/favorites";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useUser();

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

  const userId = user?.id;
  const subscribe = useCallback(
    (onStoreChange: () => void) => subscribeToFavorites(userId, onStoreChange),
    [userId],
  );
  const getSnapshot = useCallback(() => getFavoriteIdsSnapshot(userId), [userId]);
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => "[]");
  const favoriteAnimalIds = useMemo(
    () => parseFavoriteIdsSnapshot(snapshot),
    [snapshot],
  );

  const favoriteAnimals = useMemo(() => {
    if (!user) {
      return [];
    }

    return animals
      .filter((animal) => favoriteAnimalIds.includes(animal._id))
      .slice(0, 10);
  }, [animals, favoriteAnimalIds, user]);

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
      {!!user && !loading && (
        <section className={styles.favoritesSection} aria-label="Dina favoriter">
          <div className={styles.favoritesHeader}>
            <h2>Dina favoriter</h2>
            <p>Här ser du snabbt dina favoritdjur.</p>
          </div>
          {favoriteAnimals.length > 0 ? (
            <AnimalGrid animals={favoriteAnimals} />
          ) : (
            <p className={styles.emptyFavorites}>
              Du har inga favoriter ännu. Klicka på hjärtat för att spara djur här.
            </p>
          )}
        </section>
      )}
      {!loading && <AnimalGrid animals={animals} />}

      <Adoption />
    </main>
  );
}
