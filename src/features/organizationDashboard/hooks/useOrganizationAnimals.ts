import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { sortAnimalsNewestFirst } from "../../../utils/sortAnimalsNewestFirst";
import { initialAnimalFormState } from "../constants";
import type { AnimalFormState, AnimalItem } from "../types";
import {
  buildEditDataFromAnimal,
  normalizeImageForApi,
  resolveImageUrl,
} from "../utils";

type ApiAnimal = {
  _id?: string;
  id?: string;
  createdAt?: string;
  type: string;
  breed: string;
  image: string;
  name: string;
  age: number;
  keyTraits: string;
  likes?: string[] | string;
  city?: string;
  childFriendly?: boolean | string;
  personality?: string;
  description?: string;
  organizationOwner?: string;
};

const parseBoolean = (value: boolean | string | undefined): boolean => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "true" || normalized === "1" || normalized === "on";
  }

  return false;
};

const parseLikes = (likes: string[] | string | undefined): string[] => {
  if (Array.isArray(likes)) {
    return likes
      .flatMap((value) => value.split(","))
      .map((value) => value.trim())
      .filter(Boolean);
  }

  if (typeof likes === "string") {
    return likes
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
  }

  return [];
};

const appendLikesToPayload = (payload: FormData, likesText: string) => {
  const likes = likesText
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  likes.forEach((like) => payload.append("likes", like));
};

