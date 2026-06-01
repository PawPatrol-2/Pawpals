import { z } from "zod";

const booleanFromString = z.preprocess(
    (v) => (v === "true" ? true : v === "false" ? false : v),
    z.boolean().optional(),
);

const arrayFromMultipart = z.preprocess(
    (v) => (Array.isArray(v) ? v : typeof v === "string" && v ? [v] : []),
    z.array(z.string()),
).optional();

export const animalSchema = z.object({
    type: z.string().min(1, "Djurtyp krävs"),
    breed: z.string().min(1, "Ras krävs"),
    image: z.string().min(1, "Bild krävs").optional(),
    name: z.string().min(1, "Namn krävs"),
    age: z.coerce.number().min(0, "Ålder kan inte vara negativ"),
    keyTraits: z.string().optional(),
    personality: z.string().optional(),
    description: z.string().optional(),
    city: z.string().min(1, "Stad krävs"),
    childFriendly: booleanFromString,
    organizationOwner: z.string().optional(),
    likes: arrayFromMultipart,
});

export const updateAnimalSchema = z.object({
    type: z.string().min(1, "Djurtyp krävs").optional(),
    breed: z.string().min(1, "Ras krävs").optional(),
    image: z.string().min(1, "Bild krävs").optional(),
    name: z.string().min(1, "Namn krävs").optional(),
    age: z.coerce.number().min(0, "Ålder kan inte vara negativ").optional(),
    keyTraits: z.string().optional(),
    personality: z.string().optional(),
    description: z.string().optional(),
    city: z.string().min(1, "Stad krävs").optional(),
    childFriendly: booleanFromString,
    organizationOwner: z.string().optional(),
    likes: arrayFromMultipart,
});

export const deleteAnimalParamsSchema = z.object({
   id: z.string()
});