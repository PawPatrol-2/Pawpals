import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useSearchParams } from "react-router-dom";
import AnimalGrid from "../components/AnimalGrid/AnimalGrid";
import type { Animal } from "../types/animal";
import ExploreSearchBar from "../components/Explore/ExploreSearchBar";
import ExploreCategories from "../components/Explore/ExploreCategories";
import ExploreFilters from "../components/Explore/ExploreFilters";
import styles from "./ExplorePage.module.css";

const AGE_FILTERS = [
  { id: "baby", label: "Valp/kattunge", matches: (age: number) => age < 1 },
  {
    id: "young",
    label: "1-3 år",
    matches: (age: number) => age >= 1 && age <= 3,
  },
  { id: "adult", label: "3+ år", matches: (age: number) => age > 3 },
] as const;

const TRAIT_FILTERS = [
  { id: "lugn", label: "Lugn", keywords: ["lugn", "mjuk", "gosig", "snäll"] },
  {
    id: "aktiv",
    label: "Aktiv",
    keywords: ["aktiv", "lekfull", "energisk", "busig"],
  },
] as const;

function normalizeAnimal(data: Partial<Animal> & { _id: string }): Animal {
  return {
    _id: data._id,
    createdAt: data.createdAt,
    type: data.type ?? "Okänd typ",
    breed: data.breed ?? "Okänd ras",
    image: data.image ?? "",
    name: data.name ?? "Okänt namn",
    age: data.age ?? 0,
    keyTraits: data.keyTraits ?? "",
    personality: data.personality ?? "",
    description: data.description ?? "",
    city: data.city ?? "",
    childFriendly: data.childFriendly ?? false,
    organizationOwner: data.organizationOwner,
    likes: Array.isArray(data.likes) ? data.likes : [],
  };
}

function normalizeCategory(value: string) {
  return value.trim().toLowerCase();
}

