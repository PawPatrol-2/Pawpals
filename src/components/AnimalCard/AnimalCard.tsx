import { useState } from "react";
import type { Animal } from "../../types/Animal";
import styles from "./AnimalCard.module.css";

type AnimalCardProps = {
  animal: Animal;
};

function AnimalCard({ animal }: AnimalCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <article className={styles.card}>
      <img className={styles.image} src={animal.image} alt={animal.name} />

      <div className={styles.content}>
        <h2 className={styles.name}>{animal.name}</h2>

        <p className={styles.meta}>
          {animal.age} år • {animal.keyTraits}
        </p>

        <button
          className={`${styles.heart} ${isFavorite ? styles.active : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite((prev) => !prev);
          }}
        >
          ♥
        </button>
      </div>
    </article>
  );
}

export default AnimalCard;
