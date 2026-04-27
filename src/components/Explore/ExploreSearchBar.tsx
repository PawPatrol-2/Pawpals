import styles from "./ExploreSearchBar.module.css";

type ExploreSearchBarProps = {
  value: string;
  onChange: (newValue: string) => void;
};

export default function ExploreSearchBar({
  value,
  onChange,
}: ExploreSearchBarProps) {
  return (
    <div className={styles.wrapper}>
      <input
        className={styles.input}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Sök efter djur, ras eller organisation..."
        aria-label="Sök efter djur"
      />
    </div>
  );
}