function toggleFilter(
  filterId: string,
  setSelectedFilters: Dispatch<SetStateAction<string[]>>,
) {
  setSelectedFilters((current) =>
    current.includes(filterId)
      ? current.filter((value) => value !== filterId)
      : [...current, filterId],
  );
}

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    totalPages: number;
    totalAnimals: number;
  } | null>(null);
  const limit = 6;
  const [page, setPage] = useState(1);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") ?? "");
  const [selectedCategory, setSelectedCategory] = useState("alla");
  const [selectedAgeFilters, setSelectedAgeFilters] = useState<string[]>([]);
  const [selectedTraitFilters, setSelectedTraitFilters] = useState<string[]>(
    [],
  );
  const [childFriendlyOnly, setChildFriendlyOnly] = useState(false);

  useEffect(() => {
    setSearchTerm(searchParams.get("q") ?? "");
    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    const fetchAnimals = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });

        if (searchTerm.trim()) {
          params.set("q", searchTerm.trim());
        }

        if (selectedCategory !== "alla") {
          params.set("category", selectedCategory);
        }

        selectedAgeFilters.forEach((filter) => {
          params.append("age", filter);
        });

        selectedTraitFilters.forEach((filter) => {
          params.append("trait", filter);
        });

        if (childFriendlyOnly) {
          params.set("childFriendly", "true");
        }

        const response = await fetch(
          `http://localhost:3000/api/animals?${params.toString()}`,
        );
        if (!response.ok) {
          throw new Error("Kunde inte hämta djur");
        }

        const data = (await response.json()) as {
          animals: Array<Partial<Animal> & { _id: string }>;
          pagination: {
            page: number;
            limit: number;
            totalPages: number;
            totalAnimals: number;
          };
        };

        setAnimals(data.animals.map(normalizeAnimal));
        setPagination(data.pagination);
        setInfoMessage(null);
        console.log("API response:", data);
      } catch {
        setAnimals([]);
        setInfoMessage("Kunde inte hämta djur från servern.");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchAnimals();
  }, [
    page,
    searchTerm,
    selectedCategory,
    selectedAgeFilters,
    selectedTraitFilters,
    childFriendlyOnly,
  ]);

  const selectCategory = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
  };

  const toggleAgeFilter = (filterId: string) => {
    toggleFilter(filterId, setSelectedAgeFilters);
    setPage(1);
  };

  const toggleTraitFilter = (filterId: string) => {
    toggleFilter(filterId, setSelectedTraitFilters);
    setPage(1);
  };

  const toggleChildFriendlyOnly = () => {
    setChildFriendlyOnly((current) => !current);
    setPage(1);
  };

  const visibleAnimals = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    return animals.filter((animal) => {
      const animalCategory = normalizeCategory(animal.type);
      const matchesCategory =
        selectedCategory === "alla" || animalCategory === selectedCategory;

      const searchableText = [
        animal.name,
        animal.type,
        animal.breed,
        animal.keyTraits,
        animal.personality,
        animal.city,
        animal.organizationOwner,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        normalizedSearchTerm.length === 0 ||
        searchableText.includes(normalizedSearchTerm);

      const matchesAge =
        selectedAgeFilters.length === 0 ||
        selectedAgeFilters.some((filterId) =>
          AGE_FILTERS.find((filter) => filter.id === filterId)?.matches(
            animal.age,
          ),
        );

      const combinedTraits =
        `${animal.keyTraits} ${animal.personality}`.toLowerCase();
      const matchesTraits =
        selectedTraitFilters.length === 0 ||
        selectedTraitFilters.some((filterId) => {
          const filter = TRAIT_FILTERS.find((item) => item.id === filterId);
          return filter
            ? filter.keywords.some((keyword) =>
                combinedTraits.includes(keyword),
              )
            : false;
        });

      const matchesChildFriendly =
        !childFriendlyOnly || animal.childFriendly === true;

      return (
        matchesCategory &&
        matchesSearch &&
        matchesAge &&
        matchesTraits &&
        matchesChildFriendly
      );
    });
  }, [
    animals,
    searchTerm,
    selectedCategory,
    selectedAgeFilters,
    selectedTraitFilters,
    childFriendlyOnly,
  ]);

  const categoryOptions = useMemo(() => {
    const dogs = animals.filter(
      (animal) => normalizeCategory(animal.type) === "hund",
    ).length;
    const cats = animals.filter(
      (animal) => normalizeCategory(animal.type) === "katt",
    ).length;
    const rabbits = animals.filter(
      (animal) => normalizeCategory(animal.type) === "kanin",
    ).length;

    return [
      { id: "alla", label: "Alla djur", emoji: "", count: animals.length },
      { id: "hund", label: "Hund", emoji: "🐕", count: dogs },
      { id: "katt", label: "Katt", emoji: "🐱", count: cats },
      { id: "kanin", label: "Kanin", emoji: "🐇", count: rabbits },
    ];
  }, [animals]);

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <ExploreSearchBar
          value={searchTerm}
          onChange={(value) => {
            setSearchTerm(value);
            setPage(1);

            const nextParams = new URLSearchParams(searchParams);
            if (value.trim()) {
              nextParams.set("q", value);
            } else {
              nextParams.delete("q");
            }

            setSearchParams(nextParams, { replace: true });
          }}
        />
        <ExploreCategories
          categories={categoryOptions}
          selectedCategory={selectedCategory}
          onSelect={selectCategory}
        />
        <div className={styles.content}>
          <ExploreFilters
            ageFilters={AGE_FILTERS.map((filter) => ({
              id: filter.id,
              label: filter.label,
              checked: selectedAgeFilters.includes(filter.id),
              onToggle: () => toggleAgeFilter(filter.id),
            }))}
            traitFilters={TRAIT_FILTERS.map((filter) => ({
              id: filter.id,
              label: filter.label,
              checked: selectedTraitFilters.includes(filter.id),
              onToggle: () => toggleTraitFilter(filter.id),
            }))}
            childFriendlyFilters={[
              {
                id: "child-friendly",
                label: "Barnvänlig",
                checked: childFriendlyOnly,
                onToggle: toggleChildFriendlyOnly,
              },
            ]}
          />
          <section className={styles.results}>
            {isLoading && <p className={styles.status}>Laddar djur...</p>}
            {!isLoading && infoMessage && (
              <p className={styles.status}>{infoMessage}</p>
            )}
            {!isLoading && !infoMessage && (
              <>
                <div className={styles.resultsHeader}>
                  <p className={styles.resultCount}>
                    {visibleAnimals.length} djur att utforska
                  </p>
                </div>
                <AnimalGrid animals={visibleAnimals} variant="explore" />
              </>
            )}
          </section>
        </div>
          <div className={styles.pagination}>
            <button
              className={styles.pageButton}
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Föregående
            </button>

            <span className={styles.pageInfo}>
              Sida {pagination?.page ?? page} av {pagination?.totalPages ?? 1}
            </span>

            <button
              className={styles.pageButton}
              disabled={!pagination || page >= pagination.totalPages}
              onClick={() => setPage(page + 1)}
            >
              Nästa
            </button>
          </div>
      </section>
    </main>
  );
}
