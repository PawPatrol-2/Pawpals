import { useState } from "react";
import { Link } from "react-router-dom";
import type { Animal } from "../../types/animal";
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
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageHasFailed, setImageHasFailed] = useState(false);
  const imageSrc = animal.image.startsWith("/uploads/")
    ? `http://localhost:3000${animal.image}`
    : animal.image;

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
              setIsFavorite((prev) => !prev);
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
        </div>
      </article>
    </Link>
  );
}

export default AnimalCard;
