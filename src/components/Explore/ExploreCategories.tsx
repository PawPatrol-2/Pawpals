import styles from "./ExploreCategories.module.css";

type CategoryOption = {
  id: string;
  label: string;
  emoji: string;
  count: number;
};

type ExploreCategoriesProps = {
  categories: CategoryOption[];
  selectedCategory: string;
  onSelect: (categoryId: string) => void;
};

export default function ExploreCategories({
  categories,
  selectedCategory,
  onSelect,
}: ExploreCategoriesProps) {
  return (
    <div className={styles.bar}>
      <div className={styles.list} aria-label="Djurslag">
        {categories.map((category) => {
          const isActive = category.id === selectedCategory;

          return (
            <button
              key={category.id}
              type="button"
              className={`${styles.button} ${isActive ? styles.active : ""}`}
              onClick={() => onSelect(category.id)}
            >
              <span className={styles.label}>
                {category.emoji ? `${category.emoji} ${category.label}` : category.label}
              </span>
              <span className={styles.count}>{category.count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
