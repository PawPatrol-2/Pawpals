export interface CreateApplicationBody {
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
  status: "pending" | "reviewing" | "approved" | "rejected";
  id: string;
  createdAt: Date;
}
