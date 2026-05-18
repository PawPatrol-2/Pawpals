export const FAVORITES_CHANGED_EVENT = "favorites:changed";

const FAVORITES_STORAGE_PREFIX = "pawpals:favorites:";
const EMPTY_FAVORITES_SNAPSHOT = "[]";

export function getFavoritesStorageKey(userId: string): string {
  return `${FAVORITES_STORAGE_PREFIX}${userId}`;
}

function parseFavoriteIds(raw: string | null): string[] {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((value): value is string => typeof value === "string");
  } catch {
    return [];
  }
}

export function parseFavoriteIdsSnapshot(snapshot: string): string[] {
  return parseFavoriteIds(snapshot);
}

export function getFavoriteAnimalIds(userId: string | null | undefined): string[] {
  if (!userId) {
    return [];
  }

  return parseFavoriteIds(localStorage.getItem(getFavoritesStorageKey(userId)));
}

export function getFavoriteIdsSnapshot(userId: string | null | undefined): string {
  if (!userId) {
    return EMPTY_FAVORITES_SNAPSHOT;
  }

  return localStorage.getItem(getFavoritesStorageKey(userId)) ?? EMPTY_FAVORITES_SNAPSHOT;
}

export function isAnimalFavorite(
  userId: string | null | undefined,
  animalId: string,
): boolean {
  return getFavoriteAnimalIds(userId).includes(animalId);
}

export function setFavoriteAnimalIds(userId: string, ids: string[]): void {
  localStorage.setItem(getFavoritesStorageKey(userId), JSON.stringify(ids));
}

export function toggleFavoriteAnimal(
  userId: string,
  animalId: string,
): { isFavorite: boolean; favorites: string[] } {
  const currentFavorites = getFavoriteAnimalIds(userId);
  const hasAnimal = currentFavorites.includes(animalId);

  const nextFavorites = hasAnimal
    ? currentFavorites.filter((id) => id !== animalId)
    : [...currentFavorites, animalId];

  setFavoriteAnimalIds(userId, nextFavorites);

  return {
    isFavorite: !hasAnimal,
    favorites: nextFavorites,
  };
}

export function notifyFavoritesChanged(userId: string): void {
  window.dispatchEvent(
    new CustomEvent<{ userId: string }>(FAVORITES_CHANGED_EVENT, {
      detail: { userId },
    }),
  );
}

export function subscribeToFavorites(
  userId: string | null | undefined,
  onStoreChange: () => void,
): () => void {
  if (!userId) {
    return () => {};
  }

  const storageKey = getFavoritesStorageKey(userId);

  const handleFavoritesChanged = (event: Event) => {
    const favoriteEvent = event as CustomEvent<{ userId?: string }>;
    if (!favoriteEvent.detail?.userId || favoriteEvent.detail.userId === userId) {
      onStoreChange();
    }
  };

  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === storageKey) {
      onStoreChange();
    }
  };

  window.addEventListener(FAVORITES_CHANGED_EVENT, handleFavoritesChanged);
  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener(FAVORITES_CHANGED_EVENT, handleFavoritesChanged);
    window.removeEventListener("storage", handleStorageChange);
  };
}
