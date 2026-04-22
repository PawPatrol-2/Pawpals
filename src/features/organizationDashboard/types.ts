export type SectionKey = "overview" | "animals" | "applications" | "add-animal";

export type ApplicationStatus =
  | "Inskickad"
  | "Granskas"
  | "Godkänd"
  | "Nekad"
  | "Behöver mer info";

export type ApplicationItem = {
  id: number | string;
  applicant: string;
  animal: string;
  date: string;
  status: ApplicationStatus;
  action: string;
  details: {
    housingType: string;
    housingSize: number | null;
    hasAnimalExperience: boolean | null;
    hasChildren: boolean | null;
    hasAllergies: boolean | null;
    allergyDetails: string;
    motivation: string;
    gdprConsent: boolean | null;
  };
};

export type AnimalStatus = "Tillgänglig" | "Reserverad" | "Adopterad";

export type AnimalItem = {
  id: number | string;
  mongoId?: string;
  createdAt?: string;
  name: string;
  type: string;
  breed: string;
  age: string;
  keyTraits: string;
  likes: string[];
  personality?: string;
  image: string;
  description: string;
  organizationOwner?: string;
  status: AnimalStatus;
};

export type AnimalFormState = {
  type: string;
  breed: string;
  name: string;
  age: string;
  keyTraits: string;
  likes: string;
  personality: string;
  description: string;
  imagePreview: string;
  imageFile: File | null;
};
