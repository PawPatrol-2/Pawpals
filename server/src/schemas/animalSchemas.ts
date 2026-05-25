import { z } from "zod";

export const animalSchema = z.object({
    type: z.string().min(1, "Djurtyp krävs"),
    breed: z.string().min(1, "Ras krävs"),
    image: z.string().min(1, "Bild krävs"),
    name: z.string().min(1, "Namn krävs"),
    age: z.coerce.number().min(1, "Ålder kan inte vara negativ"),
    keyTraits: z.string().optional(),
    personality: z.string().optional(),
    description: z.string().optional(),
    city: z.string().min(1, "Stad krävs"),
    childFriendly: z.boolean().optional(),
    organizationOwner: z.string().optional(),
    likes: z.array(z.string()).optional(),
});

export const updateAnimalSchema = z.object({
    type: z.string().min(1, "Djurtyp krävs").optional(),
    breed: z.string().min(1, "Ras krävs").optional(),
    image: z.string().min(1, "Bild krävs").optional(),
    name: z.string().min(1, "Namn krävs").optional(),
    age: z.coerce.number().min(1, "Ålder kan inte vara negativ"),
    keyTraits: z.string().optional(),
    personality: z.string().optional(),
    description: z.string().optional(),
    city: z.string().min(1, "Stad krävs").optional(),
    childFriendly: z.boolean().optional(),
    organizationOwner: z.string().optional(),
    likes: z.array(z.string()).optional(),
});

export const deleteAnimalParamsSchema = z.object({
   id: z.string()
});