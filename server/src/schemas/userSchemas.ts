import { z } from "zod"

export const registerSchema = z.object({
    email: z.email("Ogiltig e-postadress"),
    username: z.string().min(5, 'Användarnamnet måste vara minst 5 tecken')
    .max(30, 'Användarnamnet får vara max 30 tecken')
    .regex(/^[a-zA-ZåäöÅÄÖ0-9 _-]+$/,
      "Användarnamnet får bara innehålla bokstäver, siffror, mellanslag, _ och -."
    ),
    password: z.string().min(6, "Lösenordet måste vara minst 6 tecken"),
    role: z.enum(["adopter", "organization"]).optional(),
})

export const loginSchema = z.object({
    email: z.email("Ogiltig e-postadress"),
    password: z.string().min(1, "Lösenord krävs")
})