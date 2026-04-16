export interface CreateApplicationBody {
  animalId: string;
  housingType: string;
  housingSize: number;
  hasAnimalExperience: boolean;
  hasChildren: boolean;
  hasAllergies: boolean;
  allergyDetails?: string;
  motivation: string;
  gdprConsent: boolean;
}

export type ApplicationStatus = "Inskickad" | "Granskas" | "Godkänd" | "Nekad";

export interface ApplicationResponse {
  applicationId: string;
  animalId: string | null;
  animalName: string;
  status: ApplicationStatus;
  createdAt: Date | string;
}
