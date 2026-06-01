import { z } from 'zod';

export const registerSchema = z.object({
  email: z.email('Ogiltig e-postadress'),
  username: z
    .string()
    .min(5, 'Användarnamnet måste vara minst 5 tecken')
    .max(30, 'Användarnamnet får vara max 30 tecken')
    .regex(
      /^[a-zA-ZåäöÅÄÖ0-9 _-]+$/,
      'Användarnamnet får bara innehålla bokstäver, siffror, mellanslag, _ och -.',
    ),
  password: z.string().min(6, 'Lösenordet måste vara minst 6 tecken'),
  role: z.enum(['adopter', 'organization']),
});

export const loginSchema = z.object({
  email: z.email('Ogiltig e-postadress'),
  password: z.string().min(1, 'Lösenord krävs'),
});

export const preferencesSchema = z.object({
  preferredAnimalType: z.string().optional(),
  preferredMaxAge: z.number().min(0, 'Ålder kan inte vara negativ').optional(),
  preferredPersonality: z.string().optional(),
  housingType: z.enum(['lagenhet', 'villa', 'radhus', '']).optional(),
  preferredChildFriendly: z.boolean().optional(),
});
