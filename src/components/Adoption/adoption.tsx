import styles from "./adoption.module.css";

const steps = [
  {
    icon: "🐾",
    title: "Hitta ett djur",
    description: "Bläddra bland djur som söker ett hem och hitta din nya vän.",
  },
  {
    icon: "📋",
    title: "Skicka ansökan",
    description: "Fyll i ett enkelt formulär och berätta lite om dig själv.",
  },
  {
    icon: "✅",
    title: "Godkänd & adoptera",
    description: "Vi kontaktar dig och bokar in ett möte med djuret.",
  },
];

export default function Adoption() {
  return (
    <section>
      <h2>Så här fungerar adoptionen</h2>
      <ol>
        {steps.map((step) => (
          <li key={step.title}>
            <span>{step.icon}</span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
