import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { mockAnimals } from "../data/mockAnimals";
import type { Animal } from "../types/animal";
import styles from "./AnimalDetailPage.module.css";

const normalizeAnimal = (raw: unknown): Animal | null => {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const item = raw as Record<string, unknown>;
  const idValue = item._id ?? item.id;
  if (typeof idValue !== "string") {
    return null;
  }

  return {
    _id: idValue,
    type: typeof item.type === "string" ? item.type : "Okänd art",
    breed: typeof item.breed === "string" ? item.breed : "Okänd ras",
    image: typeof item.image === "string" ? item.image : "",
    name: typeof item.name === "string" ? item.name : "Okänt djur",
    age: typeof item.age === "number" ? item.age : 0,
    keyTraits: typeof item.keyTraits === "string" ? item.keyTraits : "Okända egenskaper",
    personality:
      typeof item.personality === "string" && item.personality.trim().length > 0
        ? item.personality
        : "Ej angiven",
    description:
      typeof item.description === "string" && item.description.trim().length > 0
        ? item.description
        : "Ingen beskrivning tillgänglig.",
    likes: Array.isArray(item.likes)
      ? item.likes.filter((like): like is string => typeof like === "string")
      : [],
  };
};

export default function AnimalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const mockAnimal = useMemo(
    () => mockAnimals.find((item) => item._id === id) ?? null,
    [id]
  );
  const [animal, setAnimal] = useState<Animal | null>(mockAnimal);
  const [isLoading, setIsLoading] = useState<boolean>(!mockAnimal && Boolean(id));

  useEffect(() => {
    let isMounted = true;

    const loadAnimal = async () => {
      if (!id) {
        setAnimal(null);
        setIsLoading(false);
        return;
      }

      if (mockAnimal) {
        setAnimal(mockAnimal);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:3000/api/animals/${id}`);
        if (!response.ok) {
          throw new Error("Kunde inte hämta djuret.");
        }

        const data = await response.json();
        if (!isMounted) return;
        setAnimal(normalizeAnimal(data));
      } catch {
        if (!isMounted) return;
        setAnimal(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadAnimal();

    return () => {
      isMounted = false;
    };
  }, [id, mockAnimal]);

  if (isLoading) {
    return (
      <main className={styles.page}>
        <div className={styles.notFoundCard}>
          <p>Laddar djurdetaljer...</p>
        </div>
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
        <img className={styles.image} src={animal.image} alt={animal.name} />

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
            <ul className={styles.likesList}>
              {animal.likes.length > 0 ? (
                animal.likes.map((like) => <li key={like}>{like}</li>)
              ) : (
                <li>Inga preferenser angivna ännu.</li>
              )}
            </ul>
          </section>

          <div className={styles.actions}>
            <Link className={styles.adoptButton} to={`/ansok/${animal._id}`}>
              Ansök om adoption
            </Link>
            <Link className={styles.backButton} to="/utforska">
              Tillbaka till alla djur
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