export const useOrganizationAnimals = (username?: string) => {
  const [animals, setAnimals] = useState<AnimalItem[]>([]);
  const [formData, setFormData] = useState<AnimalFormState>(
    initialAnimalFormState,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const [selectedAnimal, setSelectedAnimal] = useState<AnimalItem | null>(null);
  const [isAnimalDetailsOpen, setIsAnimalDetailsOpen] = useState(false);
  const [editData, setEditData] = useState<AnimalFormState | null>(null);
  const [editMessage, setEditMessage] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeletingAnimal, setIsDeletingAnimal] = useState(false);

  useEffect(() => {
    const loadAnimals = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/animals");

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as ApiAnimal[];

        if (Array.isArray(data) && data.length > 0) {
          const ownerAnimals: AnimalItem[] = sortAnimalsNewestFirst(data)
            .filter((animal) => animal.organizationOwner === username)
            .map((animal, index) => ({
              id: animal._id ?? animal.id ?? `animal-${index + 1}`,
              mongoId: animal._id ?? animal.id,
              createdAt: animal.createdAt,
              name: animal.name,
              type: animal.type,
              breed: animal.breed,
              age: `${animal.age} år`,
              keyTraits: animal.keyTraits,
              likes: parseLikes(animal.likes),
              city: animal.city?.trim() || "",
              childFriendly: parseBoolean(animal.childFriendly),
              personality: animal.personality,
              image: resolveImageUrl(animal.image),
              description: animal.description || animal.keyTraits,
              organizationOwner: animal.organizationOwner,
              status: "Tillgänglig",
            }));

          setAnimals(ownerAnimals);
        }
      } catch {
        setAnimals([]);
      }
    };

    void loadAnimals();
  }, [username]);

  const canEditSelectedAnimal = useMemo(
    () =>
      !!selectedAnimal &&
      !!username &&
      selectedAnimal.organizationOwner === username,
    [selectedAnimal, username],
  );

  const openAnimalModal = () => {
    setSubmitMessage("");
    setIsModalOpen(true);
  };

  const closeAnimalModal = () => {
    setIsModalOpen(false);
  };

  const onAddImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setFormData((current) => ({
        ...current,
        imagePreview: "",
        imageFile: null,
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((current) => ({
        ...current,
        imagePreview: typeof reader.result === "string" ? reader.result : "",
        imageFile: file,
      }));
    };
    reader.readAsDataURL(file);
  };

  const onEditImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!editData) {
      return;
    }

    const file = event.target.files?.[0] ?? null;
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setEditData({
        ...editData,
        imagePreview:
          typeof reader.result === "string"
            ? reader.result
            : editData.imagePreview,
        imageFile: file,
      });
    };
    reader.readAsDataURL(file);
  };

  const updateFormField = <K extends keyof AnimalFormState>(
    field: K,
    value: AnimalFormState[K],
  ) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const updateEditField = <K extends keyof AnimalFormState>(
    field: K,
    value: AnimalFormState[K],
  ) => {
    if (!editData) {
      return;
    }

    setEditData({ ...editData, [field]: value });
  };

  const submitAddAnimal = async (): Promise<boolean> => {
    if (
      !formData.name ||
      !formData.type ||
      !formData.breed ||
      !formData.age ||
      !formData.keyTraits ||
      !formData.description ||
      !formData.imageFile
    ) {
      setSubmitMessage("Fyll i alla obligatoriska fält, inklusive en bild.");
      return false;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setSubmitMessage("Du behöver vara inloggad för att lägga upp djur.");
        return false;
      }

      const payload = new FormData();
      payload.append("type", formData.type);
      payload.append("breed", formData.breed);
      payload.append("name", formData.name);
      payload.append("age", String(Number(formData.age)));
      payload.append("keyTraits", formData.keyTraits);
      appendLikesToPayload(payload, formData.likes);
      payload.append("city", formData.city.trim());
      payload.append("childFriendly", String(formData.childFriendly));
      payload.append("personality", formData.personality);
      payload.append("description", formData.description);
      payload.append("organizationOwner", username || "");

      if (!formData.imageFile) {
        setSubmitMessage("Du måste ladda upp en bild för djuret.");
        return false;
      }

      payload.append("imageFile", formData.imageFile);

      const response = await fetch("http://localhost:3000/api/animals", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as {
          error?: string;
          err?: unknown;
        };

        if (response.status === 413) {
          setSubmitMessage(
            "Bilden är för stor att skicka. Testa en mindre bildfil (eller komprimera den) och försök igen.",
          );
          return false;
        }

        const detailText =
          typeof errorData.err === "string"
            ? errorData.err
            : errorData.err && typeof errorData.err === "object"
              ? JSON.stringify(errorData.err)
              : "";

        setSubmitMessage(
          `${errorData.error || "Kunde inte skapa djuret."} (HTTP ${response.status})${detailText ? ` - ${detailText}` : ""}`,
        );
        return false;
      }

      const createdAnimal = (await response.json()) as ApiAnimal;

      setAnimals((current) => [
        {
          id: createdAnimal._id ?? createdAnimal.id ?? Date.now(),
          mongoId: createdAnimal._id ?? createdAnimal.id,
          name: createdAnimal.name,
          type: createdAnimal.type,
          breed: createdAnimal.breed,
          age: `${createdAnimal.age} år`,
          keyTraits: createdAnimal.keyTraits,
          likes: parseLikes(createdAnimal.likes),
          city: createdAnimal.city?.trim() || "",
          childFriendly: parseBoolean(createdAnimal.childFriendly),
          personality: createdAnimal.personality,
          image: resolveImageUrl(createdAnimal.image),
          description: createdAnimal.description || createdAnimal.keyTraits,
          organizationOwner: createdAnimal.organizationOwner || username,
          status: "Tillgänglig",
        },
        ...current,
      ]);

      setFormData(initialAnimalFormState);
      setIsModalOpen(false);
      setSubmitMessage("Djuret har sparats på servern.");
      return true;
    } catch {
      setSubmitMessage("Något gick fel när djuret skulle sparas.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAnimalDetails = (animal: AnimalItem) => {
    setSelectedAnimal(animal);
    setEditData(buildEditDataFromAnimal(animal));
    setEditMessage("");
    setIsEditMode(false);
    setIsAnimalDetailsOpen(true);
  };

  const closeAnimalDetails = () => {
    setIsAnimalDetailsOpen(false);
    setSelectedAnimal(null);
    setEditData(null);
    setEditMessage("");
    setIsEditMode(false);
  };

  const startEditingSelectedAnimal = () => {
    if (!canEditSelectedAnimal) {
      return;
    }

    setEditMessage("");
    setIsEditMode(true);
  };

  const cancelEditingSelectedAnimal = () => {
    if (selectedAnimal) {
      setEditData(buildEditDataFromAnimal(selectedAnimal));
    }

    setEditMessage("");
    setIsEditMode(false);
  };

  const saveSelectedAnimalEdit = async (): Promise<boolean> => {
    if (!selectedAnimal || !editData || !username) {
      return false;
    }

    if (!selectedAnimal.mongoId) {
      setEditMessage(
        "Det här djuret saknar databas-id och kan inte uppdateras. Ladda om sidan och testa igen.",
      );
      return false;
    }

    if (
      !editData.name ||
      !editData.type ||
      !editData.breed ||
      !editData.age ||
      !editData.keyTraits ||
      !editData.description
    ) {
      setEditMessage("Fyll i alla obligatoriska fält.");
      return false;
    }

    setIsSavingEdit(true);
    setEditMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setEditMessage("Du behöver vara inloggad för att redigera djur.");
        return false;
      }

      const payload = new FormData();
      payload.append("type", editData.type);
      payload.append("breed", editData.breed);
      payload.append("name", editData.name);
      payload.append("age", String(Number(editData.age)));
      payload.append("keyTraits", editData.keyTraits);
      appendLikesToPayload(payload, editData.likes);
      payload.append("city", editData.city.trim());
      payload.append("childFriendly", String(editData.childFriendly));
      payload.append("personality", editData.personality);
      payload.append("description", editData.description);

      if (editData.imageFile) {
        payload.append("imageFile", editData.imageFile);
      } else {
        payload.append("image", normalizeImageForApi(editData.imagePreview));
      }

      const response = await fetch(
        `http://localhost:3000/api/animals/${selectedAnimal.mongoId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: payload,
        },
      );

      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        _id?: string;
        type?: string;
        breed?: string;
        image?: string;
        name?: string;
        age?: number;
        keyTraits?: string;
        likes?: string[] | string;
        personality?: string;
        description?: string;
        city?: string;
        childFriendly?: boolean | string;
        organizationOwner?: string;
      };

      if (!response.ok) {
        if (response.status === 404) {
          setEditMessage(
            "Djuret hittades inte i databasen (HTTP 404). Om servern nyligen ändrats, starta om backend och ladda om sidan.",
          );
          return false;
        }

        setEditMessage(
          `${data.error || "Kunde inte spara ändringarna."} (HTTP ${response.status})`,
        );
        return false;
      }

      setAnimals((current) =>
        current.map((animal) =>
          String(animal.id) === String(selectedAnimal.id)
            ? {
                ...animal,
                name: data.name || editData.name,
                type: data.type || editData.type,
                breed: data.breed || editData.breed,
                age: `${data.age ?? Number(editData.age)} år`,
                keyTraits: data.keyTraits || editData.keyTraits,
                likes: data.likes
                  ? parseLikes(data.likes)
                  : parseLikes(editData.likes),
                city:
                  typeof data.city === "string"
                    ? data.city.trim()
                    : editData.city,
                childFriendly:
                  data.childFriendly !== undefined
                    ? parseBoolean(data.childFriendly)
                    : editData.childFriendly,
                personality: data.personality || editData.personality,
                image: resolveImageUrl(data.image || editData.imagePreview),
                description: data.description || editData.description,
                organizationOwner:
                  data.organizationOwner || animal.organizationOwner,
              }
            : animal,
        ),
      );

      setEditMessage("Ändringarna sparades.");
      setIsEditMode(false);
      return true;
    } catch {
      setEditMessage("Något gick fel när djuret skulle uppdateras.");
      return false;
    } finally {
      setIsSavingEdit(false);
    }
  };

  const deleteSelectedAnimal = async (): Promise<boolean> => {
    if (!selectedAnimal || !selectedAnimal.mongoId || !username) {
      return false;
    }

    const shouldDelete = window.confirm(
      `Är du säker på att du vill ta bort ${selectedAnimal.name}?`,
    );

    if (!shouldDelete) {
      return false;
    }

    setIsDeletingAnimal(true);
    setEditMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setEditMessage("Du behöver vara inloggad för att ta bort djur.");
        return false;
      }

      const response = await fetch(
        `http://localhost:3000/api/animals/${selectedAnimal.mongoId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        },
      );

      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        setEditMessage(
          `${data.error || "Kunde inte ta bort djuret."} (HTTP ${response.status})`,
        );
        return false;
      }

      setAnimals((current) =>
        current.filter(
          (animal) => String(animal.id) !== String(selectedAnimal.id),
        ),
      );
      closeAnimalDetails();
      setSubmitMessage("Djuret togs bort från servern.");
      return true;
    } catch {
      setEditMessage("Något gick fel när djuret skulle tas bort.");
      return false;
    } finally {
      setIsDeletingAnimal(false);
    }
  };

  return {
    animals,
    formData,
    isModalOpen,
    isSubmitting,
    submitMessage,
    selectedAnimal,
    isAnimalDetailsOpen,
    editData,
    editMessage,
    isSavingEdit,
    isEditMode,
    isDeletingAnimal,
    canEditSelectedAnimal,
    setSubmitMessage,
    updateFormField,
    updateEditField,
    onAddImageChange,
    onEditImageChange,
    openAnimalModal,
    closeAnimalModal,
    submitAddAnimal,
    openAnimalDetails,
    closeAnimalDetails,
    startEditingSelectedAnimal,
    cancelEditingSelectedAnimal,
    saveSelectedAnimalEdit,
    deleteSelectedAnimal,
  };
};
