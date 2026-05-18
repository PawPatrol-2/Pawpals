import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Animal } from "../../types/animal";
import { useUser } from "../../context/UserContext";
import {
  getFavoriteIdsSnapshot,
  notifyFavoritesChanged,
  parseFavoriteIdsSnapshot,
  subscribeToFavorites,
  toggleFavoriteAnimal,
} from "../../utils/favorites";
import styles from "./AnimalCard.module.css";

type AnimalCardProps = {
  animal: Animal;
  variant?: "default" | "explore";
};

function getAnimalEmoji(type: string) {
  const normalizedType = type.trim().toLowerCase();

  if (normalizedType === "hund") return "🐕";
  if (normalizedType === "katt") return "🐱";
  if (normalizedType === "kanin") return "🐇";
  return "🐾";
}

function AnimalCard({ animal, variant = "default" }: AnimalCardProps) {
  const { user } = useUser();
  const navigate = useNavigate();
  const [imageHasFailed, setImageHasFailed] = useState(false);
  const cityText = animal.city?.trim() || "Ej angiven";
  const imageSrc = animal.image.startsWith("/uploads/")
    ? `http://localhost:3000${animal.image}`
    : animal.image;
  const userId = user?.id;
  const subscribe = useCallback(
    (onStoreChange: () => void) => subscribeToFavorites(userId, onStoreChange),
    [userId],
  );
  const getSnapshot = useCallback(() => getFavoriteIdsSnapshot(userId), [userId]);
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => "[]",
  );
  const favoriteAnimalIds = useMemo(
    () => parseFavoriteIdsSnapshot(snapshot),
    [snapshot],
  );
  const isFavorite = useMemo(
    () => favoriteAnimalIds.includes(animal._id),
    [animal._id, favoriteAnimalIds],
  );

  return (
    <Link
      to={`/djur/${animal._id}`}
      className={`${styles.card} ${variant === "explore" ? styles.exploreCard : ""}`}
      aria-label={`Visa detaljer om ${animal.name}`}
    >
      <article className={styles.article}>
        <div
          className={`${styles.media} ${variant === "explore" ? styles.exploreMedia : ""}`}
        >
          {!imageHasFailed && imageSrc ? (
            <img
              className={styles.image}
              src={imageSrc}
              alt={animal.name}
              onError={() => setImageHasFailed(true)}
            />
          ) : (
            <div className={styles.fallback} aria-hidden="true">
              {getAnimalEmoji(animal.type)}
            </div>
          )}

          <button
            type="button"
            className={`${styles.heart} ${isFavorite ? styles.active : ""}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

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
        </div>

        <div className={styles.content}>
          <h2 className={styles.name}>{animal.name}</h2>
          <p className={styles.meta}>
            {animal.type} • {animal.age} år
          </p>
          <p className={styles.breed}>{animal.breed}</p>
          <p className={styles.city}>Stad: {cityText}</p>
        </div>
      </article>
    </Link>
  );
}

export default AnimalCard;
