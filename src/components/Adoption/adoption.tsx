import styles from "./adoption.module.css";
import applicationLetter from "../../assets/applicationLetter.png";
import approved from "../../assets/approved.png";
import findAnimal from "../../assets/findAnimal.png";

const steps = [
  {
    icon: findAnimal,
    title: "1. Hitta ett djur",
    description: "Bläddra bland djur som söker ett hem.",
  },
  {
    icon: applicationLetter,
    title: "2. Skicka in ansökan",
    description: "Fyll i ett enkelt formulär.",
  },
  {
    icon: approved,
    title: "3. Bli godkänd & adoptera",
    description: "Vi kontaktar dig och bokar in ett möte.",
  },
];

export default function Adoption() {
  return (
    <section className={styles.section}>
      <h2>Så här fungerar adoptionen</h2>
      <ol className={styles.steps}>
        {steps.map((step) => (
          <li key={step.title} className={styles.step}>
            <span className={styles.icon}>
              <img src={step.icon} alt={step.title} />
            </span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
