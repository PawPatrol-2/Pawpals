import { z } from 'zod';

// Zod-komplettering, den här bodyn valideras innan controllern körs.
export const markNotificationsAsReadSchema = z.object({
  type: z.enum(['application-created', 'application-status-updated']).optional(),
  applicationId: z.string().trim().min(1).optional(),
});

export type MarkNotificationsAsReadInput = z.infer<typeof markNotificationsAsReadSchema>;
