import { ApplicationStatus } from "../models/Application";

export interface CreateApplicationBody {
  animalId?: string;
  animalNameSnapshot?: string;
  housingType: string;
  housingSize: number;
  hasAnimalExperience: boolean;
  hasChildren: boolean;
  hasAllergies: boolean;
  allergyDetails: string;
  motivation: string;
  gdprConsent: boolean;
}

export interface ApplicationResponse extends CreateApplicationBody {
  status: ApplicationStatus;
  id: string;
  createdAt: Date;
}
