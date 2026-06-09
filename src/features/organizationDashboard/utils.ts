import type { AnimalFormState, AnimalItem } from "./types";
import { API_BASE_URL } from "../../utils/apiBaseUrl";

export const resolveImageUrl = (image: string) => {
  if (!image) {
    return image;
  }

  if (image.startsWith("/uploads/")) {
    return `${API_BASE_URL}${image}`;
  }

  return image;
};

export const normalizeImageForApi = (image: string) => {
  const prefix = `${API_BASE_URL}/uploads/`;

  if (image.startsWith(prefix)) {
    return `/uploads/${image.slice(prefix.length)}`;
  }

  return image;
};

const getAgeNumber = (ageText: string) => {
  const parsed = Number.parseInt(ageText, 10);
  return Number.isNaN(parsed) ? null : parsed;
};

export const buildEditDataFromAnimal = (
  animal: AnimalItem,
): AnimalFormState => {
  const parsedAge = getAgeNumber(animal.age);

  return {
    type: animal.type,
    breed: animal.breed,
    name: animal.name,
    age: parsedAge === null ? "" : String(parsedAge),
    keyTraits: animal.keyTraits,
    likes: animal.likes.join(", "),
    city: animal.city,
    childFriendly: animal.childFriendly,
    personality: animal.personality || "",
    description: animal.description,
    imagePreview: animal.image,
    imageFile: null,
  };
};
