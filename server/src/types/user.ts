import { z } from 'zod';
import { registerSchema, loginSchema } from '../schemas/userSchemas';

export type RegisterBody = z.infer<typeof registerSchema>;
export type LoginBody = z.infer<typeof loginSchema>;

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
    role: 'adopter' | 'organization' | 'admin';
  };
}

export interface UserPreferences {
  preferredAnimalType?: string;
  preferredMaxAge?: number;
  preferredPersonality?: string;
  housingType?: string;
  preferredChildFriendly?: boolean;
}

export interface UserResponse {
  id: string;
  email: string;
  fullname: string;
  role: 'adopter' | 'organization' | 'admin';
  preferences?: UserPreferences;
}

export interface OrganisationResponse {
  id: string;
  email: string;
  username: string;
  organisationsnamn: string;
  role: 'adopter' | 'organization' | 'admin';
}
