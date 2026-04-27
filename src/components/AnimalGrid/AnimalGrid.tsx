import type { Animal } from "../../types/animal";
import AnimalCard from "../AnimalCard/AnimalCard";
import styles from "./AnimalGrid.module.css";

type AnimalGridProps = {
  animals: Animal[];
  variant?: "default" | "explore";
};

function AnimalGrid({ animals, variant = "default" }: AnimalGridProps) {
  if (animals.length === 0) {
    return (
      <p className={styles.empty}>
        Inga djur matchar filtren just nu. Testa att ändra din sökning eller välj
        fler kategorier.
      </p>
    );
  }

  return (
    <section
      className={`${styles.grid} ${variant === "explore" ? styles.exploreGrid : ""}`}
      aria-label="Djur tillgängliga för adoption"
    >
      {animals.map((animal) => (
        <AnimalCard key={animal._id} animal={animal} variant={variant} />
      ))}
    </section>
  );
}

export default AnimalGrid;
