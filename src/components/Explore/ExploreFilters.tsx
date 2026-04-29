import styles from "./ExploreFilters.module.css";

type FilterOption = {
  id: string;
  label: string;
  checked: boolean;
  onToggle: () => void;
};

type ExploreFiltersProps = {
  ageFilters: FilterOption[];
  traitFilters: FilterOption[];
  childFriendlyFilters: FilterOption[];
};

function FilterGroup({
  title,
  filters,
}: {
  title: string;
  filters: FilterOption[];
}) {
  return (
    <section className={styles.group}>
      <h2 className={styles.groupTitle}>{title}</h2>
      <div className={styles.options}>
        {filters.map((filter) => (
          <label key={filter.id} className={styles.option}>
            <input
              className={styles.checkbox}
              type="checkbox"
              checked={filter.checked}
              onChange={filter.onToggle}
            />
            <span>{filter.label}</span>
          </label>
        ))}
      </div>
    </section>
  );
}

export default function ExploreFilters({
  ageFilters,
  traitFilters,
  childFriendlyFilters,
}: ExploreFiltersProps) {
  return (
    <aside className={styles.sidebar}>
      <p className={styles.eyebrow}>Filter</p>
      <FilterGroup title="Ålder" filters={ageFilters} />
      <FilterGroup title="Energinivå" filters={traitFilters} />
      <FilterGroup title="Hem & familj" filters={childFriendlyFilters} />
    </aside>
  );
}
