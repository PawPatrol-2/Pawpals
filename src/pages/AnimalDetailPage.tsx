import { Link, useParams } from "react-router-dom";
import { mockAnimals } from "../data/mockAnimals";
import styles from "./AnimalDetailPage.module.css";

export default function AnimalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const animal = mockAnimals.find((item) => item._id === id);

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
              {animal.likes.map((like) => (
                <li key={like}>{like}</li>
              ))}
            </ul>
          </section>

          <Link className={styles.backButton} to="/utforska">
            Tillbaka till alla djur
          </Link>
        </div>
      </article>
    </main>
  );
}
