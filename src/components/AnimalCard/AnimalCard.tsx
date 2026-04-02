import type { Animal } from "../../types/Animal";
import styles from "./AnimalCard.module.css";

type AnimalCardProps = {
  animal: Animal;
};

function AnimalCard({ animal }: AnimalCardProps) {
  return (
    <article className={styles.card}>
      <img className={styles.image} src={animal.image} alt={animal.name} />

      <div className={styles.content}>
        <h2 className={styles.name}>{animal.name}</h2>
        <p className={styles.meta}>{animal.age} år • {animal.keyTraits} • 🐾</p>
      </div>
    </article>
  );
}

export default AnimalCard;
