import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Animal } from "../types/animal";
import styles from "./AnimalDetailPage.module.css";
import { useUser } from "../context/UserContext";
import {
  getFavoriteIdsSnapshot,
  notifyFavoritesChanged,
  parseFavoriteIdsSnapshot,
  subscribeToFavorites,
  toggleFavoriteAnimal,
} from "../utils/favorites";

export default function AnimalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();
  const userId = user?.id;
  const subscribe = useCallback(
    (onStoreChange: () => void) => subscribeToFavorites(userId, onStoreChange),
    [userId],
  );
  const getSnapshot = useCallback(() => getFavoriteIdsSnapshot(userId), [userId]);
  const favoritesSnapshot = useSyncExternalStore(subscribe, getSnapshot, () => "[]");
  const favoriteAnimalIds = useMemo(
    () => parseFavoriteIdsSnapshot(favoritesSnapshot),
    [favoritesSnapshot],
  );

  const handleApply = () => {
    if (!user) {
      navigate("/logga-in");
      return;
    }
    navigate(`/ansok/${animal?._id}`);
  };

  useEffect(() => {
    if (!id) {
      setAnimal(null);
      setIsLoading(false);
      return;
    }

    const fetchAnimal = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/animals/${id}`);
        if (!response.ok) {
          throw new Error("Kunde inte hämta djur");
        }

        const data = (await response.json()) as Partial<Animal> & {
          _id: string;
        };
        setAnimal({
          _id: data._id,
          type: data.type ?? "Okänd typ",
          breed: data.breed ?? "Okänd ras",
          image: data.image ?? "",
          name: data.name ?? "Okänt namn",
          age: data.age ?? 0,
          keyTraits: data.keyTraits ?? "Ingen information",
          personality: data.personality ?? "Ingen information",
          description: data.description ?? "Ingen beskrivning tillgänglig.",
          city: data.city ?? "",
          childFriendly: data.childFriendly ?? false,
          organizationOwner: data.organizationOwner,
          likes: Array.isArray(data.likes) ? data.likes : [],
          createdAt: data.createdAt,
        });
      } catch {
        setAnimal(null);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchAnimal();
  }, [id]);

  useEffect(() => {
    if (!user || !id) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    const checkApplication = async () => {
      const response = await fetch(
        "http://localhost:3000/api/applications/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!response.ok) return;
      const data = await response.json();
      const already = data.applications.some(
        (app: { animalId: string | null }) => app.animalId === id,
      );
      setHasApplied(already);
    };

    void checkApplication();
  }, [user, id]);

  const imageSrc = useMemo(() => {
    if (!animal?.image) {
      return "";
    }

    return animal.image.startsWith("/uploads/")
      ? `http://localhost:3000${animal.image}`
      : animal.image;
  }, [animal]);

  const cityText = animal?.city?.trim() || "Ej angiven";
  const isFavorite = useMemo(
    () => (animal ? favoriteAnimalIds.includes(animal._id) : false),
    [animal, favoriteAnimalIds],
  );

  if (isLoading) {
    return (
      <main className={styles.page}>
        <p>Laddar djur...</p>
      </main>
    );
  }

  if (!animal) {
    return (
      <main className={styles.page}>
        <div className={styles.notFoundCard}>
          <h1>Djuret kunde inte hittas</h1>
          <p>Djuret du klickade på är inte tillgängligt just nu.</p>
          <Link className={styles.backButton} to="/utforska">
            Tillbaka till alla djur
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <article className={styles.detailCard}>
        <button
          type="button"
          className={`${styles.detailFavoriteButton} ${isFavorite ? styles.detailFavoriteActive : ""}`}
          onClick={() => {
            if (!user) {
              navigate("/logga-in");
              return;
            }

            toggleFavoriteAnimal(user.id, animal._id);
            notifyFavoritesChanged(user.id);
          }}
          aria-label={
            isFavorite
              ? `Ta bort ${animal.name} från favoriter`
              : `Lägg till ${animal.name} i favoriter`
          }
        >
          ♥
        </button>

        <div className={styles.imageWrap}>
          <img className={styles.image} src={imageSrc} alt={animal.name} />
        </div>

        <div className={styles.content}>
          <p className={styles.badge}>{animal.type}</p>
          <h1 className={styles.name}>{animal.name}</h1>
          <p className={styles.subtitle}>{animal.breed}</p>

          <div className={styles.stats}>
            <div>
              <span className={styles.label}>Ålder</span>
              <strong>{animal.age} år</strong>
            </div>
            <div>
              <span className={styles.label}>Stad</span>
              <strong>{cityText}</strong>
            </div>
            <div>
              <span className={styles.label}>Personlighet</span>
              <strong>{animal.personality}</strong>
            </div>
            <div>
              <span className={styles.label}>Egenskap</span>
              <strong>{animal.keyTraits}</strong>
            </div>
          </div>

          <section className={styles.aboutSection}>
            <h2>Om {animal.name}</h2>
            <p>{animal.description}</p>
          </section>

          <section className={styles.aboutSection}>
            <h2>Tycker om</h2>
            {animal.likes.length > 0 ? (
              <ul className={styles.likesList}>
                {animal.likes.map((like) => (
                  <li key={like}>{like}</li>
                ))}
              </ul>
            ) : (
              <p>Ingen information ännu.</p>
            )}
          </section>

          {hasApplied ? (
            <p className={styles.alreadyApplied}>
              Du har redan ansökt om detta djur
            </p>
          ) : (
            <button onClick={handleApply} className={styles.applyButton}>
              Ansök om adoption
            </button>
          )}

          <Link className={styles.backButton} to="/utforska">
            Tillbaka till alla djur
          </Link>
        </div>
      </article>
    </main>
  );
}
