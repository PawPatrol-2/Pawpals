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
import {
  USER_PREFERENCES_UPDATED_EVENT,
  type UserPreferences,
} from "../utils/preferenceEvents";
import styles from "./HomePage.module.css";

function normalizeText(value: string | undefined): string {
  return value?.trim().toLowerCase() ?? "";
}

function hasMatchingPreferences(preferences: UserPreferences | null): boolean {
  if (!preferences) {
    return false;
  }

  return Boolean(
    normalizeText(preferences.preferredAnimalType) ||
      typeof preferences.preferredMaxAge === "number" ||
      normalizeText(preferences.preferredPersonality) ||
      preferences.preferredChildFriendly,
  );
}

function getAnimalMatchScore(animal: Animal, preferences: UserPreferences): number {
  let score = 0;
  const preferredType = normalizeText(preferences.preferredAnimalType);
  const preferredPersonality = normalizeText(preferences.preferredPersonality);
  const animalType = normalizeText(animal.type);
  const animalText = [
    animal.personality,
    animal.keyTraits,
    animal.description,
    ...(Array.isArray(animal.likes) ? animal.likes : []),
  ]
    .map((value) => normalizeText(value))
    .join(" ");

  if (preferredType && animalType === preferredType) {
    score += 4;
  }

  if (
    typeof preferences.preferredMaxAge === "number" &&
    animal.age <= preferences.preferredMaxAge
  ) {
    score += 2;
  }

  if (preferredPersonality && animalText.includes(preferredPersonality)) {
    score += 3;
  }

  if (preferences.preferredChildFriendly && animal.childFriendly) {
    score += 2;
  }

  return score;
}

export default function HomePage() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
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

  useEffect(() => {
    if (!user) {
      setPreferences(null);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setPreferences(null);
      return;
    }

    const fetchPreferences = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Kunde inte hämta preferenser");
        }

        const data = (await response.json()) as {
          user?: { preferences?: UserPreferences };
        };
        setPreferences(data.user?.preferences ?? null);
      } catch {
        setPreferences(null);
      }
    };

    void fetchPreferences();
  }, [user]);

  useEffect(() => {
    const handlePreferencesUpdated = (event: Event) => {
      const preferencesEvent = event as CustomEvent<UserPreferences>;
      setPreferences(preferencesEvent.detail);
    };

    window.addEventListener(
      USER_PREFERENCES_UPDATED_EVENT,
      handlePreferencesUpdated,
    );

    return () => {
      window.removeEventListener(
        USER_PREFERENCES_UPDATED_EVENT,
        handlePreferencesUpdated,
      );
    };
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

  const matchingAnimals = useMemo(() => {
    if (!user || !preferences || !hasMatchingPreferences(preferences)) {
      return [];
    }

    return animals
      .map((animal) => ({
        animal,
        score: getAnimalMatchScore(animal, preferences),
      }))
      .filter((match) => match.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((match) => match.animal);
  }, [animals, preferences, user]);
  const hasSavedMatchingPreferences = hasMatchingPreferences(preferences);

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
        <section className={styles.matchingSection} aria-label="Djur som matchar din profil">
          <div className={styles.matchingHeader}>
            <h2>Djur som matchar din profil</h2>
            <p>Tre förslag baserade på dina sparade preferenser.</p>
          </div>
          {matchingAnimals.length > 0 ? (
            <AnimalGrid animals={matchingAnimals} />
          ) : (
            <p className={styles.emptyMatching}>
              {hasSavedMatchingPreferences
                ? "Inga matchande djur hittades just nu. Uppdatera dina preferenser eller utforska alla djur."
                : "Spara dina preferenser i profilmenyn för att se djur som matchar dig."}
            </p>
          )}
        </section>
      )}
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
