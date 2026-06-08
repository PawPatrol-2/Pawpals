import styles from './adoption.module.css';
import applicationLetter from '../../assets/applicationLetter.png';
import approved from '../../assets/approved.png';
import findAnimal from '../../assets/findAnimal.png';
import { useNavigate } from 'react-router-dom';

const steps = [
  {
    number: '1',
    icon: findAnimal,
    title: 'Hitta ett djur',
    description: 'Bläddra bland djur som söker ett hem.',
    path: '/utforska',
  },
  {
    number: '2',
    icon: applicationLetter,
    title: 'Skicka in ansökan',
    description: 'Fyll i ett enkelt formulär.',
    path: '/utforska',
  },
  {
    number: '3',
    icon: approved,
    title: 'Bli godkänd & adoptera',
    description: 'Vi kontaktar dig och bokar in ett möte.',
    path: null,
  },
];

export default function Adoption() {
  const navigate = useNavigate();

  return (
    <section className={styles.section}>
      <h2>Så här fungerar adoptionen</h2>
      <p className={styles.subtitle}>Tre enkla steg till din nya bästa vän</p>
      <ol className={styles.steps}>
        {steps.map((step) => (
          <li
            key={step.title}
            className={`${styles.step} ${step.path ? styles.clickable : ''}`}
            onClick={() => step.path && navigate(step.path)}
          >
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
