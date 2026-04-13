import { useState } from "react";
import { Link } from "react-router-dom";
import type { Animal } from "../../types/animal";
import styles from "./AnimalCard.module.css";

type AnimalCardProps = {
  animal: Animal;
};

function AnimalCard({ animal }: AnimalCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const imageSrc = animal.image.startsWith("/uploads/")
    ? `http://localhost:3000${animal.image}`
    : animal.image;

  return (
    <Link
      to={`/djur/${animal._id}`}
      className={styles.card}
      aria-label={`Visa detaljer om ${animal.name}`}
    >
      <article>
        <img className={styles.image} src={imageSrc} alt={animal.name} />

        <div className={styles.content}>
          <h2 className={styles.name}>{animal.name}</h2>

          <p className={styles.meta}>
            {animal.age} år • {animal.keyTraits}
          </p>

          <button
            type="button"
            className={`${styles.heart} ${isFavorite ? styles.active : ""}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsFavorite((prev) => !prev);
            }}
          >
            ♥
          </button>
        </div>
      </article>
    </Link>
  );
}

export default AnimalCard;
