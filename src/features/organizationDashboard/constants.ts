import type {
  AnimalFormState,
  AnimalItem,
  ApplicationItem,
  ApplicationStatus,
  SectionKey,
} from "./types";

export const initialApplications: ApplicationItem[] = [
  {
    id: 1,
    applicant: "Anna S.",
    animal: "Luna",
    date: "idag",
    status: "Inskickad",
    action: "Granska",
  },
  {
    id: 2,
    applicant: "Erik L.",
    animal: "Milo",
    date: "igår",
    status: "Granskas",
    action: "Granska",
  },
  {
    id: 3,
    applicant: "Sara K.",
    animal: "Bella",
    date: "2 dgr",
    status: "Godkänd",
    action: "Klar",
  },
  {
    id: 4,
    applicant: "Johan B.",
    animal: "Luna",
    date: "3 dgr",
    status: "Nekad",
    action: "Klar",
  },
];

export const initialAnimals: AnimalItem[] = [
  {
    id: 1,
    mongoId: undefined,
    name: "Luna",
    type: "Katt",
    breed: "Huskatt",
    age: "2 år",
    keyTraits: "Trygg, social",
    personality: "Lugn",
    image:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80",
    description:
      "Trygg och social katt som gillar lugna kvällar och stora fönster.",
    organizationOwner: "Annan Organisation",
    status: "Tillgänglig",
  },
  {
    id: 2,
    mongoId: undefined,
    name: "Milo",
    type: "Hund",
    breed: "Blandras",
    age: "4 år",
    keyTraits: "Lekfull, energisk",
    personality: "Aktiv",
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80",
    description:
      "Lekfull och väldigt människoorienterad, passar i aktiv familj.",
    organizationOwner: "Annan Organisation",
    status: "Reserverad",
  },
  {
    id: 3,
    mongoId: undefined,
    name: "Bella",
    type: "Katt",
    breed: "Huskatt",
    age: "1 år",
    keyTraits: "Nyfiken, kärleksfull",
    personality: "Social",
    image:
      "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=400&q=80",
    description: "Nyfiken ung katt som gärna följer efter i hemmet.",
    organizationOwner: "Annan Organisation",
    status: "Adopterad",
  },
];

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
