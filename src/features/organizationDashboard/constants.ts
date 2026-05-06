import type { AnimalFormState, ApplicationStatus, SectionKey } from "./types";

export const applicationStatuses: ApplicationStatus[] = [
  "Inskickad",
  "Granskas",
  "Behöver mer info",
  "Godkänd",
  "Nekad",
];

export const initialAnimalFormState: AnimalFormState = {
  type: "",
  breed: "",
  name: "",
  age: "",
  keyTraits: "",
  likes: "",
  city: "",
  childFriendly: false,
  personality: "",
  description: "",
  imagePreview: "",
  imageFile: null,
};

export const sectionMeta: Record<
  SectionKey,
  { title: string; description: string }
> = {
  overview: {
    title: "Översikt",
    description:
      "Snabb överblick över ansökningar, djur och vad som behöver hanteras idag.",
  },
  animals: {
    title: "Mina djur",
    description: "Alla djur som organisationen har lagt upp för adoption.",
  },
  applications: {
    title: "Ansökningar",
    description: "Se vem som har ansökt om vilket djur och uppdatera statusen.",
  },
  "add-animal": {
    title: "Lägg upp djur",
    description: "Skapa ett nytt adoptionsdjur med bild, namn och beskrivning.",
  },
};

export const navItems: Array<{ key: SectionKey; label: string }> = [
  { key: "overview", label: "Översikt" },
  { key: "applications", label: "Ansökningar" },
  { key: "animals", label: "Mina djur" },
  { key: "add-animal", label: "Lägg upp djur" },
];
