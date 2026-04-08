import { Link } from "react-router-dom";
import type { Animal } from "../../types/animal";
import styles from "./AnimalCard.module.css";

type AnimalCardProps = {
  animal: Animal;
};

function AnimalCard({ animal }: AnimalCardProps) {
  return (
    <Link
      to={`/djur/${animal._id}`}
      className={styles.card}
      aria-label={`Visa detaljer om ${animal.name}`}
    >
      <article>
        <img className={styles.image} src={animal.image} alt={animal.name} />

        <div className={styles.content}>
          <h2 className={styles.name}>{animal.name}</h2>
          <p className={styles.meta}>
            {animal.breed} • {animal.age} år • {animal.keyTraits}
          </p>
        </div>
      </article>
    </Link>
  );
}

export default AnimalCard;
