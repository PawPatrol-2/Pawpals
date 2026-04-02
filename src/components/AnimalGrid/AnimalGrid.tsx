import type { Animal } from "../../types/Animal";
import AnimalCard from "../AnimalCard/AnimalCard";
import styles from "./AnimalGrid.module.css";

type AnimalGridProps = {
  animals: Animal[];
};

function AnimalGrid({ animals }: AnimalGridProps) {
  if (animals.length === 0) {
    return <p>Inga Djur tillgängliga för adoption i dagsläget</p>;
  }

  return (
    <section className={styles.grid}>
      {animals.map((animal) => (
        <AnimalCard key={animal.id} animal={animal} />
      ))}
    </section>
  );
}

export default AnimalGrid;
