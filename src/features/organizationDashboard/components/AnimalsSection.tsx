import type { AnimalItem } from "../types";

type AnimalsSectionProps = {
  animals: AnimalItem[];
  onOpenAnimalDetails: (animal: AnimalItem) => void;
  styles: Record<string, string>;
};

export default function AnimalsSection({
  animals,
  onOpenAnimalDetails,
  styles,
}: AnimalsSectionProps) {
  return (
    <section className={styles.formCard}>
      <h3>Mina djur</h3>
      <div className={styles.compactList}>
        {animals.map((animal) => (
          <article
            key={animal.id}
            className={`${styles.animalCard} ${styles.clickableCard}`}
            onClick={() => onOpenAnimalDetails(animal)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onOpenAnimalDetails(animal);
              }
            }}
          >
            <img src={animal.image} alt={animal.name} />
            <div>
              <h3>{animal.name}</h3>
              <p className={styles.animalMeta}>
                {animal.type} · {animal.breed} · {animal.age}
              </p>
              <p className={styles.helperText}>{animal.description}</p>
              <div className={styles.badgeRow} style={{ marginTop: "10px" }}>
                <span className={styles.badge}>{animal.status}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
